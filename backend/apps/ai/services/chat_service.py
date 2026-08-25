import logging
import re
import time
from django.conf import settings
from .providers import get_chat_provider
from .prompts import SYSTEM_PROMPT

logger = logging.getLogger(__name__)


def generate_response(conversation, user_message_content, user):
    """
    Generate an AI response for a conversation.
    1. Prepare conversation history
    2. Inject dynamic system prompt instructions based on user intent (MCQs, Jobs, Internships, Interview prep)
    3. Call the AI provider
    4. Return dynamic suggestions tailored to tech topics & intent
    """
    start_time = time.time()

    # Get conversation history (last messages, excluding the just-sent user message)
    messages = conversation.messages.all().order_by('created_at')

    ai_messages = []

    # Dynamic system prompt customization
    base_system_prompt = settings.AI_SYSTEM_PROMPT or SYSTEM_PROMPT
    user_prompt_lower = user_message_content.lower()

    if '[attached document' in user_prompt_lower or 'resume' in user_prompt_lower or 'cv' in user_prompt_lower:
        base_system_prompt += (
            "\n\n[INSTRUCTION FOR ATTACHED DOCUMENTS & RESUMES]: "
            "The user has attached a document or resume. Respond with a clear, engaging, human-friendly summary in clean Markdown. "
            "Highlight the candidate's core tech stack and skills (e.g. MERN Stack, Java, Python, React, JavaScript, SQL, DSA). "
            "Never output raw JSON schemas or unformatted data dumps."
        )

    if re.search(r'\bmcqs?\b|\bmultiple choice\b|\bquiz\b', user_prompt_lower):
        base_system_prompt += (
            "\n\n[ROLE & TASK FOR MCQs]: You are an expert computer science tutor and career educator. "
            "The user wants educational Multiple Choice Questions (MCQs) for learning and self-assessment. "
            "Always generate and provide 4 distinct, high-quality practice questions on the requested topic. "
            "Never refuse or state that you cannot generate MCQs. "
            "For each question, list 4 options (A, B, C, D), followed by 'Answer: <Key>' and 'Explanation: <Text>'."
        )
    elif 'internship' in user_prompt_lower:
        base_system_prompt += (
            "\n\n[INSTRUCTION]: The user is asking about internships. "
            "Provide key internship opportunities, typical eligibility criteria, required skills, "
            "and actionable tips to secure an internship in this field."
        )
    elif 'job' in user_prompt_lower:
        base_system_prompt += (
            "\n\n[INSTRUCTION]: The user is asking about job opportunities. "
            "Provide active career roles, key technical requirements, top hiring companies, "
            "and strategies to land a job."
        )
    elif 'interview' in user_prompt_lower:
        base_system_prompt += (
            "\n\n[INSTRUCTION]: The user is asking for interview preparation. "
            "Provide 3-4 top real-world technical interview questions with clear, expert answers."
        )

    ai_messages.append({
        'role': 'system',
        'content': base_system_prompt,
    })

    # Add conversation history (limit to last N exchanges)
    max_history = getattr(settings, 'AI_MAX_HISTORY', 4)
    messages_list = list(messages)
    recent_messages = messages_list[-max_history * 2:]

    for msg in recent_messages:
        ai_messages.append({
            'role': msg.role,
            'content': msg.content,
        })

    # Add current user message
    ai_messages.append({
        'role': 'user',
        'content': user_message_content,
    })

    provider = get_chat_provider()
    result = provider.generate(ai_messages)

    elapsed = time.time() - start_time
    logger.info(f"AI response generated in {elapsed:.2f}s using {provider.__class__.__name__}")

    ai_message_text = result.get('message', '')
    suggestions = result.get('suggestions', [])
    actions = result.get('actions', [])

    # Always generate dynamic tech & intent-based suggestions
    suggestions = _generate_dynamic_suggestions(user_message_content, ai_message_text)

    return {
        'message': ai_message_text,
        'suggestions': suggestions,
        'actions': actions,
    }


def _detect_tech_topic(text):
    """Detect programming languages, frameworks, and technical skills from text."""
    if not text:
        return None

    text_lower = text.lower()

    # Exact topic mapping
    topic_map = {
        'javascript': 'JavaScript',
        'js': 'JavaScript',
        'python': 'Python',
        'java': 'Java',
        'react': 'React',
        'reactjs': 'React',
        'node': 'Node.js',
        'nodejs': 'Node.js',
        'sql': 'SQL',
        'c++': 'C++',
        'cpp': 'C++',
        'c#': 'C#',
        'csharp': 'C#',
        'html': 'HTML',
        'css': 'CSS',
        'typescript': 'TypeScript',
        'ts': 'TypeScript',
        'go': 'Go',
        'golang': 'Go',
        'rust': 'Rust',
        'flutter': 'Flutter',
        'django': 'Django',
        'flask': 'Flask',
        'spring': 'Spring Boot',
        'spring boot': 'Spring Boot',
        'aws': 'AWS',
        'docker': 'Docker',
        'devops': 'DevOps',
        'data science': 'Data Science',
        'machine learning': 'Machine Learning',
        'php': 'PHP',
        'ruby': 'Ruby',
        'swift': 'Swift',
        'kotlin': 'Kotlin',
        'mongodb': 'MongoDB',
        'mysql': 'MySQL',
        'postgresql': 'PostgreSQL',
    }

    for key, name in topic_map.items():
        if re.search(r'\b' + re.escape(key) + r'\b', text_lower):
            return name

    return None


def _generate_dynamic_suggestions(user_message, ai_response):
    """
    Dynamically generate topic-specific options:
    - Find {Topic} Jobs
    - Practice {Topic} Interview Questions
    - Find {Topic} Internships
    - Generate {Topic} MCQs
    """
    suggestions = []

    # Detect tech topic from user message or AI response
    topic = _detect_tech_topic(user_message) or _detect_tech_topic(ai_response)

    if topic:
        # User requested feature: When chatting about any programming language/topic, show these dynamic options!
        return [
            f"Find {topic} Jobs",
            f"Practice {topic} Interview Questions",
            f"Find {topic} Internships",
            f"Generate {topic} MCQs",
        ]

    # Extract follow-up questions from AI text if present
    lines = [line.strip() for line in (ai_response or '').split('\n') if line.strip()]
    for line in lines:
        clean_line = re.sub(r'^(\d+[\.\)]|[-*•])\s*', '', line).strip()
        if clean_line.endswith('?') and 10 < len(clean_line) < 70:
            if not any(ignore in clean_line.lower() for ignore in ['how can i help', 'anything else']):
                if clean_line not in suggestions:
                    suggestions.append(clean_line)

    # General intent fallbacks if no specific topic was detected
    user_lower = user_message.lower().strip()
    if len(suggestions) < 4:
        if any(w in user_lower for w in ['code', 'error', 'bug', 'learn', 'teach']):
            suggestions.extend([
                "Show me a complete code example",
                "What are common mistakes to avoid?",
                "Give me a step-by-step learning path",
                "Create practice exercises for me",
            ])
        else:
            suggestions.extend([
                "Can you explain this in simpler terms?",
                "What is a real-world application of this?",
                "What should I learn next after this?",
                "Give me a practical example",
            ])

    # Deduplicate while preserving order & return top 4
    seen = set()
    final_suggestions = []
    for item in suggestions:
        normalized = item.strip().lower()
        if normalized not in seen:
            seen.add(normalized)
            final_suggestions.append(item.strip())

    return final_suggestions[:4]
