import json
import logging
from rest_framework import status, generics, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from django.shortcuts import get_object_or_404
from django.db import models, transaction
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
        return request.user.is_authenticated and getattr(request.user, 'role', None) == 'student'


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
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_permissions(self):
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AIConversationDetailSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        if self.request.user and self.request.user.is_authenticated:
            return AIConversation.objects.filter(user=self.request.user).order_by('-updated_at')
        guest_id = self.request.META.get('HTTP_X_GUEST_ID')
        if guest_id:
            return AIConversation.objects.filter(
                models.Q(guest_id=guest_id) | models.Q(user__isnull=True)
            ).order_by('-updated_at')
        return AIConversation.objects.filter(user__isnull=True).order_by('-updated_at')

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
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
        message_text = serializer.validated_data.get('message', '').strip()
        doc_context = serializer.validated_data.get('doc_context', '').strip()

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

        attachment_data = serializer.validated_data.get('attachment') or None

        # Save clean user message in database
        user_message = AIMessage.objects.create(
            conversation=conversation,
            role='user',
            content=message_text,
            attachment=attachment_data,
        )

        # Update title if it's currently 'New Conversation' or blank
        if not conversation.title or conversation.title == 'New Conversation':
            conversation.title = message_text[:100].strip() or 'New Conversation'
            conversation.save(update_fields=['title', 'updated_at'])

        # Build prompt for LLM including document context in memory only
        llm_prompt = message_text
        if doc_context:
            llm_prompt = f"{message_text}\n\n[ATTACHED DOCUMENT]:\n{doc_context}"

        # Call AI service
        try:
            response_data = chat_service.generate_response(
                conversation=conversation,
                user_message_content=llm_prompt,
                user=user,
            )

            # Save assistant response
            assistant_message = AIMessage.objects.create(
                conversation=conversation,
                role='assistant',
                content=response_data.get('message', ''),
                suggestions=response_data.get('suggestions', []),
            )

            # Update conversation title to first AI assistant response snippet
            ai_msg_text = response_data.get('message', '').replace('#', '').replace('*', '').replace('\n', ' ').strip()
            if ai_msg_text and (not conversation.title or conversation.title == 'New Conversation' or conversation.title == message_text[:100].strip()):
                conversation.title = ai_msg_text[:100].strip()
                conversation.save(update_fields=['title', 'updated_at'])

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

        except Exception:
            logger.exception("All configured AI chat providers failed")
            return Response(
                {
                    'error': 'AI service temporarily unavailable. Please try again.',
                    'conversation_id': str(conversation.id),
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )


from rest_framework.parsers import MultiPartParser, FormParser
from .models import AIDocument, AIDocumentChatMessage
from .serializers import (
    AIDocumentUploadSerializer, AIDocumentSerializer,
    AIDocumentDetailSerializer, AIDocumentChatMessageSerializer,
)
from .services.document_extractor import DocumentExtractor, DocumentExtractionError
from .services.document_analyzer import DocumentAnalyzer


class AIDocumentUploadView(generics.GenericAPIView):
    """
    POST /api/ai/documents/upload/
    Uploads a document (PDF/DOCX/TXT), extracts text, detects document type,
    analyzes content with Ollama -> Gemini fallback, and returns structured analysis.
    """
    serializer_class = AIDocumentUploadSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uploaded_file = serializer.validated_data['file']
        user = request.user if request.user.is_authenticated else None
        guest_id = request.META.get('HTTP_X_GUEST_ID')

        filename = uploaded_file.name
        file_size = uploaded_file.size
        file_ext = filename.split('.')[-1].lower() if '.' in filename else ''

        # Step 1: Text Extraction
        try:
            extracted_text, ocr_required = DocumentExtractor.extract_text(uploaded_file, filename, file_ext)
        except DocumentExtractionError as e:
            return Response({'error': str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            logger.exception(f"Unexpected error extracting text from {filename}: {e}")
            return Response(
                {'error': 'Could not extract readable text from document.'},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )

        if not extracted_text.strip() and not ocr_required:
            return Response(
                {'error': 'Document contains no readable text.'},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )

        # Step 2: Document Type Detection & AI Analysis
        try:
            doc_type = DocumentAnalyzer.detect_document_type(extracted_text)
            analysis_data = DocumentAnalyzer.analyze_document(extracted_text, doc_type)

            # Step 3: Save AIDocument to database
            ai_document = AIDocument.objects.create(
                user=user,
                guest_id=guest_id if not user else None,
                filename=filename,
                file_type=file_ext,
                file_size=file_size,
                extracted_text=extracted_text,
                document_type=doc_type,
                analysis_result=analysis_data.get('analysis', {}),
                ai_provider=analysis_data.get('ai_provider', 'ollama'),
                ocr_required=ocr_required,
            )

            result_serializer = AIDocumentDetailSerializer(ai_document)
            return Response(result_serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.exception(f"Document analysis error for {filename}: {e}")
            return Response(
                {'error': 'Failed to complete document analysis. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AIDocumentDetailView(generics.RetrieveDestroyAPIView):
    """
    GET /api/ai/documents/<id>/
    DELETE /api/ai/documents/<id>/
    """
    serializer_class = AIDocumentDetailSerializer
    permission_classes = [permissions.AllowAny]
    queryset = AIDocument.objects.all()
    lookup_field = 'pk'


class AIDocumentChatView(generics.GenericAPIView):
    """
    POST /api/ai/documents/<id>/chat/
    Ask follow-up questions about an analyzed document using its extracted context.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk=None, *args, **kwargs):
        document = get_object_or_404(AIDocument, id=pk)
        message_text = request.data.get('message', '').strip()

        if not message_text:
            return Response({'error': 'Message cannot be empty.'}, status=status.HTTP_400_BAD_REQUEST)

        # Save user chat message
        user_msg = AIDocumentChatMessage.objects.create(
            document=document,
            role='user',
            content=message_text,
        )

        # Generate response using document context
        res = DocumentAnalyzer.generate_document_chat_response(document, message_text)

        # Save assistant message
        assistant_msg = AIDocumentChatMessage.objects.create(
            document=document,
            role='assistant',
            content=res.get('message', ''),
        )

        return Response({
            'user_message_id': str(user_msg.id),
            'assistant_message_id': str(assistant_msg.id),
            'response': res.get('message', ''),
            'suggestions': res.get('suggestions', []),
            'ai_provider': res.get('ai_provider', 'ollama'),
        }, status=status.HTTP_200_OK)
