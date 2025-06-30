// components/PricingSection.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // If using React Router

const Pricing = ({ setShowSignup }) => {
  // If using React Router
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free Trial",
      price: "Free",
      period: "7 days",
      features: [
        "Access to 5 AI lessons",
        "Basic progress tracking",
        "Simple games and quizzes",
        "Parent dashboard access",
        "Email support"
      ],
      color: "from-gray-500 to-gray-600",
      popular: false
    },
    {
      name: "Monthly Plan",
      price: "$19",
      period: "per month",
      features: [
        "Unlimited AI lessons",
        "Advanced progress analytics",
        "All games and activities",
        "Priority support",
        "Achievement certificates",
        "Voice interaction (coming soon)"
      ],
      color: "from-pink-500 to-purple-500",
      popular: true
    },
    {
      name: "Family Plan",
      price: "$49",
      period: "per month",
      features: [
        "Up to 4 children",
        "All Monthly Plan features",
        "Family progress dashboard",
        "Sibling challenges",
        "Premium support",
        "Early access to new features"
      ],
      color: "from-blue-500 to-green-500",
      popular: false
    }
  ];

  const handleButtonClick = () => {
    // Option 1: If you want to use React Router
    navigate('/register');
    
    // Option 2: If you want to use window.location
    // window.location.href = '/register';
    
    // Option 3: If you want to keep the modal approach
    // setShowSignup(true);
  };

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              Simple Pricing
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start with our free trial, then choose the plan that works best for your family.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                plan.popular ? 'ring-4 ring-pink-200 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500 ml-2">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleButtonClick}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg transform hover:scale-105'
                      : 'border-2 border-gray-300 text-gray-700 hover:border-pink-500 hover:text-pink-500'
                  }`}
                >
                  {plan.name === 'Free Trial' ? 'Start Free Trial' : 'Choose Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;