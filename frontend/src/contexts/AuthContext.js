import { createContext, useState, useContext, useEffect } from 'react';
import { supabase, signIn, signUp, signOut, getCurrentUser, fetchUserProfile } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        setLoading(true);
        const { data, error } = await getCurrentUser();
        
        if (error) {
          console.error('Error checking authentication:', error);
          setCurrentUser(null);
          setUserProfile(null);
          return;
        }
        
        if (data?.user) {
          setCurrentUser(data.user);
          
          // Fetch user profile
          const userType = data.user.user_metadata?.role || 'patient';
          const profileData = await fetchUserProfile(data.user.id, userType);
          
          if (profileData.data) {
            setUserProfile(profileData.data);
          }
        }
      } catch (err) {
        console.error('Authentication error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setCurrentUser(session.user);
          
          // Fetch user profile
          const userType = session.user.user_metadata?.role || 'patient';
          const profileData = await fetchUserProfile(session.user.id, userType);
          
          if (profileData.data) {
            setUserProfile(profileData.data);
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setUserProfile(null);
        }
      }
    );
    
    checkUser();
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const { data, error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        return { error };
      }
      
      return { data };
    } catch (err) {
      setError(err.message);
      return { error: err };
    }
  };

  const register = async (email, password, userData) => {
    try {
      setError(null);
      const { data, error } = await signUp(email, password, userData);
      
      if (error) {
        setError(error.message);
        return { error };
      }
      
      // Create user profile in the appropriate table
      const userType = userData.role || 'patient';
      const profileData = {
        user_id: data.user.id,
        email: email,
        ...userData
      };
      
      // This will be handled by a trigger in Supabase
      
      return { data };
    } catch (err) {
      setError(err.message);
      return { error: err };
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const { error } = await signOut();
      
      if (error) {
        setError(error.message);
        return { error };
      }
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { error: err };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      
      if (!currentUser) {
        setError('User not authenticated');
        return { error: 'User not authenticated' };
      }
      
      const userType = currentUser.user_metadata?.role || 'patient';
      const table = userType === 'doctor' ? 'doctor_profiles' : 'patient_profiles';
      
      const { data, error } = await supabase
        .from(table)
        .update(profileData)
        .eq('user_id', currentUser.id);
      
      if (error) {
        setError(error.message);
        return { error };
      }
      
      // Update local state
      setUserProfile({ ...userProfile, ...profileData });
      
      return { data };
    } catch (err) {
      setError(err.message);
      return { error: err };
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};