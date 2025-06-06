from rest_framework import serializers
from .models import BlogPost, Tag, Category
from likes.models import Like, Bookmark

# Tag & Category
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

# ✅ 1. Detail Serializer (for GET)

# BlogPost Detail Serializer
class BlogPostDetailSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    tags = TagSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    is_liked = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'content', 'author',
            'tags', 'category', 'image',
            'created_at', 'updated_at', 'slug',
            'is_liked', 'is_bookmarked', 'likes_count'
        ]

    def get_is_liked(self, obj):
        user = self.context.get('request').user
        if user and user.is_authenticated:
            return Like.objects.filter(user=user, post=obj).exists()
        return False

    def get_is_bookmarked(self, obj):
        user = self.context.get('request').user
        if user and user.is_authenticated:
            return Bookmark.objects.filter(user=user, post=obj).exists()
        return False

    def get_likes_count(self, obj):
        return obj.likes_count
    

# ✅ 2. Create/Update Serializer (for POST/PUT)
class BlogPostCreateUpdateSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    tags = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Tag.objects.all(),
        required=False,
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        allow_null=True,
        required=False,
    )

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'content', 'author',
            'tags', 'category', 'image',
            'created_at', 'updated_at', 'slug'
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at', 'slug']

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        category = validated_data.pop('category', None)
        post = BlogPost.objects.create(**validated_data, category=category)
        post.tags.set(tags_data)
        return post

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', None)
        category = validated_data.pop('category', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if category is not None:
            instance.category = category

        if tags_data is not None:
            instance.tags.set(tags_data)

        instance.save()
        return instance
