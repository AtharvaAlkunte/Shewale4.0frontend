// API Configuration - centralized URL management
export const getApiUrl = () => {
  // const apiUrl = import.meta.env.VITE_API_URL || 'https://shewale4-0.onrender.com';
  const apiUrl = 'https://shewale4-0.onrender.com';
  // Remove trailing slash if present
  return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
};

export const API_BASE_URL = getApiUrl();

