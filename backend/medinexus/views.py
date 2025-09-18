from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .notifications import SMSNotification

@csrf_exempt
@require_http_methods(["POST"])
def send_appointment_notification(request):
    """
    View to send appointment notifications via SMS
    """
    try:
        data = json.loads(request.body)
        
        # Extract data from request
        notification_type = data.get('notification_type')
        to_number = data.get('phone_number')
        patient_name = data.get('patient_name')
        doctor_name = data.get('doctor_name')
        date = data.get('date')
        time = data.get('time')
        
        # Validate required fields
        if not all([notification_type, to_number, patient_name, doctor_name, date, time]):
            return JsonResponse({
                'status': 'error',
                'message': 'Missing required fields'
            }, status=400)
        
        # Initialize SMS notification service
        sms_service = SMSNotification()
        
        # Send appropriate notification based on type
        if notification_type == 'confirmation':
            result = sms_service.send_appointment_confirmation(
                to_number, patient_name, doctor_name, date, time
            )
        elif notification_type == 'reminder':
            result = sms_service.send_appointment_reminder(
                to_number, patient_name, doctor_name, date, time
            )
        else:
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid notification type'
            }, status=400)
        
        # Return response
        if result['status'] == 'success':
            return JsonResponse({
                'status': 'success',
                'message': 'Notification sent successfully',
                'data': result
            })
        else:
            return JsonResponse({
                'status': 'error',
                'message': 'Failed to send notification',
                'error': result['error']
            }, status=500)
            
    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'message': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def send_prescription_notification(request):
    """
    View to send prescription notifications via SMS
    """
    try:
        data = json.loads(request.body)
        
        # Extract data from request
        to_number = data.get('phone_number')
        patient_name = data.get('patient_name')
        
        # Validate required fields
        if not all([to_number, patient_name]):
            return JsonResponse({
                'status': 'error',
                'message': 'Missing required fields'
            }, status=400)
        
        # Initialize SMS notification service
        sms_service = SMSNotification()
        
        # Send prescription notification
        result = sms_service.send_prescription_notification(to_number, patient_name)
        
        # Return response
        if result['status'] == 'success':
            return JsonResponse({
                'status': 'success',
                'message': 'Prescription notification sent successfully',
                'data': result
            })
        else:
            return JsonResponse({
                'status': 'error',
                'message': 'Failed to send prescription notification',
                'error': result['error']
            }, status=500)
            
    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'message': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)