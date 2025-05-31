import React, { useState, useRef, useEffect } from 'react';
import { Brain, Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Debugging logs
  useEffect(() => {
    console.log('Mobile menu state:', isMenuOpen);
  }, [isMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('.mobile-menu-toggle')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    console.log('Toggling menu from', isMenuOpen, 'to', !isMenuOpen);
    setIsMenuOpen(prev => !prev);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              AI Kid Tutor
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {['Home', 'Features', 'About', 'Pricing', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-700 hover:text-pink-500 font-medium text-sm sm:text-base transition-colors duration-300"
              >
                {item}
              </a>
            ))}

            {/* Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center bg-gradient-to-r from-pink-500 to-blue-500 text-white px-3 py-1 sm:px-5 sm:py-2 rounded-full hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                Accounts <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 sm:w-44 bg-white rounded-lg sm:rounded-xl shadow-xl ring-1 ring-pink-100 z-10">
                  <button
                    onClick={() => navigate('/register')}
                    className="block w-full text-left px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-100 hover:to-blue-100 hover:text-pink-600 rounded-t-lg sm:rounded-t-xl"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="block w-full text-left px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-100 hover:to-blue-100 hover:text-blue-600 rounded-b-lg sm:rounded-b-xl"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button 
            className="md:hidden p-2 mobile-menu-toggle" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div 
          ref={mobileMenuRef}
          className={`md:hidden bg-white border-t transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-2">
            {['Home', 'Features', 'About', 'Pricing', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-pink-500 text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="border-t mt-2 pt-2 space-y-2">
              <button
                onClick={() => navigate('/register')}
                className="block w-full text-left px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-pink-500 text-base"
              >
                Register
              </button>
              <button
                onClick={() => navigate('/login')}
                className="block w-full text-left px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-pink-500 text-base"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;