import abc
import json
import logging
import time
import urllib.request
import urllib.error
from django.conf import settings

logger = logging.getLogger(__name__)


class AIProviderError(Exception):
    """A provider failed to produce a usable AI response."""


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
        self.model = getattr(settings, 'GEMINI_MODEL', getattr(settings, 'AI_MODEL', 'gemini-3.6-flash'))
        self.base_url = 'https://generativelanguage.googleapis.com/v1beta/models'

    def get_model_name(self):
        return self.model

    def generate(self, messages):
        if not self.api_key:
            raise AIProviderError("GEMINI_API_KEY is not configured.")

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

            with urllib.request.urlopen(
                req, timeout=getattr(settings, 'GEMINI_TIMEOUT_SECONDS', 30)
            ) as response:
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
            logger.error("Gemini API HTTP error %s: %s", e.code, error_body)
            if e.code == 403:
                raise AIProviderError("Gemini API access denied.") from e
            raise AIProviderError(f"Gemini API error: {e.code}") from e
        except urllib.error.URLError as e:
            logger.error("Gemini API network error: %s", e.reason)
            raise AIProviderError("Gemini API temporarily unavailable.") from e
        except json.JSONDecodeError as e:
            logger.error("Gemini API JSON decode error: %s", e)
            raise AIProviderError("Gemini API response parse error.") from e
        except Exception as e:
            logger.error("Gemini API unexpected error: %s", e)
            raise


class OllamaProvider(AIProvider):
    """Local Ollama provider for the non-streaming chat API."""

    def __init__(self):
        self.base_url = getattr(settings, 'OLLAMA_BASE_URL', 'http://127.0.0.1:11434').rstrip('/')
        self.model = getattr(settings, 'OLLAMA_MODEL', 'qwen3:8b')
        self.timeout = getattr(settings, 'OLLAMA_TIMEOUT_SECONDS', 30)

    def get_model_name(self):
        return self.model

    def generate(self, messages):
        formatted_messages = []
        for msg in messages:
            role = msg.get('role', 'user')
            if role == 'model':
                role = 'assistant'
            formatted_messages.append({
                'role': role,
                'content': msg.get('content', '')
            })

        payload = {
            'model': self.model,
            'messages': formatted_messages,
            'stream': False,
            'keep_alive': '30m',
            'options': {
                'num_predict': 2048,
                'temperature': 0.7,
                'top_k': 40,
                'top_p': 0.9,
                'num_ctx': 4096,
                'num_thread': 8,
            }
        }
        request = urllib.request.Request(
            f'{self.base_url}/api/chat',
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'},
            method='POST',
        )

        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as response:
                result = json.loads(response.read().decode('utf-8'))
            message = result.get('message', {}).get('content', '').strip()
            if not message:
                raise AIProviderError('Ollama returned an empty response.')
            return {'message': message, 'suggestions': [], 'actions': []}
        except urllib.error.HTTPError as error:
            logger.warning("Ollama HTTP error %s; falling back if configured.", error.code)
            raise AIProviderError(f'Ollama API error: {error.code}') from error
        except (urllib.error.URLError, TimeoutError, OSError) as error:
            logger.warning("Ollama is unavailable or timed out; falling back if configured: %s", error)
            raise AIProviderError('Ollama is unavailable.') from error
        except json.JSONDecodeError as error:
            logger.warning("Ollama returned invalid JSON; falling back if configured: %s", error)
            raise AIProviderError('Ollama returned an invalid response.') from error


class FallbackAIProvider(AIProvider):
    """Try a primary provider and then one configured backup provider."""

    def __init__(self, primary, fallback=None):
        self.primary = primary
        self.fallback = fallback

    def get_model_name(self):
        return self.primary.get_model_name()

    def generate(self, messages):
        try:
            result = self.primary.generate(messages)
            logger.info("AI chat response served by primary provider %s.", self.primary.__class__.__name__)
            return result
        except Exception as primary_error:
            if not self.fallback:
                raise AIProviderError('Primary AI provider is unavailable.') from primary_error
            logger.warning(
                "AI primary provider %s failed; using fallback %s.",
                self.primary.__class__.__name__, self.fallback.__class__.__name__,
            )
            try:
                result = self.fallback.generate(messages)
                logger.info("AI chat response served by fallback provider %s.", self.fallback.__class__.__name__)
                return result
            except Exception as fallback_error:
                logger.error(
                    "AI fallback provider %s also failed.", self.fallback.__class__.__name__,
                )
                raise AIProviderError('All configured AI providers are unavailable.') from fallback_error


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
        logger.debug("OpenAI-compatible provider initialized with model %s at %s", self.model, self.base_url)

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


def _provider_for_name(provider_name):
    """Build a provider from its configuration name."""
    normalized_name = (provider_name or '').lower()
    if normalized_name == 'ollama':
        return OllamaProvider()
    if normalized_name == 'gemini':
        return GeminiProvider()
    if normalized_name == 'openai':
        return OpenAIProvider()
    if normalized_name == 'mock':
        return MockProvider()
    raise ValueError(f'Unsupported AI provider: {provider_name}')


def get_chat_provider():
    """Return the Ollama-first provider used by the chat endpoint."""
    primary = _provider_for_name(getattr(settings, 'AI_CHAT_PRIMARY_PROVIDER', 'ollama'))
    fallback = None
    if getattr(settings, 'AI_CHAT_FALLBACK_ENABLED', True):
        fallback_name = getattr(settings, 'AI_CHAT_FALLBACK_PROVIDER', 'gemini')
        if fallback_name.lower() != getattr(settings, 'AI_CHAT_PRIMARY_PROVIDER', 'ollama').lower():
            fallback = _provider_for_name(fallback_name)
    return FallbackAIProvider(primary, fallback)


def get_ai_provider():
    """Legacy provider factory retained for non-chat callers."""
    return _provider_for_name(getattr(settings, 'AI_PROVIDER', 'mock'))
