from django.urls import path
from . import views, auth_views

urlpatterns = [
    # Authentication endpoints
    path('api/auth/login', auth_views.login_view, name='login'),
    path('api/auth/register', auth_views.register_view, name='register'),
    
    # Notification endpoints
    path('api/notifications/appointment', views.send_appointment_notification, name='send_appointment_notification'),
    path('api/notifications/prescription', views.send_prescription_notification, name='send_prescription_notification'),
]