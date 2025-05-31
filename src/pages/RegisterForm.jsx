import React, { useState } from 'react';
import { User, Mail, Lock, UserCheck, Eye, EyeOff, BookOpen, UserPlus } from 'lucide-react';
import { apiRegister } from '../services/auth';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user'
    });
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleRegister = async () => {
    if (!formData.name.trim()) {
      showMessage('Please enter your full name.', 'error');
      return;
    }
    if (!formData.email.trim()) {
      showMessage('Please enter your email address.', 'error');
      return;
    }
    if (!formData.password.trim()) {
      showMessage('Please enter a password.', 'error');
      return;
    }
    if (formData.password.length < 6) {
      showMessage('Password must be at least 6 characters long.', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await apiRegister(formData);
      
      if (response && response.status >= 200 && response.status < 300) {
        showMessage('Registration successful! Your account has been created.', 'success');
        resetForm();
      } else {
        showMessage('Registration failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Registration failed. Please try again.';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full mb-3 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent mb-1">
            Join AI Kid Tutor
          </h1>
          <p className="text-gray-600 text-sm">
            Create your account and start learning today
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-center font-medium ${
            messageType === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-pink-100 text-pink-800 border border-pink-200'
          }`}>
            {message}
          </div>
        )}

        {/* Registration Form */}
        <div className="space-y-4">
          {/* Full Name Field */}
          <div className="relative group">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-pink-500" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 focus:outline-none bg-gray-50/50"
            />
          </div>

          {/* Email Field */}
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-pink-500" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 focus:outline-none bg-gray-50/50"
            />
          </div>

          {/* Password Field */}
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-pink-500" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (min. 6 characters)"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 focus:outline-none bg-gray-50/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Role Selection */}
          <div className="relative group">
            <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-pink-500" />
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 focus:outline-none bg-gray-50/50 appearance-none cursor-pointer"
            >
              <option value="user">Student</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full py-3 text-sm bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </div>
            )}
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-6 space-y-3 text-sm">
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-pink-600 hover:text-blue-600 font-medium hover:underline transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{' '}
              <button className="text-pink-600 hover:text-blue-600 hover:underline transition-colors">Terms</button>
              {' '}and{' '}
              <button className="text-pink-600 hover:text-blue-600 hover:underline transition-colors">Privacy</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;