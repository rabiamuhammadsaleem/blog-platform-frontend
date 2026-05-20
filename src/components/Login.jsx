import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login({ email, password });
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="fade-in" style={{
      maxWidth: '450px',
      margin: '50px auto',
      padding: '40px',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '30px', fontSize: '32px' }}>
        🔐 Welcome Back
      </h2>
      
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '20px',
          color: '#fca5a5',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label className="glass-label">📧 Email Address</label>
          <input
            type="email"
            className="glass-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div style={{ marginBottom: '25px' }}>
          <label className="glass-label">🔒 Password</label>
          <input
            type="password"
            className="glass-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <Link to="/forgot-password" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>
            Forgot Password?
          </Link>
        </div>
        
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Logging in...' : '🚀 Sign In'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '25px', color: 'rgba(255,255,255,0.7)' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;