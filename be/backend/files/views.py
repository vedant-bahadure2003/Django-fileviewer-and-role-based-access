import os
import subprocess
import json
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.conf import settings
from django.http import HttpResponse, Http404
from django.contrib.auth import authenticate, get_user_model
from django.views.decorators.csrf import csrf_exempt
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from .models import FileAccess, FileMetadata
from .serializers import FileMetadataSerializer, FileAccessSerializer
from .utils import get_google_drive_service, download_file_from_drive

# ✅ Get the custom user model
User = get_user_model()

# ============================================
# Authentication Views
# ============================================

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def login_view(request):
    """
    Login endpoint that returns authentication token
    """
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        print(f"Login attempt for username: {username}")  # Debug log
        
        if not username or not password:
            return Response({
                'error': 'Username and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        
        if user and user.is_active:
            # Create or get token
            token, created = Token.objects.get_or_create(user=user)
            
            print(f"Login successful for user: {user.username}, role: {getattr(user, 'role', 'N/A')}")  # Debug log
            
            return Response({
                'token': token.key,
                'user_id': user.id,
                'username': user.username,
                'role': getattr(user, 'role', None),
                'message': 'Login successful'
            }, status=status.HTTP_200_OK)
        else:
            print(f"Authentication failed for username: {username}")  # Debug log
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except json.JSONDecodeError:
        return Response({
            'error': 'Invalid JSON'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(f"Login error: {str(e)}")  # Debug log
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Logout endpoint that deletes the authentication token
    """
    try:
        print(f"Logout request from user: {request.user.username}")  # Debug log
        
        # Delete the token to logout
        request.user.auth_token.delete()
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Logout error: {str(e)}")  # Debug log
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_auth_view(request):
    """
    Check if user is authenticated and return user info
    """
    print(f"Auth check for user: {request.user.username}, role: {getattr(request.user, 'role', 'N/A')}")  # Debug log
    
    return Response({
        'authenticated': True,
        'user_id': request.user.id,
        'username': request.user.username,
        'role': getattr(request.user, 'role', None)
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_view(request):
    """
    Get current user information
    """
    print(f"User info request from: {request.user.username}")  # Debug log
    
    return Response({
        'user_id': request.user.id,
        'username': request.user.username,
        'role': getattr(request.user, 'role', None),
        'email': getattr(request.user, 'email', ''),
        'first_name': getattr(request.user, 'first_name', ''),
        'last_name': getattr(request.user, 'last_name', ''),
    }, status=status.HTTP_200_OK)

# ============================================
# File Management Views (Your existing views with debug logs)
# ============================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_files(request):
    """
    Get list of available .txt files based on user role
    """
    user = request.user
    print(f"Files list request from user: {user.username}, role: {getattr(user, 'role', 'N/A')}")  # Debug log
    
    try:
        # Get files based on user role
        if hasattr(user, 'role') and user.role == 'Admin':
            files = FileMetadata.objects.all()
        elif hasattr(user, 'role'):
            files = FileMetadata.objects.filter(allowed_roles__contains=[user.role])
        else:
            # If no role attribute, return empty or all files based on your logic
            files = FileMetadata.objects.all()  # or FileMetadata.objects.none()
        
        serializer = FileMetadataSerializer(files, many=True)
        
        print(f"Returning {len(serializer.data)} files for user {user.username}")  # Debug log
        
        return Response({
            'success': True,
            'files': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error in list_files: {str(e)}")  # Debug log
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_file_exists(request, filename):
    """
    Check if file exists locally
    """
    user = request.user
    print(f"File check request for: {filename} from user: {user.username}")  # Debug log
    
    try:
        file_metadata = FileMetadata.objects.get(filename=filename)
        
        # Check if user has permission to access this file
        if (hasattr(user, 'role') and user.role != 'Admin' and 
            hasattr(file_metadata, 'allowed_roles') and 
            user.role not in file_metadata.allowed_roles):
            return Response({
                'success': False,
                'message': 'Access denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Check if file exists locally
        file_path = os.path.join(settings.FILES_DIR, filename)
        exists_locally = os.path.exists(file_path)
        
        print(f"File {filename} exists locally: {exists_locally}")  # Debug log
        
        # Log the access attempt
        try:
            FileAccess.objects.create(
                user=user,
                filename=filename,
                action='view',
                ip_address=request.META.get('REMOTE_ADDR'),
                success=exists_locally
            )
        except Exception as log_error:
            print(f"Failed to log access: {log_error}")  # Debug log
        
        if exists_locally:
            return Response({
                'success': True,
                'exists': True,
                'message': 'File is available locally',
                'file_path': file_path
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': True,
                'exists': False,
                'message': 'Not available locally',
                'download_available': bool(getattr(file_metadata, 'google_drive_id', None))
            }, status=status.HTTP_200_OK)
            
    except FileMetadata.DoesNotExist:
        print(f"File metadata not found for: {filename}")  # Debug log
        return Response({
            'success': False,
            'message': 'File not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error in check_file_exists: {str(e)}")  # Debug log
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_file(request, filename):
    """
    Download file from Google Drive if not available locally
    """
    user = request.user
    print(f"File download request for: {filename} from user: {user.username}")  # Debug log
    
    try:
        file_metadata = FileMetadata.objects.get(filename=filename)
        
        # Check permissions
        if (hasattr(user, 'role') and user.role != 'Admin' and 
            hasattr(file_metadata, 'allowed_roles') and 
            user.role not in file_metadata.allowed_roles):
            return Response({
                'success': False,
                'message': 'Access denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Check if file already exists locally
        local_path = os.path.join(settings.FILES_DIR, filename)
        if os.path.exists(local_path):
            return Response({
                'success': True,
                'message': 'File already available locally',
                'local_path': local_path
            }, status=status.HTTP_200_OK)
        
        # Download from Google Drive
        if hasattr(file_metadata, 'google_drive_id') and file_metadata.google_drive_id:
            try:
                success = download_file_from_drive(
                    file_metadata.google_drive_id, 
                    local_path
                )
                
                # Log the download attempt
                try:
                    FileAccess.objects.create(
                        user=user,
                        filename=filename,
                        action='download',
                        ip_address=request.META.get('REMOTE_ADDR'),
                        success=success
                    )
                except Exception as log_error:
                    print(f"Failed to log download: {log_error}")  # Debug log
                
                if success:
                    if hasattr(file_metadata, 'is_local'):
                        file_metadata.is_local = True
                        file_metadata.save()
                    
                    return Response({
                        'success': True,
                        'message': 'File downloaded successfully from Google Drive',
                        'local_path': local_path
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        'success': False,
                        'message': 'Failed to download file from Google Drive'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    
            except Exception as e:
                print(f"Error downloading from Drive: {str(e)}")  # Debug log
                return Response({
                    'success': False,
                    'message': f'Error downloading file: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({
                'success': False,
                'message': 'File not available on Google Drive'
            }, status=status.HTTP_404_NOT_FOUND)
            
    except FileMetadata.DoesNotExist:
        print(f"File metadata not found for download: {filename}")  # Debug log
        return Response({
            'success': False,
            'message': 'File not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error in download_file: {str(e)}")  # Debug log
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def open_file_notepad(request, filename):
    """
    Open file in Notepad (Windows) or default text editor
    """
    user = request.user
    print(f"File open request for: {filename} from user: {user.username}")  # Debug log
    
    try:
        file_metadata = FileMetadata.objects.get(filename=filename)
        
        # Check permissions
        if (hasattr(user, 'role') and user.role != 'Admin' and 
            hasattr(file_metadata, 'allowed_roles') and 
            user.role not in file_metadata.allowed_roles):
            return Response({
                'success': False,
                'message': 'Access denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        file_path = os.path.join(settings.FILES_DIR, filename)
        
        if os.path.exists(file_path):
            try:
                # Try to open with notepad on Windows
                if os.name == 'nt':  # Windows
                    subprocess.Popen(['notepad.exe', file_path])
                else:  # Unix/Linux/Mac
                    subprocess.Popen(['xdg-open', file_path])
                
                # Log the access
                try:
                    FileAccess.objects.create(
                        user=user,
                        filename=filename,
                        action='view',
                        ip_address=request.META.get('REMOTE_ADDR'),
                        success=True
                    )
                except Exception as log_error:
                    print(f"Failed to log file open: {log_error}")  # Debug log
                
                return Response({
                    'success': True,
                    'message': 'File opened successfully'
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                print(f"Error opening file: {str(e)}")  # Debug log
                return Response({
                    'success': False,
                    'message': f'Failed to open file: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({
                'success': False,
                'message': 'File not found locally'
            }, status=status.HTTP_404_NOT_FOUND)
            
    except FileMetadata.DoesNotExist:
        print(f"File metadata not found for open: {filename}")  # Debug log
        return Response({
            'success': False,
            'message': 'File not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error in open_file_notepad: {str(e)}")  # Debug log
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def activity_logs(request):
    """
    Get activity logs (Admin and Manager only)
    """
    user = request.user
    print(f"Activity logs request from user: {user.username}, role: {getattr(user, 'role', 'N/A')}")  # Debug log
    
    try:
        if not hasattr(user, 'role') or user.role not in ['Admin', 'Manager']:
            return Response({
                'success': False,
                'message': 'Access denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Admin can see all logs, Manager can see their team's logs
        if user.role == 'Admin':
            logs = FileAccess.objects.all().order_by('-id')[:50]  # Last 50 activities
        else:  # Manager
            logs = FileAccess.objects.filter(
                user__role__in=['Manager', 'Employee']
            ).order_by('-id')[:50]
        
        serializer = FileAccessSerializer(logs, many=True)
        
        print(f"Returning {len(serializer.data)} activity logs")  # Debug log
        
        return Response({
            'success': True,
            'activities': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error in activity_logs: {str(e)}")  # Debug log
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)