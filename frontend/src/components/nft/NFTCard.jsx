import { useState } from 'react';
import { 
  FiClock, 
  FiCheck, 
  FiX, 
  FiLoader, 
  FiExternalLink, 
  FiDownload, 
  FiShare2 
} from 'react-icons/fi';
import { formatDate, formatTimeAgo, formatAddress } from '../../utils/formatters';
import { getIPFSUrl } from '../../utils/ipfsService';
import './NFTCard.css';

export default function NFTCard({ asset }) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Get status icon and color based on verification status
  const getStatusIndicator = () => {
    switch (asset.status) {
      case 'Verified':
        return { icon: <FiCheck />, color: '#10b981' };
      case 'Pending':
        return { icon: <FiLoader />, color: '#f59e0b' };
      case 'Under Review':
        return { icon: <FiClock />, color: '#6366f1' };
      default:
        return { icon: <FiX />, color: '#ef4444' };
    }
  };
  
  const statusIndicator = getStatusIndicator();

  return (
    <div className={`nft-card ${showDetails ? 'expanded' : ''}`}>
      <div className="card-content">
        {/* Preview/Thumbnail */}
        <div className="nft-preview">
          <img 
            src={asset.previewUrl || 'https://via.placeholder.com/300x200'} 
            alt={asset.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Preview';
            }}
          />
          <div className="status-badge" style={{ backgroundColor: statusIndicator.color }}>
            {statusIndicator.icon}
            <span>{asset.status}</span>
          </div>
        </div>
        
        {/* Basic Info */}
        <div className="nft-info">
          <h3 className="nft-title">{asset.title}</h3>
          <p className="nft-description">{asset.description}</p>
          
          <div className="nft-metadata">
            <div className="metadata-item">
              <span className="label">Type</span>
              <span className="value">{asset.type}</span>
            </div>
            <div className="metadata-item">
              <span className="label">Created</span>
              <span className="value" title={formatDate(asset.timestamp, true)}>
                {formatTimeAgo(asset.timestamp)}
              </span>
            </div>
            <div className="metadata-item">
              <span className="label">Owner</span>
              <span className="value">{formatAddress(asset.owner)}</span>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="nft-actions">
          <button 
            className="action-btn details-btn"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
          
          <div className="action-icons">
            <a 
              href={getIPFSUrl(asset.ipfsHash)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="icon-btn"
              title="View on IPFS"
            >
              <FiExternalLink />
            </a>
            <button className="icon-btn" title="Download Certificate">
              <FiDownload />
            </button>
            <button className="icon-btn" title="Share">
              <FiShare2 />
            </button>
          </div>
        </div>
      </div>
      
      {/* Extended Details */}
      {showDetails && (
        <div className="nft-details">
          <div className="details-grid">
            <div className="detail-item">
              <h4>IPFS Hash</h4>
              <p className="hash">{asset.ipfsHash}</p>
            </div>
            <div className="detail-item">
              <h4>Transaction Hash</h4>
              <p className="hash">{asset.txHash}</p>
            </div>
            <div className="detail-item">
              <h4>Timestamp</h4>
              <p>{formatDate(asset.timestamp, true)}</p>
            </div>
            <div className="detail-item">
              <h4>Registration Date</h4>
              <p>{formatDate(asset.timestamp)}</p>
            </div>
          </div>
          
          <div className="verification-info">
            <div className="verification-header">
              <div className="verification-status" style={{ color: statusIndicator.color }}>
                {statusIndicator.icon}
                <span>{asset.status}</span>
              </div>
              <h4>Verification Details</h4>
            </div>
            <p>
              This intellectual property has been registered on the blockchain and can be 
              verified using the transaction hash and IPFS content identifier.
            </p>
          </div>
          
          <div className="certificate-link">
            <a 
              href={`/certificate/${asset.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              View Full Certificate
            </a>
          </div>
        </div>
      )}
    </div>
  );
}