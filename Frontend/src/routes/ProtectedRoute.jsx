import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

/**
 * ProtectedRoute component to protect routes that require authentication
 * If user is not logged in, they will be redirected to the login page
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Display any error messages from localStorage if they exist
    const errorMessage = localStorage.getItem('auth_error');
    if (errorMessage) {
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
      localStorage.removeItem('auth_error'); // Clear the message
    }
  }, []);
  
  // Check authentication immediately
  const token = localStorage.getItem('accessToken');
  console.log("ProtectedRoute - checking auth token:", !!token);
  
  // If no token is found, set an error message and redirect to login
  if (!token) {
    console.log("ProtectedRoute - No token found, redirecting to login");
    
    // Store the error message in localStorage to display after redirect
    localStorage.setItem('auth_error', 'Please login to access this page');
    
    // Redirect to login page with the intended destination
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  console.log("ProtectedRoute - Token found, rendering protected content");
  // If token exists, render the protected component
  return children;
};

export default ProtectedRoute; 