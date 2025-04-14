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

// Add request interceptor for logging and token management
instance.interceptors.request.use(
    (config) => {
        // Ensure content type is set for all requests
        if (config.method !== 'get') {
            config.headers['Content-Type'] = 'application/json';
        }
        
        // Log outgoing requests for debugging
        console.log(`🚀 Making ${config.method.toUpperCase()} request to: ${config.url}`, {
            baseURL: config.baseURL,
            headers: config.headers,
            withCredentials: config.withCredentials
        });
        
        // Add auth token automatically if present
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
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
                // Optional: redirect to login or clear localStorage
                // localStorage.removeItem('accessToken');
                // window.location.href = '/login';
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