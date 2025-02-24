import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "flowbite";

const Carousel = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <>
      <div id="default-carousel" className="relative w-full" data-carousel="slide">
        <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="hidden duration-700 ease-in-out" data-carousel-item>
              <img
                src={`../public/p${num}.jpg`}
                className="absolute block w-full h-150 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                alt={`Slide ${num}`}
              />
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
          {[0, 1, 2, 3, 4].map((num) => (
            <button
              key={num}
              type="button"
              className="w-3 h-3 rounded-full"
              aria-label={`Slide ${num + 1}`}
              data-carousel-slide-to={num}
            ></button>
          ))}
        </div>

        <button
          type="button"
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-prev
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
            <svg
              className="w-4 h-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </span>
        </button>

        <button
          type="button"
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-next
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
            <svg
              className="w-4 h-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </span>
        </button>
      </div>

      {/* Donate Now Button */}
      <div className="absolute w-full h-[500px] bg-cover bg-center">
        <button
          onClick={() => navigate("/donate")} // Navigate to Donate page
          className="absolute bottom-[400px] left-10 bg-[#062B40] text-white px-6 py-4 
                     text-lg flex items-center rounded-lg no-underline z-10"
        >
          Donate Now
          <span className="ml-2 bg-orange-500 px-3 py-2 rounded-full">→</span>
        </button>
      </div>
    </>
  );
};

export default Carousel;
