from unittest.mock import Mock, patch

from django.test import SimpleTestCase, override_settings

from .services.providers import AIProviderError, FallbackAIProvider, GeminiProvider, OllamaProvider


class OllamaFallbackProviderTests(SimpleTestCase):
    messages = [{'role': 'user', 'content': 'Help me prepare for an interview.'}]

    @override_settings(
        OLLAMA_BASE_URL='http://ollama.test',
        OLLAMA_MODEL='qwen3:8b',
        OLLAMA_TIMEOUT_SECONDS=5,
    )
    @patch('ai.services.providers.urllib.request.urlopen')
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

    @patch.object(OllamaProvider, 'generate', side_effect=AIProviderError('Ollama is unavailable.'))
    @patch.object(GeminiProvider, 'generate', side_effect=AIProviderError('Gemini is unavailable.'))
    def test_error_when_ollama_and_gemini_are_unavailable(self, mock_gemini, mock_ollama):
        with self.assertRaisesRegex(AIProviderError, 'All configured AI providers are unavailable'):
            FallbackAIProvider(OllamaProvider(), GeminiProvider()).generate(self.messages)

        mock_ollama.assert_called_once_with(self.messages)
        mock_gemini.assert_called_once_with(self.messages)
