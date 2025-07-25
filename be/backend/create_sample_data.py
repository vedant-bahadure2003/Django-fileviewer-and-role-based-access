#!/usr/bin/env python
"""
Script to create sample users and file metadata for testing
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fileviewer_project.settings')
django.setup()

from authentication.models import User, UserProfile
from files.models import FileMetadata

def create_sample_users():
    """Create sample users for testing"""
    
    # Create Admin user
    admin_user, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@filevault.com',
            'first_name': 'John',
            'last_name': 'Admin',
            'role': 'Admin',
            'is_staff': True,
            'is_superuser': True
        }
    )
    if created:
        admin_user.set_password('password')
        admin_user.save()
        UserProfile.objects.create(user=admin_user, department='IT')
        print("✅ Admin user created")
    
    # Create Manager user
    manager_user, created = User.objects.get_or_create(
        username='manager',
        defaults={
            'email': 'manager@filevault.com',
            'first_name': 'Jane',
            'last_name': 'Manager',
            'role': 'Manager'
        }
    )
    if created:
        manager_user.set_password('password')
        manager_user.save()
        UserProfile.objects.create(user=manager_user, department='Operations')
        print("✅ Manager user created")
    
    # Create Employee user
    employee_user, created = User.objects.get_or_create(
        username='employee',
        defaults={
            'email': 'employee@filevault.com',
            'first_name': 'Bob',
            'last_name': 'Employee',
            'role': 'Employee'
        }
    )
    if created:
        employee_user.set_password('password')
        employee_user.save()
        UserProfile.objects.create(user=employee_user, department='Sales')
        print("✅ Employee user created")

def create_sample_files():
    """Create sample file metadata"""
    
    sample_files = [
        {
            'filename': 'project-specifications.txt',
            'size': 46080,  # 45 KB
            'is_local': True,
            'allowed_roles': ['Admin', 'Manager', 'Employee'],
            'google_drive_id': 'sample-drive-id-1'
        },
        {
            'filename': 'user-manual.txt',
            'size': 131072,  # 128 KB
            'is_local': False,
            'allowed_roles': ['Admin', 'Manager', 'Employee'],
            'google_drive_id': 'sample-drive-id-2'
        },
        {
            'filename': 'team-guidelines.txt',
            'size': 68608,  # 67 KB
            'is_local': True,
            'allowed_roles': ['Admin', 'Manager'],
            'google_drive_id': 'sample-drive-id-3'
        },
        {
            'filename': 'api-documentation.txt',
            'size': 239616,  # 234 KB
            'is_local': False,
            'allowed_roles': ['Admin', 'Manager'],
            'google_drive_id': 'sample-drive-id-4'
        },
        {
            'filename': 'security-policies.txt',
            'size': 91136,  # 89 KB
            'is_local': True,
            'allowed_roles': ['Admin'],
            'google_drive_id': 'sample-drive-id-5'
        },
        {
            'filename': 'deployment-guide.txt',
            'size': 159744,  # 156 KB
            'is_local': False,
            'allowed_roles': ['Admin'],
            'google_drive_id': 'sample-drive-id-6'
        }
    ]
    
    for file_data in sample_files:
        file_obj, created = FileMetadata.objects.get_or_create(
            filename=file_data['filename'],
            defaults=file_data
        )
        if created:
            print(f"✅ Created file metadata: {file_data['filename']}")

def create_sample_txt_files():
    """Create actual sample .txt files in media/files directory"""
    from django.conf import settings
    
    files_dir = settings.FILES_DIR
    
    sample_content = {
        'project-specifications.txt': """
PROJECT SPECIFICATIONS
=====================

Project Name: FileVault - Role-Based File Viewer
Version: 1.0.0
Date: January 2024

OVERVIEW
--------
FileVault is a secure file management system that provides role-based access control
for viewing and downloading text files. The system integrates with Google Drive for
remote file storage and fallback capabilities.

FEATURES
--------
1. Role-based authentication (Admin, Manager, Employee)
2. Local file storage with Google Drive integration
3. Real-time file availability checking
4. Activity logging and audit trails
5. Responsive web interface

TECHNICAL REQUIREMENTS
---------------------
- Backend: Django 4.2+ with Django REST Framework
- Frontend: Next.js 13+ with React 18
- Database: SQLite (development) / PostgreSQL (production)
- External APIs: Google Drive API v3

SECURITY CONSIDERATIONS
----------------------
- Session-based authentication
- CSRF protection enabled
- Role-based access control
- Activity logging for compliance
- Secure file handling

For more information, contact the development team.
        """,
        'team-guidelines.txt': """
TEAM GUIDELINES
===============

GENERAL PRINCIPLES
-----------------
1. Respect and professionalism in all interactions
2. Clear communication and documentation
3. Collaborative problem-solving approach
4. Continuous learning and improvement

FILE ACCESS POLICIES
--------------------
- Employees: Access to general documentation and user manuals
- Managers: Access to team resources and operational documents
- Admins: Full system access and administrative privileges

SECURITY PROTOCOLS
------------------
- Always log out when finished
- Report suspicious activity immediately
- Follow data handling procedures
- Maintain confidentiality of sensitive information

SUPPORT CONTACTS
----------------
IT Support: support@filevault.com
Manager: manager@filevault.com
Admin: admin@filevault.com

Last Updated: January 2024
        """,
        'security-policies.txt': """
SECURITY POLICIES
=================

ACCESS CONTROL
--------------
1. Multi-factor authentication required for admin accounts
2. Regular password updates (every 90 days)
3. Role-based permissions strictly enforced
4. Session timeouts after 24 hours of inactivity

DATA PROTECTION
---------------
- All file transfers encrypted in transit
- Local storage secured with appropriate permissions
- Regular security audits and vulnerability assessments
- Backup procedures for critical data

INCIDENT RESPONSE
-----------------
1. Immediate containment of security incidents
2. Notification of security team within 1 hour
3. Documentation of all security events
4. Post-incident review and improvement

COMPLIANCE
----------
- SOC 2 Type II compliance maintained
- GDPR data protection requirements followed
- Regular compliance audits conducted
- Staff security training quarterly

MONITORING
----------
- 24/7 system monitoring
- Real-time alerting for security events
- Activity logging for all file access
- Regular review of access logs

For security concerns, contact: security@filevault.com
        """
    }
    
    for filename, content in sample_content.items():
        file_path = os.path.join(files_dir, filename)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content.strip())
        print(f"✅ Created sample file: {filename}")

if __name__ == '__main__':
    print("🚀 Creating sample data for FileVault...")
    create_sample_users()
    create_sample_files()
    create_sample_txt_files()
    print("✅ Sample data creation completed!")