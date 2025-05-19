from .models import Notification

def send_notification(user, message):
    """
    Create a new notification for a given user.
    """
    Notification.objects.create(user=user, message=message)
