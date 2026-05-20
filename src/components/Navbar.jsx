import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          textDecoration: 'none',
          background: 'linear-gradient(135deg, #fff 0%, #e0d4ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ✍️ BlogMaster
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
          <Link to="/blogs" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>All Blogs</Link>
          
          {isAuthenticated && (
            <>
              <Link to="/my-blogs" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>My Blogs</Link>
              <Link to="/create" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Create</Link>
              <Link to="/profile" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Profile</Link>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', gap: '15px' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>👤 {user?.name}</span>
              <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px' }}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-secondary">Login</button>
              </Link>
              <Link to="/signup">
                <button className="btn-primary">Signup</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;