from django.urls import path
from .views import CommentListCreateView, CommentDetailView

urlpatterns = [
    # List and create comments for a specific post
    path('posts/<int:post_id>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    # Retrieve, update, or delete a specific comment
    path('posts/<int:post_id>/comments/<int:pk>/', CommentDetailView.as_view(), name='comment-detail'),
]
