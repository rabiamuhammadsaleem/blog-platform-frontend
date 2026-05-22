import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://blog-platform-backend-production-2df3.up.railway.app/api';
export const API_BASE_URL = API_URL.replace(/\/api$/, '');

// Axios instance create karo
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,  
  headers: {
    'Content-Type': 'application/json'
  }
});

// ============ AUTH APIS ============

// Signup
export const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

// Login
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Logout
export const logout = async () => {
  const response = await api.get('/auth/logout');
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.put(`/auth/reset-password/${token}`, { password });
  return response.data;
};

// Get current user
export const getMe = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

// ============ BLOG APIS ============

// Get all blogs
export const getAllBlogs = async () => {
  const response = await api.get('/blogs/all');
  return response.data;
};

// Get my blogs
export const getMyBlogs = async () => {
  const response = await api.get('/blogs/my-blogs');
  return response.data;
};

// Get single blog
export const getBlogById = async (id) => {
  const response = await api.get(`/blogs/${id}`);
  return response.data;
};

// Create blog (with form-data for files)
export const createBlog = async (formData) => {
  const response = await api.post('/blogs/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Update blog
export const updateBlog = async (id, formData) => {
  const response = await api.put(`/blogs/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Delete blog
export const deleteBlog = async (id) => {
  const response = await api.delete(`/blogs/${id}`);
  return response.data;
};

// Search blogs
export const searchBlogs = async (keyword) => {
  const response = await api.get(`/blogs/search?keyword=${keyword}`);
  return response.data;
};

// ============ PROFILE APIS ============

// Get profile
export const getProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

// Update profile (with form-data for profile picture)
export const updateProfile = async (formData) => {
  const response = await api.put('/users/profile', formData);
  return response.data;
};

export default api;