import React, { useState } from 'react';
import { Brain, Twitter, Instagram, Facebook, Linkedin, Github, Heart, Sparkles, Star, ArrowUp } from 'lucide-react';

const Footer = () => {
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const socialIcons = [
    { Icon: Twitter, color: 'hover:text-blue-400', name: 'Twitter' },
    { Icon: Instagram, color: 'hover:text-pink-400', name: 'Instagram' },
    { Icon: Facebook, color: 'hover:text-blue-500', name: 'Facebook' },
    { Icon: Linkedin, color: 'hover:text-blue-600', name: 'LinkedIn' },
    { Icon: Github, color: 'hover:text-gray-300', name: 'GitHub' }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const FloatingElement = ({ children, delay = 0 }) => (
    <div 
      className="animate-float"
      style={{ 
        animationDelay: `${delay}s`,
        animationDuration: '6s'
      }}
    >
      {children}
    </div>
  );

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>
      
      <footer className="relative bg-gray-50 text-gray-700 border-t border-gray-200 overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Light Gradient Orbs */}
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-pink-100/50 to-purple-100/50 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 rounded-full blur-2xl" />
          
          {/* Floating Stars */}
          {[...Array(5)].map((_, i) => (
            <FloatingElement key={i} delay={i * 1.2}>
              <Star 
                className="absolute w-1 h-1 text-pink-300/40 fill-current"
                style={{
                  left: `${25 + (i * 15)}%`,
                  top: `${30 + (i * 10)}%`
                }}
              />
            </FloatingElement>
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Logo and Newsletter */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 group">
                  <div className="relative w-8 h-8 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    AI Kid Tutor
                  </span>
                  <Sparkles className="w-3 h-3 text-yellow-500 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                  Empowering young minds through AI-powered learning experiences. 
                  <span className="text-pink-600 font-medium"> Making education magical</span>, one lesson at a time! ✨
                </p>
              </div>

              {/* Social Icons */}
              <div className="flex space-x-3">
                {socialIcons.map(({ Icon, color, name }, index) => (
                  <a
                    key={index}
                    href="#"
                    onMouseEnter={() => setHoveredSocial(index)}
                    onMouseLeave={() => setHoveredSocial(null)}
                    className={`relative p-2 bg-white border border-gray-200 rounded-lg text-gray-500 ${color} transition-all duration-300 transform hover:scale-110 hover:shadow-md group`}
                    aria-label={name}
                  >
                    <Icon className="w-4 h-4" />
                    {hoveredSocial === index && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg">
                        {name}
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Quick Links
                </h3>
                <div className="w-6 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded" />
              </div>
              <ul className="space-y-2">
                {['Home', 'Features', 'About', 'Pricing', 'Contact'].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="group flex items-center text-gray-600 hover:text-pink-600 text-sm transition-all duration-300"
                    >
                      <span className="w-1 h-1 bg-pink-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {item}
                      <ArrowUp className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 rotate-45 transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Support */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Support
                </h3>
                <div className="w-6 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded" />
              </div>
              <ul className="space-y-2">
                {[
                  'Privacy Policy', 
                  'Terms of Service', 
                  'Help Center',
                  'Contact Support'
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="group flex items-center text-gray-600 hover:text-blue-600 text-sm transition-all duration-300"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent h-px" />
            <div className="pt-6 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
              <div className="flex items-center space-x-2">
                <p className="text-xs text-gray-500">
                  &copy; {new Date().getFullYear()} AI Kid Tutor. Made with
                </p>
                <Heart className="w-3 h-3 text-red-500 animate-pulse" />
                <p className="text-xs text-gray-500">for young learners</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <a href="#" className="text-xs text-gray-500 hover:text-pink-600 transition-colors duration-300">
                  Accessibility
                </a>
                <a href="#" className="text-xs text-gray-500 hover:text-pink-600 transition-colors duration-300">
                  Careers
                </a>
                
                {/* Back to Top Button */}
                <button
                  onClick={scrollToTop}
                  className="group p-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-110 shadow-sm"
                  aria-label="Back to top"
                >
                  <ArrowUp className="w-3 h-3 text-gray-600 group-hover:text-pink-600 transition-colors duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;