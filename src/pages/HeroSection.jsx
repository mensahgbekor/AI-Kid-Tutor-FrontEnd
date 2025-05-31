// components/HeroSection.js
import React, { useState, useEffect } from 'react';
import { Play, Brain, Trophy, Star } from 'lucide-react';

const HeroSection = ({ setShowSignup }) => {
  const [floatingElements, setFloatingElements] = useState([]);

  useEffect(() => {
    const elements = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      speed: Math.random() * 2 + 1,
      color: ['bg-pink-300', 'bg-blue-300', 'bg-green-300', 'bg-yellow-300', 'bg-purple-300'][Math.floor(Math.random() * 5)]
    }));
    setFloatingElements(elements);
  }, []);

  return (
    <section id="home" className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Floating Elements */}
      {floatingElements.map((element) => (
        <div
          key={element.id}
          className={`absolute ${element.color} rounded-full opacity-60 animate-pulse`}
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            animationDelay: `${element.id * 0.5}s`,
            animationDuration: `${element.speed + 2}s`
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                AI Learning
              </span>
              <br />
              <span className="text-gray-800">Made Fun!</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Transform your child's learning journey with our AI-powered educational platform. 
              Interactive lessons, games, and personalized learning paths designed for kids aged 5-12.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <button
                onClick={() => setShowSignup(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-2" />
                Start Free Trial
              </button>
              <a
                href="#features"
                className="border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:border-pink-500 hover:text-pink-500 transition-all duration-300"
              >
                Learn More
              </a>
            </div>
            <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 lg:space-x-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-pink-500">1000+</div>
                <div className="text-xs sm:text-sm text-gray-600">Happy Kids</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-500">50+</div>
                <div className="text-xs sm:text-sm text-gray-600">AI Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-500">98%</div>
                <div className="text-xs sm:text-sm text-gray-600">Parent Satisfaction</div>
              </div>
            </div>
          </div>

          <div className="relative mt-10 sm:mt-12 lg:mt-0">
            <div className="relative z-10 bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl p-6 sm:p-8 transform rotate-1 sm:rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="bg-gradient-to-br from-pink-100 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="text-sm sm:text-base font-semibold">AI Challenge Complete!</span>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="text-center py-6 sm:py-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Great job, Emma!</h3>
                  <p className="text-sm sm:text-base text-gray-600">You've mastered AI basics and earned 50 points!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;