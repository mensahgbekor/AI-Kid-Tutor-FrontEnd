import React, { useState } from 'react';
import { Brain, Menu, X, ChevronDown } from 'lucide-react';

const SidebarLayout = ({ setActiveSection, setShowSignup, setShowLogin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const menuItems = ['Home', 'Features', 'About', 'Pricing', 'Contact'];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r shadow-lg sticky top-0 h-screen z-40">
        <div className="flex items-center justify-center h-20 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              AI Kid Tutor
            </span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-4">
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveSection?.(item.toLowerCase())}
              className="w-full text-left text-gray-700 hover:text-pink-500 px-2 py-2 rounded-lg hover:bg-pink-50 transition"
            >
              {item}
            </button>
          ))}

          {/* Dropdown */}
          <div className="mt-6">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg hover:shadow-md transition"
            >
              Accounts
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {showDropdown && (
              <div className="mt-2 bg-white shadow-md rounded-lg overflow-hidden border border-pink-100">
                <button
                  onClick={() => setShowSignup?.(true)}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50"
                >
                  Register
                </button>
                <button
                  onClick={() => setShowLogin?.(true)}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Main Content + Mobile Navbar */}
      <div className="flex-1">
        {/* Topbar (mobile) */}
        <div className="md:hidden sticky top-0 bg-white z-50 flex items-center justify-between px-4 py-4 shadow-md">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              AI Kid Tutor
            </span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Slide Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 py-2 bg-white border-b shadow-sm space-y-2">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveSection?.(item.toLowerCase());
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-gray-700 hover:text-pink-500 py-2"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => {
                setShowSignup?.(true);
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-700 hover:text-pink-500 py-2"
            >
              Register
            </button>
            <button
              onClick={() => {
                setShowLogin?.(true);
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-700 hover:text-blue-500 py-2"
            >
              Login
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="p-6">
          {/* Your routed or main content goes here */}
          <h1 className="text-2xl font-bold text-gray-800">Welcome to AI Kid Tutor</h1>
          <p className="mt-2 text-gray-600">This is your main content area.</p>
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
