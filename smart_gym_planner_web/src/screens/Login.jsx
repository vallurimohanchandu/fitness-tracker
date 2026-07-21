import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Login({ onLoginSuccess, onSignupClick }) {
  const { user, onboardingDone } = useApp();
  const [username, setUsername] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }

    // If onboarding is done, verify both username and password
    if (onboardingDone && user) {
      if (username.trim().toLowerCase() !== user.name.toLowerCase()) {
        setError(`No profile found for "${username}". Try registering instead.`);
        return;
      }
      if (password !== user.password) {
        setError('Incorrect password. Please try again.');
        return;
      }
    } else {
      setError('No profile detected. Please click Create New Account below to sign up.');
      return;
    }

    setError('');
    onLoginSuccess();
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: '#f0f4f8', // Soft light blue-gray background matching the image
    }}>
      {/* Light card container replicating the user's screenshot exactly */}
      <div className="animate-scale-up" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '50px 40px',
        background: '#ffffff',
        borderRadius: '32px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(0, 0, 0, 0.03)',
        boxSizing: 'border-box'
      }}>
        {/* Title */}
        <h1 style={{ 
          fontSize: '34px', 
          fontWeight: '800', 
          marginBottom: '28px', 
          color: '#1a1a1a',
          textAlign: 'left',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          Sign In
        </h1>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fee2e2',
            color: '#991b1b',
            padding: '12px 14px',
            borderRadius: '10px',
            fontSize: '13px',
            marginBottom: '20px',
            textAlign: 'left',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px', textAlign: 'left', width: '100%' }}>
          <div>
            <label htmlFor="login-username" style={{ 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#4d4d4d',
              marginBottom: '8px',
              display: 'block'
            }}>
              Username
            </label>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ 
                height: '46px', 
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                padding: '0 16px',
                fontSize: '15px',
                color: '#1e293b',
                width: '100%',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div>
            <label htmlFor="login-password" style={{ 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#4d4d4d',
              marginBottom: '8px',
              display: 'block'
            }}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                height: '46px', 
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                padding: '0 16px',
                fontSize: '15px',
                color: '#1e293b',
                width: '100%',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          {/* Login Button - Solid Royal Blue */}
          <button 
            type="submit" 
            style={{ 
              marginTop: '10px', 
              width: '100%',
              height: '46px',
              borderRadius: '8px',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              fontWeight: '600',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
              boxShadow: 'none'
            }}
            onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.background = '#2563eb'}
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div style={{
          width: '100%',
          textAlign: 'center',
          color: '#8c8c8c',
          fontSize: '14px',
          margin: '24px 0'
        }}>
          or
        </div>

        {/* Create New Account Button - Golden Yellow */}
        <button 
          onClick={onSignupClick}
          style={{ 
            width: '100%',
            height: '46px',
            borderRadius: '8px',
            background: '#f59e0b',
            color: '#1a1a1a',
            border: 'none',
            fontWeight: '600',
            fontSize: '15px',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
            boxShadow: 'none'
          }}
          onMouseOver={(e) => e.target.style.background = '#d97706'}
          onMouseOut={(e) => e.target.style.background = '#f59e0b'}
        >
          Create New Account
        </button>
      </div>
    </div>
  );
}
