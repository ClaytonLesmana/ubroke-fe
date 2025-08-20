// API Configuration
export const API_CONFIG = {
  // Use your computer's IP address for development
  BASE_URL: 'http://172.21.146.127:3001',
  
  // For production, you would use your actual domain
  // BASE_URL: 'https://your-api-domain.com',
};

export const API_ENDPOINTS = {
  DOCUMENT_AI: {
    ACCESS_TOKEN: `${API_CONFIG.BASE_URL}/api/documentai/access-token`,
    PROCESS: `${API_CONFIG.BASE_URL}/api/documentai/process`,
  },
  USERS: `${API_CONFIG.BASE_URL}/api/users`,
}; 