import React from 'react';

const Testimonial = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What People Say
          </h2>
          <div className="w-24 h-1 bg-orange-600 mx-auto"></div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            {[
              {
                img: '/p1.jpg',
                text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae quis eveniet cum amet tenetur maxime odio accusamus qui iusto, repellendus temporibus possimus aliquid ipsa.',
                author: 'John Doe',
                position: 'Community Member'
              },
              {
                img: '/p2.jpg',
                text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae quis eveniet cum amet tenetur maxime odio accusamus qui iusto, repellendus temporibus possimus aliquid ipsa.',
                author: 'Jane Smith',
                position: 'Volunteer'
              },
              {
                img: '/p3.jpg',
                text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae quis eveniet cum amet tenetur maxime odio accusamus qui iusto, repellendus temporibus possimus aliquid ipsa.',
                author: 'Mike Johnson',
                position: 'Donor'
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/2 h-64 md:h-auto">
                    <img
                      src={item.img}
                      alt="Testimonial"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 w-full md:w-1/2 flex flex-col justify-between">
                    <div>
                      <p className="text-gray-700 text-lg leading-relaxed mb-6">
                        "{item.text}"
                      </p>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">
                          {item.author}
                        </h4>
                        <p className="text-orange-600">{item.position}</p>
                      </div>
                    </div>
                    <button className="mt-6 bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition-colors duration-300 w-full md:w-auto">
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            type="button"
            className="absolute top-1/2 left-4 transform -translate-y-1/2 z-30 flex items-center justify-center h-12 w-12 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors duration-300"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1L1 5l4 4"
              />
            </svg>
          </button>
          <button
            type="button"
            className="absolute top-1/2 right-4 transform -translate-y-1/2 z-30 flex items-center justify-center h-12 w-12 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors duration-300"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 9l4-4-4-4"
              />
            </svg>
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {[...Array(3)].map((_, index) => (
              <button
                key={index}
                type="button"
                className="w-3 h-3 rounded-full bg-orange-600 hover:bg-orange-700 transition-colors duration-300"
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
