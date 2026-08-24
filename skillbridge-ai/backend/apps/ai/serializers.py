import uuid
from rest_framework import serializers
from .models import AIConversation, AIMessage


class AIMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIMessage
        fields = ['id', 'role', 'content', 'suggestions', 'created_at']
        read_only_fields = ['id', 'conversation', 'created_at']


class AIConversationSerializer(serializers.ModelSerializer):
    message_count = serializers.SerializerMethodField()
    last_message_preview = serializers.SerializerMethodField()

    class Meta:
        model = AIConversation
        fields = [
            'id', 'title', 'created_at', 'updated_at',
            'message_count', 'last_message_preview', 'guest_id',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'guest_id']

    def get_message_count(self, obj):
        return obj.messages_count

    def get_last_message_preview(self, obj):
        msg = obj.messages.order_by('-created_at').first()
        if msg:
            return msg.content[:80].strip() + ('...' if len(msg.content) > 80 else '')
        return None


class AIConversationDetailSerializer(AIConversationSerializer):
    messages = AIMessageSerializer(many=True, read_only=True)

    class Meta(AIConversationSerializer.Meta):
        fields = AIConversationSerializer.Meta.fields + ['messages']


class ChatRequestSerializer(serializers.Serializer):
    conversation_id = serializers.UUIDField(required=False, allow_null=True)
    message = serializers.CharField(max_length=4000, min_length=1)

    def validate_message(self, value):
        # Strip but reject empty after strip
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Message cannot be empty")
        return value


class ChatResponseSerializer(serializers.Serializer):
    conversation_id = serializers.UUIDField()
    user_message_id = serializers.UUIDField()
    assistant_message_id = serializers.UUIDField()
    response = serializers.CharField()
    suggestions = serializers.ListField(child=serializers.CharField(), default=[])
    actions = serializers.ListField(child=serializers.CharField(), default=[])
    timestamp = serializers.DateTimeField(read_only=True)