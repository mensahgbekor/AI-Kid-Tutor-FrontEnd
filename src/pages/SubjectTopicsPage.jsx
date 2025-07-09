import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  BookOpen, 
  Brain, 
  Clock,
  Star,
  Trophy,
  Target,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { subjects } from '../data/subjects';
import AITutorChat from '../components/AITutorChat';
import { subjectProgressService } from '../services/supabase';

const SubjectTopicsPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { child } = location.state || {};
  const [showAIChat, setShowAIChat] = useState(false);
  const [topicProgress, setTopicProgress] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Get subject from data
  const subject = subjects.find(s => s.id === subjectId);

  useEffect(() => {
    if (!subject) {
      navigate('/subjects');
      return;
    }
    
    if (child) {
      loadTopicProgress();
    }
  }, [subject, navigate]);

  const loadTopicProgress = async () => {
    try {
      setLoading(true);
      const progressData = {};
      
      // Load progress for each subtopic
      for (const subtopic of subject.subtopics) {
        try {
          const progress = await subjectProgressService.getSubjectProgress(
            child.id, 
            subject.id, 
            subtopic.id
          );
          if (progress) {
            progressData[subtopic.id] = progress;
          }
        } catch (error) {
          // Progress doesn't exist yet, that's okay
          console.log(`No progress found for ${subtopic.id}`);
        }
      }
      
      setTopicProgress(progressData);
    } catch (error) {
      console.error('Error loading topic progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (subtopic) => {
    navigate(`/learning/${subjectId}/${subtopic.id}`, { 
      state: { 
        subjectId: subject.id,
        subtopicId: subtopic.id,
        child 
      } 
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTopicProgress = (subtopicId) => {
    return topicProgress[subtopicId] || null;
  };

  const getProgressColor = (progress) => {
    if (!progress) return 'text-gray-600';
    if (progress.completion_percentage === 100) return 'text-green-600';
    if (progress.completion_percentage > 0) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getProgressText = (progress) => {
    if (!progress) return 'Not started';
    if (progress.completion_percentage === 100) return 'Completed';
    if (progress.completion_percentage > 0) return `${progress.completion_percentage}% complete`;
    return 'Not started';
  };

  if (!subject || !child) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/subjects')}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Subjects
          </button>
          
          <button
            onClick={() => setShowAIChat(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2"
          >
            <Brain className="w-4 h-4" />
            <span>Ask AI Tutor</span>
          </button>
        </div>

        {/* Subject Header */}
        <div className={`bg-gradient-to-r ${subject.color} rounded-2xl p-6 text-white mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{subject.title}</h1>
              <p className="text-white text-opacity-90">{subject.description}</p>
              <div className="mt-4 flex items-center space-x-4 text-sm">
                <span className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{subject.subtopics.length} Topics</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>Age {child.age}</span>
                </span>
              </div>
            </div>
            <subject.icon className="w-16 h-16 opacity-80" />
          </div>
        </div>

        {/* Child Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{child.avatar}</div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Learning Path for {child.name}</h3>
                <p className="text-gray-600">Choose a topic to start your {subject.title.toLowerCase()} journey!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
                🎂 Age {child.age}
              </div>
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {subject.subtopics.map((subtopic, index) => {
            const progress = getTopicProgress(subtopic.id);
            
            return (
              <motion.div
                key={subtopic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => handleTopicClick(subtopic)}
              >
                {/* Topic Header */}
                <div className={`bg-gradient-to-r ${subject.color} p-6 text-white relative`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{subtopic.icon}</span>
                    <div className="bg-white bg-opacity-20 rounded-full px-3 py-1">
                      <span className="text-sm font-medium">{subtopic.difficulty}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{subtopic.title}</h3>
                  <p className="text-white text-opacity-90 text-sm">{subtopic.description}</p>
                </div>

                {/* Topic Content */}
                <div className="p-6">
                  {/* Progress Bar */}
                  {progress && progress.completion_percentage > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className={`font-medium ${getProgressColor(progress)}`}>
                          {progress.completion_percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${subject.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${progress.completion_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Topic Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{subtopic.estimatedTime}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <BookOpen size={14} />
                        <span>{subtopic.lessons.length} lessons</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="text-yellow-400 fill-current" size={14} />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(subtopic.difficulty)}`}>
                        {subtopic.difficulty} Level
                      </span>
                      <span className={`text-sm font-medium ${getProgressColor(progress)}`}>
                        {getProgressText(progress)}
                      </span>
                    </div>
                  </div>

                  {/* Lessons Preview */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Lessons include:</p>
                    <div className="space-y-1">
                      {subtopic.lessons.slice(0, 3).map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span>{lesson}</span>
                        </div>
                      ))}
                      {subtopic.lessons.length > 3 && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          <span>+{subtopic.lessons.length - 3} more lessons</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    progress && progress.completion_percentage === 100
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : progress && progress.completion_percentage > 0
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                  }`}>
                    <Play size={16} />
                    <span>
                      {progress && progress.completion_percentage === 100
                        ? 'Review Topic'
                        : progress && progress.completion_percentage > 0
                          ? 'Continue Topic'
                          : 'Start Topic'}
                    </span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Your {subject.title} Journey</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Topics Available</p>
                  <p className="text-2xl font-bold text-blue-800">{subject.subtopics.length}</p>
                </div>
                <BookOpen className="text-blue-600" size={32} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Total Lessons</p>
                  <p className="text-2xl font-bold text-green-800">
                    {subject.subtopics.reduce((total, topic) => total + topic.lessons.length, 0)}
                  </p>
                </div>
                <Trophy className="text-green-600" size={32} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700">Estimated Time</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {Math.round(subject.subtopics.reduce((total, topic) => {
                      const time = parseInt(topic.estimatedTime);
                      return total + time;
                    }, 0) / 60)}h
                  </p>
                </div>
                <Clock className="text-purple-600" size={32} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-pink-100 to-pink-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-pink-700">Completed Topics</p>
                  <p className="text-2xl font-bold text-pink-800">
                    {Object.values(topicProgress).filter(p => p.completion_percentage === 100).length}
                  </p>
                </div>
                <CheckCircle className="text-pink-600" size={32} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-700">Difficulty Range</p>
                  <p className="text-lg font-bold text-yellow-800">Beginner+</p>
                </div>
                <Star className="text-yellow-600" size={32} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tutor Chat Modal */}
      <AITutorChat
        childProfile={child}
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
      />
    </div>
  );
};

export default SubjectTopicsPage;