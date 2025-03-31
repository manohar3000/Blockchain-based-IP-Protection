import { ethers } from 'ethers';

// This would be your deployed contract ABI (Application Binary Interface)
// For simplicity, we're using a mock ABI with the core functions we need
const IPProtectionABI = [
  // Certificate/NFT Minting function
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "contentHash",
        "type": "bytes32"
      }
    ],
    "name": "mintCertificate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Get certificate details
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getCertificateDetails",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "bytes32",
            "name": "contentHash",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "tokenURI",
            "type": "string"
          }
        ],
        "internalType": "struct IPProtection.Certificate",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Get certificates owned by a user
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "getOwnedCertificates",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Verify certificate ownership
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "verifyOwnership",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Mock contract addresses for different networks
const CONTRACT_ADDRESSES = {
  1: '0x0000000000000000000000000000000000000000', // Ethereum Mainnet
  3: '0x0000000000000000000000000000000000000000', // Ropsten
  4: '0x0000000000000000000000000000000000000000', // Rinkeby
  5: '0x0000000000000000000000000000000000000000', // Goerli
  42: '0x0000000000000000000000000000000000000000', // Kovan
  56: '0x0000000000000000000000000000000000000000', // BSC Mainnet
  97: '0x0000000000000000000000000000000000000000', // BSC Testnet
  137: '0x0000000000000000000000000000000000000000', // Polygon Mainnet
  80001: '0x0000000000000000000000000000000000000000', // Polygon Mumbai
};

/**
 * Get contract instance based on the current network
 * @param {Object} provider - Web3 provider
 * @param {number} chainId - Current chain ID
 * @returns {Object} - Contract instance
 */
export const getContractInstance = async (provider, chainId) => {
  const contractAddress = CONTRACT_ADDRESSES[chainId];
  
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    throw new Error(`No contract deployed on chain ID ${chainId}`);
  }
  
  // Updated for ethers.js v6
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, IPProtectionABI, signer);
};

/**
 * Calculate content hash for a file
 * @param {File} file - The file to hash
 * @returns {Promise<string>} - The hex string of the file hash
 */
export const calculateContentHash = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const buffer = event.target.result;
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        resolve(hashHex);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Mint an IP Certificate NFT
 * @param {Object} contract - Contract instance
 * @param {string} tokenURI - IPFS URI for the metadata
 * @param {string} contentHash - Hash of the content
 * @returns {Promise<Object>} - Transaction receipt
 */
export const mintCertificate = async (contract, tokenURI, contentHash) => {
  try {
    // For development, return a mock transaction
    if (!contract || process.env.NODE_ENV === 'development') {
      return mockMintCertificate(tokenURI, contentHash);
    }
    
    const tx = await contract.mintCertificate(tokenURI, contentHash);
    return await tx.wait();
  } catch (error) {
    console.error('Error minting certificate:', error);
    throw new Error('Failed to mint IP certificate');
  }
};

/**
 * Mock function for minting a certificate during development
 * @param {string} tokenURI - IPFS URI for the metadata
 * @param {string} contentHash - Hash of the content
 * @returns {Promise<Object>} - Mock transaction receipt
 */
const mockMintCertificate = async (tokenURI, contentHash) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tokenId = Math.floor(Math.random() * 1000000);
      
      resolve({
        tokenId,
        transactionHash: `0x${Array(64).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        blockNumber: Math.floor(Math.random() * 1000000),
        timestamp: Math.floor(Date.now() / 1000),
        status: 1 // success
      });
    }, 2000); // Simulate blockchain delay
  });
};

/**
 * Get certificates owned by the current user
 * @param {Object} contract - Contract instance
 * @param {string} address - User's wallet address
 * @returns {Promise<Array>} - List of owned certificates
 */
export const getOwnedCertificates = async (contract, address) => {
  try {
    // For development, return mock certificates
    if (!contract || process.env.NODE_ENV === 'development') {
      return mockGetOwnedCertificates(address);
    }
    
    const tokenIds = await contract.getOwnedCertificates(address);
    
    // Fetch details for each certificate
    const certificatesPromises = tokenIds.map(async (id) => {
      const details = await contract.getCertificateDetails(id);
      return {
        id: id.toString(),
        owner: details.owner,
        contentHash: details.contentHash,
        timestamp: new Date(details.timestamp * 1000).toISOString(),
        tokenURI: details.tokenURI
      };
    });
    
    return Promise.all(certificatesPromises);
  } catch (error) {
    console.error('Error getting owned certificates:', error);
    throw new Error('Failed to fetch owned certificates');
  }
};

/**
 * Mock function for fetching owned certificates during development
 * @param {string} address - User's wallet address
 * @returns {Promise<Array>} - List of mock certificates
 */
const mockGetOwnedCertificates = async (address) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockCertificates = Array(5).fill().map((_, i) => ({
        id: `${i + 1}`,
        owner: address,
        contentHash: `0x${Array(64).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        tokenURI: `ipfs://Qm${Array(44).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`
      }));
      
      resolve(mockCertificates);
    }, 1500); // Simulate blockchain delay
  });
};

/**
 * Verify ownership of a certificate
 * @param {Object} contract - Contract instance
 * @param {string} tokenId - ID of the certificate token
 * @param {string} address - Address to verify
 * @returns {Promise<boolean>} - Whether the address owns the certificate
 */
export const verifyOwnership = async (contract, tokenId, address) => {
  try {
    // For development, return a mock result
    if (!contract || process.env.NODE_ENV === 'development') {
      return Promise.resolve(true);
    }
    
    return await contract.verifyOwnership(tokenId, address);
  } catch (error) {
    console.error('Error verifying ownership:', error);
    throw new Error('Failed to verify certificate ownership');
  }
};

export default {
  getContractInstance,
  calculateContentHash,
  mintCertificate,
  getOwnedCertificates,
  verifyOwnership
}; 