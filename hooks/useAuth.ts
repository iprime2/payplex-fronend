import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  email: string;
  exp: number;
};

export function useAuth() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log('Decoded Token:', decoded);
      setEmail(decoded.email);
    } catch (err) {
      console.error('Token decode failed:', err);
      localStorage.removeItem('token');
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; Max-Age=0; path=/';
    // router.push('/login');
  };

  return { email, logout };
}
