// components/AboutSection.js
import React from 'react';
import { Heart, Users } from 'lucide-react';
import NavBar from '../components/Navbar';

const AboutPage = () => {
  return (
    <>
      <NavBar />
      <section id="about" className="py-10 sm:py-14 md:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-5">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  About AI Kid Tutor
                </span>
              </h2>
              <div className="space-y-3 sm:space-y-4 md:space-y-5 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                <p>
                  At AI Kid Tutor, we believe that learning should be an exciting adventure. 
                  Our mission is to make AI education accessible, engaging, and fun for children 
                  aged 5-12, preparing them for a future where AI literacy is essential.
                </p>
                <p>
                  Based in Ghana, we're committed to bridging the digital divide by providing 
                  high-quality AI education to children everywhere, with special provisions for 
                  underprivileged families through our free access initiatives.
                </p>
                <p>
                  Our platform combines cutting-edge AI technology with child psychology 
                  principles to create personalized learning experiences that adapt to each 
                  child's unique needs and learning style.
                </p>
              </div>
              <div className="mt-5 sm:mt-6 md:mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div className="text-center p-3 sm:p-4 md:p-6 bg-white rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-red-500 mx-auto mb-1 sm:mb-2" />
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">5-12</div>
                  <div className="text-xs md:text-sm text-gray-600">Age Range</div>
                </div>
                <div className="text-center p-3 sm:p-4 md:p-6 bg-white rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-blue-500 mx-auto mb-1 sm:mb-2" />
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Ghana</div>
                  <div className="text-xs md:text-sm text-gray-600">Based In</div>
                </div>
              </div>
            </div>

            <div className="relative mt-6 sm:mt-8 md:mt-10 lg:mt-0">
              <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg md:shadow-xl lg:shadow-2xl p-5 sm:p-6 md:p-7 lg:p-8 transform -rotate-1 md:-rotate-2 hover:rotate-0 transition-transform duration-500 ease-in-out">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-center">Our Mission</h3>
                  <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-[10px] sm:text-xs">✓</span>
                      </div>
                      <span className="text-xs sm:text-sm md:text-base">Make AI education accessible to all</span>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-[10px] sm:text-xs">✓</span>
                      </div>
                      <span className="text-xs sm:text-sm md:text-base">Create engaging learning experiences</span>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-[10px] sm:text-xs">✓</span>
                      </div>
                      <span className="text-xs sm:text-sm md:text-base">Prepare kids for the AI future</span>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-[10px] sm:text-xs">✓</span>
                      </div>
                      <span className="text-xs sm:text-sm md:text-base">Bridge the digital divide</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;