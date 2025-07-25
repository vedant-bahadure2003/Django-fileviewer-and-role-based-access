import os
import io
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.auth.transport.requests import Request
from google.oauth2 import service_account
from django.conf import settings

def get_google_drive_service():
    """
    Get Google Drive API service instance
    """
    try:
        # For public files, we can use API key
        service = build('drive', 'v3', developerKey=settings.GOOGLE_DRIVE_API_KEY)
        return service
    except Exception as e:
        print(f"Error creating Google Drive service: {e}")
        return None

def download_file_from_drive(file_id, local_path):
    """
    Download file from Google Drive to local storage
    """
    try:
        service = get_google_drive_service()
        if not service:
            return False
        
        # Get file metadata
        file_metadata = service.files().get(fileId=file_id).execute()
        
        # Download file content
        request = service.files().get_media(fileId=file_id)
        file_content = io.BytesIO()
        
        # Download in chunks
        downloader = MediaIoBaseDownload(file_content, request)
        done = False
        while done is False:
            status, done = downloader.next_chunk()
        
        # Save to local file
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        with open(local_path, 'wb') as f:
            f.write(file_content.getvalue())
        
        return True
        
    except HttpError as error:
        print(f"An error occurred: {error}")
        return False
    except Exception as e:
        print(f"Error downloading file: {e}")
        return False

def list_drive_files(folder_id):
    """
    List files in Google Drive folder
    """
    try:
        service = get_google_drive_service()
        if not service:
            return []
        
        # Query for .txt files in the specified folder
        query = f"'{folder_id}' in parents and mimeType='text/plain' and trashed=false"
        
        results = service.files().list(
            q=query,
            fields="files(id, name, size, modifiedTime)"
        ).execute()
        
        return results.get('files', [])
        
    except HttpError as error:
        print(f"An error occurred: {error}")
        return []
    except Exception as e:
        print(f"Error listing drive files: {e}")
        return []