import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiMail, FiExternalLink } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="container footer-container">
        <div className="footer-section">
          <h3 className="footer-title">IP Shield</h3>
          <p className="footer-description">
            Secure your intellectual property with blockchain-based protection.
            Upload, verify, and prove ownership with timestamped digital certificates.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/submit">Submit IP</Link></li>
            <li><Link to="/gallery">NFT Gallery</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Resources</h4>
          <ul className="footer-links">
            <li><a href="#" target="_blank" rel="noopener noreferrer">Documentation <FiExternalLink size={12} /></a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer">API <FiExternalLink size={12} /></a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer">Smart Contracts <FiExternalLink size={12} /></a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer">Whitepaper <FiExternalLink size={12} /></a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Connect</h4>
          <div className="social-links">
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FiGithub />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FiTwitter />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FiLinkedin />
            </a>
            <a href="mailto:contact@ipshield.io" aria-label="Email">
              <FiMail />
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p className="copyright">
            &copy; {currentYear} IP Shield. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 