from django.urls import path
from .views import (
    LikeCreateView, LikeDeleteView, BookmarkCreateView, BookmarkDeleteView, 
    LikedPostsListView, BookmarkedPostsListView
)

urlpatterns = [
    # Like and Unlike Post
    path('posts/<int:post_id>/like/', LikeCreateView.as_view(), name='like-post'),
    path('posts/<int:post_id>/unlike/', LikeDeleteView.as_view(), name='unlike-post'),

    # Bookmark and Remove Bookmark
    path('posts/<int:post_id>/bookmark/', BookmarkCreateView.as_view(), name='bookmark-post'),
    path('posts/<int:post_id>/unbookmark/', BookmarkDeleteView.as_view(), name='unbookmark-post'),

    # List liked and bookmarked posts
    path('likes/', LikedPostsListView.as_view(), name='liked-posts'),
    path('bookmarks/', BookmarkedPostsListView.as_view(), name='bookmarked-posts'),
]
