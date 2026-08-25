from django.urls import path
from .views import (
    AIConversationViewSet, AIChatView,
    AIDocumentUploadView, AIDocumentDetailView, AIDocumentChatView,
)

app_name = 'ai'

urlpatterns = [
    # Conversation CRUD
    path('conversations/', AIConversationViewSet.as_view({
        'get': 'list',
        'post': 'create',
    }), name='conversations'),
    path('conversations/<str:pk>/', AIConversationViewSet.as_view({
        'get': 'retrieve',
        'patch': 'update',
        'delete': 'destroy',
    }), name='conversation-detail'),

    # Chat endpoint
    path('chat/', AIChatView.as_view(), name='chat'),

    # Document Analysis Endpoints
    path('documents/upload/', AIDocumentUploadView.as_view(), name='document-upload'),
    path('documents/<str:pk>/', AIDocumentDetailView.as_view(), name='document-detail'),
    path('documents/<str:pk>/chat/', AIDocumentChatView.as_view(), name='document-chat'),
]