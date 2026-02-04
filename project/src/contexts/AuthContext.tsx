import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import axios, { AxiosError, AxiosInstance } from 'axios';
import toast from 'react-hot-toast';

/* ================= TYPES ================= */

export type UserRole = 'user' | 'admin' | 'superadmin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  gender?: string;
  age?: string;
  dateOfBirth?: string;
  homeLocation: {
    city: string;
    state?: string;
    country?: string;
  };
  interests: string[];
  budgetPreference: string;
  crowdPreference: string;
  travelStyle: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relation?: string;
  };
  medicalNotes?: string;
}

interface AuthContextType {
  user: User | null;
  register: (data: SignupData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

/* ================= API CONFIGURATION ================= */

const API_BASE = import.meta.env.VITE_BACKEND_SERVER || 'http://localhost:5000';

// Create instance outside to prevent re-instantiation
const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to extract error messages safely
  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || error.message || 'An error occurred';
    }
    return (error as Error).message || 'An unexpected error occurred';
  };

  /* ---------- LOGOUT LOGIC ---------- */
  // Memoized to prevent unnecessary re-renders in children
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  /* ---------- INTERCEPTORS ---------- */
  useEffect(() => {
    // Request Interceptor: Attach Token
    const requestInterceptor = api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response Interceptor: Handle Global Errors (like 401)
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
          // Only toast if we were previously logged in to avoid double-toasting on app load
          if (user) toast.error('Session expired. Please login again.');
        }
        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [user]);

  /* ---------- AUTH ACTIONS ---------- */

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/api/auth/me');
      setUser(res.data.user);
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { token, user: userData } = res.data;

      localStorage.setItem('token', token);
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: SignupData) => {
    try {
      await api.post('/api/auth/register', data);
      toast.success('Registration successful! Please login.');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  };

  // Optimization: Only re-provide context if user or loading changes
  const value = useMemo(
    () => ({
      user,
      register,
      login,
      logout,
      loading,
      isAuthenticated: !!user,
    }),
    [user, loading, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading ? (
        children
      ) : (
        <div className='flex items-center justify-center h-screen'>
          {/* You can replace this with a proper Spinner component */}
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
