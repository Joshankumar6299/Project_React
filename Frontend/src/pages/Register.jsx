import { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { AiFillGoogleCircle } from "react-icons/ai";
import { FaLinkedin } from "react-icons/fa";

export default function RegisterPage() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Side - Register Form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-10">
          <h2 className="text-4xl font-bold mb-4">Sign Up</h2>
          
          {/* Social Icons */}
          <div className="flex space-x-4 mb-4">
            <button className="p-2 bg-gray-200 rounded-full"><FaFacebook /></button>
            <button className="p-2 bg-gray-200 rounded-full"><AiFillGoogleCircle /></button>
            <button className="p-2 bg-gray-200 rounded-full"><FaLinkedin /></button>
          </div>
          
          <p className="text-gray-500 mb-4">Or Use Your Email for Registration</p>
          
          {/* Input Fields */}
          <input type="text" placeholder="FullName" className="w-full p-2 mb-3 border rounded" />
          <input type="email" placeholder="Email" className="w-full p-2 mb-3 border rounded" />
          <input type="password" placeholder="Password" className="w-full p-2 mb-3 border rounded" />
          <input type="text" placeholder="Mobile No." className="w-full p-2 mb-3 border rounded" />
          <input type="password" placeholder="Password" className="w-full p-2 mb-3 border rounded" />
          
          <button className="bg-green-500 text-white px-6 py-2 rounded mt-3">SIGN UP</button>
        </div>

        {/* Right Side - Login Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-blue-400 text-white p-10">
          <h2 className="text-3xl font-bold mb-3">Welcome Back!</h2>
          <p className="text-center mb-4 px-6">To keep connected with us, please login with your personal info.</p>
          <button className="border border-white px-6 py-2 rounded">SIGN IN</button>
        </div>
      </div>
    </div>
  );
}
