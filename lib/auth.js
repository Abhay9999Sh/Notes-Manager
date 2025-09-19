// Client-side authentication utilities

const auth = {
  // Store token and user data
  login: (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Also set token in cookie for middleware
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
      
      console.log('Auth data stored:', { token: token ? 'exists' : 'missing', user }); // Debug log
    }
  },

  // Remove token and user data
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Remove token from cookie
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      
      window.location.href = '/login';
    }
  },

  // Get stored token
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  // Get stored user data
  getUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!auth.getToken();
  },
};

export default auth;