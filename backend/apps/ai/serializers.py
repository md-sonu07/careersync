import uuid
from rest_framework import serializers
from .models import AIConversation, AIMessage


class AIMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIMessage
        fields = ['id', 'role', 'content', 'attachment', 'suggestions', 'created_at']
        read_only_fields = ['id', 'conversation', 'created_at']


class AIConversationSerializer(serializers.ModelSerializer):
    message_count = serializers.SerializerMethodField()
    last_message_preview = serializers.SerializerMethodField()
    first_message_preview = serializers.SerializerMethodField()
    first_ai_response = serializers.SerializerMethodField()

    class Meta:
        model = AIConversation
        fields = [
            'id', 'title', 'created_at', 'updated_at',
            'message_count', 'last_message_preview', 'first_message_preview', 'first_ai_response', 'guest_id',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'guest_id']

    def get_message_count(self, obj):
        return obj.messages_count

    def get_last_message_preview(self, obj):
        msg = obj.messages.order_by('-created_at').first()
        if msg:
            clean = msg.content.replace('#', '').replace('*', '').replace('\n', ' ').strip()
            return clean[:80].strip() + ('...' if len(clean) > 80 else '')
        return None

    def get_first_message_preview(self, obj):
        msg = obj.messages.order_by('created_at').first()
        if msg:
            clean = msg.content.replace('#', '').replace('*', '').replace('\n', ' ').strip()
            return clean[:80].strip() + ('...' if len(clean) > 80 else '')
        return None

    def get_first_ai_response(self, obj):
        msg = obj.messages.filter(role='assistant').order_by('created_at').first()
        if msg and msg.content:
            clean = msg.content.replace('#', '').replace('*', '').replace('\n', ' ').strip()
            return clean[:80].strip() + ('...' if len(clean) > 80 else '')
        return None


class AIConversationDetailSerializer(AIConversationSerializer):
    messages = AIMessageSerializer(many=True, read_only=True)

    class Meta(AIConversationSerializer.Meta):
        fields = AIConversationSerializer.Meta.fields + ['messages']


class ChatRequestSerializer(serializers.Serializer):
    conversation_id = serializers.UUIDField(required=False, allow_null=True)
    message = serializers.CharField(max_length=4000, required=False, allow_blank=True, default='')
    attachment = serializers.JSONField(required=False, allow_null=True, default=dict)
    doc_context = serializers.CharField(required=False, allow_blank=True, allow_null=True, default='')

    def validate(self, attrs):
        msg = attrs.get('message', '').strip()
        doc = attrs.get('doc_context', '').strip()
        if not msg and not doc:
            raise serializers.ValidationError({"message": "Message or document attachment is required."})
        attrs['message'] = msg or "Attached document analysis request."
        return attrs


class ChatResponseSerializer(serializers.Serializer):
    conversation_id = serializers.UUIDField()
    user_message_id = serializers.UUIDField()
    assistant_message_id = serializers.UUIDField()
    response = serializers.CharField()
    suggestions = serializers.ListField(child=serializers.CharField(), default=[])
    actions = serializers.ListField(child=serializers.CharField(), default=[])
    timestamp = serializers.DateTimeField(read_only=True)


class AIDocumentUploadSerializer(serializers.Serializer):
    file = serializers.FileField(required=True)

    def validate_file(self, value):
        allowed_extensions = ['pdf', 'docx', 'doc', 'txt']
        ext = value.name.split('.')[-1].lower() if '.' in value.name else ''
        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                f"Invalid file type '.{ext}'. Supported formats: PDF, DOCX, TXT."
            )
        # Max file size 10MB
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("File size exceeds 10MB limit.")
        return value


from .models import AIDocument, AIDocumentChatMessage


class AIDocumentChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIDocumentChatMessage
        fields = ['id', 'role', 'content', 'created_at']
        read_only_fields = ['id', 'document', 'created_at']


class AIDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIDocument
        fields = [
            'id', 'filename', 'file_type', 'file_size',
            'document_type', 'analysis_result', 'ai_provider',
            'ocr_required', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'user', 'guest_id', 'created_at', 'updated_at']


class AIDocumentDetailSerializer(AIDocumentSerializer):
    chat_messages = AIDocumentChatMessageSerializer(many=True, read_only=True)

    class Meta(AIDocumentSerializer.Meta):
        fields = AIDocumentSerializer.Meta.fields + ['extracted_text', 'chat_messages']