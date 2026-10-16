// The logged-in session ({ token, expiresAtUtc, userId, fullName, role }) kept in localStorage
const KEY = 'therapy-booking.auth';

export const AUTH_EXPIRED_EVENT = 'therapy-booking:auth-expired';

export function loadSession() {
  try {
    const session = JSON.parse(localStorage.getItem(KEY));
    if (!session?.token || new Date(session.expiresAtUtc) <= new Date()) return null;
    return session;
  } catch {
    return null; // storage blocked or corrupted - treat as logged out
  }
}

export function saveSession(session) {
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    // private mode without storage: the session simply lasts until the tab closes
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // nothing to clear
  }
}
