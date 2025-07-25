from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class FileAccess(models.Model):
    ACTION_CHOICES = [
        ('view', 'View'),
        ('download', 'Download'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    filename = models.CharField(max_length=255)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    success = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.user.username} {self.action} {self.filename}"

class FileMetadata(models.Model):
    filename = models.CharField(max_length=255, unique=True)
    size = models.BigIntegerField(default=0)
    last_modified = models.DateTimeField(auto_now=True)
    is_local = models.BooleanField(default=False)
    google_drive_id = models.CharField(max_length=255, blank=True, null=True)
    allowed_roles = models.JSONField(default=list)  # ['Admin', 'Manager', 'Employee']
    
    def __str__(self):
        return self.filename