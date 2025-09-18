from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework import status, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .auth import generate_tokens_for_user
from .models import PatientProfile, DoctorProfile

class UserSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)

class PatientSerializer(serializers.Serializer):
    phone_number = serializers.CharField(required=False)
    address = serializers.CharField(required=False)
    date_of_birth = serializers.DateField(required=False)
    preferred_language = serializers.ChoiceField(
        choices=[('en', 'English'), ('hi', 'Hindi'), ('pa', 'Punjabi')],
        default='en',
        required=False
    )
    emergency_contact_name = serializers.CharField(required=False)
    emergency_contact_number = serializers.CharField(required=False)

class DoctorSerializer(serializers.Serializer):
    specialization = serializers.ChoiceField(
        choices=DoctorProfile.SPECIALIZATION_CHOICES,
        required=True
    )
    license_number = serializers.CharField(required=True)
    experience_years = serializers.IntegerField(required=True)
    phone_number = serializers.CharField(required=True)
    bio = serializers.CharField(required=False)
    consultation_fee = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    languages_spoken = serializers.CharField(required=False)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Authenticate a user and return JWT tokens
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': _('Please provide both username and password')},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    
    if not user:
        return Response(
            {'error': _('Invalid credentials')},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    tokens = generate_tokens_for_user(user)
    
    # Get user profile data
    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_doctor': hasattr(user, 'doctor_profile'),
        'is_patient': hasattr(user, 'patient_profile')
    }
    
    # Add profile-specific data
    if hasattr(user, 'doctor_profile'):
        doctor = user.doctor_profile
        user_data['profile'] = {
            'specialization': doctor.specialization,
            'experience_years': doctor.experience_years,
            'phone_number': doctor.phone_number,
            'bio': doctor.bio,
            'languages_spoken': doctor.languages_spoken,
            'profile_picture': doctor.profile_picture.url if doctor.profile_picture else None
        }
    elif hasattr(user, 'patient_profile'):
        patient = user.patient_profile
        user_data['profile'] = {
            'phone_number': patient.phone_number,
            'preferred_language': patient.preferred_language,
            'profile_picture': patient.profile_picture.url if patient.profile_picture else None
        }
    
    return Response({
        'tokens': tokens,
        'user': user_data
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Register a new user and return JWT tokens
    """
    from django.contrib.auth.models import User
    
    # Validate user data
    user_serializer = UserSerializer(data=request.data)
    if not user_serializer.is_valid():
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    user_type = request.data.get('user_type')  # 'doctor' or 'patient'
    if user_type not in ['doctor', 'patient']:
        return Response(
            {'error': _('Invalid user type. Must be either "doctor" or "patient"')},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if username or email already exists
    if User.objects.filter(username=user_serializer.validated_data['username']).exists():
        return Response(
            {'error': _('Username already exists')},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(email=user_serializer.validated_data['email']).exists():
        return Response(
            {'error': _('Email already exists')},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create user
    user = User.objects.create_user(
        username=user_serializer.validated_data['username'],
        email=user_serializer.validated_data['email'],
        password=user_serializer.validated_data['password'],
        first_name=user_serializer.validated_data.get('first_name', ''),
        last_name=user_serializer.validated_data.get('last_name', '')
    )
    
    # Create profile based on user type
    if user_type == 'doctor':
        doctor_serializer = DoctorSerializer(data=request.data)
        if not doctor_serializer.is_valid():
            user.delete()  # Delete user if profile data is invalid
            return Response(doctor_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        DoctorProfile.objects.create(
            user=user,
            specialization=doctor_serializer.validated_data['specialization'],
            license_number=doctor_serializer.validated_data['license_number'],
            experience_years=doctor_serializer.validated_data['experience_years'],
            phone_number=doctor_serializer.validated_data['phone_number'],
            bio=doctor_serializer.validated_data.get('bio', ''),
            consultation_fee=doctor_serializer.validated_data.get('consultation_fee', 0.00),
            languages_spoken=doctor_serializer.validated_data.get('languages_spoken', '')
        )
    elif user_type == 'patient':
        patient_serializer = PatientSerializer(data=request.data)
        if not patient_serializer.is_valid():
            user.delete()  # Delete user if profile data is invalid
            return Response(patient_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        PatientProfile.objects.create(
            user=user,
            phone_number=patient_serializer.validated_data.get('phone_number', ''),
            address=patient_serializer.validated_data.get('address', ''),
            date_of_birth=patient_serializer.validated_data.get('date_of_birth'),
            preferred_language=patient_serializer.validated_data.get('preferred_language', 'en'),
            emergency_contact_name=patient_serializer.validated_data.get('emergency_contact_name', ''),
            emergency_contact_number=patient_serializer.validated_data.get('emergency_contact_number', '')
        )
    
    tokens = generate_tokens_for_user(user)
    
    return Response({
        'tokens': tokens,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_doctor': user_type == 'doctor',
            'is_patient': user_type == 'patient'
        }
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    """
    Get the current user's profile
    """
    user = request.user
    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_doctor': hasattr(user, 'doctor_profile'),
        'is_patient': hasattr(user, 'patient_profile')
    }
    
    # Add profile-specific data
    if hasattr(user, 'doctor_profile'):
        doctor = user.doctor_profile
        user_data['profile'] = {
            'specialization': doctor.specialization,
            'license_number': doctor.license_number,
            'experience_years': doctor.experience_years,
            'phone_number': doctor.phone_number,
            'bio': doctor.bio,
            'consultation_fee': str(doctor.consultation_fee),
            'languages_spoken': doctor.languages_spoken,
            'profile_picture': doctor.profile_picture.url if doctor.profile_picture else None
        }
    elif hasattr(user, 'patient_profile'):
        patient = user.patient_profile
        user_data['profile'] = {
            'phone_number': patient.phone_number,
            'address': patient.address,
            'date_of_birth': patient.date_of_birth,
            'preferred_language': patient.preferred_language,
            'emergency_contact_name': patient.emergency_contact_name,
            'emergency_contact_number': patient.emergency_contact_number,
            'profile_picture': patient.profile_picture.url if patient.profile_picture else None
        }
    
    return Response(user_data, status=status.HTTP_201_CREATED)