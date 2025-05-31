import React from 'react';
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import Features from './pages/Features';
import HeroSection from './pages/HeroSection';
import Pricing from './pages/Pricing';

function App() {
  const router = createBrowserRouter ([
    {path: "/", element: <HomePage />},
    {path: "login", element: <LoginForm />},
    {path: "register", element: <RegisterForm />},
    {path: "about", element: <AboutPage />},
     {path: "features", element: <Features />},
          {path: "hero", element: <HeroSection />},
               {path: "price", element: <Pricing />},



  ]);
  

  return <RouterProvider router={router}/>;
    
  
}

export default App;
