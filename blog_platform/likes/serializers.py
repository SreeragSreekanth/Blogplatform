from rest_framework import serializers
from .models import Like, Bookmark
from blogpost.models import BlogPost

# Like Serializer
class LikeSerializer(serializers.ModelSerializer):
    post_title = serializers.CharField(source='post.title', read_only=True)
    author_name = serializers.CharField(source='post.author.username', read_only=True)

    class Meta:
        model = Like
        fields = ['id', 'post', 'post_title', 'author_name', 'created_at']
        read_only_fields = ['post_title', 'author_name', 'created_at']

# Bookmark Serializer
class BookmarkSerializer(serializers.ModelSerializer):
    post_title = serializers.CharField(source='post.title', read_only=True)
    author_name = serializers.CharField(source='post.author.username', read_only=True)

    class Meta:
        model = Bookmark
        fields = ['id', 'post', 'post_title', 'author_name', 'created_at']
        read_only_fields = ['post_title', 'author_name', 'created_at']

class BlogPostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'content', 'author_name', 'created_at', 'updated_at']
