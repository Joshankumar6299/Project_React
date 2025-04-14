import axios from 'axios'

// Create a custom instance of axios with default config
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
    timeout: 15000, // Increased timeout to 15 seconds for slower connections
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    // Enable CORS
    withCredentials: false
});

// Function to get a clean token from localStorage
const getAuthToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    
    // Make sure token is properly formatted (not undefined, null, etc)
    return token.trim() || null;
};

// Add request interceptor for logging and token management
instance.interceptors.request.use(
    (config) => {
        // Ensure content type is set for all requests
        if (config.method !== 'get') {
            config.headers['Content-Type'] = 'application/json';
        }
        
        // Add auth token automatically if present
        const token = getAuthToken();
        if (token) {
            // Always include 'Bearer ' prefix
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log outgoing requests for debugging
        console.log(`🚀 Making ${config.method.toUpperCase()} request to: ${config.url}`, {
            baseURL: config.baseURL,
            headers: {
                ...config.headers,
                Authorization: config.headers.Authorization ? 'Bearer [TOKEN]' : 'None' // Log presence but not the actual token
            }
        });
        
        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
instance.interceptors.response.use(
    (response) => {
        // Log successful responses
        console.log(`✅ Response from ${response.config.url}:`, {
            status: response.status,
            statusText: response.statusText,
            data: response.data
        });
        return response;
    },
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('❌ Response Error:', {
                status: error.response.status,
                data: error.response.data,
                url: error.config?.url,
                method: error.config?.method?.toUpperCase()
            });
            
            // Handle token expiration
            if (error.response.status === 401) {
                console.warn('Authentication error - user may need to log in again');
                
                // Check for specific token errors
                const errorMsg = error.response.data?.message || '';
                if (
                    errorMsg.includes('Invalid token') || 
                    errorMsg.includes('expired') || 
                    errorMsg.includes('Authentication required')
                ) {
                    console.log('Clearing invalid token from localStorage');
                    localStorage.removeItem('accessToken');
                    
                    // Don't redirect here - let the component handle it
                    console.warn('Token cleared due to authentication error');
                }
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('❌ Network Error: No response received', {
                url: error.config?.url,
                method: error.config?.method?.toUpperCase(),
                timeout: error.config?.timeout
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('❌ Request Setup Error:', error.message, error);
        }
        
        // Pass the error along to be handled by the component
        return Promise.reject(error);
    }
);

export default instance;