from django.urls import path
from .views import AIConversationViewSet, AIChatView

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
]