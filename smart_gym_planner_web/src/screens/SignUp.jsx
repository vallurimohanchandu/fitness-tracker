import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, User, Eye, EyeOff } from 'lucide-react';

export default function SignUp({ onSignupSuccess, onLoginClick }) {
  const { signUpWithEmail, loginWithGoogle, isFirebaseAvailable } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [strength, setStrength] = useState({ score: 0, label: 'Very Weak', color: 'var(--error)' });

  // Password strength check criteria
  const checkStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Very Weak', color: 'var(--error)' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;

    let label = 'Very Weak';
    let color = 'var(--error)';
    if (score >= 5) {
      label = 'Strong';
      color = 'var(--success)';
    } else if (score >= 3) {
      label = 'Medium';
      color = 'var(--warning)';
    } else if (score >= 1) {
      label = 'Weak';
      color = 'var(--error)';
    }
    return { score, label, color };
  };

  useEffect(() => {
    setStrength(checkStrength(password));
  }, [password]);

  const validate = () => {
    const newErrors = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        newErrors.password = 'Password does not meet all criteria';
      }
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!termsAccepted) {
      newErrors.terms = 'You must accept the Terms and Conditions';
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
      await signUpWithEmail(email, password, fullName);
      onSignupSuccess();
    } catch (err) {
      console.error(err);
      let errMsg = 'Failed to create account. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        errMsg = 'This email is already registered.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Invalid email address format.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'The password is too weak.';
      }
      setErrors({ form: errMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setErrors({});
    try {
      await loginWithGoogle();
      onSignupSuccess();
    } catch (err) {
      console.error(err);
      setErrors({ form: 'Google registration failed.' });
    } finally {
      setLoading(false);
    }
  };

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
      <div className="glass-card animate-scale-up" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '36px 32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
        textAlign: 'center',
        background: 'var(--bg-card)',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        boxSizing: 'border-box'
      }}>
        {/* Fallback local mode warning */}
        {!isFirebaseAvailable && (
          <div style={{
            background: 'var(--warning-glow)',
            border: '1px solid var(--warning)',
            color: 'var(--warning)',
            padding: '8px 12px',
            borderRadius: '10px',
            fontSize: '11px',
            marginBottom: '16px',
            textAlign: 'center',
            width: '100%',
            boxSizing: 'border-box',
            lineHeight: 1.4
          }}>
            ⚠️ Firebase environment variables are not configured. Running in Local Mode.
          </div>
        )}

        <h1 style={{ 
          fontSize: '30px', 
          fontWeight: '800', 
          marginBottom: '8px', 
          fontFamily: 'var(--font-title)',
          color: '#fff',
          letterSpacing: '-0.02em'
        }}>
          Create Profile
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
          Sign up to unlock personalized workout and meal plans.
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

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px', textAlign: 'left', width: '100%' }}>
          <div>
            <label htmlFor="signup-name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                id="signup-name"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ 
                  paddingLeft: '44px',
                  borderColor: errors.fullName ? 'var(--error)' : 'var(--border-color)',
                  boxShadow: errors.fullName ? '0 0 0 3px var(--error-glow)' : ''
                }}
                disabled={loading}
                required
              />
              <User size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
            </div>
            {errors.fullName && <span style={{ color: 'var(--error)', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.fullName}</span>}
          </div>

          <div>
            <label htmlFor="signup-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="signup-email"
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
            <label htmlFor="signup-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
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

            {/* Dynamic Password Strength Indicator Bar */}
            {password && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Strength: <strong>{strength.label}</strong></span>
                  <span style={{ fontSize: '10px', color: strength.color }}>{strength.score}/5</span>
                </div>
                <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${(strength.score / 5) * 100}%`, 
                    background: strength.color,
                    transition: 'all 0.3s ease'
                  }} />
                </div>

                {/* Micro-checkbox checks */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '6px', fontSize: '10px' }}>
                  <span style={{ color: password.length >= 8 ? 'var(--success)' : 'var(--text-muted)' }}>✓ Min 8 chars</span>
                  <span style={{ color: /[A-Z]/.test(password) ? 'var(--success)' : 'var(--text-muted)' }}>✓ Uppercase letter</span>
                  <span style={{ color: /[a-z]/.test(password) ? 'var(--success)' : 'var(--text-muted)' }}>✓ Lowercase letter</span>
                  <span style={{ color: /[0-9]/.test(password) ? 'var(--success)' : 'var(--text-muted)' }}>✓ Number (0-9)</span>
                  <span style={{ color: /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'var(--success)' : 'var(--text-muted)' }}>✓ Special character</span>
                </div>
              </div>
            )}
            {errors.password && <span style={{ color: 'var(--error)', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.password}</span>}
          </div>

          <div>
            <label htmlFor="signup-confirm">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="signup-confirm"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ 
                  paddingLeft: '44px',
                  borderColor: errors.confirmPassword ? 'var(--error)' : 'var(--border-color)',
                  boxShadow: errors.confirmPassword ? '0 0 0 3px var(--error-glow)' : ''
                }}
                disabled={loading}
                required
              />
              <Lock size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
            </div>
            {errors.confirmPassword && <span style={{ color: 'var(--error)', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.confirmPassword}</span>}
          </div>

          {/* Terms and Conditions checkbox */}
          <div>
            <label style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '8px', 
              cursor: 'pointer', 
              fontSize: '12px', 
              textTransform: 'none',
              letterSpacing: 'none',
              marginBottom: 0
            }}>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer', background: 'var(--bg-darker)', marginTop: '2px' }}
                disabled={loading}
              />
              <span>I accept the <strong style={{ color: 'var(--primary)' }}>Terms & Conditions</strong> and Privacy Policy.</span>
            </label>
            {errors.terms && <span style={{ color: 'var(--error)', fontSize: '11px', marginTop: '4px', display: 'block' }}>{errors.terms}</span>}
          </div>

          {/* Sign Up Button */}
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
            ) : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '20px 0 14px 0'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        {/* Google Signup Button */}
        <button 
          onClick={handleGoogleSignup} 
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
          Sign Up with Google
        </button>

        {/* Redirect to login Link */}
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '20px', fontWeight: 500 }}>
          Already have an account?{' '}
          <span 
            onClick={onLoginClick}
            style={{ color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
}
