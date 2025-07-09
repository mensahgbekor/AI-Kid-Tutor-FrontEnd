import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  BookOpen, 
  Brain, 
  CheckCircle, 
  Star,
  Clock,
  Target,
  Lightbulb
} from 'lucide-react';
import { useAIContent, useAIQuiz } from '../hooks/useAI';
import InteractiveQuiz from '../components/InteractiveQuiz';
import TutorAvatar from '../components/TutorAvatar';
import AITutorChat from '../components/AITutorChat';
import { subjects } from '../data/subjects';

const LearningPage = () => {
  const { subjectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { child } = location.state || {};
  
  // Get subject from shared data using the ID
  const subject = subjects.find(s => s.id === subjectId);
  
  const [currentStep, setCurrentStep] = useState('content'); // 'content', 'quiz', 'complete'
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [tutorState, setTutorState] = useState({
    name: 'AI Tutor',
    mood: 'happy',
    message: `Hi ${child?.name}! Ready to explore ${subject?.title}? Let's start learning! 🚀`
  });

  const { content, loading: contentLoading, generateContent } = useAIContent();
  const { questions, loading: quizLoading, generateQuiz } = useAIQuiz();

  useEffect(() => {
    if (!subject) {
      navigate('/subjects');
      return;
    }

    // Set first topic as default
    if (subject.topics && subject.topics.length > 0) {
      setSelectedTopic(subject.topics[0]);
    }
  }, [subject, navigate]);

  useEffect(() => {
    if (selectedTopic && child) {
      handleGenerateContent(selectedTopic);
    }
  }, [selectedTopic, child]);

  const handleGenerateContent = async (topic) => {
    setTutorState({
      name: 'AI Tutor',
      mood: 'thinking',
      message: `Let me prepare some exciting content about ${topic} for you! 🤔`
    });

    try {
      await generateContent(topic, `${child.age} years old`, 'beginner');
      setTutorState({
        name: 'AI Tutor',
        mood: 'excited',
        message: `Great! I've prepared some amazing content about ${topic}. Read through it and then we'll test your knowledge! 📚✨`
      });
    } catch (error) {
      setTutorState({
        name: 'AI Tutor',
        mood: 'thinking',
        message: `Oops! I had trouble loading the content. Let's try again! 🔄`
      });
    }
  };

  const handleStartQuiz = async () => {
    if (!selectedTopic) return;

    setTutorState({
      name: 'AI Tutor',
      mood: 'thinking',
      message: 'Creating a fun quiz just for you! This will help me see how much you learned! 🧠'
    });

    try {
      await generateQuiz(subject.title, selectedTopic, 'beginner', 5);
      setCurrentStep('quiz');
      setTutorState({
        name: 'AI Tutor',
        mood: 'excited',
        message: 'Quiz time! Take your time and do your best. Remember, learning is about trying! 🌟'
      });
    } catch (error) {
      setTutorState({
        name: 'AI Tutor',
        mood: 'thinking',
        message: 'Having trouble creating the quiz. Let me try again! 🔄'
      });
    }
  };

  const handleQuizComplete = (result) => {
    setCurrentStep('complete');
    
    if (result.score >= 80) {
      setTutorState({
        name: 'AI Tutor',
        mood: 'celebrating',
        message: `Wow! You scored ${result.score}%! You're becoming an expert in ${selectedTopic}! 🎉⭐`
      });
    } else if (result.score >= 60) {
      setTutorState({
        name: 'AI Tutor',
        mood: 'happy',
        message: `Good job! You scored ${result.score}%. Keep practicing and you'll master this topic! 👍`
      });
    } else {
      setTutorState({
        name: 'AI Tutor',
        mood: 'thinking',
        message: `You scored ${result.score}%. That's okay! Learning takes practice. Want to try again or explore another topic? 💪`
      });
    }
  };

  const handleNextTopic = () => {
    const currentIndex = subject.topics.indexOf(selectedTopic);
    if (currentIndex < subject.topics.length - 1) {
      setSelectedTopic(subject.topics[currentIndex + 1]);
      setCurrentStep('content');
    } else {
      // All topics completed
      setTutorState({
        name: 'AI Tutor',
        mood: 'celebrating',
        message: `Amazing! You've completed all topics in ${subject.title}! You're a superstar! 🌟🎊`
      });
    }
  };

  if (!subject || !child) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
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
            </div>
            <subject.icon className="w-16 h-16 opacity-80" />
          </div>
        </div>

        {/* AI Tutor */}
        <div className="mb-6 flex justify-center">
          <TutorAvatar tutorState={tutorState} />
        </div>

        {/* Topic Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Learning Topics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {subject.topics.map((topic, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedTopic(topic);
                  setCurrentStep('content');
                }}
                className={`p-3 rounded-lg text-sm font-medium transition-all ${
                  selectedTopic === topic
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {currentStep === 'content' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2 text-blue-500" />
                  {selectedTopic}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>~10 min read</span>
                </div>
              </div>

              {contentLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating personalized content...</p>
                </div>
              ) : content ? (
                <div className="prose max-w-none">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                    <div 
                      className="text-gray-800 leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }}
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <button 
                      onClick={handleStartQuiz}
                      className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center space-x-2"
                    >
                      <Target className="w-5 h-5" />
                      <span>Take Quiz</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Select a topic to start learning!</p>
                </div>
              )}
            </div>
          )}

          {currentStep === 'quiz' && questions.length > 0 && (
            <div className="p-6">
              <InteractiveQuiz
                questions={questions}
                onComplete={handleQuizComplete}
              />
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="p-6 text-center">
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Great Job, {child.name}!
                </h2>
                <p className="text-gray-600">
                  You've completed the lesson on {selectedTopic}!
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleNextTopic}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Next Topic</span>
                </button>
                
                <button
                  onClick={() => navigate('/subjects')}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
                >
                  Choose New Subject
                </button>
              </div>
            </div>
          )}
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

export default LearningPage;