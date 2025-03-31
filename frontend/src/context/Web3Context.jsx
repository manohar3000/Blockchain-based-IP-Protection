import { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { InjectedConnector } from '@web3-react/injected-connector';

const Web3Context = createContext();

export function useWeb3() {
  return useContext(Web3Context);
}

// Setup the injected connector for MetaMask
export const injectedConnector = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97, 137, 80001], // Supported networks
});

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Connect to the wallet
  const connect = async () => {
    if (window.ethereum) {
      try {
        setIsConnecting(true);
        setError(null);
        
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Use BrowserProvider instead of Web3Provider for ethers.js v6
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await newProvider.getSigner();
        const network = await newProvider.getNetwork();
        const newChainId = Number(network.chainId);
        
        setAccount(accounts[0]);
        setProvider(newProvider);
        setSigner(newSigner);
        setChainId(newChainId);
        setIsConnected(true);
        
        // Save connection state
        localStorage.setItem('walletConnected', 'true');
      } catch (err) {
        console.error('Connection error:', err);
        setError(err.message || 'Failed to connect to wallet');
      } finally {
        setIsConnecting(false);
      }
    } else {
      setError('No Ethereum wallet found. Please install MetaMask.');
    }
  };

  // Disconnect from the wallet
  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setIsConnected(false);
    localStorage.removeItem('walletConnected');
  };

  // Auto-connect if previously connected
  useEffect(() => {
    const walletConnected = localStorage.getItem('walletConnected') === 'true';
    
    if (walletConnected && window.ethereum) {
      connect();
    }
  }, []);

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User has disconnected their wallet
          disconnect();
        } else if (accounts[0] !== account) {
          // Account has been changed
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = (chainIdHex) => {
        // chainId is in hex, convert to decimal
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);
        
        // Refresh the page as recommended by MetaMask
        window.location.reload();
      };

      const handleDisconnect = () => {
        disconnect();
      };

      // Subscribe to events
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      // Cleanup listeners
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      };
    }
  }, [account]);

  // Switch network function
  const switchNetwork = async (targetChainId) => {
    if (!window.ethereum) {
      setError('No Ethereum wallet found. Please install MetaMask.');
      return false;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
      return true;
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        // Chain not available, would need to add it
        setError(`Network with chainId ${targetChainId} needs to be added to your wallet.`);
      } else {
        setError(switchError.message || 'Failed to switch network');
      }
      return false;
    }
  };

  const value = {
    account,
    provider,
    signer,
    chainId,
    error,
    isConnecting,
    isConnected,
    connect,
    disconnect,
    switchNetwork,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
} 