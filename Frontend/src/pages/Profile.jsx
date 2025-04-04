import React from "react";

const Profile = () => {
  return (
    <div className="flex justify-center items-center h-100 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">Joshan Kumar Kushwaha</h2>
            </div>
          </div>
          <button className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 flex items-center">
            Edit
          </button>
        </div>

        {/* About Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">About</h3>
          <p className="flex items-center text-gray-700 mb-1">
            <span className="material-icons text-blue-500 mr-2">phone</span>
            Phone: 1234567890
          </p>
          <p className="flex items-center text-gray-700 mb-1">
            <span className="material-icons text-blue-500 mr-2">email</span>
            Email: example@gmail.com
          </p>
          <p className="flex items-center text-gray-700">
            <span className="material-icons text-blue-500 mr-2">business</span>
            NGO Name: Yash Foundation
          </p>
        </div>

        <hr className="my-4" />

        {/* Address Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Address</h3>
          <p className="flex items-center text-gray-700 mb-1">
            <span className="material-icons text-green-500 mr-2">place</span>
            Address: RK University
          </p>
          <p className="flex items-center text-gray-700 mb-1">
            <span className="material-icons text-green-500 mr-2">location_city</span>
            City: Rajkot (Gujarat)
          </p>
          <p className="flex items-center text-gray-700">
            <span className="material-icons text-green-500 mr-2">pin_drop</span>
            PinCode: 360020
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;