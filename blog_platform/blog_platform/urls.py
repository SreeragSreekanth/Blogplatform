from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('userauth.urls')),
    path('api/', include('blogpost.urls')),  # Blog post management
    path('api/', include('comments.urls')),    # Comment management
    path('api/', include('likes.urls')),  # Like and Bookmark system
    path('api/', include('notifications.urls')),

]

# Serving media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
