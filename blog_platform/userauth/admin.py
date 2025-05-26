from django.contrib import admin
from .models import CustomUser

# Register your models here.
@admin.register(CustomUser)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['username']