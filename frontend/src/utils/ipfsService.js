import { create } from 'ipfs-http-client';

// Configure IPFS client
// Note: For a production app, you would use a dedicated IPFS gateway or service
// Using Infura as an example - you would need your own API credentials
const projectId = 'YOUR_INFURA_PROJECT_ID'; // Replace with actual project ID in production
const projectSecret = 'YOUR_INFURA_PROJECT_SECRET'; // Replace with actual secret in production
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

// For development/demo purposes, we can use a public gateway
// In production, you'd use your own IPFS node or a service like Infura, Pinata, etc.
const ipfsClient = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

// For development without real IPFS credentials, let's add a mock function
const mockIpfsUpload = async (file) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a random IPFS hash-like string
      const mockCid = 'Qm' + Array(44).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      resolve(mockCid);
    }, 2000); // Simulate upload delay
  });
};

/**
 * Upload a file to IPFS
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Optional callback for upload progress
 * @returns {Promise<string>} - The IPFS content identifier (CID)
 */
export const uploadToIPFS = async (file, onProgress) => {
  try {
    // In development without real IPFS credentials, use the mock function
    // Comment this out and uncomment the real implementation when you have IPFS credentials
    return await mockIpfsUpload(file);
    
    /* 
    // Real implementation for production
    const added = await ipfsClient.add(
      file,
      {
        progress: (prog) => {
          if (onProgress) {
            onProgress(Math.round((prog / file.size) * 100));
          }
        }
      }
    );
    return added.path;
    */
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw new Error('Failed to upload to IPFS');
  }
};

/**
 * Upload metadata to IPFS
 * @param {Object} metadata - The metadata object to upload
 * @returns {Promise<string>} - The IPFS content identifier (CID)
 */
export const uploadMetadataToIPFS = async (metadata) => {
  try {
    // Convert the metadata to a JSON string
    const metadataJSON = JSON.stringify(metadata);
    
    // Create a Blob from the JSON string
    const metadataBlob = new Blob([metadataJSON], { type: 'application/json' });
    
    // Use the file upload function to upload the metadata
    return await uploadToIPFS(metadataBlob);
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
};

/**
 * Get the URL to access a file from IPFS
 * @param {string} cid - The IPFS content identifier
 * @returns {string} - The URL to access the file
 */
export const getIPFSUrl = (cid) => {
  // Using IPFS gateway for direct access
  return `https://ipfs.io/ipfs/${cid}`;
};

/**
 * Extract file metadata
 * @param {File} file - The file to extract metadata from
 * @returns {Object} - The extracted metadata
 */
export const extractFileMetadata = async (file) => {
  // Basic file metadata
  const metadata = {
    name: file.name,
    type: file.type,
    size: file.size,
    lastModified: new Date(file.lastModified).toISOString(),
  };
  
  // For images, extract additional metadata
  if (file.type.startsWith('image/')) {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        metadata.width = img.width;
        metadata.height = img.height;
        URL.revokeObjectURL(objectUrl);
        resolve(metadata);
      };
      
      img.src = objectUrl;
    });
  }
  
  return metadata;
};

export default {
  uploadToIPFS,
  uploadMetadataToIPFS,
  getIPFSUrl,
  extractFileMetadata
}; 