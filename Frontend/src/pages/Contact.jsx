  import React from 'react';

  const Contact = () => {
    return (
    
    <>
    
    <img  className="w-full h-auto max-h-[500px] object-cover transition-all duration-300 rounded-lg cursor-pointer filter gray hover:grayscale-0"  src="../public/p6.png"  alt="About Us"/>

        
    <div className="text-center pb-6">
      <h2 className="text-orange-600 font-bold text-2xl bg-white px-6 py-3 rounded-lg shadow-md inline-block mt-6">Contact</h2></div>
          
    <div className="flex justify-center items-center min-h-screen px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        
        {/* Left Side - Address */}
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h3>
          <p className="text-gray-700 dark:text-gray-300">
            123 Tech Street, Suite 500 <br />
            San Francisco, CA 94107 <br />
            United States
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-4">
            📞 Phone: (123) 456-7890 <br />
            ✉️ Email: contact@company.com
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-4">
            🕒 Business Hours: Mon - Fri, 9 AM - 6 PM
          </p>
        </div>

        {/* Right Side - Form */}
        <form className="max-w-md w-full bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-30 text-white">
        
          <div className="relative z-0 w-full mb-5 group">
            <input type="email" id="floating_email" className=" outline-none block w-full px-0 py-2.5 text-sm bg-transparent border-b-2 peer" placeholder=" " required />
            <label htmlFor="floating_email" className="absolute text-sm duration-300 transform scale-75 top-3 -z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative z-0 w-full mb-5 group">
              <input type="text" id="floating_first_name" className="outline-none block w-full px-0 py-2.5 text-sm bg-transparent border-b-2 peer" placeholder=" " required />
              <label htmlFor="floating_first_name" className="absolute text-sm duration-300 transform scale-75 top-3 -z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input type="text" id="floating_last_name" className="outline-none block w-full px-0 py-2.5 text-sm bg-transparent border-b-2 peer" placeholder=" " required />
              <label htmlFor="floating_last_name" className="absolute text-sm duration-300 transform scale-75 top-3 -z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative z-0 w-full mb-5 group">
              <input type="tel" id="floating_phone" className="outline-none block w-full px-0 py-2.5 text-sm bg-transparent border-b-2 peer" placeholder=" " required />
              <label htmlFor="floating_phone" className="absolute text-sm duration-300 transform scale-75 top-3 -z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number</label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input type="text" id="floating_company" className="outline-none block w-full px-0 py-2.5 text-sm bg-transparent border-b-2 peer" placeholder=" " required />
              <label htmlFor="floating_company" className="absolute text-sm duration-300 transform scale-75 top-3 -z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Company</label>
            </div>


            <div className="relative z-0 w-full mb-5 group">
              <textarea type="text" id="floating_company" className="outline-none block w-full px-0 py-2.5 text-sm bg-transparent border-b-2 peer" placeholder=" " required />
              <label htmlFor="floating_company" className="absolute text-sm duration-300 transform scale-75 top-3 -z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Tell me anout your query</label>
            </div>

          </div>

          <button type="submit" className="w-full px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none">
            Submit
          </button>
        </form>

      </div>
    </div>
    {/* </div> */}

      

    </>
    );
  }

  export default Contact;
