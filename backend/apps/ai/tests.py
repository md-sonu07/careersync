import io
import json
from unittest.mock import Mock, patch
from django.test import TestCase, SimpleTestCase, override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from .services.providers import AIProviderError, FallbackAIProvider, GeminiProvider, OllamaProvider
from .services.document_extractor import DocumentExtractor, DocumentExtractionError
from .services.document_analyzer import DocumentAnalyzer
from .models import AIDocument, AIDocumentChatMessage


class OllamaFallbackProviderTests(SimpleTestCase):
    messages = [{'role': 'user', 'content': 'Help me prepare for an interview.'}]

    @override_settings(
        OLLAMA_BASE_URL='http://ollama.test',
        OLLAMA_MODEL='qwen3:8b',
        OLLAMA_TIMEOUT_SECONDS=5,
    )
    @patch('apps.ai.services.providers.urllib.request.urlopen')
    def test_ollama_response_is_used_when_available(self, mock_urlopen):
        response = Mock()
        response.read.return_value = b'{"message": {"content": "Ollama answer"}}'
        mock_urlopen.return_value.__enter__.return_value = response

        fallback = Mock()
        result = FallbackAIProvider(OllamaProvider(), fallback).generate(self.messages)

        self.assertEqual(result['message'], 'Ollama answer')
        fallback.generate.assert_not_called()

    @patch.object(OllamaProvider, 'generate', side_effect=AIProviderError('Ollama is unavailable.'))
    @patch.object(GeminiProvider, 'generate', return_value={
        'message': 'Gemini answer', 'suggestions': [], 'actions': [],
    })
    def test_ollama_unavailable_uses_gemini_fallback(self, mock_gemini, mock_ollama):
        result = FallbackAIProvider(OllamaProvider(), GeminiProvider()).generate(self.messages)

        self.assertEqual(result['message'], 'Gemini answer')
        mock_ollama.assert_called_once_with(self.messages)
        mock_gemini.assert_called_once_with(self.messages)


class DocumentExtractionTests(TestCase):
    def test_txt_extraction(self):
        text_content = b"John Doe\nSoftware Engineer\nSkills: Python, JavaScript, React, Django."
        file_obj = io.BytesIO(text_content)
        extracted, ocr = DocumentExtractor.extract_text(file_obj, "resume.txt", "txt")

        self.assertIn("Software Engineer", extracted)
        self.assertFalse(ocr)

    def test_invalid_file_type_raises_error(self):
        file_obj = io.BytesIO(b"fake data")
        with self.assertRaises(DocumentExtractionError):
            DocumentExtractor.extract_text(file_obj, "test.exe", "exe")


class DocumentAnalyzerTests(TestCase):
    def test_detect_resume_type(self):
        resume_text = """
        John Doe
        john@example.com | 123-456-7890
        EDUCATION: BS Computer Science, MIT 2023
        EXPERIENCE: Software Developer at Acme Corp
        SKILLS: JavaScript, React, Node.js, Python, Django, PostgreSQL
        PROJECTS: Built an AI Resume Analyzer
        """
        doc_type = DocumentAnalyzer.detect_document_type(resume_text)
        self.assertEqual(doc_type, 'resume')

    def test_detect_general_type(self):
        general_text = "This is a brief note regarding tomorrow's team standup meeting at 10 AM."
        doc_type = DocumentAnalyzer.detect_document_type(general_text)
        self.assertEqual(doc_type, 'general')

    def test_clean_and_parse_json_markdown_fences(self):
        raw_ai_output = """```json
{
  "document_type": "resume",
  "summary": "Experienced Full Stack Developer",
  "skills": ["JavaScript", "React"]
}
```"""
        parsed = DocumentAnalyzer._clean_and_parse_json(raw_ai_output)
        self.assertIsNotNone(parsed)
        self.assertEqual(parsed['summary'], "Experienced Full Stack Developer")
        self.assertIn("React", parsed['skills'])


class DocumentAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    @patch.object(DocumentAnalyzer, 'analyze_document')
    def test_upload_txt_resume_success(self, mock_analyze):
        mock_analyze.return_value = {
            'document_type': 'resume',
            'analysis': {
                'document_type': 'resume',
                'summary': 'Developer profile',
                'skills': ['Python', 'Django'],
                'recommended_courses': [
                    {'course_name': 'Advanced Django', 'reason': 'Skill match', 'level': 'Advanced'}
                ]
            },
            'ai_provider': 'ollama'
        }

        txt_file = io.BytesIO(b"John Doe\nEducation: MIT\nExperience: Python Developer\nSkills: Python, Django")
        txt_file.name = 'resume.txt'

        response = self.client.post(
            reverse('ai:document-upload'),
            {'file': txt_file},
            format='multipart'
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['document_type'], 'resume')
        self.assertEqual(response.data['ai_provider'], 'ollama')
        self.assertIn('summary', response.data['analysis_result'])

    def test_upload_invalid_file_type(self):
        fake_file = io.BytesIO(b"binary data")
        fake_file.name = "malicious.exe"

        response = self.client.post(
            reverse('ai:document-upload'),
            {'file': fake_file},
            format='multipart'
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
