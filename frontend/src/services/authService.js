import api from './api';

const authService = {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      console.log('Register response:', response);
      console.log('Register response data:', response.data);
      
      if (response.data && response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      } else {
        console.error('Invalid register response format:', response.data);
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Register error:', error);
      console.error('Register error response:', error.response?.data);
      throw error;
    }
  },

  async login(credentials) {
    try {
      console.log('Sending login request with:', credentials);
      const response = await api.post('/auth/login', credentials);
      
      // Log the full response for debugging
      console.log('Full login response:', response);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response data:', response.data);
      
      // Check if response.data exists and has the expected structure
      if (response.data) {
        if (response.data.token && response.data.user) {
          // Store in localStorage
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          console.log('Login successful, user stored:', response.data.user);
          return response.data;
        } else {
          console.error('Response missing token or user:', response.data);
          throw new Error('Invalid response format: missing token or user');
        }
      } else {
        console.error('No data in response');
        throw new Error('No data received from server');
      }
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log('Retrieved user from localStorage:', user);
        return user;
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user');
    }
    return null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }
};

export default authService;