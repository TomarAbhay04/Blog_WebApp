// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log('Stored user from localStorage:', storedUser);

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Parsed user from localStorage:', parsedUser);

        if (parsedUser) {
          setUser(parsedUser); // Use id as is
        }
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
      }
    }
  }, []);

  const loginUser = async (credentials) => {
    console.log('Login credentials:', credentials);

    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', credentials);
      console.log('Login response from backend:', response.data);

      if (response.data.token) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('User data stored in localStorage:', response.data.user);
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  };

  const registerUser = async (credentials) => {
    console.log('Registration credentials:', credentials);

    try {
      const response = await axios.post('http://localhost:4000/api/auth/register', credentials);
      console.log('Registration response from backend:', response.data);

      if (response.data.token) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('User data stored in localStorage:', response.data.user);
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    console.log('User logged out');
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
