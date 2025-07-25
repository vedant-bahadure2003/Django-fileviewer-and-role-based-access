from django.urls import path
from . import views

urlpatterns = [
    path('files/', views.list_files, name='list_files'),
    path('files/check/<str:filename>/', views.check_file_exists, name='check_file_exists'),
    path('files/download/<str:filename>/', views.download_file, name='download_file'),
    path('files/open/<str:filename>/', views.open_file_notepad, name='open_file_notepad'),
    path('activity-logs/', views.activity_logs, name='activity_logs'),
]