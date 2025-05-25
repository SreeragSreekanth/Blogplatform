from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from blogpost.models import BlogPost
from .models import Like, Bookmark
from blogpost.serializers import BlogPostDetailSerializer
from .serializers import LikeSerializer, BookmarkSerializer
from notifications.utils import send_notification
from django.shortcuts import get_object_or_404


# Like a Post
class LikeCreateView(generics.GenericAPIView):
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, slug):
        user = request.user
        try:
            post = BlogPost.objects.get(slug=slug)
        except BlogPost.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        like, created = Like.objects.get_or_create(user=user, post=post)
        if not created:
            return Response({"message": "Already liked"}, status=status.HTTP_200_OK)

        # Optional: send notification
        send_notification(
            user=post.author,
            message=f"Your post '{post.title}' was liked by {user.username}."
        )
        
        serializer = self.get_serializer(like)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class LikeDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, slug):
        user = request.user
        try:
            post = BlogPost.objects.get(slug=slug)
            like = Like.objects.get(user=user, post=post)
            like.delete()
            return Response({"message": "Like removed"}, status=status.HTTP_204_NO_CONTENT)
        except (BlogPost.DoesNotExist, Like.DoesNotExist):
            return Response({"error": "Like not found"}, status=status.HTTP_404_NOT_FOUND)

class BookmarkCreateView(generics.GenericAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request,  slug):
        user = request.user
        try:
            post = BlogPost.objects.get(slug=slug)
        except BlogPost.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        bookmark, created = Bookmark.objects.get_or_create(user=user, post=post)
        if not created:
            return Response({"message": "Already bookmarked"}, status=status.HTTP_200_OK)

        serializer = self.get_serializer(bookmark)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class BookmarkDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, slug):
        user = request.user
        try:
            post = BlogPost.objects.get(slug=slug)
            bookmark = Bookmark.objects.get(user=user, post=post)
            bookmark.delete()
            return Response({"message": "Bookmark removed"}, status=status.HTTP_204_NO_CONTENT)
        except (BlogPost.DoesNotExist, Bookmark.DoesNotExist):
            return Response({"error": "Bookmark not found"}, status=status.HTTP_404_NOT_FOUND)


# List Bookmarked Posts
class BookmarkedPostsListView(generics.ListAPIView):
    serializer_class = BlogPostDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Get IDs of posts bookmarked by user
        bookmarked_post_ids = Bookmark.objects.filter(user=self.request.user).values_list('post_id', flat=True)
        return BlogPost.objects.filter(id__in=bookmarked_post_ids).order_by('-created_at')


class UserBlogsListView(generics.ListAPIView):
    serializer_class = BlogPostDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BlogPost.objects.filter(author=self.request.user).order_by('-created_at')