import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '../services/api';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (videoLink) formData.append('url', videoLink);
    if (image) formData.append('image', image);
    if (video) formData.append('video', video);

    try {
      const response = await createBlog(formData);
      if (response.success) {
        navigate(`/blogs/${response.blog._id}`);
      } else {
        setError(response.message || 'Failed to create blog');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="glass-card" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: 'white', fontSize: '32px', marginBottom: '10px' }}>✏️ Create New Blog</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '30px' }}>Share your story with the world</p>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', borderRadius: '12px', padding: '12px', marginBottom: '20px', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label className="glass-label">📌 Title</label>
            <input type="text" className="glass-input" placeholder="Enter blog title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="glass-label">📝 Description</label>
            <textarea className="glass-input" rows="6" placeholder="Write your blog content here..." value={description} onChange={(e) => setDescription(e.target.value)} required style={{ resize: 'vertical' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="glass-label">🔗 YouTube Video Link (Optional)</label>
            <input type="url" className="glass-input" placeholder="https://youtube.com/watch?v=..." value={videoLink} onChange={(e) => setVideoLink(e.target.value)} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="glass-label">🖼️ Upload Image (Optional)</label>
            <input type="file" className="glass-input" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ padding: '10px' }} />
          </div>

          {/* <div style={{ marginBottom: '25px' }}>
            <label className="glass-label">🎥 Upload Video (Optional)</label>
            <input type="file" className="glass-input" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} style={{ padding: '10px' }} />
          </div> */}

          <div style={{ display: 'flex', gap: '15px' }}>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Creating...' : '🚀 Publish Blog'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/blogs')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;