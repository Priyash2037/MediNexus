// Using fetch API instead of axios to avoid dependency issues
const API_URL = 'http://localhost:8000/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  email: string;
  user_type: 'doctor' | 'patient';
}

export interface AuthResponse {
  tokens: {
    access: string;
    refresh: string;
  };
  user: {
    id: number;
    username: string;
    email: string;
    is_doctor: boolean;
    is_patient: boolean;
  };
}

// Custom fetch with error handling
const customFetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
};

// Store tokens in localStorage
const setTokens = (tokens: { access: string; refresh: string }) => {
  localStorage.setItem('accessToken', tokens.access);
  localStorage.setItem('refreshToken', tokens.refresh);
};

// Get the stored access token
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

// Get the stored refresh token
export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

// Clear tokens on logout
export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Store user data
export const setUser = (user: AuthResponse['user']) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Get the stored user data
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAccessToken();
};

// Login user
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await customFetch<AuthResponse>(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setTokens(response.tokens);
    setUser(response.user);
    return response;
  } catch (error) {
    throw error;
  }
};

// Register user
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await customFetch<AuthResponse>(`${API_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setTokens(response.tokens);
    setUser(response.user);
    return response;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logout = () => {
  clearTokens();
  window.location.href = '/';
};

// Create a function to get authenticated fetch options
export const getAuthFetchOptions = (options: RequestInit = {}): RequestInit => {
  const token = getAccessToken();
  return {
    ...options,
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};

// Authenticated fetch function
export const authFetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  try {
    return await customFetch<T>(url, getAuthFetchOptions(options));
  } catch (error: any) {
    // Handle 401 Unauthorized errors
    if (error.message.includes('401')) {
      // Token expired or invalid
      logout();
    }
    throw error;
  }
};