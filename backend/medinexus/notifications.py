import os
from twilio.rest import Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Twilio credentials
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')

class SMSNotification:
    """
    Class to handle SMS notifications using Twilio
    """
    def __init__(self):
        self.client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        self.from_number = TWILIO_PHONE_NUMBER

    def send_appointment_confirmation(self, to_number, patient_name, doctor_name, date, time):
        """
        Send appointment confirmation SMS
        
        Args:
            to_number (str): Patient's phone number
            patient_name (str): Patient's name
            doctor_name (str): Doctor's name
            date (str): Appointment date
            time (str): Appointment time
        
        Returns:
            dict: Response from Twilio API
        """
        message_body = (
            f"Hello {patient_name}, your appointment with Dr. {doctor_name} "
            f"has been confirmed for {date} at {time}. "
            f"Please login to MediNexus 10 minutes before your appointment time."
        )
        
        return self._send_sms(to_number, message_body)
    
    def send_appointment_reminder(self, to_number, patient_name, doctor_name, date, time):
        """
        Send appointment reminder SMS
        
        Args:
            to_number (str): Patient's phone number
            patient_name (str): Patient's name
            doctor_name (str): Doctor's name
            date (str): Appointment date
            time (str): Appointment time
        
        Returns:
            dict: Response from Twilio API
        """
        message_body = (
            f"Reminder: Hello {patient_name}, you have an appointment with Dr. {doctor_name} "
            f"tomorrow at {time}. "
            f"Please login to MediNexus 10 minutes before your appointment time."
        )
        
        return self._send_sms(to_number, message_body)
    
    def send_prescription_notification(self, to_number, patient_name):
        """
        Send prescription notification SMS
        
        Args:
            to_number (str): Patient's phone number
            patient_name (str): Patient's name
        
        Returns:
            dict: Response from Twilio API
        """
        message_body = (
            f"Hello {patient_name}, your prescription has been updated. "
            f"Please login to MediNexus to view and download your prescription."
        )
        
        return self._send_sms(to_number, message_body)
    
    def _send_sms(self, to_number, message_body):
        """
        Private method to send SMS
        
        Args:
            to_number (str): Recipient's phone number
            message_body (str): SMS content
        
        Returns:
            dict: Response from Twilio API
        """
        try:
            message = self.client.messages.create(
                body=message_body,
                from_=self.from_number,
                to=to_number
            )
            return {
                'status': 'success',
                'message_sid': message.sid,
                'to': to_number
            }
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e),
                'to': to_number
            }