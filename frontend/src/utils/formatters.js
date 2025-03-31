/**
 * Format a date to a readable string
 * @param {string|Date} date - Date to format
 * @param {boolean} includeTime - Whether to include time in the output
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' })
  };
  
  return dateObj.toLocaleDateString('en-US', options);
};

/**
 * Format a time passed since a date
 * @param {string|Date} date - Date to calculate time from
 * @returns {string} - Time ago string
 */
export const formatTimeAgo = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
};

/**
 * Format a file size to a readable string
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted size string
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Truncate a string in the middle
 * @param {string} str - String to truncate
 * @param {number} startChars - Number of characters to keep at the start
 * @param {number} endChars - Number of characters to keep at the end
 * @returns {string} - Truncated string
 */
export const truncateMiddle = (str, startChars = 6, endChars = 4) => {
  if (!str) return '';
  if (str.length <= startChars + endChars) return str;
  
  return `${str.substring(0, startChars)}...${str.substring(str.length - endChars)}`;
};

/**
 * Format an Ethereum address
 * @param {string} address - Ethereum address
 * @param {boolean} short - Whether to return a shortened version
 * @returns {string} - Formatted address
 */
export const formatAddress = (address, short = true) => {
  if (!address) return '';
  
  if (short) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
  
  return address;
};

/**
 * Format a transaction hash
 * @param {string} hash - Transaction hash
 * @returns {string} - Formatted hash
 */
export const formatTxHash = (hash) => {
  if (!hash) return '';
  
  return truncateMiddle(hash);
};

/**
 * Create an explorer link for a transaction
 * @param {string} hash - Transaction hash
 * @param {number} chainId - Network chain ID
 * @returns {string} - Explorer URL
 */
export const getExplorerTxLink = (hash, chainId) => {
  if (!hash) return '';
  
  const explorers = {
    1: 'https://etherscan.io/tx/',
    3: 'https://ropsten.etherscan.io/tx/',
    4: 'https://rinkeby.etherscan.io/tx/',
    5: 'https://goerli.etherscan.io/tx/',
    42: 'https://kovan.etherscan.io/tx/',
    56: 'https://bscscan.com/tx/',
    97: 'https://testnet.bscscan.com/tx/',
    137: 'https://polygonscan.com/tx/',
    80001: 'https://mumbai.polygonscan.com/tx/',
  };
  
  return `${explorers[chainId] || explorers[1]}${hash}`;
};

/**
 * Create an explorer link for an address
 * @param {string} address - Ethereum address
 * @param {number} chainId - Network chain ID
 * @returns {string} - Explorer URL
 */
export const getExplorerAddressLink = (address, chainId) => {
  if (!address) return '';
  
  const explorers = {
    1: 'https://etherscan.io/address/',
    3: 'https://ropsten.etherscan.io/address/',
    4: 'https://rinkeby.etherscan.io/address/',
    5: 'https://goerli.etherscan.io/address/',
    42: 'https://kovan.etherscan.io/address/',
    56: 'https://bscscan.com/address/',
    97: 'https://testnet.bscscan.com/address/',
    137: 'https://polygonscan.com/address/',
    80001: 'https://mumbai.polygonscan.com/address/',
  };
  
  return `${explorers[chainId] || explorers[1]}${address}`;
};

export default {
  formatDate,
  formatTimeAgo,
  formatFileSize,
  truncateMiddle,
  formatAddress,
  formatTxHash,
  getExplorerTxLink,
  getExplorerAddressLink
}; 