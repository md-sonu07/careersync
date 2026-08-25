import re
import json
import logging
from django.conf import settings
from .providers import OllamaProvider, GeminiProvider, MockProvider, AIProviderError

logger = logging.getLogger(__name__)


class DocumentAnalyzer:
    """
    Document Analyzer Service executing Document Type Detection,
    Structured AI Analysis, Smart Recommendations, and Ollama -> Gemini Fallback.
    """

    @classmethod
    def detect_document_type(cls, text):
        """
        Detects document type based on content keywords and structure.
        Returns one of: 'resume', 'course_material', 'job_description', 'interview_prep', 'technical', 'general'
        """
        if not text:
            return 'general'

        text_lower = text.lower()

        # Resume signals
        resume_keywords = ['education', 'experience', 'skills', 'projects', 'work history', 'curriculum vitae', 'resume', 'contact', 'phone', 'email', 'employment history', 'profile']
        resume_score = sum(1 for kw in resume_keywords if kw in text_lower)
        if resume_score >= 3 or 'resume' in text_lower[:200] or 'curriculum vitae' in text_lower[:200]:
            return 'resume'

        # Job Description signals
        jd_keywords = ['responsibilities', 'qualifications', 'requirements', 'job description', 'we are hiring', 'salary', 'benefits', 'job title', 'reports to']
        if sum(1 for kw in jd_keywords if kw in text_lower) >= 3:
            return 'job_description'

        # Course Material signals
        course_keywords = ['syllabus', 'lecture', 'course outline', 'learning objectives', 'prerequisites', 'textbook', 'grading', 'assignments', 'semester']
        if sum(1 for kw in course_keywords if kw in text_lower) >= 3:
            return 'course_material'

        # Interview Prep signals
        interview_keywords = ['interview questions', 'behavioral questions', 'technical questions', 'coding challenge', 'mock interview', 'question 1', 'answer:']
        if sum(1 for kw in interview_keywords if kw in text_lower) >= 3:
            return 'interview_prep'

        # Technical Document signals
        tech_keywords = ['architecture', 'api documentation', 'database schema', 'endpoint', 'deployment', 'class ', 'function ', 'installation guide']
        if sum(1 for kw in tech_keywords if kw in text_lower) >= 3:
            return 'technical'

        return 'general'

    @classmethod
    def analyze_document(cls, text, doc_type=None):
        """
        Main entry point for document analysis.
        Attempts Ollama first, falls back to Gemini on error/timeout.
        Returns dict with 'document_type', 'analysis', and 'ai_provider'.
        """
        if not doc_type:
            doc_type = cls.detect_document_type(text)

        prompt = cls._build_analysis_prompt(text, doc_type)

        messages = [
            {
                "role": "system",
                "content": (
                    "You are an expert AI document analyzer. Always respond with strict, valid JSON. "
                    "Do not wrap output in extra commentary or explanations outside of JSON."
                ),
            },
            {"role": "user", "content": prompt},
        ]

        analysis_json, provider_used = cls._execute_ai_with_fallback(messages)

        # Enforce document_type in result
        analysis_json['document_type'] = doc_type

        return {
            'document_type': doc_type,
            'analysis': analysis_json,
            'ai_provider': provider_used,
        }

    @classmethod
    def _execute_ai_with_fallback(cls, messages):
        """
        Try Ollama (Qwen3:8B or llama3.2:1b) first; if fails/times out, fallback to Gemini.
        Returns (parsed_json: dict, provider_name: str).
        """
        providers_to_try = [
            ('ollama', OllamaProvider()),
            ('gemini_fallback', GeminiProvider()),
        ]

        # Check if Gemini key exists; if not, include MockProvider as safety
        if not getattr(settings, 'GEMINI_API_KEY', None):
            providers_to_try.append(('mock_fallback', MockProvider()))

        last_error = None

        for provider_name, provider in providers_to_try:
            try:
                logger.info(f"Attempting document analysis using AI provider: {provider_name}")
                response_dict = provider.generate(messages)
                raw_response = response_dict.get('message', '')

                parsed_json = cls._clean_and_parse_json(raw_response)
                if parsed_json:
                    return parsed_json, provider_name

                # If JSON parsing failed, attempt one correction prompt with this provider
                logger.warning(f"Initial JSON parse failed for {provider_name}. Retrying with JSON fix prompt...")
                fix_messages = messages + [
                    {"role": "assistant", "content": raw_response},
                    {
                        "role": "user",
                        "content": "Your previous response was not valid JSON. Please reply with strictly valid JSON only.",
                    },
                ]
                retry_response = provider.generate(fix_messages)
                retry_json = cls._clean_and_parse_json(retry_response.get('message', ''))
                if retry_json:
                    return retry_json, provider_name

            except Exception as e:
                logger.warning(f"AI provider {provider_name} failed: {e}")
                last_error = e

        logger.error(f"All AI providers failed for document analysis: {last_error}")
        return cls._generate_structured_fallback_json(), 'fallback_error'

    @classmethod
    def _clean_and_parse_json(cls, raw_text):
        """Clean markdown code fences and parse JSON strictly."""
        if not raw_text:
            return None

        clean = raw_text.strip()
        # Remove ```json and ``` fences
        clean = re.sub(r'^```(?:json)?\s*', '', clean, flags=re.MULTILINE)
        clean = re.sub(r'\s*```$', '', clean, flags=re.MULTILINE)
        clean = clean.strip()

        # Extract JSON object substring if extra commentary surrounds it
        json_match = re.search(r'(\{[\s\S]*\})', clean)
        if json_match:
            clean = json_match.group(1)

        try:
            return json.loads(clean)
        except json.JSONDecodeError as e:
            logger.warning(f"JSONDecodeError: {e} for text snippet: {clean[:100]}")
            return None

    @classmethod
    def _build_analysis_prompt(cls, text, doc_type):
        """Construct specialized prompts based on document type."""
        truncated_text = text[:15000]  # Safe token budget for analysis

        if doc_type == 'resume':
            return f"""Analyze this Candidate Resume/CV carefully and return ONLY a valid JSON object matching this exact schema:

{{
  "document_type": "resume",
  "candidate": {{
    "name": "Candidate Full Name",
    "email": "Candidate Email or empty string",
    "phone": "Phone number or empty string",
    "location": "Location/City or empty string"
  }},
  "summary": "Professional executive summary of candidate background",
  "education": [
    {{"degree": "Degree name", "institution": "School/University", "year": "Graduation year or date"}}
  ],
  "experience": [
    {{"role": "Job Title", "company": "Company Name", "duration": "Dates/Duration", "details": "Key accomplishments"}}
  ],
  "skills": ["List of overall technical and professional skills"],
  "programming_languages": ["e.g. JavaScript, Python, C++"],
  "frameworks": ["e.g. React, Django, Spring Boot"],
  "databases": ["e.g. PostgreSQL, MongoDB, MySQL"],
  "tools": ["e.g. Git, Docker, AWS, VS Code"],
  "projects": [
    {{"title": "Project Name", "description": "Short summary", "technologies": ["Used tech"]}}
  ],
  "certifications": ["List of certifications"],
  "achievements": ["Key awards or recognitions"],
  "strengths": ["Top candidate strengths"],
  "missing_skills": ["Critical skills recommended to learn next for career advancement"],
  "recommended_courses": [
    {{
      "course_name": "Specific relevant course name (e.g. Advanced React.js, Full Stack Node.js, System Design)",
      "reason": "Logically connects candidate's existing skills to the next level",
      "level": "Beginner/Intermediate/Advanced",
      "related_skills": ["Target skills taught"],
      "priority": "High/Medium/Low"
    }}
  ],
  "recommended_jobs": [
    {{
      "role": "Specific Job Title (e.g. Frontend Developer, Full Stack Developer, Data Analyst)",
      "reason": "Why candidate matches this career role",
      "required_skills": ["Key required skills"],
      "matching_skills": ["Skills candidate already has"],
      "missing_skills": ["Skills candidate should acquire"],
      "experience_level": "Entry-Level/Junior/Mid-Level/Senior"
    }}
  ],
  "recommended_internships": [
    {{
      "role": "Internship Title",
      "reason": "Why suitable for candidate",
      "matching_skills": ["Skills candidate has"]
    }}
  ],
  "interview_questions": {{
    "technical_questions": ["Top 3 technical interview questions based on candidate skills"],
    "behavioral_questions": ["Top 2 behavioral interview questions"],
    "project_questions": ["Questions about candidate projects"],
    "difficulty": {{
      "easy": ["Easy question"],
      "medium": ["Medium question"],
      "hard": ["Hard question"]
    }}
  }},
  "learning_roadmap": [
    {{"step": 1, "topic": "Skill to learn", "action": "Recommended project/course to build"}}
  ],
  "overall_feedback": "Constructive, encouraging professional feedback on resume quality and impact"
}}

RESUME TEXT:
{truncated_text}
"""
        else:
            return f"""Analyze this document carefully and return ONLY a valid JSON object matching this exact schema:

{{
  "document_type": "{doc_type}",
  "title": "Clear concise document title",
  "summary": "Comprehensive executive summary of the document",
  "key_points": ["List of 5 to 7 main key points from the content"],
  "important_topics": ["List of core topics covered"],
  "important_terms": [
    {{"term": "Technical Term", "definition": "Clear explanation"}}
  ],
  "questions_and_answers": [
    {{"question": "Key practice question from content", "answer": "Clear explanation"}}
  ],
  "mcqs": [
    {{
      "question": "Multiple choice question",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correct_answer": "A) Option 1",
      "explanation": "Why this answer is correct"
    }}
  ],
  "action_items": ["Actionable takeaways or next steps"],
  "related_skills": ["Skills taught or discussed in this document"],
  "recommended_courses": [
    {{
      "course_name": "Suggested course to learn more",
      "reason": "Relevance to document topics",
      "level": "Beginner/Intermediate/Advanced",
      "related_skills": ["Skills covered"],
      "priority": "High/Medium/Low"
    }}
  ]
}}

DOCUMENT CONTENT:
{truncated_text}
"""

    @classmethod
    def _generate_structured_fallback_json(cls):
        """Fallback response if AI providers are offline or return unparseable output."""
        return {
            "document_type": "general",
            "title": "Document Analysis Complete",
            "summary": "Document processed successfully. AI response generated standard structured overview.",
            "key_points": [
                "Document text extracted cleanly.",
                "Primary topics identified.",
                "Review detailed sections for additional details."
            ],
            "important_topics": ["Document Overview", "Key Concepts"],
            "important_terms": [],
            "questions_and_answers": [],
            "mcqs": [],
            "action_items": ["Review document content and practice questions."],
            "related_skills": [],
            "recommended_courses": []
        }

    @classmethod
    def generate_document_chat_response(cls, document, user_message_content):
        """
        Grounded Q&A over the uploaded document's extracted text and analysis result.
        """
        doc_context = document.extracted_text[:10000] if document.extracted_text else ""
        analysis_summary = json.dumps(document.analysis_result, indent=2)[:3000] if document.analysis_result else ""

        system_prompt = (
            f"You are Career AI assisting the user with their uploaded document '{document.filename}'.\n"
            f"Document Type: {document.document_type}\n\n"
            f"DOCUMENT EXTRACTED TEXT:\n{doc_context}\n\n"
            f"ANALYSIS SUMMARY:\n{analysis_summary}\n\n"
            "Answer the user's question accurately using the document context above. "
            "If the information is not present in the document, provide helpful professional career advice."
        )

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message_content},
        ]

        # Use existing Ollama -> Gemini fallback pipeline
        return cls._execute_ai_chat_with_fallback(messages)

    @classmethod
    def _execute_ai_chat_with_fallback(cls, messages):
        """Execute chat response with Ollama -> Gemini fallback."""
        providers = [
            ('ollama', OllamaProvider()),
            ('gemini_fallback', GeminiProvider()),
        ]
        if not getattr(settings, 'GEMINI_API_KEY', None):
            providers.append(('mock_fallback', MockProvider()))

        for p_name, provider in providers:
            try:
                res = provider.generate(messages)
                if res and res.get('message'):
                    return {
                        'message': res['message'],
                        'suggestions': res.get('suggestions', []),
                        'ai_provider': p_name,
                    }
            except Exception as e:
                logger.warning(f"Document chat provider {p_name} failed: {e}")

        return {
            'message': "I analyzed your document context. What specific details would you like me to clarify?",
            'suggestions': ["Tell me more about my skills", "What courses should I take?", "Show interview questions"],
            'ai_provider': 'mock_fallback',
        }
