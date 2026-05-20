import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBlogs, deleteBlog, API_BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      const response = await getMyBlogs();
      if (response.success) {
        setBlogs(response.blogs);
      }
    } catch (error) {
      console.error('Error fetching my blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const response = await deleteBlog(id);
        if (response.success) {
          fetchMyBlogs();
        }
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Loading your blogs...</div>;
  }

  return (
    <div className="fade-in">
      <div className="glass-card" style={{ padding: '30px', marginBottom: '30px' }}>
        <h1 style={{ color: 'white', fontSize: '32px', marginBottom: '15px' }}>📝 My Blogs</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Manage your created blogs</p>
        <Link to="/create">
          <button className="btn-primary" style={{ marginTop: '15px' }}>✏️ Create New Blog</button>
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px' }}>You haven't created any blogs yet.</p>
          <Link to="/create">
            <button className="btn-primary" style={{ marginTop: '20px' }}>Create Your First Blog</button>
          </Link>
        </div>
      ) : (
        <div className="my-blog-grid">
          {blogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              {blog.image ? (
                <img
                  src={blog.image.startsWith('http') ? blog.image : `${API_BASE_URL}${blog.image}`}
                  alt={blog.title}
                  className="blog-card-image"
                />
              ) : (
                <div className="blog-card-image placeholder">No Image</div>
              )}
              <div className="blog-card-content">
                <h3 className="blog-card-title">{blog.title}</h3>
                <p className="blog-card-excerpt">{blog.description?.substring(0, 110)}
                <p className="blog-card-meta">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p></p>
                
                {blog.videoLink && (
                  <div className="blog-card-ref" style={{ marginTop: '10px' }}>
                    <div style={{ fontWeight: 700, marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>Reference</div>
                    <a href={blog.videoLink} target="_blank" rel="noopener noreferrer" className="blog-card-url">
                      {blog.videoLink}
                    </a>
                  </div>
                )}
                <div className="blog-card-actions">
                  <Link to={`/blogs/${blog._id}`} className="blog-card-link">View</Link>
                  <Link to={`/update/${blog._id}`} className="btn-secondary small">Edit</Link>
                  <button onClick={() => handleDelete(blog._id)} className="btn-danger small">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;