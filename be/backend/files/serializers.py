from rest_framework import serializers
from .models import FileAccess, FileMetadata

class FileMetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileMetadata
        fields = ['id', 'filename', 'size', 'last_modified', 'is_local', 'allowed_roles']

class FileAccessSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_role = serializers.CharField(source='user.role', read_only=True)
    
    class Meta:
        model = FileAccess
        fields = ['id', 'user_name', 'user_role', 'filename', 'action', 'timestamp', 'success']