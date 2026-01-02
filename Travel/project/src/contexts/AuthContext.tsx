import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
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
}

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_BACKEND_SERVER || 'http://localhost:5000';

/* ================= PROVIDER ================= */

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  /* ---------- CHECK AUTH ---------- */
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const res = await axios.get(`${API_BASE}/api/auth/me`, {
        withCredentials: true,
      });

      setUser(res.data.user);
    } catch (err) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- REGISTER ---------- */
  const register = async (data: SignupData) => {
    try {
      await axios.post(`${API_BASE}/api/auth/register`, data, {
        withCredentials: true,
      });

      toast.success('Registration successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  /* ---------- LOGIN ---------- */
  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/auth/login`,
        { email, password },
        { withCredentials: true },
      );

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  /* ---------- LOGOUT ---------- */
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
