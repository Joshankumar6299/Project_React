
import { FaFacebook } from "react-icons/fa";
import { AiFillGoogleCircle } from "react-icons/ai";
import { FaLinkedin } from "react-icons/fa";

export default function LoginPage() {

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="flex w-3/4 max-w-4xl">
        {/* Left Side - Login Form */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-white p-10 shadow-lg">
          <h2 className="text-4xl font-bold mb-4">Sign in</h2>
          
          {/* Social Icons */}
          <div className="flex space-x-4 mb-4">
            <button className="p-2 bg-gray-200 rounded-full"><FaFacebook /></button>
            <button className="p-2 bg-gray-200 rounded-full"><AiFillGoogleCircle /></button>
            <button className="p-2 bg-gray-200 rounded-full"><FaLinkedin /></button>
          </div>
          
          <p className="text-gray-500 mb-4">Or With Your Account</p>
          
          {/* Input Fields */}
          <input type="email" placeholder="Email" className="w-80 p-2 mb-3 border rounded" />
          <input type="password" placeholder="Password" className="w-80 p-2 mb-3 border rounded" />
          
          <a href="#" className="text-blue-600 mb-3">Forgot Password</a>
          
          <button className="bg-orange-500 text-white px-6 py-2 rounded mt-3">SIGN IN</button>
        </div>

        {/* Right Side - Signup Section */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-red-400 text-white p-10">
          <h2 className="text-3xl font-bold mb-3">Hello, Friend!</h2>
          <p className="text-center mb-4 px-6">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.</p>
          <a href="" className="border border-white px-6 py-2 rounded">SIGN UP</a>
        </div>
      </div>
    </div>
  );
}