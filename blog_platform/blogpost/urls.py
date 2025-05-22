from django.urls import path,include
from .views import (
    BlogPostCreateView, BlogPostListView, BlogPostDetailView, 
    BlogPostUpdateView, BlogPostDeleteView, CategoryListView, TagListView
)


urlpatterns = [
    path('posts/', BlogPostListView.as_view(), name='post-list'),
    path('posts/create/', BlogPostCreateView.as_view(), name='post-create'),
    path('posts/<slug:slug>/', BlogPostDetailView.as_view(), name='post-detail'),
    path('posts/<slug:slug>/update/', BlogPostUpdateView.as_view(), name='post-update'),
    path('posts/<slug:slug>/delete/', BlogPostDeleteView.as_view(), name='post-delete'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('tags/', TagListView.as_view(), name='tag-list'),

]
