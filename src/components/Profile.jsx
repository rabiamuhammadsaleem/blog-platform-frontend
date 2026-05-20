import React, { useState, useEffect } from 'react';
import { updateProfile, API_BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    if (profilePicture) formData.append('profilePicture', profilePicture);

    try {
      const response = await updateProfile(formData);
      if (response.success) {
        setMessage('Profile updated successfully!');
        if (setUser) setUser(response.user);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="glass-card" style={{ padding: '32px', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '18px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '30px', marginBottom: '6px' }}>👤 My Profile</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '6px' }}>Personal details at a glance</p>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Tap update to edit your profile.</p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowEdit((prev) => !prev)}
            style={{ minWidth: '180px' }}
          >
            {showEdit ? 'Close Profile Form' : '+ Update Profile'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '20px', alignItems: 'start', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '22px', overflow: 'hidden', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.18)' }}>
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture.startsWith('http') ? user.profilePicture : `${API_BASE_URL}${user.profilePicture}`}
                  alt="Profile"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <span style={{ color: 'white', fontSize: '32px', fontWeight: 700 }}>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              )}
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '14px' }}>
              <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '8px', fontWeight: 600 }}>Name</p>
              <p style={{ color: 'white', fontSize: '18px', margin: 0 }}>{user?.name || 'No name set'}</p>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '8px', fontWeight: 600 }}>Email</p>
              <p style={{ color: 'white', fontSize: '16px', margin: 0 }}>{user?.email || 'No email available'}</p>
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '8px', fontWeight: 600 }}>Bio</p>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', margin: 0, minHeight: '42px' }}>{user?.bio || 'Add a short bio to show who you are.'}</p>
            </div>
          </div>
        </div>

        {showEdit && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.14)', paddingTop: '26px' }}>
            <h2 style={{ color: 'white', fontSize: '24px', marginBottom: '18px' }}>Update Profile</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label className="glass-label">👤 Full Name</label>
                <input type="text" className="glass-input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label className="glass-label">📝 Bio</label>
                <textarea className="glass-input" rows="4" placeholder="Write something about yourself..." value={bio} onChange={(e) => setBio(e.target.value)} style={{ resize: 'vertical' }} />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label className="glass-label">🖼️ Profile Picture</label>
                <input type="file" className="glass-input" accept="image/*" onChange={(e) => setProfilePicture(e.target.files[0])} style={{ padding: '10px' }} />
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Saving...' : '💾 Save Profile'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;