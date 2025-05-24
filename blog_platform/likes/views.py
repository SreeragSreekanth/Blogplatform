from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Like, Bookmark
from blogpost.models import BlogPost
from blogpost.serializers import BlogPostDetailSerializer # Import your blog post serializer
from .serializers import LikeSerializer, BookmarkSerializer
from notifications.utils import send_notification


# Like a Post
class LikeCreateView(generics.CreateAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        user = request.user
        try:
            post = BlogPost.objects.get(id=post_id)
        except BlogPost.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        like, created = Like.objects.get_or_create(user=user, post=post)
        if not created:
            return Response({"message": "Already liked"}, status=status.HTTP_200_OK)
        
        send_notification(
            user_id=post.author,
            message=f"Your post '{post.title}' was liked by {request.user.username}."
        )
        
        return Response({"message": "Post liked"}, status=status.HTTP_201_CREATED)


# Unlike a Post
class LikeDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, post_id):
        user = request.user
        try:
            post = BlogPost.objects.get(id=post_id)
            like = Like.objects.get(user=user, post=post)
            like.delete()
            return Response({"message": "Like removed"}, status=status.HTTP_204_NO_CONTENT)
        except (BlogPost.DoesNotExist, Like.DoesNotExist):
            return Response({"error": "Like not found"}, status=status.HTTP_404_NOT_FOUND)


# Bookmark a Post
class BookmarkCreateView(generics.CreateAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        user = request.user
        try:
            post = BlogPost.objects.get(id=post_id)
        except BlogPost.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        bookmark, created = Bookmark.objects.get_or_create(user=user, post=post)
        if not created:
            return Response({"message": "Already bookmarked"}, status=status.HTTP_200_OK)

        return Response({"message": "Post bookmarked"}, status=status.HTTP_201_CREATED)


# Remove Bookmark
class BookmarkDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, post_id):
        user = request.user
        try:
            post = BlogPost.objects.get(id=post_id)
            bookmark = Bookmark.objects.get(user=user, post=post)
            bookmark.delete()
            return Response({"message": "Bookmark removed"}, status=status.HTTP_204_NO_CONTENT)
        except (BlogPost.DoesNotExist, Bookmark.DoesNotExist):
            return Response({"error": "Bookmark not found"}, status=status.HTTP_404_NOT_FOUND)


# List Bookmarked Posts (returns full blog posts bookmarked by the user)
class BookmarkedPostsListView(generics.ListAPIView):
    serializer_class = BlogPostDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        bookmarked_post_ids = Bookmark.objects.filter(user=self.request.user).values_list('post_id', flat=True)
        return BlogPost.objects.filter(id__in=bookmarked_post_ids).order_by('-created_at')


# List blogs authored by logged-in user
class UserBlogsListView(generics.ListAPIView):
    serializer_class = BlogPostDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BlogPost.objects.filter(author=self.request.user).order_by('-created_at')
