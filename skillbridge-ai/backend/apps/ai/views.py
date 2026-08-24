import json
import logging
from rest_framework import status, generics, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone

from .models import AIConversation, AIMessage
from .serializers import (
    AIConversationSerializer, AIConversationDetailSerializer, AIMessageSerializer,
    ChatRequestSerializer, ChatResponseSerializer,
)
from .services import chat_service

logger = logging.getLogger(__name__)


class IsStudent(permissions.BasePermission):
    """
    Allows access only to authenticated users with 'student' role.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'student'
        )


class AIConversationViewSet(viewsets.ModelViewSet):
    """
    CRUD for user's AI conversations.
    GET /api/ai/conversations/
    POST /api/ai/conversations/
    GET /api/ai/conversations/{id}/
    PATCH /api/ai/conversations/{id}/
    DELETE /api/ai/conversations/{id}/
    """
    serializer_class = AIConversationSerializer

    def get_permissions(self):
        if self.action in ['retrieve', 'list', 'create', 'send_message', 'destroy']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AIConversationDetailSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return AIConversation.objects.filter(user=self.request.user).order_by('-updated_at')
        guest_id = self.request.META.get('HTTP_X_GUEST_ID')
        if guest_id:
            return AIConversation.objects.filter(guest_id=guest_id).order_by('-updated_at')
        return AIConversation.objects.filter(user__isnull=True, guest_id__isnull=True).order_by('-updated_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user and instance.user != request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You do not have access to this conversation.")
        guest_id = request.META.get('HTTP_X_GUEST_ID')
        if not instance.user and instance.guest_id and instance.guest_id != guest_id:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You do not have access to this conversation.")
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        if 'guest_id' in validated_data:
            validated_data.pop('guest_id')
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AIChatView(generics.GenericAPIView):
    """
    POST /api/ai/chat/
    Handles sending a message in a conversation.
    """
    serializer_class = ChatRequestSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [UserRateThrottle]
    throttle_scope = 'ai_chat'

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        conversation_id = serializer.validated_data.get('conversation_id')
        message_text = serializer.validated_data['message']

        user = request.user if request.user.is_authenticated else None
        guest_id = request.META.get('HTTP_X_GUEST_ID')

        # If conversation_id provided, verify ownership; otherwise create new
        conversation = None
        if conversation_id:
            conversation = get_object_or_404(AIConversation, id=conversation_id)
            if conversation.user and conversation.user != user:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("You do not have access to this conversation.")
            if not conversation.user and conversation.guest_id and conversation.guest_id != guest_id:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("You do not have access to this conversation.")
            if not conversation.user and not conversation.guest_id and guest_id:
                conversation.guest_id = guest_id
                conversation.save(update_fields=['guest_id'])
        else:
            conversation = AIConversation.objects.create(
                user=user,
                guest_id=guest_id if not user else None,
                title='New Conversation'
            )

        # Save user message
        user_message = AIMessage.objects.create(
            conversation=conversation,
            role='user',
            content=message_text,
        )

        # Build conversation history and call AI service
        try:
            response_data = chat_service.generate_response(
                conversation=conversation,
                user_message_content=message_text,
                user=user,
            )

            # Save assistant response
            assistant_message = AIMessage.objects.create(
                conversation=conversation,
                role='assistant',
                content=response_data.get('message', ''),
                suggestions=response_data.get('suggestions', []),
            )

            # Build response
            response_serializer = ChatResponseSerializer({
                'conversation_id': str(conversation.id),
                'user_message_id': str(user_message.id),
                'assistant_message_id': str(assistant_message.id),
                'response': response_data.get('message', ''),
                'suggestions': response_data.get('suggestions', []),
                'actions': response_data.get('actions', []),
                'timestamp': timezone.now(),
            })

            return Response(response_serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception("AI service error")
            return Response(
                {
                    'error': 'AI service temporarily unavailable. Please try again.',
                    'conversation_id': str(conversation.id),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )