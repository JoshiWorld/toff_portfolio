import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    // Implement your login logic and set the token
    setToken('your_token_here'); // Replace 'your_token_here' with the actual token
    console.log('I got pressed');
  };

  const logout = () => {
    // Implement your logout logic and reset the token
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
  const url = `http://localhost:3030/api/master/verify?token=${token}`;
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
