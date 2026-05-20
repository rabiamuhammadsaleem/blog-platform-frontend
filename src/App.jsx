import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import AllBlogs from './components/AllBlogs';
import SingleBlog from './components/SingleBlog';
import MyBlogs from './components/MyBlogs';
import CreateBlog from './components/CreateBlog';
import UpdateBlog from './components/UpdateBlog';
import Profile from './components/Profile';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function AppContent() {
  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '30px', paddingBottom: '50px' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/blogs" element={<AllBlogs />} />
          <Route path="/blogs/:id" element={<SingleBlog />} />
          
          {/* Protected Routes - Login Required */}
          <Route path="/my-blogs" element={
            <ProtectedRoute><MyBlogs /></ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute><CreateBlog /></ProtectedRoute>
          } />
          <Route path="/update/:id" element={
            <ProtectedRoute><UpdateBlog /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;