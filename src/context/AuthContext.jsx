import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth';
import { AUTH_EXPIRED_EVENT, clearSession, loadSession, saveSession } from '../utils/authStorage';

const AuthContext = createContext(null);

/**
 * Holds the logged-in user for the whole app. The JWT itself is attached to requests
 * by the axios interceptor (api/client.js); this context only manages the session state.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  const startSession = useCallback((authResponse) => {
    saveSession(authResponse);
    setSession(authResponse);
    return authResponse;
  }, []);

  const login = useCallback(
    async (credentials) => startSession(await authApi.login(credentials)),
    [startSession],
  );

  const register = useCallback(
    async (details) => startSession(await authApi.register(details)),
    [startSession],
  );

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  // The interceptor fires this event on a 401 (expired token)
  useEffect(() => {
    window.addEventListener(AUTH_EXPIRED_EVENT, logout);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, logout);
  }, [logout]);

  const value = useMemo(() => ({ user: session, login, register, logout }), [session, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
