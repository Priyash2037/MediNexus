from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    preferred_language = models.CharField(
        max_length=10, 
        choices=[('en', 'English'), ('hi', 'Hindi'), ('pa', 'Punjabi')],
        default='en'
    )
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_number = models.CharField(max_length=15, blank=True)
    profile_picture = models.ImageField(upload_to='patient_profiles/', null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.username}'s Patient Profile"

class DoctorProfile(models.Model):
    SPECIALIZATION_CHOICES = [
        ('general', 'General Physician'),
        ('cardiology', 'Cardiology'),
        ('dermatology', 'Dermatology'),
        ('neurology', 'Neurology'),
        ('pediatrics', 'Pediatrics'),
        ('psychiatry', 'Psychiatry'),
        ('orthopedics', 'Orthopedics'),
        ('gynecology', 'Gynecology'),
        ('ophthalmology', 'Ophthalmology'),
        ('ent', 'ENT Specialist'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    specialization = models.CharField(max_length=50, choices=SPECIALIZATION_CHOICES, default='general')
    license_number = models.CharField(max_length=50, blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    phone_number = models.CharField(max_length=15, blank=True)
    bio = models.TextField(blank=True)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    languages_spoken = models.CharField(max_length=200, blank=True, help_text="Comma separated languages")
    profile_picture = models.ImageField(upload_to='doctor_profiles/', null=True, blank=True)
    
    def __str__(self):
        return f"Dr. {self.user.username} ({self.get_specialization_display()})"

class DoctorAvailability(models.Model):
    DAY_CHOICES = [
        (0, _('Monday')),
        (1, _('Tuesday')),
        (2, _('Wednesday')),
        (3, _('Thursday')),
        (4, _('Friday')),
        (5, _('Saturday')),
        (6, _('Sunday')),
    ]
    
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='availability')
    day_of_week = models.IntegerField(choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ('doctor', 'day_of_week', 'start_time', 'end_time')
        verbose_name_plural = 'Doctor Availabilities'
    
    def __str__(self):
        return f"{self.doctor} - {self.get_day_of_week_display()} ({self.start_time} - {self.end_time})"

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('requested', 'Requested'),
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    ]
    
    APPOINTMENT_TYPE_CHOICES = [
        ('video', 'Video Call'),
        ('chat', 'Chat Consultation'),
        ('in_person', 'In-Person Visit'),
    ]
    
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='appointments')
    date_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='requested')
    appointment_type = models.CharField(max_length=20, choices=APPOINTMENT_TYPE_CHOICES, default='video')
    symptoms = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    video_call_id = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return f"Appointment: {self.patient.user.username} with Dr. {self.doctor.user.username} on {self.date_time}"

class MedicalRecord(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='medical_records')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='medical_records/')
    record_date = models.DateField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    record_type = models.CharField(max_length=50, blank=True)
    
    def __str__(self):
        return f"{self.title} - {self.patient.user.username}"

class Prescription(models.Model):
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='prescription')
    medications = models.TextField()
    instructions = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    follow_up_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"Prescription for {self.appointment}"

class ChatbotConversation(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='chatbot_conversations')
    conversation_id = models.CharField(max_length=100, unique=True)
    started_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Conversation with {self.patient.user.username} ({self.conversation_id})"

class ChatbotMessage(models.Model):
    MESSAGE_TYPE_CHOICES = [
        ('user', 'User Message'),
        ('bot', 'Bot Message'),
        ('system', 'System Message'),
    ]
    
    conversation = models.ForeignKey(ChatbotConversation, on_delete=models.CASCADE, related_name='messages')
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPE_CHOICES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.get_message_type_display()} in {self.conversation.conversation_id}"

class Notification(models.Model):
    NOTIFICATION_TYPE_CHOICES = [
        ('appointment', 'Appointment Reminder'),
        ('prescription', 'New Prescription'),
        ('message', 'New Message'),
        ('system', 'System Notification'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    related_object_id = models.IntegerField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.notification_type} for {self.user.username}: {self.title}"