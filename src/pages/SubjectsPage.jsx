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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{selectedChild?.avatar}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Learning Subjects</h1>
                <p className="text-gray-600">Choose a subject to start your learning adventure!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedChild?.name || ''} 
                onChange={(e) => {
                  const child = children.find(c => c.name === e.target.value);
                  setSelectedChild(child);
                }}
                className="bg-blue-100 border border-blue-300 rounded-lg px-4 py-2 text-blue-800 font-medium"
              >
                {children.map(child => (
                  <option key={child.name} value={child.name}>{child.name}</option>
                ))}
              </select>
              <button
                onClick={() => setShowAIChat(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2"
              >
                <Brain className="w-4 h-4" />
                <span>Ask AI Tutor</span>
              </button>
            </div>
          </div>

          {/* Child Info */}
          {selectedChild && (
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Learning for:</p>
                  <p className="text-lg font-bold text-gray-800">{selectedChild.name}, age {selectedChild.age}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Interests:</p>
                  <p className="text-sm font-medium text-gray-800">{selectedChild.interests.join(', ')}</p>
                </div>
              </div>
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
                  <p className="text-sm text-green-700">Subjects Started</p>
                  <p className="text-2xl font-bold text-green-800">3</p>
                </div>
                <BookOpen className="text-green-600" size={32} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Lessons Completed</p>
                  <p className="text-2xl font-bold text-blue-800">12</p>
                </div>
                <Trophy className="text-blue-600" size={32} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700">Stars Earned</p>
                  <p className="text-2xl font-bold text-purple-800">28</p>
                </div>
                <Star className="text-purple-600" size={32} />
              </div>
            </div>
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