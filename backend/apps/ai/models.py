import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone


AI_CONVERSATION_TITLE_MAX_LENGTH = 200


class AIConversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ai_conversations',
        null=True,
        blank=True,
    )
    guest_id = models.CharField(max_length=100, null=True, blank=True, db_index=True)
    title = models.CharField(max_length=AI_CONVERSATION_TITLE_MAX_LENGTH, default='New Conversation')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'ai'
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['user', '-updated_at']),
            models.Index(fields=['guest_id', '-updated_at']),
            models.Index(fields=['-updated_at']),
        ]

    def __str__(self):
        return f"{self.title} ({self.user.email})"

    def save(self, *args, **kwargs):
        if not self.title or self.title == 'New Conversation':
            first_msg = self.messages.order_by('created_at').first()
            if first_msg and first_msg.content:
                self.title = first_msg.content[:AI_CONVERSATION_TITLE_MAX_LENGTH - 1].strip() or 'New Conversation'
        super().save(*args, **kwargs)

    @property
    def messages_count(self):
        return self.messages.count()


class AIMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        AIConversation,
        on_delete=models.CASCADE,
        related_name='messages',
    )
    role = models.CharField(max_length=20, choices=[('user', 'User'), ('assistant', 'Assistant')])
    content = models.TextField()
    attachment = models.JSONField(default=dict, null=True, blank=True)
    suggestions = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'ai'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['conversation', 'created_at']),
        ]

    def __str__(self):
        return f"{self.role}: {self.content[:50]}..."


class AIDocument(models.Model):
    DOCUMENT_TYPES = [
        ('resume', 'Resume/CV'),
        ('course_material', 'Course Material'),
        ('job_description', 'Job Description'),
        ('interview_prep', 'Interview Preparation'),
        ('technical', 'Technical Document'),
        ('general', 'General Document'),
        ('unknown', 'Unknown'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ai_documents',
        null=True,
        blank=True,
    )
    guest_id = models.CharField(max_length=100, null=True, blank=True, db_index=True)
    filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=20)  # pdf, docx, txt
    file_size = models.IntegerField(default=0)
    extracted_text = models.TextField(blank=True)
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPES, default='general')
    analysis_result = models.JSONField(default=dict, blank=True)
    ai_provider = models.CharField(max_length=50, default='ollama')
    ocr_required = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'ai'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['guest_id', '-created_at']),
        ]

    def __str__(self):
        return f"{self.filename} ({self.document_type})"


class AIDocumentChatMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(
        AIDocument,
        on_delete=models.CASCADE,
        related_name='chat_messages',
    )
    role = models.CharField(max_length=20, choices=[('user', 'User'), ('assistant', 'Assistant')])
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'ai'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['document', 'created_at']),
        ]

    def __str__(self):
        return f"{self.role}: {self.content[:50]}..."