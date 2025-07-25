from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('user/', views.user_profile_view, name='user_profile'),
    path('check-auth/', views.check_auth_view, name='check_auth'),
]