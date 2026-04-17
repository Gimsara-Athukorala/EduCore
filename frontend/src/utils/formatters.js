/**
 * Formats an ISO date string to a readable format.
 * @param {string|Date} iso - The date to format
 * @returns {string} - e.g., "Mar 12, 2026"
 */
export const formatDate = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Formats bytes to a human readable file size string.
 * @param {number} bytes - File size in bytes
 * @returns {string} - e.g., "2.4 MB"
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Formats a number with commas or shortens it if over 999.
 * @param {number} n 
 * @returns {string} - e.g., "1,200" or "1.2K"
 */
export const formatNumber = (n) => {
  if (n === null || n === undefined) return '0';
  if (n < 1000) return n.toString();
  return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'K';
};

/**
 * Converts a slug to a title-cased string.
 * @param {string} slug - e.g., "fintech-club"
 * @returns {string} - e.g., "Fintech Club"
 */
export const slugToTitle = (slug) => {
  if (!slug) return '';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Returns a human-readable "time ago" string.
 * @param {string|Date} dateParam - The date
 * @returns {string} - e.g., "2 hours ago"
 */
export const formatTimeAgo = (dateParam) => {
  if (!dateParam) return '';
  const date = typeof dateParam === 'string' ? new Date(dateParam) : dateParam;
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};
