import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useWeb3 } from '../context/Web3Context';
import { formatAddress, formatDate, getExplorerAddressLink } from '../utils/formatters';
import { FiUser, FiEdit2, FiSave, FiExternalLink, FiAlertCircle, FiLoader } from 'react-icons/fi';
import './ProfilePage.css';

export default function ProfilePage() {
  const { userData, isLoading, updateUserProfile } = useUser();
  const { isConnected, account, chainId } = useWeb3();
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);
  
  // Start editing profile
  const handleEdit = () => {
    setUsername(userData?.username || '');
    setIsEditing(true);
    setEditError(null);
    setEditSuccess(false);
  };
  
  // Save profile changes
  const handleSave = async () => {
    if (!username.trim()) {
      setEditError('Username cannot be empty');
      return;
    }
    
    setEditLoading(true);
    setEditError(null);
    
    try {
      const success = await updateUserProfile({ username });
      
      if (success) {
        setEditSuccess(true);
        setIsEditing(false);
        
        // Reset success message after a few seconds
        setTimeout(() => {
          setEditSuccess(false);
        }, 3000);
      } else {
        setEditError('Failed to update profile');
      }
    } catch (err) {
      setEditError('An error occurred while updating profile');
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };
  
  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setEditError(null);
  };
  
  // Render content based on connection and loading state
  const renderContent = () => {
    if (!isConnected) {
      return (
        <div className="connect-message">
          <FiAlertCircle />
          <p>Please connect your wallet to view your profile</p>
        </div>
      );
    }
    
    if (isLoading) {
      return (
        <div className="loading-state">
          <FiLoader className="spinner" />
          <p>Loading profile information...</p>
        </div>
      );
    }
    
    return (
      <>
        <div className="profile-header">
          <div className="profile-avatar">
            {userData?.avatar ? (
              <img src={userData.avatar} alt="Avatar" />
            ) : (
              <FiUser className="avatar-placeholder" />
            )}
          </div>
          
          <div className="profile-info">
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter a username"
                  />
                </div>
                
                {editError && (
                  <div className="edit-error">{editError}</div>
                )}
                
                <div className="edit-actions">
                  <button className="btn btn-outline" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={editLoading}
                  >
                    {editLoading ? (
                      <>
                        <FiLoader className="spinner" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="profile-name">{userData?.username || 'Anonymous User'}</h1>
                <div className="profile-address">
                  {formatAddress(account, false)}
                  <a 
                    href={getExplorerAddressLink(account, chainId)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="explorer-link"
                  >
                    <FiExternalLink />
                  </a>
                </div>
                
                <div className="profile-actions">
                  <button className="btn btn-outline" onClick={handleEdit}>
                    <FiEdit2 />
                    Edit Profile
                  </button>
                </div>
                
                {editSuccess && (
                  <div className="edit-success">
                    Profile updated successfully!
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Assets</h3>
            <div className="stat-value">{userData?.totalAssets || 0}</div>
          </div>
          
          <div className="stat-card">
            <h3>Reputation</h3>
            <div className="stat-value">{userData?.reputation || 0}</div>
          </div>
          
          <div className="stat-card">
            <h3>Member Since</h3>
            <div className="stat-value">
              {userData?.dateJoined ? formatDate(userData.dateJoined) : 'Unknown'}
            </div>
          </div>
        </div>
        
        <div className="profile-section">
          <h2>Account Security</h2>
          <div className="security-info">
            <p>Your profile is secured by your Ethereum wallet. To change your account password or recovery options, please use your wallet provider's security settings.</p>
          </div>
        </div>
        
        <div className="profile-section">
          <h2>Privacy Settings</h2>
          <div className="privacy-settings">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Public Profile</h3>
                <p>Allow others to see your profile and intellectual property assets</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={true} readOnly />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h3>Email Notifications</h3>
                <p>Receive email updates about your intellectual property</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={false} readOnly />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  return (
    <div className="profile-page">
      {renderContent()}
    </div>
  );
} 