import { useAuthStore } from '../store/authStore';

// Function to create authenticated fetch requests
export const authFetch = async (url: string, options: RequestInit = {}) => {
  const { accessToken, refreshAuth, logout } = useAuthStore.getState();
  
  if (!accessToken) {
    throw new Error('No access token available');
  }
  
  // Add authorization header and content type
  const authOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  
  try {
    const response = await fetch(url, authOptions);
    
    // If unauthorized, try to refresh token
    if (response.status === 401 && refreshAuth) {
      const refreshed = await refreshAuth();
      
      if (refreshed) {
        // Retry with new token
        const newToken = useAuthStore.getState().accessToken;
        const retryOptions = {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        };
        
        return fetch(url, retryOptions);
      } else {
        // If refresh failed, logout
        logout();
        throw new Error('Session expired. Please login again.');
      }
    }
    
    return response;
  } catch (error) {
    console.error('Auth fetch error:', error);
    throw error;
  }
};

// Function to check if a response is a 401 Unauthorized
export const isUnauthorized = (response: Response): boolean => {
  return response.status === 401;
};

// Hook to check if user is authenticated
export const useIsAuthenticated = () => {
  const { user, accessToken } = useAuthStore();
  return !!user && !!accessToken;
};