from django.contrib import admin
from .models import FileAccess, FileMetadata

@admin.register(FileMetadata)
class FileMetadataAdmin(admin.ModelAdmin):
    list_display = ['filename', 'size', 'is_local', 'last_modified']
    list_filter = ['is_local', 'last_modified']
    search_fields = ['filename']
    readonly_fields = ['last_modified']

@admin.register(FileAccess)
class FileAccessAdmin(admin.ModelAdmin):
    list_display = ['user', 'filename', 'action', 'timestamp', 'success']
    list_filter = ['action', 'success', 'timestamp']
    search_fields = ['user__username', 'filename']
    readonly_fields = ['timestamp']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')