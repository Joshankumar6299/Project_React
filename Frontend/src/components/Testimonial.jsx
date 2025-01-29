import React from 'react';

const Testimonial = () => {
  return (
    <div id="default-carousel" className="relative w-full" data-carousel="slide">
      {/* Title */}
      <div className="text-center py-10 px-6">
        <h2 className="bg-white text-orange-600 font-bold text-2xl px-6 py-3 rounded-lg shadow-md inline-block">
          Testimonial
        </h2>
      </div>

      {/* Carousel */}
      <div className="relative h-auto overflow-hidden rounded-lg md:h-96">
        {[
          { img: '../public/p1.jpg', text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae quis eveniet cum amet tenetur maxime odio accusamus qui iusto, repellendus temporibus possimus aliquid ipsa aperiam rerum, sint eos! Optio, unde minima earum debitis voluptates iusto dignissimos nobis! Veritatis rem animi voluptates vitae modi. Cum sunt quasi tenetur ullam a aspernatur.' },
          { img: '../public/p2.jpg', text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae quis eveniet cum amet tenetur maxime odio accusamus qui iusto, repellendus temporibus possimus aliquid ipsa aperiam rerum, sint eos! Optio, unde minima earum debitis voluptates iusto dignissimos nobis! Veritatis rem animi voluptates vitae modi. Cum sunt quasi tenetur ullam a aspernatur.' },
          { img: '../public/p3.jpg', text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae quis eveniet cum amet tenetur maxime odio accusamus qui iusto, repellendus temporibus possimus aliquid ipsa aperiam rerum, sint eos! Optio, unde minima earum debitis voluptates iusto dignissimos nobis! Veritatis rem animi voluptates vitae modi. Cum sunt quasi tenetur ullam a aspernatur.' },
        ].map((item, index) => (
          <div key={index} className="hidden duration-700 ease-in-out flex flex-col md:flex-row items-center gap-6 p-6" data-carousel-item>
            {/* Image on Top for Mobile, Left for Desktop */}
            <img src={item.img} className="w-full md:w-1/2 h-64 md:h-96 object-cover rounded-lg shadow-md" alt="Testimonial" />

            {/* Text & Button */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center md:text-left">
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{item.text}</p>

              {/* Button */}
              <button className="mt-6 border border-black px-4 py-2 rounded-full text-black hover:bg-gray-200 transition w-40">
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Controls */}
      <div className="absolute z-30 flex bottom-5 left-1/2 -translate-x-1/2 space-x-3">
        {[...Array(3)].map((_, index) => (
          <button key={index} type="button" className="w-3 h-3 rounded-full bg-gray-400 hover:bg-gray-600 transition" aria-label={`Slide ${index + 1}`} data-carousel-slide-to={index}></button>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button type="button" className="absolute top-1/2 left-4 transform -translate-y-1/2 z-30 flex items-center justify-center h-10 w-10 rounded-full bg-white/30 hover:bg-white/50 transition" data-carousel-prev>
        <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1L1 5l4 4" />
        </svg>
      </button>
      <button type="button" className="absolute top-1/2 right-4 transform -translate-y-1/2 z-30 flex items-center justify-center h-10 w-10 rounded-full bg-white/30 hover:bg-white/50 transition" data-carousel-next>
        <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 9l4-4-4-4" />
        </svg>
      </button>
    </div>
  );
};

export default Testimonial;
