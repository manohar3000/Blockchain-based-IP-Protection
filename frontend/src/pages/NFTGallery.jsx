import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import NFTCard from '../components/nft/NFTCard';
import { FiSearch, FiFilter, FiRefreshCw, FiLoader, FiX } from 'react-icons/fi';
import './NFTGallery.css';

export default function NFTGallery() {
  const { ipAssets, isLoading, error } = useUser();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filteredAssets, setFilteredAssets] = useState([]);
  
  // Filter types available for the gallery
  const assetTypes = ['Document', 'Image', 'Code', 'Audio', 'Video'];
  const statusTypes = ['Verified', 'Pending', 'Under Review'];
  
  // Apply filters and search
  useEffect(() => {
    let result = [...ipAssets];
    
    // Apply type filter
    if (filterType !== 'all') {
      result = result.filter(asset => asset.type === filterType);
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(asset => asset.status === filterStatus);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(asset => 
        asset.title.toLowerCase().includes(query) ||
        (asset.description && asset.description.toLowerCase().includes(query))
      );
    }
    
    setFilteredAssets(result);
  }, [ipAssets, searchQuery, filterType, filterStatus]);
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterStatus('all');
    setIsSearchOpen(false);
    setIsFiltersOpen(false);
  };
  
  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchOpen(false);
  };
  
  return (
    <div className="nft-gallery-page">
      <div className="gallery-header">
        <div className="header-content">
          <h1>NFT Gallery</h1>
          <p>Browse intellectual property certificates stored on the blockchain</p>
        </div>
        
        <div className="gallery-actions">
          <button 
            className={`action-btn search-btn ${isSearchOpen ? 'active' : ''}`}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <FiSearch />
            <span className="btn-text">Search</span>
          </button>
          
          <button 
            className={`action-btn filter-btn ${isFiltersOpen ? 'active' : ''}`}
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <FiFilter />
            <span className="btn-text">Filter</span>
            {(filterType !== 'all' || filterStatus !== 'all') && (
              <span className="filter-badge"></span>
            )}
          </button>
        </div>
      </div>
      
      {isSearchOpen && (
        <div className="search-container">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or description..."
                className="search-input"
                autoFocus
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className="clear-search" 
                  onClick={() => setSearchQuery('')}
                >
                  <FiX />
                </button>
              )}
            </div>
            <button type="submit" className="search-submit">Search</button>
          </form>
        </div>
      )}
      
      {isFiltersOpen && (
        <div className="filters-container">
          <div className="filter-section">
            <h3>Filter by Type</h3>
            <div className="filter-options">
              <button 
                className={`filter-option ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                All Types
              </button>
              {assetTypes.map(type => (
                <button 
                  key={type}
                  className={`filter-option ${filterType === type ? 'active' : ''}`}
                  onClick={() => setFilterType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-section">
            <h3>Filter by Status</h3>
            <div className="filter-options">
              <button 
                className={`filter-option ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                All Status
              </button>
              {statusTypes.map(status => (
                <button 
                  key={status}
                  className={`filter-option ${filterStatus === status ? 'active' : ''}`}
                  onClick={() => setFilterStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-actions">
            <button className="clear-filters" onClick={clearFilters}>
              Clear All Filters
            </button>
            <button className="apply-filters" onClick={() => setIsFiltersOpen(false)}>
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      {(filterType !== 'all' || filterStatus !== 'all' || searchQuery) && (
        <div className="active-filters">
          <div className="filters-summary">
            <span>Active Filters:</span>
            {filterType !== 'all' && (
              <div className="filter-tag">
                Type: {filterType}
                <button onClick={() => setFilterType('all')}>
                  <FiX />
                </button>
              </div>
            )}
            {filterStatus !== 'all' && (
              <div className="filter-tag">
                Status: {filterStatus}
                <button onClick={() => setFilterStatus('all')}>
                  <FiX />
                </button>
              </div>
            )}
            {searchQuery && (
              <div className="filter-tag">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery('')}>
                  <FiX />
                </button>
              </div>
            )}
          </div>
          <button className="clear-all-btn" onClick={clearFilters}>
            Clear All
          </button>
        </div>
      )}
      
      <div className="gallery-results">
        <div className="results-header">
          <p className="results-count">
            Showing {filteredAssets.length} of {ipAssets.length} NFTs
          </p>
        </div>
        
        {isLoading ? (
          <div className="loading-state">
            <FiLoader className="loading-icon" />
            <p>Loading NFT gallery...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button className="retry-btn" onClick={() => navigate(0)}>
              <FiRefreshCw /> Retry
            </button>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="empty-state">
            <p>No intellectual property certificates found matching your criteria.</p>
            {(filterType !== 'all' || filterStatus !== 'all' || searchQuery) && (
              <button className="clear-btn" onClick={clearFilters}>
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="nft-grid">
            {filteredAssets.map(asset => (
              <NFTCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 