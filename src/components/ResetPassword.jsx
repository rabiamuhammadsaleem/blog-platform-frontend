// import React, { useState } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';

// const ResetPassword = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');

//     if (password !== confirmPassword) {
//       setError('Passwords do not match!');
//       return;
//     }

//     if (password.length < 6) {
//       setError('Password must be at least 6 characters');
//       return;
//     }

//     setLoading(true);

//     // Demo mode - simulate password reset
//     setTimeout(() => {
//       console.log('Password reset for token:', token);
//       console.log('New password:', password);
      
//       setMessage('✅ Password reset successful! Redirecting to login...');
//       setTimeout(() => {
//         navigate('/login');
//       }, 2000);
//       setLoading(false);
//     }, 1000);
//   };

//   return (
//     <div className="fade-in" style={{
//       maxWidth: '450px',
//       margin: '50px auto',
//       padding: '40px',
//       background: 'rgba(255, 255, 255, 0.1)',
//       backdropFilter: 'blur(10px)',
//       borderRadius: '24px',
//       border: '1px solid rgba(255, 255, 255, 0.2)'
//     }}>
//       <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '20px', fontSize: '28px' }}>
//         🔐 Reset Password
//       </h2>
      
//       <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: '25px' }}>
//         Token: <code style={{ fontSize: '12px' }}>{token?.substring(0, 20)}...</code>
//       </p>
      
//       {message && (
//         <div style={{
//           background: 'rgba(16, 185, 129, 0.2)',
//           border: '1px solid rgba(16, 185, 129, 0.5)',
//           borderRadius: '12px',
//           padding: '12px',
//           marginBottom: '20px',
//           color: '#6ee7b7',
//           textAlign: 'center'
//         }}>
//           {message}
//         </div>
//       )}
      
//       {error && (
//         <div style={{
//           background: 'rgba(239, 68, 68, 0.2)',
//           border: '1px solid rgba(239, 68, 68, 0.5)',
//           borderRadius: '12px',
//           padding: '12px',
//           marginBottom: '20px',
//           color: '#fca5a5',
//           textAlign: 'center'
//         }}>
//           {error}
//         </div>
//       )}
      
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: '20px' }}>
//           <label className="glass-label">🔒 New Password</label>
//           <input
//             type="password"
//             className="glass-input"
//             placeholder="Enter new password (min 6 characters)"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
        
//         <div style={{ marginBottom: '25px' }}>
//           <label className="glass-label">✓ Confirm New Password</label>
//           <input
//             type="password"
//             className="glass-input"
//             placeholder="Re-enter new password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </div>
        
//         <button
//           type="submit"
//           className="btn-primary"
//           disabled={loading}
//           style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
//         >
//           {loading ? 'Resetting...' : '✅ Reset Password'}
//         </button>
//       </form>
      
//       <p style={{ textAlign: 'center', marginTop: '25px', color: 'rgba(255,255,255,0.7)' }}>
//         <Link to="/login" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>
//           ← Back to Login
//         </Link>
//       </p>
//     </div>
//   );
// };

// export default ResetPassword;


import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
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

    try {
      const response = await resetPassword(token, password);
      console.log('Reset response:', response);
      
      if (response.success) {
        setMessage('✅ Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Reset error:', err);
      setError(err.response?.data?.message || 'Invalid or expired token');
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
      <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '20px', fontSize: '28px' }}>
        🔐 Reset Password
      </h2>
      
      {message && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.5)',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '20px',
          color: '#6ee7b7',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}
      
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
          <label className="glass-label">🔒 New Password</label>
          <input
            type="password"
            className="glass-input"
            placeholder="Enter new password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div style={{ marginBottom: '25px' }}>
          <label className="glass-label">✓ Confirm New Password</label>
          <input
            type="password"
            className="glass-input"
            placeholder="Re-enter new password"
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
          {loading ? 'Resetting...' : '✅ Reset Password'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '25px', color: 'rgba(255,255,255,0.7)' }}>
        <Link to="/login" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>
          ← Back to Login
        </Link>
      </p>
    </div>
  );
};

export default ResetPassword;