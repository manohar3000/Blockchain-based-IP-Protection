import { useState } from 'react';
import { FiCreditCard, FiX, FiLoader, FiCopy, FiExternalLink, FiLogOut } from 'react-icons/fi';
import useWalletStatus from '../../hooks/useWalletStatus';
import './WalletButton.css';

export default function WalletButton() {
  const { connect, disconnect, isConnected, isConnecting, error, formattedAddress, networkName, getNetworkColor } = useWalletStatus();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleConnectWallet = () => (isConnected ? setIsDropdownOpen(!isDropdownOpen) : connect());

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(formattedAddress).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleDisconnect = () => {
    disconnect();
    setIsDropdownOpen(false);
  };

  return (
    <div className="wallet-container">
      <button
        className={`wallet-button ${isConnected ? 'connected' : ''} ${error ? 'error' : ''}`}
        onClick={handleConnectWallet}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <FiLoader className="spinner" />
            <span>Connecting...</span>
          </>
        ) : error ? (
          <>
            <FiX />
            <span>Error</span>
          </>
        ) : isConnected ? (
          <>
            <span className="network-indicator" style={{ backgroundColor: getNetworkColor() }}></span>
            <span>{formattedAddress}</span>
          </>
        ) : (
          <>
            <FiCreditCard />
            <span>Connect Wallet</span>
          </>
        )}
      </button>

      {isDropdownOpen && isConnected && (
        <div className="wallet-dropdown">
          <div className="dropdown-header">
            <span className="network-name">{networkName}</span>
            <span className="address">{formattedAddress}</span>
          </div>
          <div className="dropdown-actions">
            <button className="dropdown-btn" onClick={handleCopyAddress}>
              <FiCopy />
              <span>{copySuccess ? 'Copied!' : 'Copy Address'}</span>
            </button>
            <a
              href={`https://sepolia.etherscan.io/address/${formattedAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="dropdown-btn"
            >
              <FiExternalLink />
              <span>View on Explorer</span>
            </a>
            <button className="dropdown-btn disconnect" onClick={handleDisconnect}>
              <FiLogOut />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}