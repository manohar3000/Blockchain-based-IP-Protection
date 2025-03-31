import { useState, useCallback } from 'react';
import { uploadToIPFS, uploadMetadataToIPFS, extractFileMetadata } from '../utils/ipfsService';
import { calculateContentHash } from '../utils/contractService';

/**
 * Custom hook for handling file uploads to IPFS
 * @returns {Object} - File upload state and methods
 */
export default function useFileUpload() {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [contentHash, setContentHash] = useState(null);
  const [ipfsHash, setIpfsHash] = useState(null);
  const [metadataIpfsHash, setMetadataIpfsHash] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileSelect = useCallback(async (selectedFile) => {
    try {
      setError(null);
      setFile(selectedFile);
      
      // Create preview URL
      if (selectedFile.type.startsWith('image/')) {
        const preview = URL.createObjectURL(selectedFile);
        setFilePreview(preview);
      } else {
        setFilePreview(null);
      }
      
      // Extract metadata
      const extractedMetadata = await extractFileMetadata(selectedFile);
      setMetadata(extractedMetadata);
      
      // Calculate content hash
      const hash = await calculateContentHash(selectedFile);
      setContentHash(hash);
      
      return { metadata: extractedMetadata, contentHash: hash };
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Failed to process the selected file');
      return null;
    }
  }, []);

  // Upload file to IPFS
  const uploadFile = useCallback(async () => {
    if (!file) {
      setError('No file selected');
      return null;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      // Upload file to IPFS
      const cid = await uploadToIPFS(file, (progress) => {
        setUploadProgress(progress / 2); // First half of the process
      });
      
      setIpfsHash(cid);
      
      // Create and upload metadata
      const fullMetadata = {
        ...metadata,
        contentHash,
        name: file.name,
        description: `IP Protection metadata for ${file.name}`,
        type: file.type,
        size: file.size,
        created: new Date().toISOString(),
        ipfsHash: cid
      };
      
      // Upload metadata to IPFS
      setUploadProgress(50); // Half way there
      const metadataCid = await uploadMetadataToIPFS(fullMetadata);
      setMetadataIpfsHash(metadataCid);
      setUploadProgress(100);
      
      return {
        ipfsHash: cid,
        metadataIpfsHash: metadataCid,
        contentHash,
        metadata: fullMetadata
      };
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload the file to IPFS');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [file, metadata, contentHash]);

  // Reset all state
  const reset = useCallback(() => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    
    setFile(null);
    setFilePreview(null);
    setMetadata(null);
    setContentHash(null);
    setIpfsHash(null);
    setMetadataIpfsHash(null);
    setUploadProgress(0);
    setIsUploading(false);
    setError(null);
  }, [filePreview]);

  return {
    file,
    filePreview,
    metadata,
    contentHash,
    ipfsHash,
    metadataIpfsHash,
    uploadProgress,
    isUploading,
    error,
    handleFileSelect,
    uploadFile,
    reset
  };
} 