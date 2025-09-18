from rest_framework import status, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils.translation import gettext_lazy as _
from django.db.models import Q
from datetime import datetime, timedelta

from .models import Appointment, DoctorProfile, PatientProfile, DoctorAvailability

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    doctor_specialization = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'doctor', 'date_time', 'end_time', 'status', 
            'appointment_type', 'symptoms', 'notes', 'created_at', 'updated_at',
            'video_call_id', 'patient_name', 'doctor_name', 'doctor_specialization'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'video_call_id']
    
    def get_patient_name(self, obj):
        return f"{obj.patient.user.first_name} {obj.patient.user.last_name}"
    
    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.user.first_name} {obj.doctor.user.last_name}"
    
    def get_doctor_specialization(self, obj):
        return obj.doctor.get_specialization_display()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_appointments(request):
    """
    List appointments for the current user based on their role
    """
    user = request.user
    
    # Filter parameters
    status_filter = request.query_params.get('status')
    date_from = request.query_params.get('date_from')
    date_to = request.query_params.get('date_to')
    
    if hasattr(user, 'doctor_profile'):
        # Doctor's appointments
        appointments = Appointment.objects.filter(doctor=user.doctor_profile)
    elif hasattr(user, 'patient_profile'):
        # Patient's appointments
        appointments = Appointment.objects.filter(patient=user.patient_profile)
    else:
        return Response(
            {'error': _('User is neither a doctor nor a patient')},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Apply filters
    if status_filter:
        appointments = appointments.filter(status=status_filter)
    
    if date_from:
        try:
            date_from = datetime.strptime(date_from, '%Y-%m-%d')
            appointments = appointments.filter(date_time__gte=date_from)
        except ValueError:
            pass
    
    if date_to:
        try:
            date_to = datetime.strptime(date_to, '%Y-%m-%d')
            date_to = date_to + timedelta(days=1)  # Include the entire day
            appointments = appointments.filter(date_time__lt=date_to)
        except ValueError:
            pass
    
    # Order by date_time
    appointments = appointments.order_by('date_time')
    
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_appointment(request):
    """
    Create a new appointment request
    """
    user = request.user
    
    if not hasattr(user, 'patient_profile'):
        return Response(
            {'error': _('Only patients can request appointments')},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Get doctor
    doctor_id = request.data.get('doctor')
    try:
        doctor = DoctorProfile.objects.get(id=doctor_id)
    except DoctorProfile.DoesNotExist:
        return Response(
            {'error': _('Doctor not found')},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Create appointment data
    appointment_data = {
        'patient': user.patient_profile.id,
        'doctor': doctor.id,
        'date_time': request.data.get('date_time'),
        'appointment_type': request.data.get('appointment_type', 'video'),
        'symptoms': request.data.get('symptoms', ''),
        'status': 'requested'
    }
    
    # Calculate end time (default to 30 minutes)
    try:
        date_time = datetime.fromisoformat(request.data.get('date_time').replace('Z', '+00:00'))
        end_time = date_time + timedelta(minutes=30)
        appointment_data['end_time'] = end_time.isoformat()
    except (ValueError, AttributeError):
        return Response(
            {'error': _('Invalid date_time format')},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate and save
    serializer = AppointmentSerializer(data=appointment_data)
    if serializer.is_valid():
        serializer.save()
        
        # TODO: Send notification to doctor
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_appointment(request, appointment_id):
    """
    Get appointment details
    """
    user = request.user
    
    try:
        # Check if user has access to this appointment
        if hasattr(user, 'doctor_profile'):
            appointment = Appointment.objects.get(id=appointment_id, doctor=user.doctor_profile)
        elif hasattr(user, 'patient_profile'):
            appointment = Appointment.objects.get(id=appointment_id, patient=user.patient_profile)
        else:
            return Response(
                {'error': _('User is neither a doctor nor a patient')},
                status=status.HTTP_403_FORBIDDEN
            )
    except Appointment.DoesNotExist:
        return Response(
            {'error': _('Appointment not found')},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = AppointmentSerializer(appointment)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_appointment_status(request, appointment_id):
    """
    Update appointment status
    """
    user = request.user
    new_status = request.data.get('status')
    
    if not new_status:
        return Response(
            {'error': _('Status is required')},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Check if user has access to this appointment
        if hasattr(user, 'doctor_profile'):
            appointment = Appointment.objects.get(id=appointment_id, doctor=user.doctor_profile)
            # Doctors can update to any status
            valid_transitions = {
                'requested': ['scheduled', 'cancelled'],
                'scheduled': ['in_progress', 'cancelled', 'no_show'],
                'in_progress': ['completed', 'cancelled']
            }
        elif hasattr(user, 'patient_profile'):
            appointment = Appointment.objects.get(id=appointment_id, patient=user.patient_profile)
            # Patients can only cancel appointments
            valid_transitions = {
                'requested': ['cancelled'],
                'scheduled': ['cancelled']
            }
        else:
            return Response(
                {'error': _('User is neither a doctor nor a patient')},
                status=status.HTTP_403_FORBIDDEN
            )
    except Appointment.DoesNotExist:
        return Response(
            {'error': _('Appointment not found')},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Check if the status transition is valid
    current_status = appointment.status
    if current_status in valid_transitions and new_status in valid_transitions[current_status]:
        appointment.status = new_status
        appointment.save()
        
        # TODO: Send notification about status change
        
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)
    else:
        return Response(
            {'error': _('Invalid status transition')},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_doctor_availability(request, doctor_id):
    """
    Get doctor's availability
    """
    try:
        doctor = DoctorProfile.objects.get(id=doctor_id)
    except DoctorProfile.DoesNotExist:
        return Response(
            {'error': _('Doctor not found')},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Get doctor's availability
    availability = DoctorAvailability.objects.filter(doctor=doctor, is_available=True)
    
    # Format response
    availability_data = []
    for slot in availability:
        availability_data.append({
            'day_of_week': slot.day_of_week,
            'day_name': slot.get_day_of_week_display(),
            'start_time': slot.start_time.strftime('%H:%M'),
            'end_time': slot.end_time.strftime('%H:%M')
        })
    
    # Get doctor's booked appointments for the next 7 days
    today = datetime.now().date()
    next_week = today + timedelta(days=7)
    
    booked_slots = Appointment.objects.filter(
        doctor=doctor,
        date_time__date__gte=today,
        date_time__date__lt=next_week,
        status__in=['scheduled', 'in_progress']
    ).values('date_time', 'end_time')
    
    booked_data = []
    for slot in booked_slots:
        booked_data.append({
            'start_datetime': slot['date_time'].isoformat(),
            'end_datetime': slot['end_time'].isoformat() if slot['end_time'] else None
        })
    
    return Response({
        'doctor_id': doctor.id,
        'doctor_name': f"Dr. {doctor.user.first_name} {doctor.user.last_name}",
        'specialization': doctor.get_specialization_display(),
        'weekly_availability': availability_data,
        'booked_slots': booked_data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_doctors(request):
    """
    Search for doctors based on name, specialization, or languages
    """
    query = request.query_params.get('query', '')
    specialization = request.query_params.get('specialization', '')
    language = request.query_params.get('language', '')
    
    doctors = DoctorProfile.objects.all()
    
    # Apply filters
    if query:
        doctors = doctors.filter(
            Q(user__first_name__icontains=query) | 
            Q(user__last_name__icontains=query)
        )
    
    if specialization:
        doctors = doctors.filter(specialization=specialization)
    
    if language:
        doctors = doctors.filter(languages_spoken__icontains=language)
    
    # Format response
    doctors_data = []
    for doctor in doctors:
        doctors_data.append({
            'id': doctor.id,
            'name': f"Dr. {doctor.user.first_name} {doctor.user.last_name}",
            'specialization': doctor.get_specialization_display(),
            'experience_years': doctor.experience_years,
            'languages_spoken': doctor.languages_spoken,
            'consultation_fee': str(doctor.consultation_fee),
            'profile_picture': doctor.profile_picture.url if doctor.profile_picture else None
        })
    
    return Response(doctors_data)