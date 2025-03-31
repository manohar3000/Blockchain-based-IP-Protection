import { createContext, useState, useEffect, useContext } from 'react';
import { useWeb3 } from './Web3Context';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const { account, isConnected } = useWeb3();
  const [userData, setUserData] = useState(null);
  const [ipAssets, setIpAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user data when wallet is connected
  useEffect(() => {
    if (isConnected && account) {
      fetchUserData();
      fetchUserIPAssets();
    } else {
      // Clear user data when disconnected
      setUserData(null);
      setIpAssets([]);
    }
  }, [account, isConnected]);

  // Mock function to fetch user data - would be replaced with actual API calls
  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulating API fetch with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data for demo
      const mockUserData = {
        address: account,
        username: `user_${account.substring(2, 8)}`,
        avatar: `https://avatars.dicebear.com/api/identicon/${account}.svg`,
        dateJoined: new Date().toISOString(),
        totalAssets: Math.floor(Math.random() * 10),
        reputation: Math.floor(Math.random() * 100),
      };
      
      setUserData(mockUserData);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock function to fetch user's IP assets - would be replaced with blockchain calls
  const fetchUserIPAssets = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulating blockchain data fetch with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock IP assets for demo
      const mockIPAssets = Array(5).fill().map((_, i) => ({
        id: `asset-${i}-${Date.now()}`,
        title: `IP Asset ${i + 1}`,
        description: `Description for IP asset ${i + 1}. This is a sample intellectual property asset registered on the blockchain.`,
        type: ['Document', 'Image', 'Code', 'Audio', 'Video'][Math.floor(Math.random() * 5)],
        timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        txHash: `0x${Array(64).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        ipfsHash: `Qm${Array(44).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        previewUrl: `https://picsum.photos/seed/${i + 1}/300/200`,
        owner: account,
        status: ['Verified', 'Pending', 'Under Review'][Math.floor(Math.random() * 3)],
      }));
      
      setIpAssets(mockIPAssets);
    } catch (err) {
      console.error('Error fetching IP assets:', err);
      setError('Failed to load your IP assets. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update user profile
  const updateUserProfile = async (updatedData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulating API update with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the user data with the new values
      setUserData(prevData => ({
        ...prevData,
        ...updatedData
      }));
      
      return true;
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError('Failed to update user profile. Please try again later.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new IP asset
  const addIpAsset = (newAsset) => {
    setIpAssets(prevAssets => [newAsset, ...prevAssets]);
  };

  const value = {
    userData,
    ipAssets,
    isLoading,
    error,
    updateUserProfile,
    fetchUserData,
    fetchUserIPAssets,
    addIpAsset
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
} 