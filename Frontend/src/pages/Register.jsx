import { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { AiFillGoogleCircle } from "react-icons/ai";
import { FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";  // Import useNavigate for page redirection

export default function RegisterPage() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();  // Initialize the useNavigate hook

  // State for form fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobileNo: "",
    confirmPassword: "",
  });

  // State for error messages
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    mobileNo: "",
    confirmPassword: "",
  });

  // Check if the form is valid
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Please fill the fullname";
    if (!formData.email) newErrors.email = "Please fill the email";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please fill the email";
    
    if (!formData.password) newErrors.password = "Please fill the password";
    if (!formData.mobileNo) newErrors.mobileNo = "Please fill the mobile";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;  // Return true if no errors
  };

  // Handle form submission
  const handleSignUpClick = () => {
    if (validateForm()) {
      // If the form is valid, navigate to another page
      navigate("/dashboard");  // Redirect to dashboard or another page after successful signup
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle Sign In redirection
  const handleSignInClick = () => {
    navigate("/login");  // Redirect to login page when "SIGN IN" is clicked
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Side - Register Form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-10">
          <a href="#" className="text-4xl font-bold mb-4">Sign Up</a>
          
          {/* Social Icons */}
          <div className="flex space-x-4 mb-4">
            <button className="p-2 bg-gray-200 rounded-full"><FaFacebook /></button>
            <button className="p-2 bg-gray-200 rounded-full"><AiFillGoogleCircle /></button>
            <button className="p-2 bg-gray-200 rounded-full"><FaLinkedin /></button>
          </div>
          
          <p className="text-gray-500 mb-4">Or Use Your Email for Registration</p>
          
          {/* Input Fields */}
          <input
            type="text"
            name="fullName"
            placeholder="FullName"
            className="w-full p-2 mb-3 border rounded"
            value={formData.fullName}
            onChange={handleInputChange}
          />
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 mb-3 border rounded"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 mb-3 border rounded"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <input
            type="text"
            name="mobileNo"
            placeholder="Mobile No."
            className="w-full p-2 mb-3 border rounded"
            value={formData.mobileNo}
            onChange={handleInputChange}
          />
          {errors.mobileNo && <p className="text-red-500 text-sm">{errors.mobileNo}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full p-2 mb-3 border rounded"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

          <button
            onClick={handleSignUpClick}  // Handle the click event
            className="bg-green-500 text-white px-6 py-2 rounded mt-3"
          >
            SIGN UP
          </button>
        </div>

        {/* Right Side - Login Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-blue-400 text-white p-10">
          <h2 className="text-3xl font-bold mb-3">Welcome Back!</h2>
          <p className="text-center mb-4 px-6">To keep connected with us, please login with your personal info.</p>
          <button onClick={handleSignInClick} className="border border-white px-6 py-2 rounded">SIGN IN</button> {/* Handle the click event */}
        </div>
      </div>
    </div>
  );
}
