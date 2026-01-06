import React, { useState, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { localAuth } from '../../services/localAuth';
import '../styles/AdminLogin.css';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus email input on mount and hide rogue logo
  useLayoutEffect(() => {
    emailInputRef.current?.focus();

    // FAILSAFE: Forcefully hide the rogue logo if it exists anywhere
    const styleId = 'admin-logo-fix';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .logo-bounce-wrapper, .logo-bounce-wrapper::before, .logo-bounce-wrapper::after {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          width: 0 !important;
          height: 0 !important;
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // Cleanup when leaving admin login
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting login...'); // Debug log
    setError('');
    setLoading(true);

    try {
      // Force initialization just in case
      localAuth.initialize();

      const success = localAuth.login(email, password);
      console.log('Login result:', success); // Debug log

      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err); // Debug log
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      {/* Back to Home Button */}
      <button onClick={() => navigate('/')} className="back-home-btn">
        <svg className="home-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        Back to Menu
      </button>

      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="admin-login-glass-card">
        <div className="login-header">
          <div className="login-icon-wrapper">
            <img src="/logo.png" alt="Snip Taste" className="login-logo-img" />
          </div>
          <h1>Admin Portal</h1>
          <p>Snip Taste Management System</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div
              className="error-animated"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center',
              }}
            >
              <svg
                style={{ width: '20px', height: '20px', flexShrink: 0 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {error}
            </div>
          )}

          <div className="input-group">
            <input
              ref={emailInputRef}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
              autoComplete="email"
            />
            <label htmlFor="email">Email Address</label>
          </div>

          <div className="input-group">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              autoComplete="current-password"
            />
            <label htmlFor="password">Password</label>
          </div>

          <button type="submit" disabled={loading} className="login-btn-premium">
            {loading ? (
              <span className="loading-dots">
                Logging in<span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            ) : (
              'Access Dashboard'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>© {new Date().getFullYear()} Snip Taste</p>
          <div className="secure-badge">
            <span className="secure-dot"></span> Secure Connection
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
