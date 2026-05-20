import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllBlogs, getMyBlogs, API_BASE_URL } from '../services/api';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    yourBlogs: 0,
    totalAuthors: 0,
    totalLikes: 0  // Note: Likes feature baad mein add karenge
  });
  const [insights, setInsights] = useState({
    topAuthor: '',
    averageBlogs: 0,
    mediaPosts: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Saare blogs fetch karo
      const allBlogsRes = await getAllBlogs();
      const blogs = allBlogsRes.success ? allBlogsRes.blogs : [];
      const totalBlogs = blogs.length;

      // Media-rich posts count
      const mediaPosts = blogs.filter(blog => blog.image || blog.video || blog.videoLink).length;

      // Calculate distinct posting users and top contributor
      const authorCounts = {};
      const authorNames = {};
      blogs.forEach((blog) => {
        const authorId = blog.author?._id || blog.authorName || 'Unknown';
        authorCounts[authorId] = (authorCounts[authorId] || 0) + 1;
        authorNames[authorId] = blog.authorName || authorNames[authorId] || 'Unknown';
      });

      const totalAuthors = Object.keys(authorCounts).length;
      const averageBlogs = totalAuthors ? Number((totalBlogs / totalAuthors).toFixed(1)) : 0;
      const topAuthorEntry = Object.entries(authorCounts).sort((a, b) => b[1] - a[1])[0];
      const topAuthor = topAuthorEntry ? `${authorNames[topAuthorEntry[0]]} (${topAuthorEntry[1]} posts)` : 'No contributors yet';

      // Recent blogs (last 3)
      const recent = blogs.slice(0, 3);
      setRecentBlogs(recent);

      // Stats update
      setStats(prev => ({ ...prev, totalBlogs, totalAuthors }));
      setInsights({ topAuthor, averageBlogs, mediaPosts });

      // Agar user login hai toh uske blogs fetch karo
      if (isAuthenticated) {
        const myBlogsRes = await getMyBlogs();
        const yourBlogs = myBlogsRes.success ? myBlogsRes.blogs.length : 0;
        setStats(prev => ({ ...prev, yourBlogs }));
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      {/* Welcome Section */}
      <div className="glass-card" style={{
        padding: '40px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: 'white', fontSize: '42px', marginBottom: '15px' }}>
          {isAuthenticated ? `Welcome back, ${user?.name}! ✨` : 'Welcome to BlogMaster ✨'}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
          Share your thoughts, stories, and ideas with the world. Create beautiful blogs and connect with readers.
        </p>
        
        {isAuthenticated && (
          <Link to="/create">
            <button className="btn-primary" style={{ marginTop: '25px' }}>
              ✏️ Create New Blog
            </button>
          </Link>
        )}
      </div>

      {/* Why Choose This App */}
      <div className="glass-card" style={{ padding: '30px', marginBottom: '30px' }}>
        <h2 style={{ color: 'white', fontSize: '28px', marginBottom: '16px', textAlign: 'center' }}>Why choose this app?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '18px', padding: '18px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
            <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '10px' }}>Fast & easy</h3>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px' }}>Create posts quickly and manage content without hassle.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '18px', padding: '18px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌐</div>
            <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '10px' }}>Community reach</h3>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px' }}>Share your ideas and reach readers with an engaging blog layout.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '18px', padding: '18px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔒</div>
            <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '10px' }}>Secure profile</h3>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px' }}>Handle your posts and profile safely with login-protected features.</p>
          </div>
        </div>
      </div>

      {/* Real Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div className="glass-card" style={{ padding: '25px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📝</div>
          <h3 style={{ color: 'white', fontSize: '32px' }}>{stats.totalBlogs}</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>Total Blogs</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '8px' }}>
            Across all users
          </p>
        </div>
        
        <div className="glass-card" style={{ padding: '25px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>✏️</div>
          <h3 style={{ color: 'white', fontSize: '32px' }}>
            {isAuthenticated ? stats.yourBlogs : 'Login to see'}
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>Your Blogs</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '8px' }}>
            Blogs you've created
          </p>
        </div>
        
        <div className="glass-card" style={{ padding: '25px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>👥</div>
          <h3 style={{ color: 'white', fontSize: '32px' }}>{stats.totalAuthors}</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>Total user</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '8px' }}>
            Unique authors contributing
          </p>
        </div>
      </div>

      {/* Dashboard Insights */}
      <div className="glass-card" style={{ padding: '25px', marginBottom: '40px' }}>
        <h2 style={{ color: 'white', fontSize: '26px', marginBottom: '18px', textAlign: 'center' }}>Dashboard insights</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '18px', padding: '18px', minHeight: '140px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px', textAlign: 'center' }}>🏆</div>
            <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '10px', textAlign: 'center' }}>Top contributor</h3>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', lineHeight: '1.6' ,textAlign:'center'
                
            }}>{insights.topAuthor}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '18px', padding: '18px', minHeight: '140px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px',textAlign:'center' }}>📊</div>
            <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '10px', textAlign: 'center' }}>Average posts</h3>
            <p style={{ color: 'rgba(255,255,255,0.75)', textAlign: 'center', fontSize: '14px', lineHeight: '1.6'}}>
              {insights.averageBlogs} post(s) per author on average.
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '18px', padding: '18px', minHeight: '140px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px',textAlign:'center' }}>📸</div>
            <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '10px', textAlign: 'center' }}>Media posts</h3>
            <p style={{ color: 'rgba(255,255,255,0.75)', textAlign: 'center', fontSize: '14px', lineHeight: '1.6' }}>
              {insights.mediaPosts} blogs include an image or video.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Blogs Section */}
      <div className="glass-card" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={{ color: 'white', fontSize: '24px' }}>📌 Recent Blogs</h2>
          <Link to="/blogs" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
            View All →
          </Link>
        </div>
        
        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>Loading blogs...</p>
        ) : recentBlogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>No blogs yet!</p>
            <Link to="/create">
              <button className="btn-primary">Create First Blog</button>
            </Link>
          </div>
        ) : (
          <div className="blog-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            {recentBlogs.map((blog) => (
              <Link to={`/blogs/${blog._id}`} key={blog._id} style={{ textDecoration: 'none', width: '100%' }}>
                <div className="glass-card blog-card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
                  {blog.image && (
                    <img
                      src={blog.image.startsWith('http') ? blog.image : `${API_BASE_URL}${blog.image}`}
                      alt={blog.title}
                      className="blog-card-image"
                    />
                  )}
                  <div className="blog-card-content" style={{ flex: 1, minHeight: 0, justifyContent: 'space-between' }}>
                    <h3 className="blog-card-title">{blog.title}</h3>
                    <p className="blog-card-meta">By {blog.authorName} • {new Date(blog.createdAt).toLocaleDateString()}</p>
                    <p className="blog-card-excerpt">{blog.description?.substring(0, 80)}...</p>
                    <div className="blog-card-footer">
                      <span className="blog-card-meta">Recent</span>
                      <span className="blog-card-readmore">Read More</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;