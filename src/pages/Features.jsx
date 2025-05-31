// components/FeaturesSection.js
import React from 'react';
import { Brain, Gamepad2, BookOpen, Shield, Users, Trophy } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Brain className="w-5 h-5 md:w-6 lg:w-7 xl:w-8" />,
      title: "AI-Powered Learning",
      description: "Personalized lessons that adapt to your child's learning pace and style",
      color: "from-pink-500 to-purple-500"
    },
    {
      icon: <Gamepad2 className="w-5 h-5 md:w-6 lg:w-7 xl:w-8" />,
      title: "Gamified Experience",
      description: "Turn learning into an adventure with points, badges, and rewards",
      color: "from-blue-500 to-green-500"
    },
    {
      icon: <BookOpen className="w-5 h-5 md:w-6 lg:w-7 xl:w-8" />,
      title: "Interactive Content",
      description: "Engaging videos, quizzes, and hands-on activities for better retention",
      color: "from-green-500 to-yellow-500"
    },
    {
      icon: <Shield className="w-5 h-5 md:w-6 lg:w-7 xl:w-8" />,
      title: "Safe Environment",
      description: "Child-safe platform with parental controls and progress monitoring",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Users className="w-5 h-5 md:w-6 lg:w-7 xl:w-8" />,
      title: "Parent Dashboard",
      description: "Track your child's progress and celebrate their achievements",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Trophy className="w-5 h-5 md:w-6 lg:w-7 xl:w-8" />,
      title: "Achievement System",
      description: "Motivate learning with certificates, trophies, and skill badges",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section id="features" className="py-10 md:py-14 lg:py-18 xl:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="text-center mb-8 md:mb-10 lg:mb-12 xl:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl font-bold mb-3 sm:mb-4 md:mb-5">
            <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              Amazing Features
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
            Our AI-powered platform combines education with entertainment to create 
            an engaging learning experience your kids will love.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white p-5 sm:p-6 md:p-7 lg:p-8 rounded-lg md:rounded-xl lg:rounded-2xl shadow-sm hover:shadow-md md:hover:shadow-lg lg:hover:shadow-xl transform hover:-translate-y-1 md:hover:-translate-y-1.5 lg:hover:-translate-y-2 transition-all duration-300 ease-in-out"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${feature.color} rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center text-white mb-3 sm:mb-4 md:mb-5 transform hover:rotate-12 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4">{feature.title}</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;