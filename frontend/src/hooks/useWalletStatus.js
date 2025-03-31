import { useState, useEffect } from 'react';
import { FiCreditCard, FiX, FiLoader, FiCopy, FiExternalLink, FiLogOut } from 'react-icons/fi';
import { useWeb3 } from '../context/Web3Context';
import { formatAddress } from '../utils/formatters';

export default function useWalletStatus() {
  const { account, chainId, isConnected, isConnecting, error, connect, disconnect } = useWeb3();
  const [formattedAddress, setFormattedAddress] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [statusMessage, setStatusMessage] = useState('');

  const SEPOLIA_CHAIN_ID = 11155111;
  const SEPOLIA_NETWORK_NAME = 'Sepolia Testnet';
  const SEPOLIA_COLOR = '#f6c343';

  useEffect(() => {
    setFormattedAddress(account ? formatAddress(account) : '');
  }, [account]);

  useEffect(() => {
    if (isConnecting) {
      setConnectionStatus('connecting');
      setStatusMessage('Connecting to wallet...');
    } else if (error) {
      setConnectionStatus('error');
      setStatusMessage(error);
    } else if (isConnected && account) {
      setConnectionStatus('connected');
      setStatusMessage(`Connected to ${SEPOLIA_NETWORK_NAME}`);
    } else {
      setConnectionStatus('disconnected');
      setStatusMessage('Wallet not connected');
    }
  }, [isConnected, isConnecting, error, account]);

  const getNetworkColor = () => (chainId === SEPOLIA_CHAIN_ID ? SEPOLIA_COLOR : '#6b7280');

  return {
    account,
    chainId,
    networkName: SEPOLIA_NETWORK_NAME,
    formattedAddress,
    connectionStatus,
    statusMessage,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    getNetworkColor,
  };
}