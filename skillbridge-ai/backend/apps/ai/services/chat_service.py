import logging
import time
from django.conf import settings
from .providers import get_ai_provider
from .prompts import SYSTEM_PROMPT

logger = logging.getLogger(__name__)


def generate_response(conversation, user_message_content, user):
    """
    Generate an AI response for a conversation.
    1. Prepare conversation history
    2. Call the AI provider
    3. Return structured response with message, suggestions, actions
    """
    start_time = time.time()

    # Get conversation history (last messages, excluding the just-sent user message)
    messages = conversation.messages.all().order_by('created_at')

    # Build the message list for the AI provider
    # Format: [system_prompt, ...conversation_history, {role: user, content: message}]
    ai_messages = []

    # Add system prompt
    ai_messages.append({
        'role': 'system',
        'content': settings.AI_SYSTEM_PROMPT or SYSTEM_PROMPT,
    })

    # Add conversation history (limit to last N exchanges to control cost/latency)
    max_history = getattr(settings, 'AI_MAX_HISTORY', 10)
    
    # Convert QuerySet to list before negative indexing
    messages_list = list(messages)
    recent_messages = messages_list[-max_history * 2:]  # each exchange = user + assistant

    for msg in recent_messages:
        ai_messages.append({
            'role': msg.role,
            'content': msg.content,
        })

    # Add the current user message at the end
    ai_messages.append({
        'role': 'user',
        'content': user_message_content,
    })

    # Get provider and generate
    provider = get_ai_provider()
    result = provider.generate(ai_messages)

    elapsed = time.time() - start_time
    logger.info(f"AI response generated in {elapsed:.2f}s using {provider.__class__.__name__}")

    # Extract suggestions from response if present
    suggestions = result.get('suggestions', [])
    actions = result.get('actions', [])

    # If no suggestions were returned, generate context-aware default suggestions
    if not suggestions:
        suggestions = _generate_default_suggestions(user_message_content)

    return {
        'message': result.get('message', ''),
        'suggestions': suggestions,
        'actions': actions,
    }


def _generate_default_suggestions(user_message):
    """Generate context-aware suggestion prompts based on user input."""
    text = user_message.lower().strip()

    suggestions = []

    # Topic explanation suggestions
    if any(word in text for word in ['explain', 'what is', 'how does', 'define']):
        suggestions = [
            'Explain this concept more',
            'Give me an example',
            'What are the key benefits?',
        ]
    # Learning suggestions
    elif any(word in text for word in ['learn', 'study', 'practice', 'teach me']):
        suggestions = [
            'Teach me the next step',
            'Create a practice exercise',
            'What should I focus on?',
        ]
    # Assessment/career suggestions
    elif any(word in text for word in ['assess', 'prepare', 'interview', 'exam', 'test']):
        suggestions = [
            'Create practice questions',
            'Give me test tips',
            'What topics do I need to know?',
        ]
    # Career questions
    elif any(word in text for word in ['career', 'job', 'role', 'skills', 'future']):
        suggestions = [
            'What skills do I need?',
            'Suggest a learning path',
            'What careers match my profile?',
        ]
    else:
        # Generic fallback
        suggestions = [
            'Explain more',
            'Give me an example',
            'Ask me another question',
        ]

    return suggestions[:3]  # Cap at 3 suggestions