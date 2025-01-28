import React,{useState} from 'react'
import Carousel from '../components/Carousel'


const Home = () => {
    const [isOpen, setIsOpen] = useState(false);
  return (
    
    <>
    <Carousel/>
    <br />
    <div className="flex flex-col items-center text-center p-6 bg-white shadow-lg rounded-lg">
  <h2 className="text-orange-600 text-xl font-bold mb-2">
    CREATING IMPACT SINCE 2025
  </h2>
  <p className="text-gray-700 max-w-xl mb-6">
    For over 20 years, Jeevan Asha has been working for the upliftment of the
    underserved communities through Education and Health
  </p>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
    <div className="flex flex-col items-center">
      <span className="text-black text-2xl font-bold">4822</span>
      <span className="text-gray-600">Underprivileged Children Educated</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-black text-2xl font-bold">2491</span>
      <span className="text-gray-600">Long Term Impact and Care</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-black text-2xl font-bold">40000+</span>
      <span className="text-gray-600">Reach (Consultation, Camps, Awareness)</span>
    </div>
  </div>
</div>

{/* OUR VISION */} <br />
    <div className="bg-orange-500 text-white text-center py-10 px-6 h-70 flex flex-col justify-center items-center">
    <div className="bg-white text-orange-600 font-bold text-2xl px-6 py-3 rounded-lg inline-block shadow-md"> OUR VISION</div>
    <p className="text-lg font-semibold mt-6 max-w-3xl mx-auto leading-relaxed">
        TO BRING HOPE TO MANY LIVES AS WE SERVE DIFFERENT COMMUNITIES
        THROUGH VARIOUS PROJECTS IN THANE AND BEYOND
    </p>
    </div>

    

{/* card  */} <br />
<div>
      {/* Card Layout */}
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden border h-96">
        {/* Left: Single Image */}
        <div className="w-full md:w-1/2 h-full">
          <img src="../public/p1.jpg" alt="Food Donation" className="w-full h-full object-cover" />
        </div>

        {/* Right: Content Section */}
        <div className="p-6 w-full md:w-1/2 flex flex-col text-left h-full">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Donate Food</h2>
          <p className="text-gray-700 mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque vel quos magnam doloremque quas. Distinctio error a culpa repellat, officiis autem dignissimos, id quisquam, atque reiciendis eveniet voluptatum inventore praesentium tempora eaque optio molestias commodi modi tenetur labore quasi nihil? Fuga nisi facere excepturi maiores repellat consequatur sapiente est asperiores non, quisquam ex molestias fugiat omnis eaque porro fugit commodi temporibus necessitatibus similique hic, officia quibusdam quaerat minus natus. Reprehenderit est facere necessitatibus deleniti, magni accusamus amet. Fugiat libero nam accusantium harum mollitia iste molestiae porro voluptate magni ullam. Aspernatur vero ipsum in eos fuga eveniet nobis earum vitae atque.
          </p>
          <button 
            onClick={() => setIsOpen(true)} 
            className="mt-4 border border-black px-3 py-2 rounded-full text-black hover:bg-gray-200 transition w-32"
          >
            Read More
          </button>
        </div>
      </div>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-gray-900">Donate Food Details</h2>
            <p className="text-gray-700 mt-2">
              This project focuses on helping underprivileged communities by providing food donations.
              Join us to make a difference in people's lives.
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit quam, quis praesentium qui hic amet consequuntur excepturi nulla obcaecati. Similique incidunt architecto harum nemo alias, dolorum, quaerat voluptas, esse labore deserunt culpa veritatis? Magni voluptas a perferendis distinctio sint fugiat, inventore delectus ab natus consequuntur officiis quis labore illum nesciunt.
            </p>
            <button 
              onClick={() => setIsOpen(false)} 
              className="mt-4 border border-black px-4 py-2 rounded-md text-black hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>

<br />

    </>
  )
}

export default Home