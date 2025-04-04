import React from 'react'
import "../index.css";
import img from '../assets/img/donate.jpg';

const images = [
    "https://images.pexels.com/photos/29321658/pexels-photo-29321658/free-photo-of-modern-indoor-staircase-with-neon-lights.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    "https://images.pexels.com/photos/30122027/pexels-photo-30122027/free-photo-of-photographer-in-yellow-jacket-capturing-fall-nature.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    "https://images.pexels.com/photos/30079902/pexels-photo-30079902/free-photo-of-pristine-snowfall-captured-in-winter-landscape.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    "https://images.pexels.com/photos/30173365/pexels-photo-30173365/free-photo-of-minimalist-flatlay-of-modern-home-office-supplies.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    "https://images.pexels.com/photos/29321658/pexels-photo-29321658/free-photo-of-modern-indoor-staircase-with-neon-lights.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    "https://images.pexels.com/photos/30122027/pexels-photo-30122027/free-photo-of-photographer-in-yellow-jacket-capturing-fall-nature.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    "https://images.pexels.com/photos/30079902/pexels-photo-30079902/free-photo-of-pristine-snowfall-captured-in-winter-landscape.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    "https://images.pexels.com/photos/30173365/pexels-photo-30173365/free-photo-of-minimalist-flatlay-of-modern-home-office-supplies.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
  ];
  

const Donate = () => {
  return (
    <>
      <h1 className="text-5xl font-bold  m-5">Online Donations</h1>
      
      <img 
            className="w-full h-96 object-cover transition-all duration-300 rounded-lg cursor-pointer filter grayscale hover:grayscale-0" 
            src={img}  // Use imported variable here
            alt="Donate"
            />

<div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Left Side - Image */}
      <div className="md:w-1/2 flex justify-center ">
        <img
          src={img} // Replace with your image path
          alt="Donation"
          className="w-300 mr-20 rounded-lg shadow-lg"
        />
      </div>

      {/* Right Side - Form */}
      <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Donate Now</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Name" name="name" className="w-full p-3 border rounded-lg outline-none " />

          <input type="email" placeholder="Email" name="email" className="w-full p-3 border rounded-lg outline-none" />

              <div className="p-4">
          <h2 className="text-lg font-medium mb-2"> Food Type:</h2>

          <div>
            <label className="mr-4">
              <input type="radio" name="choice" value="veg" className="mr-1" />
              Veg 
            </label>

            <label className="mr-4">
              <input type="radio" name="choice" value="non-veg" className="mr-1" />
              Non Veg
            </label>

            <label>
              <input type="radio" name="choice" value="both" className="mr-1" />
              Both
            </label>
          </div>
        </div>

          <input type="text" placeholder="WhatsApp No." name="phone" className="w-full p-3 border rounded-lg outline-none" />

          <input type="text" placeholder="Address" name="address" className="w-full p-3 border rounded-lg outline-none" />

          <input type="text" placeholder="Quantity" name="quantity" className="w-full p-3 border rounded-lg outline-none" />
          
          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700">
            Donate
          </button>
        </form>
      </div>
    </div>


    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">Note:</h2>
      <ul className="space-y-2">
        <li className="flex items-start">
          <span className="text-black text-lg mr-2">●</span>
          <p>
            It costs us ₹1,500 to provide nutritious, hygienic and tasty mid-day meals to a child for a year.*
          </p>
        </li>
        <li className="flex items-start">
          <span className="text-black text-lg mr-2">●</span>
          <p>
            We thank the Central Government and various State Governments and UT Administrations for supporting us in
            serving mid-day meals to children.
          </p>
        </li>
        <li className="flex items-start">
          <span className="text-black text-lg mr-2">●</span>
          <p>
            If you are an account holder of Indian banks and have debit/credit cards issued by these banks then please
            select Indian Donors as your donation mode.
          </p>
        </li>
        <li className="flex items-start">
          <span className="text-black text-xl mr-2">★</span>
          <p>
            The ask is for 232 meals per child for an academic year. The equivalent number of meals can also be served
            for a shorter period for a higher number of children. The amount can also be utilised to meet cost
            escalations if required. Alternatively, it can be used for improving the school infrastructure to create a
            better learning environment and to serve meals.
          </p>
        </li>
      </ul>
    </div>

    <div className="w-full overflow-hidden whitespace-nowrap bg-gray-100 py-4">
      <div className="flex animate-marquee space-x-4">
        {images.concat(images).map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Image ${index + 1}`}
            className="w-[300px] h-[200px] rounded-lg object-cover"
          />
        ))}
      </div>
    </div>
    </>
  )
}

export default Donate
