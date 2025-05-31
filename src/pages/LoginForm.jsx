import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, BookOpen, LogIn, Shield } from 'lucide-react';
import { apiLogin } from '../services/auth';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleKeyPress = (e) => e.key === 'Enter' && handleLogin();

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setMessage({ text: 'Please fill in all fields', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await apiLogin(form);
      setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Login failed', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full mb-3 shadow-lg flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent mb-1">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to continue your journey</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg text-center ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-pink-100 text-pink-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 focus:outline-none"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500"
            >
              {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg hover:from-pink-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('/register')}
            className="text-pink-600 hover:text-blue-600 transition-colors duration-300 font-semibold"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;