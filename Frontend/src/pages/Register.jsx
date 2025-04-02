import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobileNo: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    mobileNo: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Please fill the fullname";
    if (!formData.email) newErrors.email = "Please fill the email";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Please fill the password";
    if (!formData.mobileNo) newErrors.mobileNo = "Please fill the mobile number";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUpClick = () => {
    if (validateForm()) {
      navigate("/dashboard");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignInClick = () => {
    navigate("/login");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Side - Text Section */}
        <div className="w-1/2 bg-red-500 text-white flex flex-col items-center justify-center p-10">
          <h2 className="text-4xl font-bold mb-4">Hello, Friend!</h2>
          <p className="text-center text-lg mb-6">
          Sign in  and start your journey with us.
          </p>
          <button
            onClick={handleSignInClick}
            className="bg-white text-red-500 px-6 py-2 rounded hover:bg-gray-200 transition-colors"
          >
            SIGN IN
          </button>
        </div>

        {/* Right Side - Form Section */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sign Up</h2>
          <form className="space-y-4">
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="w-full p-2 border rounded"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-2 border rounded"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-2 border rounded"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div>
              <input
                type="text"
                name="mobileNo"
                placeholder="Mobile No."
                className="w-full p-2 border rounded"
                value={formData.mobileNo}
                onChange={handleInputChange}
              />
              {errors.mobileNo && <p className="text-red-500 text-sm">{errors.mobileNo}</p>}
            </div>
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full p-2 border rounded"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
            <button
              type="button"
              onClick={handleSignUpClick}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors" >
              SIGN UP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
