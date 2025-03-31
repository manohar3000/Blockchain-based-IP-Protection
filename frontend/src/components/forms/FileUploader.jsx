import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiImage, FiCode, FiFileText, FiMusic, FiVideo, FiX } from 'react-icons/fi';
import { formatFileSize } from '../../utils/formatters';
import './FileUploader.css';

export default function FileUploader({ 
  onFileSelect, 
  file, 
  filePreview, 
  isUploading, 
  error, 
  progress, 
  onRemove,
  acceptedFileTypes = {}
}) {
  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  // Setup dropzone
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: 1,
    disabled: isUploading,
  });

  // Get file icon based on mimetype
  const getFileIcon = (type) => {
    if (!type) return <FiFile />;
    
    if (type.startsWith('image/')) return <FiImage />;
    if (type.startsWith('text/')) return <FiFileText />;
    if (type.includes('application/pdf')) return <FiFileText />;
    if (type.includes('javascript') || type.includes('json') || type.includes('html') || type.includes('css')) return <FiCode />;
    if (type.startsWith('audio/')) return <FiMusic />;
    if (type.startsWith('video/')) return <FiVideo />;
    
    return <FiFile />;
  };

  return (
    <div className="file-uploader">
      {!file ? (
        <div 
          {...getRootProps()} 
          className={`dropzone ${isDragActive ? 'active' : ''} ${isDragReject ? 'reject' : ''}`}
        >
          <input {...getInputProps()} />
          
          <div className="dropzone-content">
            <div className="upload-icon">
              <FiUpload />
            </div>
            
            {isDragActive ? (
              <p>Drop the file here...</p>
            ) : (
              <>
                <p className="primary-text">Drag & drop a file here, or click to select</p>
                <p className="secondary-text">
                  Support for documents, images, code files, and more
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="file-preview">
          <div className="file-info">
            <div className="file-icon">
              {filePreview ? (
                <img 
                  src={filePreview} 
                  alt="File preview" 
                  className="preview-image" 
                />
              ) : (
                getFileIcon(file.type)
              )}
            </div>
            
            <div className="file-details">
              <h4 className="file-name">{file.name}</h4>
              <p className="file-meta">
                {formatFileSize(file.size)}
                <span className="dot"></span>
                {file.type || 'Unknown type'}
              </p>
            </div>
            
            {!isUploading && (
              <button 
                className="remove-file-btn" 
                onClick={onRemove}
                aria-label="Remove file"
              >
                <FiX />
              </button>
            )}
          </div>
          
          {isUploading && (
            <div className="upload-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${progress}%` }}
              ></div>
              <p className="progress-text">{progress}% Uploaded</p>
            </div>
          )}
        </div>
      )}
      
      {error && <p className="error-message">{error}</p>}
    </div>
  );
} 