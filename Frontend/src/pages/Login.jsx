import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaFacebook, FaTwitter } from "react-icons/fa";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt with:", formData);
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <div className="h-140 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-8">
          {/* Social Icons */}
          <div className="flex justify-end space-x-2 mb-6">
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <FaFacebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <FaTwitter className="w-5 h-5" />
            </a>
          </div>

          {/* Sign In Header */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sign In</h2>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full px-3 py-2 border-b-2 border-gray-200 focus:border-emerald-500 outline-none text-gray-700"
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-3 py-2 border-b-2 border-gray-200 focus:border-emerald-500 outline-none text-gray-700"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="remember" className="ml-2 text-gray-600">
                  Remember Me
                </label>
              </div>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                Forgot Password
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600 transition-colors"
            >
              Sign In
            </button>

            <div className="text-center text-sm text-gray-600">
              Not a member? {" "}
              <button
                onClick={handleSignUp}
                className="text-emerald-500 hover:text-emerald-600 font-medium focus:outline-none"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
