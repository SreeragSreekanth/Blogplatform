from rest_framework import serializers
from .models import BlogPost, Tag, Category

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class BlogPostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')  # Display author's username
    tags = TagSerializer(many=True, read_only=True)               # Nested tags
    category = CategorySerializer(read_only=True)                 # Nested category

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'content', 'author', 'tags', 'category', 'image', 'created_at', 'updated_at', 'slug']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at', 'slug']
