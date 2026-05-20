import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await signup({ name, email, password });
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Signup failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="fade-in" style={{
      maxWidth: '500px',
      margin: '40px auto',
      padding: '40px',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '30px', fontSize: '32px' }}>
        📝 Create Account
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
          <label className="glass-label">👤 Full Name</label>
          <input
            type="text"
            className="glass-input"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
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
        
        <div style={{ marginBottom: '20px' }}>
          <label className="glass-label">🔒 Password</label>
          <input
            type="password"
            className="glass-input"
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div style={{ marginBottom: '25px' }}>
          <label className="glass-label">✓ Confirm Password</label>
          <input
            type="password"
            className="glass-input"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Creating Account...' : '✨ Sign Up'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '25px', color: 'rgba(255,255,255,0.7)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;