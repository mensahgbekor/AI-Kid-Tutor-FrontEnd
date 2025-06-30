import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ADDED FOR NAVIGATION
import { BookOpen, Star, Trophy, Clock, Play, Users, TrendingUp, Award, Filter, Search, ChevronRight, Lock, CheckCircle } from 'lucide-react';

const CoursesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChild, setActiveChild] = useState('Emma');
  const navigate = useNavigate(); // ADDED FOR NAVIGATION

  const children = [
    { name: 'Emma', age: 8, level: 'Beginner', progress: 75, avatar: '👧' },
    { name: 'Alex', age: 10, level: 'Intermediate', progress: 60, avatar: '👦' }
  ];

  const categories = [
    { name: 'All', icon: '📚', color: 'bg-gray-100 text-gray-800' },
    { name: 'AI Basics', icon: '🤖', color: 'bg-blue-100 text-blue-800' },
    { name: 'Machine Learning', icon: '🧠', color: 'bg-purple-100 text-purple-800' },
    { name: 'Robotics', icon: '🦾', color: 'bg-green-100 text-green-800' },
    { name: 'Coding', icon: '💻', color: 'bg-orange-100 text-orange-800' },
    { name: 'Ethics', icon: '⚖️', color: 'bg-pink-100 text-pink-800' },
    { name: 'Art & Design', icon: '🎨', color: 'bg-red-100 text-red-800' },
    { name: 'History', icon: '🏛️', color: 'bg-amber-100 text-amber-800' },
    { name: 'Health & PE', icon: '🏃', color: 'bg-emerald-100 text-emerald-800' },
    { name: 'Geography', icon: '🌍', color: 'bg-teal-100 text-teal-800' },
    { name: 'Computer Science', icon: '💻', color: 'bg-indigo-100 text-indigo-800' },
    { name: 'Environmental Science', icon: '🌱', color: 'bg-lime-100 text-lime-800' },
    { name: 'Music', icon: '🎵', color: 'bg-violet-100 text-violet-800' },
    { name: 'Languages', icon: '🗣️', color: 'bg-sky-100 text-sky-800' },
    { name: 'Social Studies', icon: '👥', color: 'bg-rose-100 text-rose-800' }
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const courses = [
    {
      id: 1,
      title: 'Introduction to AI',
      description: 'Learn the basics of artificial intelligence in fun, interactive lessons',
      category: 'AI Basics',
      level: 'Beginner',
      duration: '2 hours',
      lessons: 8,
      enrolled: 1250,
      rating: 4.8,
      progress: 0,
      thumbnail: '🤖',
      color: 'from-blue-400 to-blue-600',
      completed: false,
      unlocked: true,
      skills: ['AI Concepts', 'Problem Solving', 'Critical Thinking']
    },
    {
      id: 2,
      title: 'AI in Everyday Life',
      description: 'Discover how AI works in apps, games, and devices you use daily',
      category: 'AI Basics',
      level: 'Beginner',
      duration: '1.5 hours',
      lessons: 6,
      enrolled: 980,
      rating: 4.9,
      progress: 0,
      thumbnail: '📱',
      color: 'from-green-400 to-green-600',
      completed: false,
      unlocked: true,
      skills: ['Real-world AI', 'Technology Awareness']
    },
    {
      id: 3,
      title: 'How Robots Think',
      description: 'Explore how robots make decisions and learn from their environment',
      category: 'Robotics',
      level: 'Beginner',
      duration: '2.5 hours',
      lessons: 10,
      enrolled: 756,
      rating: 4.7,
      progress: 0,
      thumbnail: '🤖',
      color: 'from-purple-400 to-purple-600',
      completed: false,
      unlocked: true,
      skills: ['Robot Logic', 'Sensors', 'Decision Making']
    },
    {
      id: 4,
      title: 'Machine Learning for Kids',
      description: 'Understand how computers learn and get smarter over time',
      category: 'Machine Learning',
      level: 'Intermediate',
      duration: '3 hours',
      lessons: 12,
      enrolled: 642,
      rating: 4.6,
      progress: 0,
      thumbnail: '🧠',
      color: 'from-indigo-400 to-indigo-600',
      completed: false,
      unlocked: true,
      skills: ['Pattern Recognition', 'Data Analysis', 'Algorithms']
    },
    {
      id: 5,
      title: 'Creative AI Art',
      description: 'Create amazing art and music with the help of artificial intelligence',
      category: 'AI Basics',
      level: 'Beginner',
      duration: '2 hours',
      lessons: 8,
      enrolled: 892,
      rating: 4.9,
      progress: 0,
      thumbnail: '🎨',
      color: 'from-pink-400 to-pink-600',
      completed: false,
      unlocked: true,
      skills: ['Creativity', 'AI Tools', 'Digital Art']
    },
    {
      id: 6,
      title: 'Coding Your First AI',
      description: 'Build simple AI programs using kid-friendly coding tools',
      category: 'Coding',
      level: 'Intermediate',
      duration: '4 hours',
      lessons: 15,
      enrolled: 523,
      rating: 4.8,
      progress: 0,
      thumbnail: '💻',
      color: 'from-orange-400 to-orange-600',
      completed: false,
      unlocked: true,
      skills: ['Programming', 'Logic', 'Problem Solving']
    },
    {
      id: 7,
      title: 'AI Ethics & Responsibility',
      description: 'Learn about using AI safely and responsibly in our world',
      category: 'Ethics',
      level: 'Intermediate',
      duration: '1.5 hours',
      lessons: 6,
      enrolled: 445,
      rating: 4.7,
      progress: 0,
      thumbnail: '⚖️',
      color: 'from-teal-400 to-teal-600',
      completed: false,
      unlocked: true,
      skills: ['Ethics', 'Responsibility', 'Critical Thinking']
    },
    {
      id: 8,
      title: 'Future of AI',
      description: 'Explore what AI might look like in the future and its possibilities',
      category: 'AI Basics',
      level: 'Advanced',
      duration: '2.5 hours',
      lessons: 10,
      enrolled: 334,
      rating: 4.8,
      progress: 0,
      thumbnail: '🚀',
      color: 'from-cyan-400 to-cyan-600',
      completed: false,
      unlocked: true,
      skills: ['Future Thinking', 'Innovation', 'Technology Trends']
    },
    {
      id: 9,
      title: 'Drawing Fundamentals',
      description: 'Learn the basics of drawing shapes, forms, and perspectives',
      category: 'Art & Design',
      level: 'Beginner',
      duration: '3 hours',
      lessons: 10,
      enrolled: 1200,
      rating: 4.7,
      progress: 0,
      thumbnail: '✏️',
      color: 'from-red-400 to-red-600',
      completed: false,
      unlocked: true,
      skills: ['Drawing', 'Perspective', 'Creativity']
    },
    {
      id: 10,
      title: 'Ancient Civilizations',
      description: 'Explore the wonders of ancient Egypt, Greece, and Rome',
      category: 'History',
      level: 'Beginner',
      duration: '2.5 hours',
      lessons: 8,
      enrolled: 950,
      rating: 4.6,
      progress: 0,
      thumbnail: '🏛️',
      color: 'from-amber-400 to-amber-600',
      completed: false,
      unlocked: true,
      skills: ['History', 'Culture', 'Ancient World']
    },
    {
      id: 11,
      title: 'Healthy Eating Habits',
      description: 'Learn about nutrition and how to make healthy food choices',
      category: 'Health & PE',
      level: 'Beginner',
      duration: '1.5 hours',
      lessons: 5,
      enrolled: 1100,
      rating: 4.8,
      progress: 0,
      thumbnail: '🍎',
      color: 'from-emerald-400 to-emerald-600',
      completed: false,
      unlocked: true,
      skills: ['Nutrition', 'Health', 'Wellness']
    },
    {
      id: 12,
      title: 'World Geography',
      description: 'Discover countries, cultures, and earth\'s amazing features',
      category: 'Geography',
      level: 'Beginner',
      duration: '3 hours',
      lessons: 12,
      enrolled: 850,
      rating: 4.5,
      progress: 0,
      thumbnail: '🌎',
      color: 'from-teal-400 to-teal-600',
      completed: false,
      unlocked: true,
      skills: ['Geography', 'Cultures', 'Earth Science']
    },
    {
      id: 13,
      title: 'Introduction to Programming',
      description: 'Learn basic coding concepts with fun, interactive projects',
      category: 'Computer Science',
      level: 'Beginner',
      duration: '4 hours',
      lessons: 15,
      enrolled: 1500,
      rating: 4.9,
      progress: 0,
      thumbnail: '👩‍💻',
      color: 'from-indigo-400 to-indigo-600',
      completed: false,
      unlocked: true,
      skills: ['Coding', 'Logic', 'Problem Solving']
    },
    {
      id: 14,
      title: 'Ecosystems & Wildlife',
      description: 'Explore different ecosystems and the animals that live there',
      category: 'Environmental Science',
      level: 'Beginner',
      duration: '2 hours',
      lessons: 7,
      enrolled: 780,
      rating: 4.7,
      progress: 0,
      thumbnail: '🌿',
      color: 'from-lime-400 to-lime-600',
      completed: false,
      unlocked: true,
      skills: ['Ecology', 'Conservation', 'Biology']
    },
    {
      id: 15,
      title: 'Music Theory Basics',
      description: 'Learn about rhythm, melody, and how music works',
      category: 'Music',
      level: 'Beginner',
      duration: '2 hours',
      lessons: 8,
      enrolled: 650,
      rating: 4.6,
      progress: 0,
      thumbnail: '🎼',
      color: 'from-violet-400 to-violet-600',
      completed: false,
      unlocked: true,
      skills: ['Music', 'Rhythm', 'Creativity']
    },
    {
      id: 16,
      title: 'Spanish for Beginners',
      description: 'Start learning Spanish with fun, interactive lessons',
      category: 'Languages',
      level: 'Beginner',
      duration: '3 hours',
      lessons: 10,
      enrolled: 920,
      rating: 4.8,
      progress: 0,
      thumbnail: '🇪🇸',
      color: 'from-sky-400 to-sky-600',
      completed: false,
      unlocked: true,
      skills: ['Spanish', 'Language', 'Communication']
    },
    {
      id: 17,
      title: 'Community & Citizenship',
      description: 'Learn about being a good citizen and helping your community',
      category: 'Social Studies',
      level: 'Beginner',
      duration: '1.5 hours',
      lessons: 5,
      enrolled: 600,
      rating: 4.5,
      progress: 0,
      thumbnail: '👥',
      color: 'from-rose-400 to-rose-600',
      completed: false,
      unlocked: true,
      skills: ['Citizenship', 'Community', 'Responsibility']
    }
  ];

  const child = children.find(c => c.name === activeChild);

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const completedCourses = courses.filter(course => course.completed).length;
  const totalCourses = courses.length;
  const inProgressCourses = courses.filter(course => course.progress > 0 && !course.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{child.avatar}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Learning Courses</h1>
                <p className="text-gray-600">Choose your next learning adventure!</p>
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
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Completed</p>
                  <p className="text-2xl font-bold text-green-800">{completedCourses}</p>
                </div>
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">In Progress</p>
                  <p className="text-2xl font-bold text-blue-800">{inProgressCourses}</p>
                </div>
                <BookOpen className="text-blue-600" size={32} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700">Total Available</p>
                  <p className="text-2xl font-bold text-purple-800">{totalCourses}</p>
                </div>
                <Trophy className="text-purple-600" size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.name
                      ? 'bg-blue-500 text-white'
                      : category.color
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level} Level</option>
              ))}
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Course Header */}
              <div className={`bg-gradient-to-r ${course.color} p-6 text-white relative`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{course.thumbnail}</span>
                  {course.completed && (
                    <div className="bg-white bg-opacity-20 rounded-full p-1">
                      <CheckCircle className="text-white" size={20} />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-white text-opacity-90 text-sm">{course.description}</p>
              </div>

              {/* Course Content */}
              <div className="p-6">
                {/* Course Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{course.duration}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <BookOpen size={14} />
                      <span>{course.lessons} lessons</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-400 fill-current" size={14} />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>

                {/* Level Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                    course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {course.level}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center space-x-1">
                    <Users size={14} />
                    <span>{course.enrolled.toLocaleString()}</span>
                  </span>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">You'll learn:</p>
                  <div className="flex flex-wrap gap-1">
                    {course.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress Bar (if started) */}
                {course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${course.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Action Button - ONLY MODIFIED THIS SECTION */}
                <button 
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                    course.completed
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : course.progress > 0
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                  onClick={() => navigate(`/course/${course.id}`)} // ADDED NAVIGATION
                >
                  {course.completed ? (
                    <>
                      <Trophy size={16} />
                      <span>Completed</span>
                    </>
                  ) : course.progress > 0 ? (
                    <>
                      <Play size={16} />
                      <span>Continue</span>
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      <span>Start Course</span>
                    </>
                  )}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;