import { FaFacebook, FaTwitter } from "react-icons/fa";
import { MdMovie } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Logo and Description */}
        <h1 className="text-3xl font-bold">Logo</h1>
        <p className="text-sm mt-2">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        </p>

        {/* Navigation and Social Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div>
            <p>Home</p>
            <p>About</p>
            <p>Home</p>
            <p>Home</p>
          </div>
          <div>
            <p>Home</p>
            <p>Home</p>
            <p>Home</p>
            <p>Home</p>
          </div>
          <div className="flex space-x-4 justify-center md:justify-start">
            <FaFacebook className="text-2xl text-blue-500" />
            <MdMovie className="text-2xl text-pink-500" />
            <FaTwitter className="text-2xl text-blue-400" />
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-6 border-t border-gray-600 pt-4 flex flex-col md:flex-row justify-between text-sm">
          <p>Privacy Policy</p>
          <p>Terms and Condition</p>
          <p>Name 2025 . All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
