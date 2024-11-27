import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Create AuthContext
const AuthContext = createContext();

// Provider to wrap the app and manage authentication state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch user data on initialization if a cookie exists
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('Fetching user...');
        const response = await fetch('/auth/me', {
          credentials: 'include', // Include cookies in the request
        });

        if (response.ok) {
          const data = await response.json();
          console.log('User fetched successfully:', data);
          setUser(data); // Set the user state
        } else {
          console.log('No valid session found');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        console.log("Got to set false");
        setLoading(false); // Set loading to false regardless of the outcome
      }
    };

    fetchUser();
  }, []);
  
  const login = (userData) => {
    console.log('Setting user in AuthProvider:', userData);
    setUser(userData); // Set user state after login
    setLoading(false); // Ensure loading is false after login
  };

  const logout = async () => {
    await fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include', // Include cookies in the request
    });
    setUser(null); // Clear user state
    setLoading(false); // Reset loading state
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// PropTypes for validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook to access AuthContext in components
export const useAuth = () => useContext(AuthContext);
