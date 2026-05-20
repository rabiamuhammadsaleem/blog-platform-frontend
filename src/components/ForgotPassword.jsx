// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const ForgotPassword = () => {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [resetLink, setResetLink] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');
//     setResetLink('');
//     setLoading(true);

//     // Demo mode - simulate API call
//     setTimeout(() => {
//       // Check if email looks valid
//       if (!email.includes('@') || !email.includes('.')) {
//         setError('Please enter a valid email address');
//         setLoading(false);
//         return;
//       }

//       // Generate demo token
//       const demoToken = 'demo-' + Math.random().toString(36).substring(2, 15);
//       const resetUrl = `http://localhost:3000/reset-password/${demoToken}`;
      
//       setResetLink(resetUrl);
//       setMessage(`✅ Password reset link generated for ${email}!`);
//       console.log('🔗 Reset link:', resetUrl);
//       setEmail('');
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
//         🔑 Forgot Password?
//       </h2>
      
//       <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: '25px' }}>
//         Enter your email address and we'll send you a link to reset your password.
//       </p>
      
//       {message && (
//         <div style={{
//           background: 'rgba(16, 185, 129, 0.2)',
//           border: '1px solid rgba(16, 185, 129, 0.5)',
//           borderRadius: '12px',
//           padding: '12px',
//           marginBottom: '15px',
//           color: '#6ee7b7',
//           textAlign: 'center'
//         }}>
//           {message}
//           {resetLink && (
//             <div style={{ marginTop: '10px', wordBreak: 'break-all' }}>
//               <a href={resetLink} style={{ color: '#6ee7b7' }}>Click here to reset password</a>
//             </div>
//           )}
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
//         <div style={{ marginBottom: '25px' }}>
//           <label className="glass-label">📧 Email Address</label>
//           <input
//             type="email"
//             className="glass-input"
//             placeholder="Enter your registered email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
        
//         <button
//           type="submit"
//           className="btn-primary"
//           disabled={loading}
//           style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
//         >
//           {loading ? 'Sending...' : '📧 Send Reset Link'}
//         </button>
//       </form>
      
//       <p style={{ textAlign: 'center', marginTop: '25px', color: 'rgba(255,255,255,0.7)' }}>
//         Remember your password?{' '}
//         <Link to="/login" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>
//           Back to Login
//         </Link>
//       </p>
//     </div>
//   );
// };

// export default ForgotPassword;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setResetLink('');
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      console.log('Response:', response);
      
      if (response.success) {
        setMessage(response.message);
        if (response.resetUrl) {
          setResetLink(response.resetUrl);
        }
        setEmail('');
      } else {
        setError(response.message || 'Something went wrong');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Failed to send reset link');
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
        🔑 Forgot Password?
      </h2>
      
      <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: '25px' }}>
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      {message && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.5)',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '15px',
          color: '#6ee7b7',
          textAlign: 'center'
        }}>
          {message}
          {resetLink && (
            <div style={{ marginTop: '10px', wordBreak: 'break-all' }}>
              <a href={resetLink} style={{ color: '#6ee7b7' }}>👉 Click here to reset password 👈</a>
            </div>
          )}
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
        <div style={{ marginBottom: '25px' }}>
          <label className="glass-label">📧 Email Address</label>
          <input
            type="email"
            className="glass-input"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Sending...' : '📧 Send Reset Link'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '25px', color: 'rgba(255,255,255,0.7)' }}>
        Remember your password?{' '}
        <Link to="/login" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>
          Back to Login
        </Link>
      </p>
    </div>
  );
};

export default ForgotPassword;