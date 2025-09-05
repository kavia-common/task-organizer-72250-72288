import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import api from '../api/client';
import { getToken, setToken, clearToken, getUser, setUser, clearUser } from '../utils/tokenStorage';

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Return the Auth context to access auth state and actions. */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides login state, user, token, and actions to the application. */
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUserState] = useState(() => getUser());
  const [loading, setLoading] = useState(true);

  // Initialize: if there's a token but no user, try /auth/me
  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const existingToken = getToken();
      if (!existingToken) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        if (!mounted) return;
        setUserState(data);
        setUser(data);
      } catch (e) {
        // Invalid token - clear and continue unauthenticated
        setTokenState(null);
        clearToken();
        clearUser();
      } finally {
        if (mounted) setLoading(false);
      }
    }

    // Also respond to global logout events (e.g., 401)
    const onLogout = () => {
      setTokenState(null);
      setUserState(null);
      clearToken();
      clearUser();
    };
    window.addEventListener('auth:logout', onLogout);

    bootstrap();

    return () => {
      mounted = false;
      window.removeEventListener('auth:logout', onLogout);
    };
  }, []);

  // PUBLIC_INTERFACE
  const login = useCallback(async (email, password) => {
    /**
     * Authenticate against the backend.
     * Returns { user, token } on success.
     */
    const { data } = await api.post('/auth/login', { email, password });
    if (data?.token) {
      setToken(data.token);
      setTokenState(data.token);
    }
    if (data?.user) {
      setUser(data.user);
      setUserState(data.user);
    } else {
      // If backend doesn't return user, attempt fetching it
      try {
        const me = await api.get('/auth/me');
        setUser(me.data);
        setUserState(me.data);
      } catch (_) {
        // ignore
      }
    }
    return data;
  }, []);

  // PUBLIC_INTERFACE
  const logout = useCallback(() => {
    /** Clear auth state and storage. */
    setTokenState(null);
    setUserState(null);
    clearToken();
    clearUser();
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    loading,
    isAuthenticated: Boolean(token),
    login,
    logout,
  }), [token, user, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
