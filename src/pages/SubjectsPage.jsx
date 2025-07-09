import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  BookOpen, 
  Calculator, 
  Beaker,
  FileText,
  Play,
  Star,
  Clock,
  Trophy,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AITutorChat from '../components/AITutorChat';

const SubjectsPage = () => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [selectedAge, setSelectedAge] = useState(null);
  const [showAgeSelector, setShowAgeSelector] = useState(true);
  const navigate = useNavigate();

  // Child profile based on selected age
  const getChildProfile = () => ({
    id: 1, 
    name: 'Student', 
    age: selectedAge || 8, 
    avatar: '👤',
    interests: ['Learning', 'Discovery', 'Knowledge'],
    learning_preferences: { visual: 50, auditory: 30, kinesthetic: 20 }
  });

  const ages = [5, 6, 7, 8, 9, 10, 11, 12];

  const getAgeDescription = (age) => {
    if (age <= 6) return "Early Explorer";
    if (age <= 8) return "Curious Learner";
    if (age <= 10) return "Knowledge Seeker";
    return "Advanced Thinker";
  };

  const handleAgeSelect = (age) => {
    setSelectedAge(age);
    setShowAgeSelector(false);
  };

  const subjects = [
    {
      id: 'mathematics',
      title: 'Mathematics',
      description: 'Fun with numbers, patterns, and problem-solving',
      icon: Calculator,
      color: 'from-blue-500 to-cyan-500',
      difficulty: 'Beginner',
      lessons: 15,
      duration: '4 hours',
      topics: ['Basic Math', 'Patterns', 'Geometry', 'Logic Puzzles']
    },
    {
      id: 'science',
      title: 'Science Explorer',
      description: 'Discover how the world works through experiments and exploration',
      icon: Beaker,
      color: 'from-green-500 to-teal-500',
      difficulty: 'Beginner',
      lessons: 10,
      duration: '2.5 hours',
      topics: ['Nature', 'Experiments', 'Animals', 'Space']
    },
    {
      id: 'english',
      title: 'English Language',
      description: 'Master reading, writing, and communication skills',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      difficulty: 'Beginner',
      lessons: 12,
      duration: '3 hours',
      topics: ['Reading', 'Writing', 'Grammar', 'Vocabulary']
    }
  ];

  const handleSubjectClick = (subject) => {
    if (!selectedAge) {
      setShowAgeSelector(true);
      return;
    }
    
    navigate(`/subjects/${subject.id}`, { 
      state: { 
        child: getChildProfile()
      } 
    });
  };

  // Age Selection Modal
  if (showAgeSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🎂</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">How old are you?</h2>
            <p className="text-gray-600">This helps us create the perfect learning experience for you!</p>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-6">
            {ages.map((age) => (
              <button
                key={age}
                onClick={() => handleAgeSelect(age)}
                className="group relative bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-2 border-transparent hover:border-blue-300 rounded-xl p-4 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-2xl font-bold text-gray-800 mb-1">{age}</div>
                <div className="text-xs text-gray-600">{getAgeDescription(age)}</div>
              </button>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Don't worry, you can change this later!
            </p>
            {selectedAge && (
              <button
                onClick={() => setShowAgeSelector(false)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Skip for now
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{getChildProfile().avatar}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Learning Subjects</h1>
                <p className="text-gray-600">Choose a subject to start your learning adventure!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {selectedAge && (
                <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                  <span>🎂</span>
                  <span>Age {selectedAge}</span>
                  <button
                    onClick={() => setShowAgeSelector(true)}
                    className="ml-2 text-blue-600 hover:text-blue-800 text-xs underline"
                  >
                    Change
                  </button>
                </div>
              )}
              <button
                onClick={() => setShowAIChat(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2"
              >
                <Brain className="w-4 h-4" />
                <span>Ask AI Tutor</span>
              </button>
            </div>
          </div>

          {/* Learning Info */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ready to learn:</p>
                <p className="text-lg font-bold text-gray-800">
                  {selectedAge ? `${getAgeDescription(selectedAge)} Level` : 'Core Subjects'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Available subjects:</p>
                <p className="text-sm font-medium text-gray-800">Mathematics, Science, English</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => handleSubjectClick(subject)}
            >
              {/* Subject Header */}
              <div className={`bg-gradient-to-r ${subject.color} p-6 text-white relative`}>
                <div className="flex items-center justify-between mb-4">
                  <subject.icon className="w-12 h-12" />
                  <div className="bg-white bg-opacity-20 rounded-full px-3 py-1">
                    <span className="text-sm font-medium">{subject.difficulty}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{subject.title}</h3>
                <p className="text-white text-opacity-90 text-sm">{subject.description}</p>
              </div>

              {/* Subject Content */}
              <div className="p-6">
                {/* Subject Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{subject.duration}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <BookOpen size={14} />
                      <span>{subject.lessons} lessons</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-400 fill-current" size={14} />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>

                {/* Topics Preview */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Topics include:</p>
                  <div className="flex flex-wrap gap-1">
                    {subject.topics.slice(0, 3).map((topic, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                        {topic}
                      </span>
                    ))}
                    {subject.topics.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                        +{subject.topics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2">
                  <Play size={16} />
                  <span>Start Learning</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Learning Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Subjects Available</p>
                  <p className="text-2xl font-bold text-green-800">3</p>
                </div>
                <BookOpen className="text-green-600" size={32} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Total Lessons</p>
                  <p className="text-2xl font-bold text-blue-800">37</p>
                </div>
                <Trophy className="text-blue-600" size={32} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700">Learning Hours</p>
                  <p className="text-2xl font-bold text-purple-800">9.5</p>
                </div>
                <Star className="text-purple-600" size={32} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tutor Chat Modal */}
      <AITutorChat
        childProfile={getChildProfile()}
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
      />
    </div>
  );
};

export default SubjectsPage;