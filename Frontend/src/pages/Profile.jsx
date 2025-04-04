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
      </div>
    </div>
  );
};

export default Profile;