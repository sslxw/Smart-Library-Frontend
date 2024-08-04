import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  username: string;
  role: string;
}

interface AuthContextProps {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: () => {},
  loading: true,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:8001/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        if (data.username) {
          setUser(data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
  };

  useEffect(() => {
    fetchUser().finally(() => setLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:8001/users/login', new URLSearchParams({
        username: username,
        password: password,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const data = response.data;
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        await fetchUser();
        return { success: true };
      } else {
        return { success: false, message: data.detail };
      }
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, message: 'Login failed' };
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:8001/users/register', {
        username: username,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        return await login(username, password);
      } else {
        const data = response.data;
        return { success: false, message: data.detail };
      }
    } catch (error) {
      console.error('Error signing up:', error);
      return { success: false, message: 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
