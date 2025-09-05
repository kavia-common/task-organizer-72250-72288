import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** 
   * Minimal, accessible login form connected to AuthContext.login.
   * - Captures email and password
   * - Submits to /auth/login via AuthContext
   * - Displays error on failure
   * - Redirects to intended page or /tasks on success
   */
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, send to tasks
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tasks', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const from = location.state?.from?.pathname || '/tasks';

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      // Navigate to previous page or /tasks by default
      navigate(from, { replace: true });
    } catch (err) {
      // Try to extract API error message
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        'Login failed. Please check your credentials and try again.';
      setError(apiMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} role="region" aria-labelledby="login-title">
        <div style={styles.header}>
          <h1 id="login-title" style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Sign in to continue to your tasks</p>
        </div>

        {error ? (
          <div style={styles.error} role="alert" aria-live="assertive">
            {error}
          </div>
        ) : null}

        <form onSubmit={onSubmit} style={styles.form} noValidate>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
            autoComplete="email"
            disabled={submitting}
          />

          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
            autoComplete="current-password"
            disabled={submitting}
          />

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(submitting ? styles.buttonDisabled : {}),
            }}
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={styles.footerText}>
          <span style={{ opacity: 0.7 }}>Don’t have an account?</span>{' '}
          <Link to="/register" style={styles.link} onClick={(e) => e.preventDefault()}>
            Register (coming soon)
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: 'var(--bg-secondary)',
    borderRadius: 12,
    border: `1px solid var(--border-color, #e9ecef)`,
    padding: 24,
    boxSizing: 'border-box',
    boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
  },
  header: {
    marginBottom: 16,
    textAlign: 'left',
  },
  title: {
    margin: 0,
    fontSize: 24,
    color: 'var(--text-primary)',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 0,
    color: 'var(--text-primary)',
    opacity: 0.7,
    fontSize: 14,
  },
  form: {
    marginTop: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  label: {
    fontSize: 13,
    color: 'var(--text-primary)',
    opacity: 0.75,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 8,
    border: `1px solid var(--border-color, #e9ecef)`,
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    outline: 'none',
    fontSize: 14,
  },
  button: {
    marginTop: 8,
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'var(--button-bg, #007bff)',
    color: 'var(--button-text, #fff)',
    border: 'none',
    borderRadius: 8,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform 0.15s ease, opacity 0.15s ease',
  },
  buttonDisabled: {
    opacity: 0.75,
    cursor: 'not-allowed',
  },
  error: {
    background: 'rgba(220, 53, 69, 0.12)',
    border: '1px solid rgba(220, 53, 69, 0.35)',
    color: '#ff6b6b',
    padding: '10px 12px',
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 14,
  },
  footerText: {
    marginTop: 14,
    fontSize: 13,
    color: 'var(--text-primary)',
    textAlign: 'center',
  },
  link: {
    color: 'var(--text-secondary)',
    textDecoration: 'none',
  },
};
