import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail } from 'lucide-react';

export default function ForgotPassword({ onBackToLogin }) {
  const { sendPasswordReset } = useApp();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');
    try {
      await sendPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      let errMsg = 'Failed to send password reset email. Please try again.';
      if (err.code === 'auth/user-not-found') {
        errMsg = 'No account found with this email address.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Invalid email address format.';
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

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
        maxWidth: '420px',
        padding: '40px 32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
        textAlign: 'center',
        background: 'var(--bg-card)',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        boxSizing: 'border-box'
      }}>
        <h1 style={{ 
          fontSize: '30px', 
          fontWeight: '800', 
          marginBottom: '8px', 
          fontFamily: 'var(--font-title)',
          color: '#fff',
          letterSpacing: '-0.02em'
        }}>
          Reset Password
        </h1>

        {success ? (
          <div style={{ textAlign: 'left', marginTop: '16px' }}>
            <div style={{
              background: 'var(--success-glow)',
              border: '1px solid var(--success)',
              color: 'var(--success)',
              padding: '14px',
              borderRadius: '12px',
              fontSize: '13px',
              marginBottom: '24px',
              textAlign: 'center',
              lineHeight: '1.5'
            }}>
              A password reset link has been sent to <strong>{email}</strong>. Please check your spam folder if you do not receive it shortly.
            </div>
            <button 
              onClick={onBackToLogin}
              style={{ width: '100%', height: '48px', borderRadius: '12px' }}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px', lineHeight: '1.5' }}>
              Enter your email below. We'll email you instructions to reset your password.
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
                boxSizing: 'border-box'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '18px', textAlign: 'left', width: '100%' }}>
              <div>
                <label htmlFor="reset-email">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ 
                      paddingLeft: '44px',
                      borderColor: error ? 'var(--error)' : 'var(--border-color)',
                      boxShadow: error ? '0 0 0 3px var(--error-glow)' : ''
                    }}
                    disabled={loading}
                    required
                  />
                  <Mail size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                </div>
              </div>

              {/* Reset Submit button */}
              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  marginTop: '6px', 
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
                ) : 'Send Reset Link'}
              </button>
            </form>

            {/* Back to Login Link */}
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '24px', fontWeight: 500 }}>
              Remember your password?{' '}
              <span 
                onClick={onBackToLogin}
                style={{ color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Login
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
