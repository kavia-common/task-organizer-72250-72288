import React from 'react';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function TasksPage() {
  /**
   * Minimal task landing page after login.
   * Future work: integrate tasks list, filters, sorting, etc.
   */
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Your Tasks</h2>
        <p style={styles.subtitle}>
          {user?.email ? `Signed in as ${user.email}` : 'Signed in'}
        </p>
      </div>
      <div style={styles.emptyState}>
        <p style={styles.emptyText}>
          Task list UI not implemented yet. This is the post-login landing page.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: 960,
    padding: 24,
    boxSizing: 'border-box',
    textAlign: 'left',
  },
  header: {
    marginBottom: 12,
  },
  title: {
    margin: 0,
    color: 'var(--text-primary)',
  },
  subtitle: {
    marginTop: 8,
    color: 'var(--text-primary)',
    opacity: 0.7,
    fontSize: 14,
  },
  emptyState: {
    marginTop: 24,
    border: `1px dashed var(--border-color, #e9ecef)`,
    borderRadius: 12,
    padding: 20,
  },
  emptyText: {
    margin: 0,
    color: 'var(--text-primary)',
    opacity: 0.8,
  },
};
