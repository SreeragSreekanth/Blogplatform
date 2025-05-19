from rest_framework import generics, permissions
from .models import Comment
from .serializers import CommentSerializer
from blogpost.models import BlogPost
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import serializers
from notifications.utils import send_notification  # Import the notification function




# List and Create Comments for a Post
class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post__id=post_id, parent=None).order_by('-created_at')

    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        try:
            post = BlogPost.objects.get(id=post_id)
            serializer.save(post=post, user=self.request.user)

            # Send notification to the post author
            send_notification(
                user=post.author,
                message=f"Your post '{post.title}' received a new comment from {self.request.user.username}."
            )
        except BlogPost.DoesNotExist:
            raise serializers.ValidationError({"post": "Post not found."})

# Update and Delete a Comment
class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)
