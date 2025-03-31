import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { useUser } from '../context/UserContext';
import useFileUpload from '../hooks/useFileUpload';
import FileUploader from '../components/forms/FileUploader';
import { mintCertificate } from '../utils/contractService';
import { FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi';
import './IPSubmission.css';

export default function IPSubmission() {
  const navigate = useNavigate();
  const { isConnected, signer, chainId } = useWeb3();
  const { addIpAsset } = useUser();
  const {
    file,
    filePreview,
    metadata,
    contentHash,
    ipfsHash,
    metadataIpfsHash,
    uploadProgress,
    isUploading,
    error: uploadError,
    handleFileSelect,
    uploadFile,
    reset
  } = useFileUpload();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [step, setStep] = useState(1);

  // Handle file selection
  const onFileSelect = async (selectedFile) => {
    await handleFileSelect(selectedFile);
    
    // Auto-fill title from filename
    const fileName = selectedFile.name;
    setTitle(fileName.substring(0, fileName.lastIndexOf('.')) || fileName);
  };

  // Move to next step
  const goToNextStep = async () => {
    if (step === 1) {
      // Upload file to IPFS
      if (!file) {
        setError('Please select a file first');
        return;
      }
      
      const result = await uploadFile();
      if (result) {
        setStep(2);
        setError(null);
      }
    } else if (step === 2) {
      // Mint certificate
      submitToBlockchain();
    }
  };

  // Submit to blockchain
  const submitToBlockchain = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!title.trim()) {
      setError('Please enter a title for your IP');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare metadata
      const fullMetadata = {
        title,
        description,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        type: file.type,
        size: file.size,
        name: file.name,
        contentHash,
        ipfsHash,
        created: new Date().toISOString(),
      };
      
      // Mock function to mint certificate - in a real app this would use the actual blockchain
      const receipt = await mintCertificate(null, metadataIpfsHash, contentHash);
      
      // Create a new IP asset
      const newAsset = {
        id: `asset-${Date.now()}`,
        title,
        description,
        type: fullMetadata.type.split('/')[0],
        timestamp: new Date().toISOString(),
        txHash: receipt.transactionHash,
        ipfsHash,
        metadataIpfsHash,
        previewUrl: filePreview,
        owner: signer ? await signer.getAddress() : 'unknown',
        status: 'Pending',
      };
      
      // Add to user's assets
      addIpAsset(newAsset);
      
      setSuccess('Your intellectual property has been successfully protected!');
      
      // Navigate to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      console.error('Error submitting to blockchain:', err);
      setError('Failed to mint certificate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    reset();
    setTitle('');
    setDescription('');
    setTags('');
    setError(null);
    setSuccess(null);
    setStep(1);
  };

  // Render content based on step
  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="upload-step">
          <h2 className="step-title">Step 1: Upload Your File</h2>
          <p className="step-description">
            Select the file containing your intellectual property. We support various file types 
            including documents, images, code files, audio, and video.
          </p>
          
          <FileUploader
            onFileSelect={onFileSelect}
            file={file}
            filePreview={filePreview}
            isUploading={isUploading}
            error={uploadError}
            progress={uploadProgress}
            onRemove={reset}
          />
        </div>
      );
    } else if (step === 2) {
      return (
        <div className="metadata-step">
          <h2 className="step-title">Step 2: Add Metadata</h2>
          <p className="step-description">
            Provide details about your intellectual property to help identify and protect it.
          </p>
          
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your intellectual property"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your intellectual property"
              rows={4}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="art, design, code, etc."
            />
          </div>
          
          <div className="file-info-summary">
            <h3>File Information</h3>
            <ul className="info-list">
              <li><strong>File Name:</strong> {file?.name}</li>
              <li><strong>File Type:</strong> {file?.type || 'Unknown'}</li>
              <li><strong>IPFS Hash:</strong> {ipfsHash}</li>
              <li><strong>Content Hash:</strong> {contentHash?.substring(0, 10)}...{contentHash?.substring(contentHash.length - 10)}</li>
            </ul>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="ip-submission-page">
      <div className="page-header">
        <h1 className="page-title">Protect Your Intellectual Property</h1>
        <p className="page-subtitle">
          Secure your creative works on the blockchain with timestamped proof of ownership
        </p>
      </div>

      {!isConnected ? (
        <div className="connect-wallet-message">
          <FiAlertCircle />
          <p>Please connect your wallet to protect your intellectual property</p>
        </div>
      ) : (
        <div className="submission-container">
          <div className="submission-progress">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-indicator">1</div>
              <span className="step-label">Upload File</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-indicator">2</div>
              <span className="step-label">Add Metadata</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-indicator">3</div>
              <span className="step-label">Secure on Blockchain</span>
            </div>
          </div>
          
          <div className="submission-form">
            {renderStepContent()}
            
            {error && (
              <div className="error-message">
                <FiAlertCircle />
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="success-message">
                <FiCheckCircle />
                <span>{success}</span>
              </div>
            )}
            
            <div className="form-actions">
              {step > 1 && (
                <button 
                  className="btn btn-outline" 
                  onClick={() => setStep(step - 1)}
                  disabled={isSubmitting || isUploading}
                >
                  Back
                </button>
              )}
              
              <button 
                className="btn btn-outline" 
                onClick={handleReset}
                disabled={isSubmitting || isUploading}
              >
                Reset
              </button>
              
              <button 
                className="btn btn-primary" 
                onClick={goToNextStep}
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting || isUploading ? (
                  <>
                    <FiLoader className="spinner" />
                    {isUploading ? 'Uploading...' : 'Submitting...'}
                  </>
                ) : step === 1 ? (
                  'Upload & Continue'
                ) : (
                  'Submit to Blockchain'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 