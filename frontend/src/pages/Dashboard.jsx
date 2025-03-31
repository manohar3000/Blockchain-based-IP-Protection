import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useWeb3 } from '../context/Web3Context';
import NFTCard from '../components/nft/NFTCard';
import { formatDate, formatTimeAgo } from '../utils/formatters';
import { FiPlus, FiAlertCircle, FiRefreshCw, FiGrid, FiList, FiLoader } from 'react-icons/fi';
import './Dashboard.css';

export default function Dashboard() {
  const { userData, ipAssets, isLoading, error, fetchUserIPAssets } = useUser();
  const { isConnected } = useWeb3();
  const [viewMode, setViewMode] = useState('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle manual refresh of IP assets
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUserIPAssets();
    setIsRefreshing(false);
  };

  // Render empty state when no assets are available
  const renderEmptyState = () => (
    <div className="empty-state">
      <div className="empty-icon">🖼️</div>
      <h2>No Intellectual Property Found</h2>
      <p>You don't have any IP assets registered yet. Start by protecting your creations.</p>
      <Link to="/submit" className="btn btn-primary">
        <FiPlus />
        Submit New IP
      </Link>
    </div>
  );

  // Render content based on loading and connection state
  const renderContent = () => {
    if (!isConnected) {
      return (
        <div className="connect-wallet-message">
          <FiAlertCircle />
          <p>Please connect your wallet to view your dashboard</p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="loading-state">
          <FiLoader className="spinner" />
          <p>Loading your intellectual property assets...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-state">
          <FiAlertCircle />
          <p>{error}</p>
          <button className="btn btn-outline" onClick={handleRefresh}>
            Try Again
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="dashboard-header">
          <div className="user-welcome">
            <h1>Welcome, {userData?.username || 'Creator'}</h1>
            <p>Manage and monitor your intellectual property portfolio</p>
          </div>
          
          <div className="action-buttons">
            <button
              className="btn btn-outline refresh-btn"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <FiRefreshCw className={isRefreshing ? 'spinning' : ''} />
              Refresh
            </button>
            
            <Link to="/submit" className="btn btn-primary">
              <FiPlus />
              Submit New IP
            </Link>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Assets</h3>
            <div className="stat-value">{ipAssets.length}</div>
          </div>
          
          <div className="stat-card">
            <h3>Verified Assets</h3>
            <div className="stat-value">
              {ipAssets.filter(asset => asset.status === 'Verified').length}
            </div>
          </div>
          
          <div className="stat-card">
            <h3>Pending Verification</h3>
            <div className="stat-value">
              {ipAssets.filter(asset => asset.status === 'Pending').length}
            </div>
          </div>
          
          <div className="stat-card">
            <h3>Under Review</h3>
            <div className="stat-value">
              {ipAssets.filter(asset => asset.status === 'Under Review').length}
            </div>
          </div>
        </div>

        <div className="assets-section">
          <div className="section-header">
            <h2>Your Protected Assets</h2>
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <FiGrid />
              </button>
              <button
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <FiList />
              </button>
            </div>
          </div>
          
          {ipAssets.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className={`assets-container ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
              {ipAssets.map((asset) => (
                <NFTCard key={asset.id} asset={asset} />
              ))}
            </div>
          )}
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          {ipAssets.length > 0 ? (
            <div className="activity-list">
              {ipAssets.slice(0, 5).map((asset) => (
                <div key={`activity-${asset.id}`} className="activity-item">
                  <div className="activity-icon">
                    {asset.status === 'Verified' && '✅'}
                    {asset.status === 'Pending' && '⏳'}
                    {asset.status === 'Under Review' && '🔍'}
                  </div>
                  <div className="activity-details">
                    <h4>{asset.title}</h4>
                    <p>Status: {asset.status}</p>
                  </div>
                  <div className="activity-time">
                    {formatTimeAgo(asset.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-activity">No recent activity yet.</p>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="dashboard-page">
      {renderContent()}
    </div>
  );
} 