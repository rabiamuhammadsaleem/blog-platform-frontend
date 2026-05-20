import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogs, searchBlogs, API_BASE_URL } from '../services/api';

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await getAllBlogs();
      if (response.success) {
        setBlogs(response.blogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchBlogs();
      return;
    }
    
    setSearching(true);
    try {
      const response = await searchBlogs(searchTerm);
      if (response.success) {
        setBlogs(response.blogs);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchBlogs();
  };

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Loading blogs...</div>;
  }

  return (
    <div className="fade-in">
      <div className="glass-card" style={{ padding: '30px', marginBottom: '30px' }}>
        <h1 style={{ color: 'white', fontSize: '32px', marginBottom: '15px' }}>📖 All Blogs</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Discover amazing stories and insights from our community</p>
        
        <form onSubmit={handleSearch} style={{ marginTop: '25px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="glass-input"
            placeholder="Search blogs by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, minWidth: '200px' }}
          />
          <button type="submit" className="btn-primary" disabled={searching}>
            {searching ? 'Searching...' : '🔍 Search'}
          </button>
          {searchTerm && (
            <button type="button" className="btn-secondary" onClick={handleClearSearch}>
              Clear
            </button>
          )}
        </form>
      </div>

      {blogs.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px' }}>
            {searchTerm ? 'No blogs found matching your search.' : 'No blogs yet. Be the first to create one!'}
          </p>
          {!searchTerm && (
            <Link to="/create">
              <button className="btn-primary" style={{ marginTop: '20px' }}>✏️ Create First Blog</button>
            </Link>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '18px'
        }}>
          {blogs.map((blog) => (
            <Link to={`/blogs/${blog._id}`} key={blog._id} style={{ textDecoration: 'none', width: '100%' }}>
              <div className="glass-card blog-card" style={{
                padding: '0',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '400px'
              }}>
                {blog.image && (
                  <img 
                    src={`${API_BASE_URL}${blog.image}`}
                    alt={blog.title}
                    style={{
                      width: '100%',
                      height: '140px',
                      objectFit: 'contain',
                      borderBottom: '1px solid rgba(255,255,255,0.1)'
                    }}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                <div className="blog-card-content">
                  <div>
                    <br></br>
                    <h3 className="blog-card-title">{blog.title}</h3>
                    <p className="blog-card-excerpt">
                      {blog.description?.substring(0, 80)}
                    <p className="blog-card-meta">
                      By {blog.authorName} • {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                     </p>

                     <br></br>

                  </div>
                  {blog.videoLink && (
                    <div className="blog-card-ref">
                      <div style={{ fontWeight: 700, marginBottom: '6px' }}>Reference</div>
                      <a href={blog.videoLink} target="_blank" rel="noopener noreferrer" className="blog-card-url">
                        {blog.videoLink}
                      </a>
                    </div>
                  )}
                  <div className="blog-card-footer">
                    <Link to={`/blogs/${blog._id}`} className="blog-card-readmore">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBlogs;