from django.urls import path
from .views import (
    BlogPostCreateView, BlogPostListView, BlogPostDetailView, 
    BlogPostUpdateView, BlogPostDeleteView
)

urlpatterns = [
    path('posts/', BlogPostListView.as_view(), name='post-list'),
    path('posts/create/', BlogPostCreateView.as_view(), name='post-create'),
    path('posts/<int:pk>/', BlogPostDetailView.as_view(), name='post-detail'),
    path('posts/<int:pk>/update/', BlogPostUpdateView.as_view(), name='post-update'),
    path('posts/<int:pk>/delete/', BlogPostDeleteView.as_view(), name='post-delete'),
]
