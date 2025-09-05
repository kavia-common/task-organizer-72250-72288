const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// PUBLIC_INTERFACE
export function setToken(token) {
  /** Persist JWT token in localStorage. */
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    // noop - storage not available
  }
}

// PUBLIC_INTERFACE
export function getToken() {
  /** Retrieve JWT token from localStorage. */
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

// PUBLIC_INTERFACE
export function clearToken() {
  /** Remove JWT token from localStorage. */
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    // noop
  }
}

// PUBLIC_INTERFACE
export function setUser(user) {
  /** Persist user object in localStorage. */
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    // noop
  }
}

// PUBLIC_INTERFACE
export function getUser() {
  /** Retrieve user object from localStorage. */
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// PUBLIC_INTERFACE
export function clearUser() {
  /** Remove user object from localStorage. */
  try {
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    // noop
  }
}
