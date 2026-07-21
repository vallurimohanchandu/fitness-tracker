import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function Login({ onLoginSuccess, onSignupClick, onForgotPasswordClick }) {
  const { loginWithEmail, loginWithGoogle, isFirebaseAvailable } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      await loginWithEmail(email, password);
      if (rememberMe) {
        localStorage.setItem('sg_remember_email', email);
      } else {
        localStorage.removeItem('sg_remember_email');
      }
      onLoginSuccess();
    } catch (err) {
      console.error(err);
      let errMsg = 'Failed to sign in. Please check your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errMsg = 'Invalid email or password.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Invalid email address format.';
      }
      setErrors({ form: errMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrors({});
    try {
      await loginWithGoogle();
      onLoginSuccess();
    } catch (err) {
      console.error(err);
      setErrors({ form: 'Google authentication failed.' });
    } finally {
      setLoading(false);
    }
  };

  // Google 'G' icon helper
  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: '8px' }}>
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
      position: 'relative',
      zIndex: 1
    }}>
      {/* Dark glassmorphic card container */}
      <div className="glass-card animate-scale-up" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px 32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
        textAlign: 'center',
        background: 'var(--bg-card)',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        boxSizing: 'border-box'
      }}>

        {/* Title */}
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '800', 
          marginBottom: '8px', 
          fontFamily: 'var(--font-title)',
          color: '#fff',
          letterSpacing: '-0.02em'
        }}>
          Ready to lift?
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
          Welcome back! Sign in to continue your journey.
        </p>

        {errors.form && (
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
            boxSizing: 'border-box'
          }}>
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', textAlign: 'left', width: '100%' }}>
          <div>
            <label htmlFor="login-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  paddingLeft: '44px', 
                  borderColor: errors.email ? 'var(--error)' : 'var(--border-color)',
                  boxShadow: errors.email ? '0 0 0 3px var(--error-glow)' : ''
                }}
                disabled={loading}
                required
              />
              <Mail size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
            </div>
            {errors.email && <span style={{ color: 'var(--error)', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
          </div>

          <div>
            <label htmlFor="login-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  paddingLeft: '44px', 
                  paddingRight: '44px',
                  borderColor: errors.password ? 'var(--error)' : 'var(--border-color)',
                  boxShadow: errors.password ? '0 0 0 3px var(--error-glow)' : ''
                }}
                disabled={loading}
                required
              />
              <Lock size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <button
                type="button"
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
            {errors.password && <span style={{ color: 'var(--error)', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.password}</span>}
          </div>

          {/* Remember Me and Forgot Password row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-4px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer', 
              fontSize: '12px', 
              textTransform: 'none',
              letterSpacing: 'none',
              marginBottom: 0
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer', background: 'var(--bg-darker)' }}
                disabled={loading}
              />
              Remember Me
            </label>
            <span 
              onClick={onForgotPasswordClick}
              style={{ fontSize: '12px', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
            >
              Forgot Password?
            </span>
          </div>

          {/* Login Button with loading spinner */}
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '10px', 
              width: '100%',
              height: '48px',
              borderRadius: '12px',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <svg width="20" height="20" viewBox="0 0 38 38" stroke="#fff" style={{ display: 'block' }}>
                <g fill="none" fillRule="evenodd">
                  <g transform="translate(1 1)" strokeWidth="3">
                    <circle strokeOpacity=".25" cx="18" cy="18" r="18"/>
                    <path d="M36 18c0-9.94-8.06-18-18-18">
                      <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.8s" repeatCount="indefinite"/>
                    </path>
                  </g>
                </g>
              </svg>
            ) : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '24px 0 16px 0'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        {/* Google button */}
        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          style={{
            width: '100%',
            height: '46px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            color: '#fff',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Signup Link */}
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '24px', fontWeight: 500 }}>
          Don't have an account?{' '}
          <span 
            onClick={onSignupClick}
            style={{ color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
}
