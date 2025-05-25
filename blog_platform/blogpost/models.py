from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify

CustomUser = get_user_model()

# Category Model
class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

# Tag Model
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

# BlogPost Model
class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='posts')
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    tags = models.ManyToManyField(Tag, blank=True, related_name='posts')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True,editable=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            # Generate base slug
            base_slug = slugify(self.title)
            self.slug = base_slug
            
            # Handle duplicates (e.g., "my-post" and "my-post-1")
            counter = 1
            while BlogPost.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{base_slug}-{counter}"
                counter += 1
        
        # Ensure slug doesn't exceed max_length
        self.slug = self.slug[:200]
        super().save(*args, **kwargs)

    @property
    def likes_count(self):
        return self.likes.count()