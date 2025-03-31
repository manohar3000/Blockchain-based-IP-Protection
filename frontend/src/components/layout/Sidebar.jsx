import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../../context/Web3Context';
import { useUser } from '../../context/UserContext';
import { 
  FiHome, 
  FiGrid, 
  FiUpload, 
  FiImage, 
  FiUser, 
  FiSettings, 
  FiHelpCircle, 
  FiChevronLeft, 
  FiChevronRight 
} from 'react-icons/fi';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const { isConnected } = useWeb3();
  const { userData } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  // Navigation items with their icons
  const navItems = [
    { title: 'Home', path: '/', icon: <FiHome /> },
    { title: 'Dashboard', path: '/dashboard', icon: <FiGrid /> },
    { title: 'Submit IP', path: '/submit', icon: <FiUpload /> },
    { title: 'NFT Gallery', path: '/gallery', icon: <FiImage /> },
    { title: 'Profile', path: '/profile', icon: <FiUser /> },
  ];

  // If the user is on the landing page, don't show the sidebar
  if (location.pathname === '/') {
    return null;
  }

  return (
    <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <h2 className="sidebar-title">IP Shield</h2>}
        <button 
          className="collapse-btn" 
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      {isConnected && userData && !collapsed && (
        <div className="user-info">
          <div className="user-avatar">
            <img src={userData.avatar} alt="User avatar" />
          </div>
          <div className="user-details">
            <h3 className="user-name">{userData.username}</h3>
            <p className="user-address">{userData.address.substring(0, 6)}...{userData.address.substring(userData.address.length - 4)}</p>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        <ul className="nav-items">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={location.pathname === item.path ? 'active' : ''}
                title={collapsed ? item.title : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {!collapsed && <span className="nav-title">{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <Link to="/settings" title={collapsed ? 'Settings' : ''}>
          <FiSettings />
          {!collapsed && <span>Settings</span>}
        </Link>
        <Link to="/help" title={collapsed ? 'Help & Support' : ''}>
          <FiHelpCircle />
          {!collapsed && <span>Help & Support</span>}
        </Link>
      </div>
    </aside>
  );
} 