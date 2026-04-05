'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signup } from '@/app/auth/actions';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password, companyName);
      // signup() redirects on success
    } catch (error: any) {
      alert('Signup failed: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f2ec 0%, #ede9df 100%)', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .signup-container {
          width: 100%;
          max-width: 450px;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .signup-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .signup-logo {
          font-family: 'Instrument Serif', serif;
          font-size: 1.75rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #0a0a0f;
        }

        .signup-subtitle {
          color: #6b6760;
          font-size: 0.95rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #0a0a0f;
          font-size: 0.95rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e8e5dc;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          transition: all 0.2s;
          color: #0a0a0f;
        }

        .form-input:focus {
          outline: none;
          border-color: #7a9e87;
          box-shadow: 0 0 0 3px rgba(122, 158, 135, 0.1);
        }

        .form-button {
          width: 100%;
          padding: 0.85rem 1.5rem;
          background: #6b6760;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
        }

        .form-button:hover {
          background: #5a5550;
        }

        .form-button:disabled {
          background: #c9c3ba;
          cursor: not-allowed;
        }

        .signup-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0;
          color: #9b9590;
        }

        .signup-divider::before,
        .signup-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e8e5dc;
        }

        .oauth-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .oauth-button {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #e8e5dc;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .oauth-button:hover {
          border-color: #7a9e87;
          background: #f9f8f5;
        }

        .signup-footer {
          text-align: center;
          margin-top: 1.5rem;
          color: #6b6760;
          font-size: 0.9rem;
        }

        .signup-footer a {
          color: #7a9e87;
          text-decoration: none;
          font-weight: 600;
        }

        .signup-footer a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="signup-container">
        <div className="signup-header">
          <div className="signup-logo">Thea</div>
          <p className="signup-subtitle">Opprett konto og kom i gang på 5 minutter</p>
        </div>

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label className="form-label">Bedriftsnavn</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Din bedrift AS"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">E-postadresse</label>
            <input
              type="email"
              className="form-input"
              placeholder="du@bedrift.no"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              required
            />
          </div>

          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
          <button type="submit" className="form-button" disabled={loading}>
            {loading ? 'Opprettet....' : 'Opprett konto gratis'}
          </button>
        </form>

        <div className="signup-divider">eller</div>

        <div className="oauth-buttons">
          <button className="oauth-button">
            👤 Google
          </button>
          <button className="oauth-button">
            👤 Microsoft
          </button>
        </div>

        <div className="signup-footer">
          Har du allerede konto? <Link href="/login">Logg inn</Link>
        </div>
      </div>
    </div>
  );
}
