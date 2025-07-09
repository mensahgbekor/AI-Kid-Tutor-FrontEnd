import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Brain,
  Award,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Eye,
  BookOpen,
  Star,
  Zap
} from 'lucide-react';
import { useComprehensiveAnalytics } from '../hooks/useAnalytics';

const AnalyticsDashboard = ({ childId, childProfile }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [activeTab, setActiveTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(false);

  const {
    generateAllReports,
    isLoading,
    hasError,
    data,
    realTimeAnalytics,
    sessionTracking,
    quizAnalytics
  } = useComprehensiveAnalytics(childId);

  useEffect(() => {
    if (childId) {
      generateAllReports(selectedTimeframe);
    }
  }, [childId, selectedTimeframe, generateAllReports]);

  // Auto-refresh every 5 minutes if enabled
  useEffect(() => {
    if (autoRefresh && childId) {
      const interval = setInterval(() => {
        generateAllReports(selectedTimeframe);
      }, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, childId, selectedTimeframe, generateAllReports]);

  const handleRefresh = () => {
    generateAllReports(selectedTimeframe);
  };

  const handleExportReport = () => {
    // Implementation for exporting reports
    const reportData = {
      child: childProfile,
      timeframe: selectedTimeframe,
      generated_at: new Date().toISOString(),
      ...data
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${childProfile?.name || 'child'}-analytics-${selectedTimeframe}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading && !data.aiReport) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mr-4"></div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Generating Analytics Report</h3>
            <p className="text-gray-600">Processing learning data and insights...</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasError && !data.aiReport) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <BarChart3 className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to Load Analytics</h3>
          <p className="text-gray-600 mb-4">There was an error loading the analytics data.</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-blue-500" />
              Analytics Dashboard
            </h2>
            <p className="text-gray-600">
              Comprehensive learning insights for {childProfile?.name}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Timeframe Selector */}
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
            </select>
            
            {/* Auto-refresh Toggle */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-600">Auto-refresh</span>
            </label>
            
            {/* Action Buttons */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            
            <button
              onClick={handleExportReport}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'performance', label: 'Performance', icon: TrendingUp },
              { id: 'progress', label: 'Progress', icon: Target },
              { id: 'insights', label: 'Insights', icon: Brain }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab 
          data={data} 
          childProfile={childProfile} 
          timeframe={selectedTimeframe}
        />
      )}
      
      {activeTab === 'performance' && (
        <PerformanceTab 
          data={data} 
          childProfile={childProfile} 
          timeframe={selectedTimeframe}
        />
      )}
      
      {activeTab === 'progress' && (
        <ProgressTab 
          data={data} 
          childProfile={childProfile} 
          timeframe={selectedTimeframe}
        />
      )}
      
      {activeTab === 'insights' && (
        <InsightsTab 
          data={data} 
          childProfile={childProfile} 
          timeframe={selectedTimeframe}
        />
      )}
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ data, childProfile, timeframe }) => {
  const aiReport = data.aiReport;
  const progressReport = data.progressReport;
  
  if (!aiReport || !progressReport) {
    return <div className="text-center py-8 text-gray-500">Loading overview data...</div>;
  }

  const stats = [
    {
      title: 'Total Learning Time',
      value: `${Math.round((progressReport.time_analysis?.total_time_hours || 0) * 10) / 10}h`,
      change: '+12%',
      trend: 'up',
      icon: Clock,
      color: 'blue'
    },
    {
      title: 'Sessions Completed',
      value: progressReport.session_tracking?.total_sessions || 0,
      change: '+8%',
      trend: 'up',
      icon: BookOpen,
      color: 'green'
    },
    {
      title: 'Average Score',
      value: `${Math.round(aiReport.performance_analysis?.average_quiz_score || 0)}%`,
      change: aiReport.learning_trends?.change_percentage ? `${aiReport.learning_trends.change_percentage > 0 ? '+' : ''}${aiReport.learning_trends.change_percentage}%` : '0%',
      trend: aiReport.learning_trends?.trend === 'improving' ? 'up' : aiReport.learning_trends?.trend === 'declining' ? 'down' : 'stable',
      icon: Target,
      color: 'purple'
    },
    {
      title: 'Achievements',
      value: progressReport.achievement_system?.achievements_earned || 0,
      change: '+3',
      trend: 'up',
      icon: Award,
      color: 'yellow'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <div className={`flex items-center mt-2 text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  <TrendingUp className={`w-4 h-4 mr-1 ${
                    stat.trend === 'down' ? 'rotate-180' : ''
                  }`} />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity & Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {progressReport.activity_timeline?.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${
                  activity.type === 'session' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                }`}>
                  {activity.type === 'session' ? <BookOpen className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.title}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(activity.date).toLocaleDateString()} • 
                    {activity.type === 'session' ? 
                      ` ${activity.completion}% completed` : 
                      ` ${activity.score}% score`
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Quick Insights
          </h3>
          <div className="space-y-4">
            {aiReport.recommendations?.slice(0, 3).map((rec, index) => (
              <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-600' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <Brain className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{rec.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{rec.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Performance Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Subject Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(aiReport.subject_analysis || {}).map(([subject, data]) => (
            <div key={subject} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800 capitalize">{subject}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  data.strength_level === 'strong' ? 'bg-green-100 text-green-800' :
                  data.strength_level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {data.strength_level}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completion:</span>
                  <span className="font-medium">{Math.round(data.average_completion)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quiz Score:</span>
                  <span className="font-medium">{Math.round(data.average_quiz_score)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sessions:</span>
                  <span className="font-medium">{data.sessions}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Performance Tab Component
const PerformanceTab = ({ data, childProfile, timeframe }) => {
  const aiReport = data.aiReport;
  
  if (!aiReport) {
    return <div className="text-center py-8 text-gray-500">Loading performance data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Performance Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Performance Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(aiReport.performance_analysis?.average_quiz_score || 0)}%
            </div>
            <div className="text-sm text-gray-600">Average Quiz Score</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(aiReport.performance_analysis?.average_completion_rate || 0)}%
            </div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {aiReport.performance_analysis?.learning_consistency || 0}%
            </div>
            <div className="text-sm text-gray-600">Consistency</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {aiReport.performance_analysis?.improvement_rate || 0}%
            </div>
            <div className="text-sm text-gray-600">Improvement Rate</div>
          </div>
        </div>
      </div>

      {/* Learning Trends */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Learning Trends</h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-gray-800">Overall Trend</h4>
              <p className="text-sm text-gray-600">
                {aiReport.learning_trends?.trend === 'improving' ? 'Performance is improving' :
                 aiReport.learning_trends?.trend === 'declining' ? 'Performance needs attention' :
                 'Performance is stable'}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              aiReport.learning_trends?.trend === 'improving' ? 'bg-green-100 text-green-800' :
              aiReport.learning_trends?.trend === 'declining' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {aiReport.learning_trends?.strength || 'Stable'}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Recent Average:</span>
              <span className="ml-2 font-medium">{aiReport.learning_trends?.recent_average || 0}%</span>
            </div>
            <div>
              <span className="text-gray-600">Previous Average:</span>
              <span className="ml-2 font-medium">{aiReport.learning_trends?.previous_average || 0}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths and Areas for Improvement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Strengths
          </h3>
          <div className="space-y-3">
            {aiReport.areas_for_improvement?.filter(area => area.priority !== 'high').slice(0, 3).map((strength, index) => (
              <div key={index} className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800">{strength.area}</h4>
                <p className="text-sm text-green-600 mt-1">{strength.suggestion}</p>
              </div>
            )) || [
              <div key="default" className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800">Consistent Learning</h4>
                <p className="text-sm text-green-600 mt-1">Shows regular engagement with learning activities</p>
              </div>
            ]}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-red-500" />
            Areas for Improvement
          </h3>
          <div className="space-y-3">
            {aiReport.areas_for_improvement?.slice(0, 3).map((area, index) => (
              <div key={index} className="p-3 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-800">{area.area}</h4>
                <p className="text-sm text-red-600 mt-1">{area.suggestion}</p>
                <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                  area.priority === 'high' ? 'bg-red-100 text-red-800' :
                  area.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {area.priority} priority
                </span>
              </div>
            )) || [
              <div key="default" className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-center">No specific areas identified for improvement</p>
              </div>
            ]}
          </div>
        </div>
      </div>
    </div>
  );
};

// Progress Tab Component
const ProgressTab = ({ data, childProfile, timeframe }) => {
  const progressReport = data.progressReport;
  
  if (!progressReport) {
    return <div className="text-center py-8 text-gray-500">Loading progress data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Session Tracking */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Session Tracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {progressReport.session_tracking?.total_sessions || 0}
            </div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {progressReport.session_tracking?.completed_sessions || 0}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {progressReport.session_tracking?.partial_sessions || 0}
            </div>
            <div className="text-sm text-gray-600">Partial</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {progressReport.session_tracking?.incomplete_sessions || 0}
            </div>
            <div className="text-sm text-gray-600">Incomplete</div>
          </div>
        </div>
        
        {/* Completion Rate Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Completion Rate</span>
            <span className="font-medium">{progressReport.session_tracking?.completion_rate || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressReport.session_tracking?.completion_rate || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Time Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Time Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {progressReport.time_analysis?.total_time_hours || 0}h
            </div>
            <div className="text-sm text-gray-600">Total Time</div>
          </div>
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">
              {progressReport.time_analysis?.average_session_time || 0}m
            </div>
            <div className="text-sm text-gray-600">Avg Session</div>
          </div>
          <div className="text-center p-4 bg-cyan-50 rounded-lg">
            <div className="text-2xl font-bold text-cyan-600">
              {progressReport.time_analysis?.daily_average || 0}m
            </div>
            <div className="text-sm text-gray-600">Daily Average</div>
          </div>
        </div>
      </div>

      {/* Achievement System */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-yellow-500" />
          Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Total Points</span>
              <span className="text-2xl font-bold text-yellow-600">
                {progressReport.achievement_system?.total_points || 0}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Achievements Earned</span>
              <span className="text-xl font-bold text-green-600">
                {progressReport.achievement_system?.achievements_earned || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Current Streak</span>
              <span className="text-xl font-bold text-orange-600">
                {progressReport.achievement_system?.current_streak || 0} days
              </span>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Recent Achievements</h4>
            <div className="space-y-2">
              {progressReport.achievement_system?.achievements?.filter(a => a.earned).slice(0, 3).map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
                  <span className="text-lg">{achievement.type === 'sessions' ? '📚' : achievement.type === 'quiz' ? '🧠' : '🔥'}</span>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{achievement.title}</p>
                    <p className="text-xs text-gray-600">{achievement.type}</p>
                  </div>
                </div>
              )) || [
                <div key="no-achievements" className="text-center text-gray-500 py-4">
                  No achievements yet - keep learning!
                </div>
              ]}
            </div>
          </div>
        </div>
        
        {/* Next Milestone */}
        {progressReport.achievement_system?.next_milestone && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Next Milestone</h4>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">{progressReport.achievement_system.next_milestone.title}</span>
              <span className="font-medium">
                {progressReport.achievement_system.next_milestone.current} / {progressReport.achievement_system.next_milestone.target}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(progressReport.achievement_system.next_milestone.current / progressReport.achievement_system.next_milestone.target) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Insights Tab Component
const InsightsTab = ({ data, childProfile, timeframe }) => {
  const insights = data.insights;
  
  if (!insights) {
    return <div className="text-center py-8 text-gray-500">Loading insights data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Weekly Analytics */}
      {insights.weekly_analytics && insights.weekly_analytics.status !== 'insufficient_data' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {insights.weekly_analytics.total_learning_time}m
              </div>
              <div className="text-sm text-gray-600">Learning Time</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {insights.weekly_analytics.total_sessions}
              </div>
              <div className="text-sm text-gray-600">Sessions</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {insights.weekly_analytics.average_score}%
              </div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {insights.weekly_analytics.days_active}
              </div>
              <div className="text-sm text-gray-600">Active Days</div>
            </div>
          </div>
          
          {/* Learning Pattern */}
          {insights.weekly_analytics.learning_pattern && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Learning Pattern</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-medium capitalize">{insights.weekly_analytics.learning_pattern.type.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-gray-600">Consistency:</span>
                  <span className="ml-2 font-medium capitalize">{insights.weekly_analytics.learning_pattern.consistency}</span>
                </div>
                <div>
                  <span className="text-gray-600">Trend:</span>
                  <span className="ml-2 font-medium capitalize">{insights.weekly_analytics.learning_pattern.trend}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Performance Trends */}
      {insights.performance_trends && insights.performance_trends.status !== 'insufficient_data' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Performance Trends</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className={`text-2xl font-bold ${
                insights.performance_trends.trend_direction === 'improving' ? 'text-green-600' :
                insights.performance_trends.trend_direction === 'declining' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {insights.performance_trends.trend_direction}
              </div>
              <div className="text-sm text-gray-600">Trend Direction</div>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <div className="text-2xl font-bold text-pink-600">
                {insights.performance_trends.trend_strength}
              </div>
              <div className="text-sm text-gray-600">Trend Strength</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {insights.performance_trends.performance_stability}
              </div>
              <div className="text-sm text-gray-600">Stability</div>
            </div>
          </div>
          
          {/* Prediction */}
          {insights.performance_trends.prediction && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Next Week Prediction</h4>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-600">Predicted Score:</span>
                  <span className="ml-2 font-bold text-blue-600">{insights.performance_trends.prediction.predicted_score}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Confidence:</span>
                  <span className={`ml-2 font-medium ${
                    insights.performance_trends.prediction.confidence === 'high' ? 'text-green-600' :
                    insights.performance_trends.prediction.confidence === 'medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {insights.performance_trends.prediction.confidence}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Engagement Analysis */}
      {insights.engagement_analysis && insights.engagement_analysis.status !== 'no_sessions' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Engagement Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Engagement by Time of Day</h4>
              <div className="space-y-2">
                {Object.entries(insights.engagement_analysis.engagement_by_time || {}).map(([time, data]) => (
                  <div key={time} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="capitalize text-gray-700">{time}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{data.sessions} sessions</span>
                      <span className="font-medium">{Math.round(data.averageEngagement || 0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Engagement by Subject</h4>
              <div className="space-y-2">
                {Object.entries(insights.engagement_analysis.engagement_by_subject || {}).map(([subject, data]) => (
                  <div key={subject} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="capitalize text-gray-700">{subject}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{data.sessions} sessions</span>
                      <span className="font-medium">{Math.round(data.averageEngagement || 0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Overall Engagement */}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">Overall Engagement Score</span>
              <span className="text-2xl font-bold text-blue-600">
                {insights.engagement_analysis.overall_engagement || 0}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Insights Summary */}
      {insights.insights_summary && insights.insights_summary.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Key Insights</h3>
          <div className="space-y-4">
            {insights.insights_summary.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg ${
                insight.type === 'positive' ? 'bg-green-50 border-l-4 border-green-500' :
                insight.type === 'concern' ? 'bg-red-50 border-l-4 border-red-500' :
                'bg-blue-50 border-l-4 border-blue-500'
              }`}>
                <h4 className={`font-medium mb-2 ${
                  insight.type === 'positive' ? 'text-green-800' :
                  insight.type === 'concern' ? 'text-red-800' :
                  'text-blue-800'
                }`}>
                  {insight.title}
                </h4>
                <p className={`text-sm ${
                  insight.type === 'positive' ? 'text-green-700' :
                  insight.type === 'concern' ? 'text-red-700' :
                  'text-blue-700'
                }`}>
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recommendations</h3>
          <div className="space-y-4">
            {insights.recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-2">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {rec.priority} priority
                    </span>
                  </div>
                  <div className="ml-4">
                    <Brain className="w-5 h-5 text-purple-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;