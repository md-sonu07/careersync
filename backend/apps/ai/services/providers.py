import abc
import json
import logging
import time
import urllib.request
import urllib.error
from django.conf import settings

logger = logging.getLogger(__name__)


class AIProvider(abc.ABC):
    """Abstract base for AI provider implementations."""

    @abc.abstractmethod
    def generate(self, messages):
        """Generate a response given a list of message dicts {role, content}.
        Returns dict with keys: 'message' (str), 'suggestions' (list[str]), 'actions' (list[str]).
        """
        pass

    @abc.abstractmethod
    def get_model_name(self):
        """Return the model name being used."""
        pass


class MockProvider(AIProvider):
    """Fallback provider that generates educational responses without external API calls.

    Used when no AI key is configured (development/testing mode).
    """

    def get_model_name(self):
        return 'mock'

    def generate(self, messages):
        # Extract the last user message content
        last_user_msg = ''
        for msg in reversed(messages):
            if msg.get('role') == 'user':
                last_user_msg = msg.get('content', '')
                break

        # Build a grounded response based on the topic
        topic = last_user_msg.lower().strip() or 'your question'

        # Generate a professional educational response
        message = self._build_educational_response(topic)

        # Generate context-aware suggestions
        suggestions = self._build_suggestions(topic)

        # No actions for mock
        actions = []

        return {
            'message': message,
            'suggestions': suggestions,
            'actions': actions,
        }

    def _build_educational_response(self, topic):
        """Build a professional, beginner-friendly educational response."""
        # Use structured paragraphs with clear fact/suggestion separation
        response_parts = []

        # Opening
        response_parts.append(f"Great question about {topic}!")

        # Educational content - general but structured
        response_parts.append(
            f"{topic} is a fundamental concept that forms the basis for many "
            "learning paths in technology and career development."
        )

        # Example-oriented section
        response_parts.append(
            f"For example, understanding {topic} helps you build a stronger foundation "
            "for tackling more advanced topics. Many learners start by exploring the basic "
            "principles before applying them in practical projects."
        )

        # Distinguish facts from suggestions
        response_parts.append(
            "Key takeaway: This concept is widely applicable across many domains, "
            "from software development to system design."
        )

        # Professional closing
        response_parts.append(
            "Would you like me to elaborate on any part, provide more examples, "
            "or help you connect this to a specific learning goal?"
        )

        return ' '.join(response_parts)

    def _build_suggestions(self, topic):
        """Build context-aware suggestions based on the topic."""
        base_suggestions = [
            'Explain more',
            'Give me an example',
            'Ask me another question',
        ]

        # Topic-specific suggestion mapping
        topic_lower = topic.lower()
        suggestions = list(base_suggestions)

        if any(word in topic_lower for word in ['react', 'javascript', 'frontend', 'library']):
            suggestions.extend([
                'Explain components',
                'Teach me hooks',
                'What should I learn next?',
            ])
        elif any(word in topic_lower for word in ['python', 'backend', 'django', 'flask']):
            suggestions.extend([
                'Explain middleware',
                'Teach me decorators',
                'Create a practice exercise',
            ])
        elif any(word in topic_lower for word in ['database', 'sql', 'postgres']):
            suggestions.extend([
                'Explain joins',
                'Teach me migrations',
                'What should I optimize?',
            ])
        elif any(word in topic_lower for word in ['career', 'job', 'role']):
            suggestions.extend([
                'What skills do I need?',
                'Suggest a learning path',
                'What careers match?',
            ])

        # Cap at 3 suggestions
        return suggestions[:3]


class GeminiProvider(AIProvider):
    """Google Gemini AI provider via REST API.

    Uses the Gemini 1.5 Flash or Pro model through the Google Generative AI REST endpoint.
    API key must be set via GEMINI_API_KEY environment variable.
    """

    def __init__(self):
        self.api_key = getattr(settings, 'GEMINI_API_KEY', None)
        self.model = getattr(settings, 'AI_MODEL', 'gemini-3.6-flash')
        self.base_url = 'https://generativelanguage.googleapis.com/v1beta/models'
        print(f"[DEBUG] GeminiProvider initialized with model: {self.model}, api_key starts with: {str(self.api_key)[:10]}")

    def get_model_name(self):
        return self.model

    def generate(self, messages):
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not configured")

        # Build the prompt from messages
        # Gemini uses a different format: system instruction + contents
        system_instruction = ''
        contents = []

        for msg in messages:
            role = msg.get('role', 'user')
            content = msg.get('content', '')

            if role == 'system':
                system_instruction = content
            elif role == 'user':
                contents.append({'role': 'user', 'parts': [{'text': content}]})
            elif role == 'assistant':
                contents.append({'role': 'model', 'parts': [{'text': content}]})

        # Build the request payload
        payload = {
            'contents': contents,
            'generationConfig': {
                'temperature': 0.7,
                'topP': 1,
                'topK': 40,
                'maxOutputTokens': 512,
            }
        }
        
        if system_instruction:
            payload['systemInstruction'] = {
                'parts': [{'text': system_instruction}]
            }

        url = f"{self.base_url}/{self.model}:generateContent?key={self.api_key}"

        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode('utf-8'),
                headers={'Content-Type': 'application/json'},
                method='POST',
            )

            with urllib.request.urlopen(req, timeout=30) as response:
                result = json.loads(response.read().decode('utf-8'))

            # Extract the response text from Gemini format
            if result.get('candidates'):
                candidate = result['candidates'][0]
                if candidate.get('content'):
                    message = candidate['content'].get('parts', [{}])[0].get('text', '')
                else:
                    message = ''
            else:
                message = ''

            # Extract suggestions if present in response metadata
            suggestions = []
            if result.get('metadata') and result['metadata'].get('suggestions'):
                suggestions = result['metadata']['suggestions']
            elif result.get('suggestions'):
                suggestions = result['suggestions']

            # Ensure we always have at least one suggestion-like fallback
            if not suggestions:
                suggestions = ['Explain more', 'Give me an example']

            # Cap suggestions
            suggestions = suggestions[:3]

            return {
                'message': message or 'I apologize, but I encountered an issue generating the response. Please try again.',
                'suggestions': suggestions,
                'actions': [],
            }

        except urllib.error.HTTPError as e:
            error_body = e.fp.read().decode('utf-8') if getattr(e, 'fp', None) else str(e)
            print(f"[DEBUG] Gemini API HTTP error: {e.code} - {error_body}")
            print(f"[DEBUG] URL was: {url}")
            if e.code == 403:
                raise ValueError("Gemini API access denied. Check GEMINI_API_KEY and permissions.")
            raise ValueError(f"Gemini API error: {e.code}")
        except urllib.error.URLError as e:
            logger.error(f"Gemini API URL error: {e.reason}")
            raise ValueError("Gemini API temporarily unavailable. Please try again.")
        except json.JSONDecodeError as e:
            logger.error(f"Gemini API JSON decode error: {e}")
            raise ValueError("Gemini API response parse error.")
        except Exception as e:
            logger.error(f"Gemini API unexpected error: {e}")
            raise


class OpenAIProvider(AIProvider):
    """OpenAI compatible provider with automatic model fallback.
    
    Tries the configured model first, then falls back through a list of
    known-working free models on OpenCode Zen until one responds.
    """

    # Ordered list of free models to try (fastest first)
    FALLBACK_MODELS = [
        'mimo-v2.5-free',
        'laguna-s-2.1-free',
        'nemotron-3.5-lightning-free',
        'muse-spark-1.2-contributor-free',
        'x-preview-f-free',
        'hy3-free',
        'nemotron-3-ultra-free',
        'deepseek-v4-flash-free',
    ]

    def __init__(self):
        self.api_key = getattr(settings, 'OPENAI_API_KEY', getattr(settings, 'GEMINI_API_KEY', None))
        self.model = getattr(settings, 'AI_MODEL', 'nemotron-3.5-lightning-free')
        self.base_url = getattr(settings, 'OPENAI_BASE_URL', 'https://opencode.ai/zen/v1/chat/completions')
        print(f"[DEBUG] OpenAIProvider initialized with model: {self.model}, base_url: {self.base_url}, api_key starts with: {str(self.api_key)[:10]}")

    def get_model_name(self):
        return self.model

    def _call_api(self, model, messages):
        """Make a single API call with the given model. Returns result dict or raises."""
        openai_messages = []
        for msg in messages:
            role = msg.get('role', 'user')
            if role == 'model':
                role = 'assistant'
            openai_messages.append({
                'role': role,
                'content': msg.get('content', '')
            })

        payload = {
            'model': model,
            'messages': openai_messages,
            'temperature': 0.7,
            'max_tokens': 512,
        }

        req = urllib.request.Request(
            self.base_url,
            data=json.dumps(payload).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.api_key}',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            method='POST',
        )

        with urllib.request.urlopen(req, timeout=45) as response:
            result = json.loads(response.read().decode('utf-8'))

        message = ''
        if result.get('choices'):
            message = result['choices'][0].get('message', {}).get('content', '')

        return {
            'message': message or 'I apologize, but I encountered an issue generating the response.',
            'suggestions': [],
            'actions': [],
        }

    def generate(self, messages):
        if not self.api_key:
            raise ValueError("API key not configured for OpenAIProvider")

        # Build list of models to try: configured model first, then fallbacks
        models_to_try = [self.model]
        for m in self.FALLBACK_MODELS:
            if m != self.model:
                models_to_try.append(m)

        last_error = None
        for model in models_to_try:
            try:
                print(f"[DEBUG] Trying model: {model}")
                result = self._call_api(model, messages)
                print(f"[DEBUG] Success with model: {model}")
                return result
            except urllib.error.HTTPError as e:
                error_body = e.fp.read().decode('utf-8') if getattr(e, 'fp', None) else str(e)
                print(f"[DEBUG] Model {model} failed ({e.code}): {error_body}")
                last_error = e
                # Don't retry on auth errors (wrong API key)
                if e.code == 401 and 'ModelError' not in error_body:
                    raise ValueError("AI API key is invalid. Check OPENAI_API_KEY.")
                if e.code == 403 and 'Cloudflare' not in str(error_body) and '1010' not in str(error_body):
                    raise ValueError("AI API access denied. Check API key and permissions.")
                continue
            except urllib.error.URLError as e:
                print(f"[DEBUG] Model {model} network error: {e.reason}")
                last_error = e
                continue
            except Exception as e:
                print(f"[DEBUG] Model {model} unexpected error: {e}")
                last_error = e
                continue

        # All models failed — raise the last error
        logger.error(f"All AI models failed. Last error: {last_error}")
        raise ValueError("AI service temporarily unavailable. All models failed. Please try again later.")


def get_ai_provider():
    """Factory function to get the configured AI provider instance."""
    provider_name = getattr(settings, 'AI_PROVIDER', 'mock').lower()

    if provider_name == 'gemini':
        return GeminiProvider()
    elif provider_name == 'openai':
        return OpenAIProvider()
    else:
        # Default to mock provider
        return MockProvider()