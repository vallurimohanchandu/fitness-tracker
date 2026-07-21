import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import gymCharacter from '../assets/gym_character.jpg';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

export default function Login({ onLoginSuccess, onSignupClick }) {
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
    } else {
      // If no account is created, they must register first
      setError('No profile detected. Please click Sign up below to create your account.');
      return;
    }

    setError('');
    onLoginSuccess();
  };

  const handleSocialClick = (platform) => {
    alert(`${platform} integration coming soon! For now, please sign in with your username.`);
  };

  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" style={{ display: 'block' }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      {/* Mobile-shaped card container */}
      <div className="glass-card animate-scale-up" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '30px 24px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '32px',
        background: 'rgba(9, 9, 14, 0.85)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        {/* Character Illustration Header */}
        <div style={{
          width: '100%',
          height: '180px',
          borderRadius: '24px',
          overflow: 'hidden',
          marginBottom: '20px',
          background: 'var(--bg-darker)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <img 
            src={gymCharacter} 
            alt="Ready to lift?" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              objectPosition: 'center 15%'
            }} 
          />
          {/* Soft dark vignette gradient */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(9,9,14,0) 50%, rgba(9,9,14,0.8) 100%)'
          }} />
        </div>

        {/* Title */}
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: '800', 
          marginBottom: '4px', 
          fontFamily: 'var(--font-title)',
          color: '#fff',
          letterSpacing: '-0.02em'
        }}>
          Ready to lift?
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
          Welcome back! Log in to pick up where you left.
        </p>

        {error && (
          <div style={{
            background: 'var(--error-glow)',
            border: '1px solid var(--error)',
            color: 'var(--error)',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '12px',
            marginBottom: '16px',
            textAlign: 'left',
            width: '100%',
            animation: 'fadeIn var(--transition-fast) forwards'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px', textAlign: 'left', width: '100%' }}>
          <div>
            <label htmlFor="login-username" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '44px', height: '48px', borderRadius: '14px' }}
                required
              />
              <User size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '44px', paddingRight: '44px', height: '48px', borderRadius: '14px' }}
                required
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

          {/* Forgot Password link */}
          <div style={{ textAlign: 'right', marginTop: '-4px' }}>
            <span 
              onClick={() => alert('Passwords are saved locally on this machine. If you forgot your password, please click Sign up to reset your app.')}
              style={{ fontSize: '11px', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}
            >
              Forgot Password?
            </span>
          </div>

          {/* Login Button with Premium Coral Gradient */}
          <button 
            type="submit" 
            style={{ 
              marginTop: '10px', 
              width: '100%',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
              border: 'none',
              fontWeight: '700',
              fontSize: '14px',
              boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
            }}
          >
            Login
          </button>
        </form>

        {/* Social Dividers */}
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '22px 0 16px 0'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Or Login with</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        {/* Social Buttons */}
        <div style={{ display: 'flex', gap: '14px', marginBottom: '22px' }}>
          <button 
            onClick={() => handleSocialClick('Facebook')} 
            className="secondary" 
            style={{ padding: '10px', minWidth: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#1877F2" style={{ display: 'block' }}>
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          <button 
            onClick={() => handleSocialClick('Google')} 
            className="secondary" 
            style={{ padding: '10px', minWidth: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <GoogleIcon />
          </button>
          <button 
            onClick={() => handleSocialClick('Apple')} 
            className="secondary" 
            style={{ padding: '10px', minWidth: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#ffffff" style={{ display: 'block' }}>
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.1.08.2.12.3.12.87 0 1.95-.57 2.52-1.45z"/>
            </svg>
          </button>
        </div>

        {/* Signup redirection link */}
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Don't have an account?{' '}
          <span 
            onClick={onSignupClick}
            style={{ color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Signup
          </span>
        </div>
      </div>
    </div>
  );
}
