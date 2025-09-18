

# MediNexus - Telemedicine Application

MediNexus is a comprehensive telemedicine platform designed to connect patients with healthcare providers through secure video consultations. The application supports multilingual interfaces (English, Hindi, and Punjabi) to serve diverse populations, especially in rural areas.

## Features

- **User Authentication**: Separate login/registration for patients and doctors
- **Video Consultations**: WebRTC-based secure video calling
- **AI Chatbot**: Initial symptom screening with escalation to human doctors
- **Multilingual Support**: English, Hindi, and Punjabi interfaces
- **SMS Notifications**: Appointment reminders and prescription alerts via Twilio
- **Patient Dashboard**: Manage appointments, medical records, and prescriptions
- **Doctor Dashboard**: Manage patient appointments, availability, and e-prescriptions

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Shadcn UI components
- React Router for navigation
- Tanstack Query for data fetching

### Backend
- Django with Django REST Framework
- PostgreSQL database
- JWT for authentication
- Twilio for SMS notifications

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- PostgreSQL
- Twilio account for SMS notifications

### Frontend Setup

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. The application will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment
4. Install dependencies: `pip install -r requirements.txt`
5. Create a `.env` file based on `.env.example` and add your configuration
6. Run migrations: `python manage.py migrate`
7. Start the development server: `python manage.py runserver`
8. The API will be available at `http://localhost:8000`

## SMS Notifications Setup

1. Sign up for a Twilio account at [twilio.com](https://www.twilio.com)
2. Get your Account SID, Auth Token, and a Twilio phone number
3. Add these credentials to your `.env` file

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open 

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
