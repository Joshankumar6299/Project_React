import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // For navigation

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          Food Donate App
        </Link>
        <button
          onClick={toggleMenu}
          className="text-white md:hidden"
        >
          <span className="material-icons">menu</span>
        </button>

        <ul
          className={`md:flex space-x-6 ${isMenuOpen ? 'block' : 'hidden'}`}
        >
          <li>
            <Link to="/" className="text-white hover:bg-blue-700 px-4 py-2 rounded-md">Home</Link>
          </li>
          <li>
            <Link to="/about" className="text-white hover:bg-blue-700 px-4 py-2 rounded-md">About</Link>
          </li>
          <li>
            <Link to="/gallery" className="text-white hover:bg-blue-700 px-4 py-2 rounded-md">Gallery</Link>
          </li>
          <li>
            <Link to="/contact" className="text-white hover:bg-blue-700 px-4 py-2 rounded-md">Contact</Link>
          </li>
          <li>
            <Link to="/getstart" className="text-white hover:bg-blue-700 px-4 py-2 rounded-md">Get Start</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
