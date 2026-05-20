import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBlogById, deleteBlog, API_BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SingleBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await getBlogById(id);
      if (response.success) {
        setBlog(response.blog);
      } else {
        setError('Blog not found');
      }
    } catch (err) {
      setError('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const response = await deleteBlog(id);
        if (response.success) {
          navigate('/blogs');
        }
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Loading blog...</div>;
  }

  if (error || !blog) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>{error || 'Blog not found'}</div>;
  }

  return (
    <div className="fade-in">
      <div className="glass-card single-blog-card">
        {blog.image && (
          <img 
            src={`${API_BASE_URL}${blog.image}`}
            alt={blog.title}
            className="single-blog-image"
            onError={(e) => e.target.style.display = 'none'}
          />
        )}

        <div className="single-blog-header">
          <h1 className="single-blog-title">{blog.title}</h1>
          <p className="single-blog-description">
            {blog.description}</p>
            <br></br>
          <p className="single-blog-meta">
            By {blog.authorName} • {new Date(blog.createdAt).toLocaleDateString()}
          </p>
        </div>

       

        {blog.videoLink && (
          <div className="single-blog-section">
            {/* <h2 className="single-blog-section-title">Reference Link</h2> */}
            <div className="single-blog-video-link">Reference
                <br></br>
              <a href={blog.videoLink} target="_blank" rel="noopener noreferrer">
                {blog.videoLink}
              </a>
            </div>
          </div>
        )}

         {blog.video && (
          <div className="single-blog-section">
            <h2 className="single-blog-section-title">Video</h2>
            <div className="single-blog-video">
              <video 
                src={`${API_BASE_URL}${blog.video}`}
                controls
              />
            </div>
          </div>
        )}


        {user && user._id === blog.author._id && (
          <div className="single-blog-actions">
            <Link to={`/update/${blog._id}`}>
              <button className="btn-secondary">✏️ Edit</button>
            </Link>
            <button onClick={handleDelete} className="btn-danger">🗑️ Delete</button>
          </div>
        )}

       
       

        <div className="single-blog-back">
          <Link to="/blogs">
            <button className="btn-secondary">← Back to All Blogs</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;