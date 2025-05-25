from django.urls import path
from .views import NotificationListView,MarkNotificationAsReadView,MarkAllNotificationsReadView

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notifications-list'),
    path('notifications/<int:notification_id>/read/', MarkNotificationAsReadView.as_view(), name='mark-as-read'),
    path('notifications/mark-all-read/', MarkAllNotificationsReadView.as_view(), name='mark-all-read'),


]
