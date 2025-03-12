import { create } from 'zustand';
import { AuthState, AuthResponse } from '../types';

// Initialize state from local storage
const getStoredUser = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

const getStoredAccessToken = () => {
  return localStorage.getItem('accessToken') || null;
};

const getStoredRefreshToken = () => {
  return localStorage.getItem('refreshToken') || null;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getStoredUser(),
  accessToken: getStoredAccessToken(),
  refreshToken: getStoredRefreshToken(),
  isLoading: false,
  error: null,
  login: async (username: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await fetch('http://122.165.73.156:8888/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      // Check for 401 status or other error status
      if (response.status === 401 || data.status === 401) {
        set({ 
          isLoading: false, 
          error: 'Invalid username or password. Please try again.' 
        });
        return false;
      }
      
      if (data.status === 200 && data.accessToken) {
        const user = { 
          username: data.user, 
          name: data.user, 
          role: data.role 
        };
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        set({ 
          user, 
          accessToken: data.accessToken, 
          refreshToken: data.refreshToken,
          isLoading: false,
          error: null
        });
        
        return true;
      } else {
        set({ 
          isLoading: false, 
          error: data.message || 'Login failed. Please check your credentials.' 
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      set({ 
        isLoading: false, 
        error: 'Network error. Please try again later.' 
      });
      return false;
    }
  },
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, accessToken: null, refreshToken: null });
  },
  refreshAuth: async () => {
    const { refreshToken } = get();
    
    if (!refreshToken) {
      return false;
    }
    
    try {
      const response = await fetch('http://122.165.73.156:8888/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          set({ accessToken: data.accessToken });
          return true;
        }
      }
      
      // If refresh failed, clear tokens and return false
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }
}));