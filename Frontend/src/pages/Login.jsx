import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage((prev) => ({
      ...prev,
      [name]: "", // Clear error message for the field being edited
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let errors = {};

    if (!formData.email) {
      errors.email = "Please fill the email";
    }
    if (!formData.password) {
      errors.password = "Please fill the password";
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors);
      return;
    }

    setErrorMessage({ email: "", password: "" });
    console.log("Login attempt with:", formData);
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg flex">
        {/* Sign In Section */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errorMessage.email ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
              />
              {errorMessage.email && (
                <p className="text-red-500 text-sm mt-1">{errorMessage.email}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errorMessage.password ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
              />
              {errorMessage.password && (
                <p className="text-red-500 text-sm mt-1">{errorMessage.password}</p>
              )}
            </div>
            <div className="flex justify-between items-center text-sm">
              <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              SIGN IN
            </button>
          </form>
        </div>

        {/* Sign Up Section */}
        <div className="w-1/2 bg-red-500 text-white p-8 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
          <p className="text-center mb-6">Sign up and start your journey with us.</p>
          <button
            onClick={handleSignUp}
            className="bg-white text-red-500 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
}