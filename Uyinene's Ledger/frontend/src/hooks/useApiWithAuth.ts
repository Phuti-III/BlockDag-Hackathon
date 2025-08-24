//4. Create: src/hooks/useApiWithAuth.ts
import { useAuth } from '@/context/AuthContext';

export const useApiWithAuth = () => {
  const { user } = useAuth();
  
  const makeApiCall = async (endpoint: string, options: RequestInit = {}) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'X-User-Address': user.address,
      'X-User-Role': user.role,
    };
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    };
    
    // Add user address to request body for POST/PUT/DELETE requests
    if (['POST', 'PUT', 'DELETE'].includes(options.method || 'GET')) {
      if (config.body && typeof config.body === 'string') {
        const body = JSON.parse(config.body);
        body.userAddress = user.address;
        config.body = JSON.stringify(body);
      } else if (!config.body) {
        config.body = JSON.stringify({ userAddress: user.address });
      }
    }
    
    const response = await fetch(`${baseUrl}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }
    
    return response.json();
  };
  
  return { makeApiCall, user };
};