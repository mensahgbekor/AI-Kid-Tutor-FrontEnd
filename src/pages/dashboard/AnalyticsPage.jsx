import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Brain,
  Target,
  Award
} from 'lucide-react';
import AnalyticsDashboard from '../../components/AnalyticsDashboard';
import { childService, parentService } from '../../services/supabase';
import { useComprehensiveAnalytics } from '../../hooks/useAnalytics';

const AnalyticsPage = () => {
  const [selectedChild, setSelectedChild] = useState(null);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load children on component mount
  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user's parent profile
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        throw new Error('User not found');
      }

      // Get parent profile
      const parentProfile = await parentService.getParentProfile(user.id);
      if (!parentProfile) {
        throw new Error('Parent profile not found');
      }

      // Get children
      const childrenData = await childService.getChildrenByParent(parentProfile.id);
      setChildren(childrenData || []);

      // Select first child by default
      if (childrenData && childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
      }
    } catch (err) {
      console.error('Error loading children:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mr-4"></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Loading Analytics</h3>
                <p className="text-gray-600">Preparing your learning insights...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <BarChart3 className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to Load Analytics</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={loadChildren}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <Users className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Children Found</h3>
              <p className="text-gray-600 mb-4">
                You need to add child profiles to view analytics.
              </p>
              <button
                onClick={() => window.location.href = '/dashboard/children'}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Child Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                  <BarChart3 className="w-8 h-8 mr-3 text-blue-500" />
                  Learning Analytics
                </h1>
                <p className="text-gray-600 mt-1">
                  Comprehensive insights into your child's learning journey
                </p>
              </div>
              
              {/* Child Selector */}
              {children.length > 1 && (
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">
                    Select Child:
                  </label>
                  <select
                    value={selectedChild?.id || ''}
                    onChange={(e) => {
                      const child = children.find(c => c.id === e.target.value);
                      setSelectedChild(child);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {children.map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.name} (Age {child.age})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Analytics Dashboard */}
        {selectedChild && (
          <motion.div
            key={selectedChild.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnalyticsDashboard
              childId={selectedChild.id}
              childProfile={selectedChild}
            />
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="flex items-center justify-center space-x-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <Eye className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-medium">View Detailed Report</span>
              </button>
              
              <button className="flex items-center justify-center space-x-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-medium">Export Data</span>
              </button>
              
              <button className="flex items-center justify-center space-x-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <Brain className="w-5 h-5 text-purple-600" />
                <span className="text-purple-600 font-medium">AI Insights</span>
              </button>
              
              <button className="flex items-center justify-center space-x-2 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                <Calendar className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-600 font-medium">Schedule Review</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Analytics Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Analytics Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Performance Tracking</h4>
                <p className="text-sm text-gray-600">
                  Monitor learning progress and identify trends over time
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">AI Insights</h4>
                <p className="text-sm text-gray-600">
                  Get personalized recommendations based on learning patterns
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Goal Tracking</h4>
                <p className="text-sm text-gray-600">
                  Set and monitor learning goals with detailed progress reports
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-yellow-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Achievement System</h4>
                <p className="text-sm text-gray-600">
                  Track milestones, badges, and learning achievements
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;