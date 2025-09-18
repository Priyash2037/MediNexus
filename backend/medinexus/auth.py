from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import authentication, exceptions
from rest_framework_simplejwt.tokens import RefreshToken
import jwt

User = get_user_model()

def generate_tokens_for_user(user):
    """
    Generate JWT tokens for a user
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class JWTAuthentication(authentication.BaseAuthentication):
    """
    Custom JWT authentication for the API
    """
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None

        try:
            # Get the token
            token = auth_header.split(' ')[1]
            payload = jwt.decode(
                token, 
                settings.SECRET_KEY, 
                algorithms=['HS256']
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token expired. Please log in again.')
        except (jwt.DecodeError, IndexError):
            raise exceptions.AuthenticationFailed('Invalid token. Please log in again.')

        try:
            user = User.objects.get(id=payload['user_id'])
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed('User not found')

        if not user.is_active:
            raise exceptions.AuthenticationFailed('User inactive or deleted')

        return (user, token)