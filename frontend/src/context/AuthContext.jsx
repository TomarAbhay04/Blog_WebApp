// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
// import { set } from 'mongoose';
// import { set } from 'mongoose';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = JSON.parse(localStorage.getItem('token'));
    console.log('Stored user from localStorage:', storedUser);
    console.log('Stored token from localStorage:', storedToken);

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
      const response = await axios.post('https://blog-webapp-2rak.onrender.com/api/auth/login', credentials);
      console.log('Login response from backend:', response.data);
  
      if (response.data.token) {
        setUser(response.data.user);
        setToken(response.data.token);
        localStorage.setItem('token', JSON.stringify(response.data.token)); // Save token to localStorage
        console.log('Token stored in localStorage:', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('User data stored in localStorage:', response.data.user);
      }
    } catch (error) {
      // Log detailed error information
      console.error('Login error:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const registerUser = async (credentials) => {
    console.log('Registration credentials:', credentials);

    try {
      const response = await axios.post('https://blog-webapp-2rak.onrender.com/api/auth/register', credentials);
      console.log('Registration response from backend:', response.data);

      if (response.data.token) {
        setUser(response.data.user);
        setToken(response.data.token);
        localStorage.setItem('token', JSON.stringify(response.data.token)); // Save token to localStorage
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
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};
