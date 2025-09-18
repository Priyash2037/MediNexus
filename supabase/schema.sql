-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create tables with RLS policies

-- Patient Profiles Table
CREATE TABLE patient_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  phone_number TEXT,
  address TEXT,
  medical_history TEXT,
  allergies TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Doctor Profiles Table
CREATE TABLE doctor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  full_name TEXT NOT NULL,
  specialization TEXT,
  license_number TEXT,
  experience_years INTEGER,
  education TEXT,
  bio TEXT,
  consultation_fee DECIMAL(10, 2),
  availability JSON,
  phone_number TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Appointments Table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patient_profiles(user_id) NOT NULL,
  doctor_id UUID REFERENCES doctor_profiles(user_id) NOT NULL,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  appointment_type TEXT NOT NULL DEFAULT 'video',
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medical Records Table
CREATE TABLE medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patient_profiles(user_id) NOT NULL,
  doctor_id UUID REFERENCES doctor_profiles(user_id) NOT NULL,
  appointment_id UUID REFERENCES appointments(id),
  diagnosis TEXT,
  treatment TEXT,
  prescription TEXT,
  notes TEXT,
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Conversations Table
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patient_profiles(user_id) NOT NULL,
  doctor_id UUID REFERENCES doctor_profiles(user_id),
  is_bot_conversation BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages Table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES chat_conversations(id) NOT NULL,
  sender_id UUID REFERENCES auth.users NOT NULL,
  message_text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Video Sessions Table
CREATE TABLE video_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) NOT NULL,
  session_token TEXT NOT NULL,
  ice_servers JSON,
  status TEXT NOT NULL DEFAULT 'pending',
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  related_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

-- Patient Profiles RLS
ALTER TABLE patient_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view their own profile"
  ON patient_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Doctors can view patient profiles"
  ON patient_profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM doctor_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Patients can update their own profile"
  ON patient_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Doctor Profiles RLS
ALTER TABLE doctor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view their own profile"
  ON doctor_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view doctor profiles"
  ON doctor_profiles FOR SELECT
  USING (true);

CREATE POLICY "Doctors can update their own profile"
  ON doctor_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Appointments RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view their own appointments"
  ON appointments FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view their appointments"
  ON appointments FOR SELECT
  USING (auth.uid() = doctor_id);

CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their appointments"
  ON appointments FOR UPDATE
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can update their appointments"
  ON appointments FOR UPDATE
  USING (auth.uid() = doctor_id);

-- Medical Records RLS
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view their own medical records"
  ON medical_records FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view medical records they created"
  ON medical_records FOR SELECT
  USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can create medical records"
  ON medical_records FOR INSERT
  WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update medical records they created"
  ON medical_records FOR UPDATE
  USING (auth.uid() = doctor_id);

-- Chat Conversations RLS
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations"
  ON chat_conversations FOR SELECT
  USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

CREATE POLICY "Patients can create conversations"
  ON chat_conversations FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

-- Chat Messages RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their conversations"
  ON chat_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM chat_conversations
    WHERE id = chat_messages.conversation_id
    AND (patient_id = auth.uid() OR doctor_id = auth.uid())
  ));

CREATE POLICY "Users can send messages in their conversations"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id AND EXISTS (
    SELECT 1 FROM chat_conversations
    WHERE id = chat_messages.conversation_id
    AND (patient_id = auth.uid() OR doctor_id = auth.uid())
  ));

-- Video Sessions RLS
ALTER TABLE video_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their video sessions"
  ON video_sessions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM appointments
    WHERE id = video_sessions.appointment_id
    AND (patient_id = auth.uid() OR doctor_id = auth.uid())
  ));

-- Notifications RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Create functions for real-time features

-- Function to handle new chat messages
CREATE OR REPLACE FUNCTION handle_new_chat_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notification for recipient
  INSERT INTO notifications (user_id, title, message, type, related_id)
  SELECT 
    CASE 
      WHEN c.patient_id = NEW.sender_id THEN c.doctor_id
      ELSE c.patient_id
    END,
    'New Message',
    'You have received a new message',
    'chat',
    NEW.conversation_id
  FROM chat_conversations c
  WHERE c.id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new chat messages
CREATE TRIGGER on_new_chat_message
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE PROCEDURE handle_new_chat_message();

-- Function to handle new appointments
CREATE OR REPLACE FUNCTION handle_new_appointment()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notification for doctor
  INSERT INTO notifications (user_id, title, message, type, related_id)
  VALUES (
    NEW.doctor_id,
    'New Appointment',
    'You have a new appointment request',
    'appointment',
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new appointments
CREATE TRIGGER on_new_appointment
  AFTER INSERT ON appointments
  FOR EACH ROW
  EXECUTE PROCEDURE handle_new_appointment();

-- Function to handle appointment status changes
CREATE OR REPLACE FUNCTION handle_appointment_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status <> NEW.status THEN
    -- Create notification for patient
    INSERT INTO notifications (user_id, title, message, type, related_id)
    VALUES (
      NEW.patient_id,
      'Appointment Update',
      'Your appointment status has been updated to ' || NEW.status,
      'appointment',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for appointment updates
CREATE TRIGGER on_appointment_update
  AFTER UPDATE ON appointments
  FOR EACH ROW
  EXECUTE PROCEDURE handle_appointment_update();

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_notification_type CHECK (type IN ('appointment', 'chat', 'alert', 'success', 'info'))
);

-- Add RLS policies for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
    ON notifications
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
    ON notifications
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
    ON notifications
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create index for faster notification queries
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('medical_records', 'Medical Records', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('profile_images', 'Profile Images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('chat_attachments', 'Chat Attachments', false);

-- Set up storage policies
CREATE POLICY "Patients can access their medical records"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'medical_records' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Doctors can access patient medical records"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'medical_records' AND EXISTS (
    SELECT 1 FROM medical_records mr
    JOIN appointments a ON mr.appointment_id = a.id
    WHERE a.doctor_id = auth.uid() AND (storage.foldername(name))[1] = mr.patient_id::text
  ));

CREATE POLICY "Users can upload their profile images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile_images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Public can view profile images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile_images');