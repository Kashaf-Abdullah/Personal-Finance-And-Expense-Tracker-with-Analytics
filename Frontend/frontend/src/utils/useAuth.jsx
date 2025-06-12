import { useState } from 'react';

export function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const saveToken = (tk) => {
    localStorage.setItem('token', tk);
    setToken(tk);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return { token, saveToken, logout };
}
