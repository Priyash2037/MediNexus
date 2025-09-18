import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL", "https://vlszfbcbtxnksbxnbhnf.supabase.co")
supabase_key = os.getenv("SUPABASE_KEY")

if not supabase_key:
    raise ValueError("SUPABASE_KEY environment variable is not set")

supabase: Client = create_client(supabase_url, supabase_key)

# User management functions
def get_user(user_id):
    """Get user data from Supabase Auth"""
    response = supabase.auth.admin.get_user_by_id(user_id)
    return response.user if response else None

def get_user_profile(user_id, user_type="patient"):
    """Get user profile from the appropriate table"""
    table = "doctor_profiles" if user_type == "doctor" else "patient_profiles"
    response = supabase.table(table).select("*").eq("user_id", user_id).execute()
    return response.data[0] if response.data else None

def create_user_profile(user_id, profile_data, user_type="patient"):
    """Create a new user profile in the appropriate table"""
    table = "doctor_profiles" if user_type == "doctor" else "patient_profiles"
    profile_data["user_id"] = user_id
    response = supabase.table(table).insert(profile_data).execute()
    return response.data[0] if response.data else None

def update_user_profile(user_id, profile_data, user_type="patient"):
    """Update an existing user profile"""
    table = "doctor_profiles" if user_type == "doctor" else "patient_profiles"
    response = supabase.table(table).update(profile_data).eq("user_id", user_id).execute()
    return response.data[0] if response.data else None

# Appointment functions
def get_appointments(user_id, user_type="patient"):
    """Get appointments for a user"""
    field = "doctor_id" if user_type == "doctor" else "patient_id"
    response = supabase.table("appointments").select("*").eq(field, user_id).execute()
    return response.data

def create_appointment(appointment_data):
    """Create a new appointment"""
    response = supabase.table("appointments").insert(appointment_data).execute()
    return response.data[0] if response.data else None

def update_appointment(appointment_id, appointment_data):
    """Update an existing appointment"""
    response = supabase.table("appointments").update(appointment_data).eq("id", appointment_id).execute()
    return response.data[0] if response.data else None

# Chat functions
def get_chat_messages(conversation_id):
    """Get messages for a conversation"""
    response = supabase.table("chat_messages").select("*").eq("conversation_id", conversation_id).order("created_at").execute()
    return response.data

def create_chat_message(message_data):
    """Create a new chat message"""
    response = supabase.table("chat_messages").insert(message_data).execute()
    return response.data[0] if response.data else None

# Real-time subscription helpers
def get_subscription_client():
    """Get the Supabase client for real-time subscriptions"""
    return supabase

# Storage functions
def upload_file(bucket, file_path, file_content, content_type="application/octet-stream"):
    """Upload a file to Supabase Storage"""
    response = supabase.storage.from_(bucket).upload(file_path, file_content, {"content-type": content_type})
    return response

def get_file_url(bucket, file_path):
    """Get a public URL for a file in Supabase Storage"""
    return supabase.storage.from_(bucket).get_public_url(file_path)

# Notification functions
def create_notification(user_id, type, message, link=None, data=None):
    """
    Create a notification for a user
    
    Args:
        user_id: The user ID to create the notification for
        type: The notification type (appointment, chat, alert, success, info)
        message: The notification message
        link: Optional link to redirect to when clicked
        data: Optional JSON data to include with the notification
        
    Returns:
        The created notification or None if there was an error
    """
    try:
        response = supabase.table('notifications').insert({
            'user_id': user_id,
            'type': type,
            'message': message,
            'link': link,
            'data': data
        }).execute()
        
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error creating notification: {e}")
        return None

def get_user_notifications(user_id, limit=50, include_read=True):
    """
    Get notifications for a user
    
    Args:
        user_id: The user ID to get notifications for
        limit: Maximum number of notifications to return
        include_read: Whether to include read notifications
        
    Returns:
        List of notifications or empty list if there was an error
    """
    try:
        query = supabase.table('notifications').select('*').eq('user_id', user_id).order('created_at', desc=True).limit(limit)
        
        if not include_read:
            query = query.eq('is_read', False)
            
        response = query.execute()
        
        if response.data:
            return response.data
        return []
    except Exception as e:
        print(f"Error getting notifications: {e}")
        return []

def mark_notification_as_read(notification_id):
    """
    Mark a notification as read
    
    Args:
        notification_id: The notification ID to mark as read
        
    Returns:
        True if successful, False otherwise
    """
    try:
        response = supabase.table('notifications').update({'is_read': True}).eq('id', notification_id).execute()
        return bool(response.data)
    except Exception as e:
        print(f"Error marking notification as read: {e}")
        return False

def mark_all_notifications_as_read(user_id):
    """
    Mark all notifications as read for a user
    
    Args:
        user_id: The user ID to mark all notifications as read for
        
    Returns:
        True if successful, False otherwise
    """
    try:
        response = supabase.table('notifications').update({'is_read': True}).eq('user_id', user_id).eq('is_read', False).execute()
        return True
    except Exception as e:
        print(f"Error marking all notifications as read: {e}")
        return False