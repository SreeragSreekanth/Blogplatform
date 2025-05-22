from rest_framework import generics, permissions,filters
from .models import BlogPost,Category, Tag
from .serializers import BlogPostCreateUpdateSerializer, BlogPostDetailSerializer,CategorySerializer,TagSerializer
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.core.exceptions import PermissionDenied


# Create a BlogPost
class BlogPostCreateView(generics.CreateAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class BlogPostPagination(PageNumberPagination):
    page_size = 5  # You can adjust the number of posts per page
    page_size_query_param = 'page_size'
    max_page_size = 20

# List all BlogPosts
class BlogPostListView(generics.ListAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostDetailSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = BlogPostPagination

    # Enable filtering and searching
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tags', 'category']  # Fields to filter
    search_fields = ['title', 'content']  # Fields to search
    ordering_fields = ['created_at', 'title']  # Fields to order by
    ordering = ['-created_at']  # Default ordering


# Retrieve a single BlogPost
class BlogPostDetailView(generics.RetrieveAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostDetailSerializer
    permission_classes = [permissions.AllowAny]

# Update a BlogPost (Only by the author)
class BlogPostUpdateView(generics.UpdateAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        if serializer.instance.author != self.request.user:
            raise PermissionDenied("You can only edit your own blog posts")
        serializer.save()

# Delete a BlogPost (Only by the author)
class BlogPostDeleteView(generics.DestroyAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all().order_by('name')
    serializer_class =  TagSerializer
    permission_classes = [permissions.AllowAny]


