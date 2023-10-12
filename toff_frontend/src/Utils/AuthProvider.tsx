import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext({
  token: null as string | null,
  login: () => {},
  logout: () => {},
  isLoading: true, // Add isLoading state
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Initialize isLoading to true

  useEffect(() => {
    // Fetch the token asynchronously and set it as the initial state
    getToken()
        .then((initialToken) => {
          setToken(initialToken);
        })
        .catch((error) => {
          console.error('Error fetching token:', error);
        })
        .finally(() => {
          setIsLoading(false); // Set isLoading to false when done
        });
  }, []); // The empty dependency array ensures this effect runs once on component mount

  const login = () => {
    setToken(getCookie('jwt'));
  };

  const logout = () => {
    removeCookie('jwt');
    setToken('');
  };

  const contextValue = {
    token,
    login,
    logout,
    isLoading, // Include isLoading in the context
  };

  return (
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
  );
};

async function getToken() {
  const token = getCookie('jwt');
  const url = `${API_BASE_URL}/api/master/verify?token=${token}`;
  const result = await fetch(url);

  if (result.ok) {
    return token;
  } else {
    return null;
  }
}

function getCookie(name: string) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

function removeCookie(name: string) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
