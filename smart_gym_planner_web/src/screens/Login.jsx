import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Dumbbell, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const { user, onboardingDone } = useApp();
  const [username, setUsername] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    }}>
      <div className="glass-card animate-scale-up" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px 32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
        textAlign: 'center'
      }}>
        {/* Logo */}
        <div style={{
          display: 'inline-flex',
          background: 'var(--primary-gradient)',
          padding: '12px',
          borderRadius: '16px',
          color: '#fff',
          boxShadow: '0 8px 20px var(--primary-glow)',
          marginBottom: '16px'
        }}>
          <Dumbbell size={28} />
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '6px', fontFamily: 'var(--font-title)' }}>
          SMART GYM
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '28px' }}>
          Log in to track workouts and nutrition
        </p>

        {error && (
          <div style={{
            background: 'var(--error-glow)',
            border: '1px solid var(--error)',
            color: 'var(--error)',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '12px',
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', textAlign: 'left' }}>
          <div>
            <label htmlFor="login-username">Username</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-username"
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '44px' }}
                required
              />
              <User size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div>
            <label htmlFor="login-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '44px', paddingRight: '44px' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <button
                type="button"
                className="secondary"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '6px',
                  padding: '8px',
                  minWidth: 'auto',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  boxShadow: 'none'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" style={{ marginTop: '10px', width: '100%' }}>
            Sign In
          </button>
        </form>

        {/* Register Hint */}
        {!onboardingDone && (
          <div style={{ marginTop: '24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            New to Smart Gym?{' '}
            <span 
              onClick={onLoginSuccess} // Taking to onboarding
              style={{ color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Create profile
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
