from django.urls import path
from .views import (
    LikeCreateView, LikeDeleteView,
    BookmarkCreateView, BookmarkDeleteView,
    BookmarkedPostsListView, UserBlogsListView
)

urlpatterns = [
    # Like and Unlike Post by slug
    path('posts/<slug:slug>/like/', LikeCreateView.as_view(), name='like-post'),
    path('posts/<slug:slug>/unlike/', LikeDeleteView.as_view(), name='unlike-post'),

    # Bookmark and Remove Bookmark by slug
    path('posts/<slug:slug>/bookmark/', BookmarkCreateView.as_view(), name='bookmark-post'),
    path('posts/<slug:slug>/unbookmark/', BookmarkDeleteView.as_view(), name='unbookmark-post'),

    # List bookmarked posts
    path('profile/bookmarked/', BookmarkedPostsListView.as_view(), name='bookmarked-posts'),

    # List user's own blogs
    path('profile/blogs/', UserBlogsListView.as_view(), name='user-blogs'),
]
