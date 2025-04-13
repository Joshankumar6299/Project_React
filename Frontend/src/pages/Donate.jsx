import React, { useState } from 'react'
import "../index.css";
import img from '../assets/img/donate.jpg';
import { toast } from 'react-toastify';

// Add CSS to hide the number input spinners
const styles = {
  hideNumberSpinners: `
    /* For Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* For Firefox */
    input[type=number] {
      -moz-appearance: textfield;
    }
  `
};

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    foodType: '',
    phone: '',
    address: '',
    quantity: ''
  });
  
  const [phoneError, setPhoneError] = useState('');
  const [quantityError, setQuantityError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Only allow digits, and limit to 10 digits
      const digitsOnly = value.replace(/\D/g, '');
      const truncated = digitsOnly.slice(0, 10);
      
      if (value !== truncated && value.length > truncated.length) {
        setPhoneError('Please enter only 10 digits');
      } else {
        setPhoneError('');
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: truncated
      }));
    } else if (name === 'quantity') {
      // Only allow positive numbers
      const numberValue = value.replace(/[^0-9]/g, '');
      
      if (value !== numberValue) {
        setQuantityError('Please enter numbers only');
      } else {
        setQuantityError('');
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else if (name === 'foodType') {
      setFormData(prev => ({
        ...prev,
        foodType: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.foodType || !formData.phone || !formData.address || !formData.quantity) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Validate phone number
    if (formData.phone.length !== 10) {
      setPhoneError('Phone number must be 10 digits');
      return;
    }
    
    // Validate quantity
    if (parseInt(formData.quantity) <= 0) {
      setQuantityError('Quantity must be greater than 0');
      return;
    }
    
    // Here you would make an API call to submit the form
    console.log('Donation submitted:', formData);
    
    toast.success('Thank you for your donation! We will contact you soon.');
    
    // Reset form after successful submission
    setFormData({
      name: '',
      email: '',
      foodType: '',
      phone: '',
      address: '',
      quantity: ''
    });
  };

  return (
    <>
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
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Name" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg outline-none focus:border-blue-500" 
            required 
          />

          <input 
            type="email" 
            placeholder="Email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg outline-none focus:border-blue-500" 
            required 
          />

          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-medium mb-2">Food Type:</h2>

            <div>
              <label className="mr-4 cursor-pointer">
                <input 
                  type="radio" 
                  name="foodType" 
                  value="veg" 
                  checked={formData.foodType === 'veg'}
                  onChange={handleChange}
                  className="mr-1" 
                  required
                />
                Veg 
              </label>

              <label className="mr-4 cursor-pointer">
                <input 
                  type="radio" 
                  name="foodType" 
                  value="non-veg" 
                  checked={formData.foodType === 'non-veg'}
                  onChange={handleChange}
                  className="mr-1" 
                />
                Non Veg
              </label>

            </div>
          </div>

          <div className="relative">
            <input 
              type="tel" 
              placeholder="WhatsApp No." 
              name="phone" 
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg outline-none focus:border-blue-500" 
              pattern="[0-9]{10}"
              maxLength="10"
              required 
            />
            {phoneError && (
              <p className="text-red-500 text-xs mt-1">{phoneError}</p>
            )}
          </div>

          <input 
            type="text" 
            placeholder="Address" 
            name="address" 
            value={formData.address}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg outline-none focus:border-blue-500" 
            required 
          />

          <div className="relative">
            <style>{styles.hideNumberSpinners}</style>
            <input 
              type="number" 
              placeholder="Quantity (in numbers)" 
              name="quantity" 
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg outline-none focus:border-blue-500" 
              min="1"
              required 
            />
            {quantityError && (
              <p className="text-red-500 text-xs mt-1">{quantityError}</p>
            )}
          </div>
          
          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-300">
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
