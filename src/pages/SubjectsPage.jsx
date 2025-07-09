import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  BookOpen, 
  Gamepad2, 
  Calculator, 
  Globe, 
  Palette, 
  Music, 
  Beaker,
  Play,
  Star,
  Clock,
  Trophy,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAIContent, useAIQuiz } from '../hooks/useAI';
import AITutorChat from '../components/AITutorChat';

const SubjectsPage = () => {
  const [selectedChild, setSelectedChild] = useState(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const navigate = useNavigate();

  // Mock child data - replace with actual data from Supabase
  const children = [
    { 
      id: 1, 
      name: 'Emma', 
      age: 8, 
      avatar: '👧',
      interests: ['AI', 'Art', 'Animals'],
      learning_preferences: { visual: 60, auditory: 25, kinesthetic: 15 }
    },
    { 
      id: 2, 
      name: 'Alex', 
      age: 10, 
      avatar: '👦',
      interests: ['Coding', 'Games', 'Science'],
      learning_preferences: { visual: 40, auditory: 30, kinesthetic: 30 }
    }
  ];

  const subjects = [
    {
      id: 'ai-basics',
      title: 'AI & Technology',
      description: 'Learn about artificial intelligence, robots, and how computers think',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      difficulty: 'Beginner',
      lessons: 12,
      duration: '3 hours',
      topics: ['What is AI?', 'Smart Assistants', 'Machine Learning', 'Robots']
    },
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
      id: 'creative-arts',
      title: 'Creative Arts',
      description: 'Express yourself through art, music, and creative projects',
      icon: Palette,
      color: 'from-pink-500 to-rose-500',
      difficulty: 'Beginner',
      lessons: 8,
      duration: '2 hours',
      topics: ['Drawing', 'Colors', 'Music', 'Crafts']
    },
    {
      id: 'world-explorer',
      title: 'World Explorer',
      description: 'Travel the world and learn about different cultures and places',
      icon: Globe,
      color: 'from-orange-500 to-red-500',
      difficulty: 'Beginner',
      lessons: 12,
      duration: '3 hours',
      topics: ['Countries', 'Cultures', 'Languages', 'Geography']
    },
    {
      id: 'coding-games',
      title: 'Coding & Games',
      description: 'Learn programming through fun games and interactive activities',
      icon: Gamepad2,
      color: 'from-indigo-500 to-purple-500',
      difficulty: 'Intermediate',
      lessons: 20,
      duration: '5 hours',
      topics: ['Scratch', 'Logic', 'Algorithms', 'Game Design']
    }
  ];

  useEffect(() => {
    // Set default child
    if (children.length > 0) {
      setSelectedChild(children[0]);
    }
  }, []);

  const handleSubjectClick = (subject) => {
    navigate(`/learning/${subject.id}`, { 
      state: { 
        subject, 
        child: selectedChild 
      } 
    });
  };

  const handleStartAIChat = () => {
    setShowAIChat(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{selectedChild?.avatar}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Choose Your Learning Adventure!
                </h1>
                <p className="text-gray-600">
                  Hi {selectedChild?.name}! What would you like to explore today?
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Child Selector */}
              <select 
                value={selectedChild?.id || ''} 
                onChange={(e) => {
                  const child = children.find(c => c.id === parseInt(e.target.value));
                  setSelectedChild(child);
                }}
                className="bg-blue-100 border border-blue-300 rounded-lg px-4 py-2 text-blue-800 font-medium"
              >
                {children.map(child => (
                  <option key={child.id} value={child.id}>
                    {child.avatar} {child.name}
                  </option>
                ))}
              </select>

              {/* AI Chat Button */}
              <button
                onClick={handleStartAIChat}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2"
              >
                <Brain className="w-4 h-4" />
                <span>Ask AI Tutor</span>
              </button>
            </div>
          </div>

          {/* Child Interests */}
          {selectedChild?.interests && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Interests:</span>
              {selectedChild.interests.map((interest, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleSubjectClick(subject)}
            >
              {/* Subject Header */}
              <div className={`bg-gradient-to-r ${subject.color} p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -ml-8 -mb-8" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <subject.icon className="w-8 h-8" />
                    <div className="bg-white bg-opacity-20 rounded-full p-1">
                      <Play className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{subject.title}</h3>
                  <p className="text-white text-opacity-90 text-sm">
                    {subject.description}
                  </p>
                </div>
              </div>

              {/* Subject Content */}
              <div className="p-6">
                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{subject.lessons} lessons</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{subject.duration}</span>
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    subject.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    subject.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {subject.difficulty}
                  </span>
                </div>

                {/* Topics Preview */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">What you'll learn:</p>
                  <div className="flex flex-wrap gap-1">
                    {subject.topics.slice(0, 3).map((topic, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
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

                {/* Start Button */}
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105">
                  <Play className="w-4 h-4" />
                  <span>Start Learning</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Trophy className="w-6 h-6 text-blue-500" />
              <div className="text-left">
                <p className="font-medium text-gray-800">View Progress</p>
                <p className="text-sm text-gray-600">Check your achievements</p>
              </div>
            </button>
            
            <button 
              onClick={handleStartAIChat}
              className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Brain className="w-6 h-6 text-purple-500" />
              <div className="text-left">
                <p className="font-medium text-gray-800">Ask AI Tutor</p>
                <p className="text-sm text-gray-600">Get help with anything</p>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/games')}
              className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Gamepad2 className="w-6 h-6 text-green-500" />
              <div className="text-left">
                <p className="font-medium text-gray-800">Play Games</p>
                <p className="text-sm text-gray-600">Learn through play</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* AI Tutor Chat Modal */}
      <AITutorChat
        childProfile={selectedChild}
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
      />
    </div>
  );
};

export default SubjectsPage;