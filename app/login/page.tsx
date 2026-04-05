'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Success - redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f2ec 0%, #ede9df 100%)', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .login-container {
          width: 100%;
          max-width: 450px;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
          font-weight: 500;
          color: #0a0a0f;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e8e5dc;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          color: #0a0a0f;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #7a9e87;
          box-shadow: 0 0 0 3px rgba(122, 158, 135, 0.1);
        }

        .form-button {
          width: 100%;
          padding: 0.875rem 1rem;
          background: #7a9e87;
          color: white;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .form-button:hover:not(:disabled) {
          background: #6b8d78;
        }

        .form-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          color: #dc2626;
          background: #fee2e2;
          padding: 0.75rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 600;
          color: #0a0a0f;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #6b7280;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }

        .signup-link {
          text-align: center;
          margin-top: 1.5rem;
          color: #6b7280;
        }

        .signup-link a {
          color: #7a9e87;
          text-decoration: none;
          font-weight: 600;
        }

        .signup-link a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="login-container">
        <div className="logo">Thea</div>
        <p className="subtitle">Logg inn på kontoen din</p>

        <form onSubmit={handleLogin}>
          {error && !error.includes('NEXT_REDIRECT') && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label className="form-label">E-postadresse</label>
            <input
              type="email"
              className="form-input"
              placeholder="du@bedrift.no"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Passord</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="form-button" disabled={loading}>
            {loading ? 'Innlasting...' : 'Logg inn'}
          </button>
        </form>

        <div className="signup-link">
          Har du ikke konto? <Link href="/signup">Opprett konto</Link>
        </div>
      </div>
    </div>
  );
}
