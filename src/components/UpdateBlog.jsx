import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById, updateBlog } from '../services/api';

const UpdateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await getBlogById(id);
      if (response.success) {
        setTitle(response.blog.title);
        setDescription(response.blog.description);
        setVideoLink(response.blog.videoLink || '');
      } else {
        setError('Blog not found');
      }
    } catch (err) {
      setError('Failed to load blog');
    } finally {
      setFetching(false);
    }
  };

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
      const response = await updateBlog(id, formData);
      if (response.success) {
        navigate(`/blogs/${id}`);
      } else {
        setError(response.message || 'Failed to update blog');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Loading blog...</div>;
  }

  if (error && !title) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>{error}</div>;
  }

  return (
    <div className="fade-in">
      <div className="glass-card" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: 'white', fontSize: '32px', marginBottom: '10px' }}>✏️ Update Blog</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '30px' }}>Edit your blog content</p>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', borderRadius: '12px', padding: '12px', marginBottom: '20px', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label className="glass-label">📌 Title</label>
            <input type="text" className="glass-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="glass-label">📝 Description</label>
            <textarea className="glass-input" rows="6" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ resize: 'vertical' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="glass-label">🔗 YouTube Video Link (Optional)</label>
            <input type="url" className="glass-input" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="glass-label">🖼️ Change Image (Optional)</label>
            <input type="file" className="glass-input" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ padding: '10px' }} />
          </div>


          <div style={{ display: 'flex', gap: '15px' }}>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Updating...' : '💾 Update Blog'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate(`/blogs/${id}`)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBlog;