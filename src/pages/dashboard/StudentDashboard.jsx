import React, { useState } from 'react';
import { BookOpen, Star, Trophy, Clock, Play, Users, TrendingUp, Award } from 'lucide-react';

const Dashboard = () => {
  const [activeChild, setActiveChild] = useState('Emma');
  const [currentLesson, setCurrentLesson] = useState(null);

  const children = [
    { name: 'Emma', age: 8, level: 'Beginner', progress: 75, avatar: '👧' },
    { name: 'Alex', age: 10, level: 'Intermediate', progress: 60, avatar: '👦' }
  ];

  const lessons = [
    { id: 1, title: 'What is AI?', duration: '15 min', difficulty: 'Easy', completed: true, stars: 3 },
    { id: 2, title: 'AI in Daily Life', duration: '20 min', difficulty: 'Easy', completed: true, stars: 2 },
    { id: 3, title: 'How Robots Think', duration: '25 min', difficulty: 'Medium', completed: false, stars: 0 },
    { id: 4, title: 'Machine Learning Basics', duration: '30 min', difficulty: 'Medium', completed: false, stars: 0 }
  ];

  const achievements = [
    { title: 'First AI Explorer', icon: '🎯', earned: true },
    { title: 'Quiz Master', icon: '🧠', earned: true },
    { title: 'Coding Curious', icon: '💻', earned: false },
    { title: 'AI Detective', icon: '🔍', earned: false }
  ];

  const stats = [
    { label: 'Lessons Completed', value: '12', icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Total Stars', value: '28', icon: Star, color: 'bg-yellow-500' },
    { label: 'Current Streak', value: '5 days', icon: Trophy, color: 'bg-green-500' },
    { label: 'Time Spent', value: '4.2 hrs', icon: Clock, color: 'bg-purple-500' }
  ];

  const child = children.find(c => c.name === activeChild);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{child.avatar}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Welcome back, {child.name}!</h1>
                <p className="text-gray-600">Ready to explore AI today?</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={activeChild} 
                onChange={(e) => setActiveChild(e.target.value)}
                className="bg-blue-100 border border-blue-300 rounded-lg px-4 py-2 text-blue-800 font-medium"
              >
                {children.map(child => (
                  <option key={child.name} value={child.name}>{child.name}</option>
                ))}
              </select>
              <div className="text-right">
                <div className="text-sm text-gray-500">Level: {child.level}</div>
                <div className="text-lg font-bold text-blue-600">{child.progress}% Complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Learning Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Learning Progress</h2>
              <div className="bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${child.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{child.progress}% of AI Basics completed</p>
            </div>

            {/* Available Lessons */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Continue Learning</h2>
              <div className="space-y-4">
                {lessons.map((lesson) => (
                  <div 
                    key={lesson.id} 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      lesson.completed 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-blue-200 bg-blue-50 hover:border-blue-300'
                    }`}
                    onClick={() => setCurrentLesson(lesson)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          lesson.completed ? 'bg-green-500' : 'bg-blue-500'
                        } text-white`}>
                          {lesson.completed ? <Trophy size={16} /> : <Play size={16} />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{lesson.duration}</span>
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              lesson.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {lesson.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < lesson.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Content */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Achievements</h2>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      achievement.earned ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <span className={`text-2xl ${!achievement.earned && 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </span>
                    <div>
                      <p className={`font-medium ${achievement.earned ? 'text-yellow-800' : 'text-gray-500'}`}>
                        {achievement.title}
                      </p>
                      {achievement.earned && (
                        <p className="text-xs text-yellow-600">Unlocked!</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Challenge */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Daily Challenge</h2>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h3 className="font-semibold mb-2">AI Quiz Time!</h3>
                <p className="text-sm mb-4">Test your knowledge with today's fun AI quiz</p>
                <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all">
                  Start Challenge
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Award size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Completed "What is AI?"</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <TrendingUp size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Level up to Beginner+</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Star size={16} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Earned 3 stars in quiz</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;