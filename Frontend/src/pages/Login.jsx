import React from 'react';

const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8 w-96">
        <h2 className="text-2xl font-bold mb-4">Sign in</h2>
        <div className="flex justify-center gap-4 mb-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <i className="fab fa-facebook-f"></i>
          </button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            <i className="fab fa-google"></i>
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <i className="fab fa-linkedin-in"></i>
          </button>
        </div>
        <p className="text-gray-500 mb-4">Or With Your Account</p>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
 <div className="flex items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            SIGN IN
          </button>
          <a href="#" className="text-blue-500 hover:text-blue-800">
            Forgot Password?
          </a>
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-500">Hello, Friend!</p>
          <p className="text-gray-500">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
          <a href="#" className="text-blue-500 hover:text-blue-800 font-bold">SIGN UP</a>
        </div>
      </div>
    </div>
  );
};

export default Login;