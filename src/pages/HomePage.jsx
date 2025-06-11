// App.js
import React, { useState, useEffect } from 'react';
import NavBar from '../components/Navbar';
import HeroSection from './HeroSection';
import Features from './Features';
import AboutPage from './AboutPage';
import Pricing from './Pricing';
import ContactForm from './ContactForm';
import Footer from '../components/Footer';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="min-h-screen">
      <NavBar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        setActiveSection={setActiveSection}
        setShowSignup={setShowSignup}
      />
      
      <HeroSection setShowSignup={setShowSignup} />
      <Features />
      <AboutPage/>
      <Pricing setShowSignup={setShowSignup} />
      <ContactForm />
              <Footer/>

      
      {showSignup && (
        <SignupModal 
          showSignup={showSignup}
          setShowSignup={setShowSignup}
        />
      )}
    </div>
  );
};

export default HomePage;