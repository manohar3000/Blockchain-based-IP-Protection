import { useNavigate } from 'react-router-dom';
import { FiShield, FiUploadCloud, FiClock, FiLock, FiDatabase, FiGlobe } from 'react-icons/fi';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Protect Your Intellectual Property with Blockchain Technology
            </h1>
            <p className="hero-description">
              Secure, timestamp, and verify your creative works and ideas using decentralized 
              storage and immutable blockchain records. Get digital certificates as proof of 
              ownership.
            </p>
            <div className="hero-actions">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/submit')}
              >
                Protect Your IP Now
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => navigate('/gallery')}
              >
                View NFT Gallery
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-wrapper">
              <img src="https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80" alt="Blockchain IP Protection" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">
              Our platform provides a seamless way to protect your intellectual property using 
              blockchain technology and decentralized storage.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FiUploadCloud />
              </div>
              <h3 className="feature-title">Upload Your Work</h3>
              <p className="feature-description">
                Easily upload your documents, images, code, or any digital content you want to protect.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FiDatabase />
              </div>
              <h3 className="feature-title">Secure Storage on IPFS</h3>
              <p className="feature-description">
                Your files are stored securely on IPFS, a decentralized storage system with content addressing.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FiClock />
              </div>
              <h3 className="feature-title">Timestamped Records</h3>
              <p className="feature-description">
                Each submission is timestamped and recorded on the blockchain, providing irrefutable proof of existence.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FiShield />
              </div>
              <h3 className="feature-title">Digital Certificates</h3>
              <p className="feature-description">
                Receive an NFT certificate as proof of ownership that can be verified by anyone.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FiLock />
              </div>
              <h3 className="feature-title">Ownership Verification</h3>
              <p className="feature-description">
                Easily verify ownership and prove the existence of your work at a specific point in time.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FiGlobe />
              </div>
              <h3 className="feature-title">Global Access</h3>
              <p className="feature-description">
                Your certificates and protected works can be accessed and verified from anywhere in the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Simple 3-Step Process</h2>
            <p className="section-description">
              Protecting your intellectual property is quick and easy with our platform.
            </p>
          </div>

          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3 className="step-title">Connect Your Wallet</h3>
              <p className="step-description">
                Connect your Ethereum wallet to authenticate and manage your digital assets.
              </p>
            </div>
            
            <div className="step-divider"></div>
            
            <div className="process-step">
              <div className="step-number">2</div>
              <h3 className="step-title">Upload Your Content</h3>
              <p className="step-description">
                Upload your file and add metadata to describe your intellectual property.
              </p>
            </div>
            
            <div className="step-divider"></div>
            
            <div className="process-step">
              <div className="step-number">3</div>
              <h3 className="step-title">Mint Your Certificate</h3>
              <p className="step-description">
                Confirm the transaction to mint your NFT certificate and secure your IP on the blockchain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Protect Your Intellectual Property?</h2>
            <p className="cta-description">
              Start securing your creative works and ideas on the blockchain today.
            </p>
            <button 
              className="btn btn-primary cta-btn"
              onClick={() => navigate('/submit')}
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 