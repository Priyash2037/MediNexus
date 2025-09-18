import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vlszfbcbtxnksbxnbhnf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsc3pmYmNidHhua3NieG5iaG5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NTQ4MTMsImV4cCI6MjA3MzIzMDgxM30.doKyFifD9XJXR8n8t2gPTkMx0maUqnxGYyXwj0lA1qM';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (email, password, userData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
};

// Database helpers
export const fetchUserProfile = async (userId, userType) => {
  const table = userType === 'doctor' ? 'doctor_profiles' : 'patient_profiles';
  
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('user_id', userId)
    .single();
    
  return { data, error };
};

// Real-time subscription helper
export const subscribeToChannel = (channel, callback) => {
  return supabase
    .channel(channel)
    .on('postgres_changes', { event: '*', schema: 'public' }, callback)
    .subscribe();
};