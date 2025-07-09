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
  Lightbulb,
  Trophy,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useAIContent, useAIQuiz } from '../hooks/useAI';
import InteractiveQuiz from '../components/InteractiveQuiz';
import TutorAvatar from '../components/TutorAvatar';
import AITutorChat from '../components/AITutorChat';
import { learningService, quizService } from '../services/supabase';

const LearningPage = () => {
  const { subjectId, subtopicId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { subject, subtopic, child } = location.state || {};
  
  const [currentStep, setCurrentStep] = useState('lessons'); // 'lessons', 'content', 'quiz', 'complete'
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showAIChat, setShowAIChat] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [tutorState, setTutorState] = useState({
    name: 'AI Tutor',
    mood: 'happy',
    message: `Hi ${child?.name}! Ready to explore ${subtopic?.title}? Let's start learning! 🚀`
  });

  const { content, loading: contentLoading, generateContent } = useAIContent();
  const { questions, loading: quizLoading, generateQuiz } = useAIQuiz();

  useEffect(() => {
    if (!subject || !subtopic || !child) {
      navigate('/subjects');
      return;
    }

    // Create learning session
    createLearningSession();
  }, [subject, subtopic, child, navigate]);

  const createLearningSession = async () => {
    try {
      const sessionData = {
        child_id: child.id,
        session_type: 'lesson',
        subject: subject.title,
        topic: subtopic.title,
        difficulty_level: subtopic.difficulty.toLowerCase(),
        session_data: {
          subtopic_id: subtopic.id,
          total_lessons: subtopic.lessons.length
        }
      };

      const session = await learningService.createLearningSession(sessionData);
      setSessionId(session.id);
    } catch (error) {
      console.error('Error creating learning session:', error);
    }
  };

  const handleLessonClick = async (lessonIndex) => {
    const lesson = subtopic.lessons[lessonIndex];
    setCurrentLessonIndex(lessonIndex);
    setCurrentStep('content');

    setTutorState({
      name: 'AI Tutor',
      mood: 'thinking',
      message: `Let me prepare an exciting lesson about "${lesson}" for you! 🤔`
    });

    try {
      const prompt = `${lesson} in ${subtopic.title} for ${subject.title}`;
      await generateContent(prompt, `${child.age} years old`, subtopic.difficulty.toLowerCase());
      
      setTutorState({
        name: 'AI Tutor',
        mood: 'excited',
        message: `Great! I've prepared an amazing lesson about "${lesson}". Read through it carefully and then we'll test your knowledge! 📚✨`
      });
    } catch (error) {
      setTutorState({
        name: 'AI Tutor',
        mood: 'thinking',
        message: `Oops! I had trouble loading the lesson. Let's try again! 🔄`
      });
    }
  };

  const handleStartQuiz = async () => {
    const currentLesson = subtopic.lessons[currentLessonIndex];
    
    setTutorState({
      name: 'AI Tutor',
      mood: 'thinking',
      message: 'Creating a fun quiz just for you! This will help me see how much you learned! 🧠'
    });

    try {
      await generateQuiz(subject.title, currentLesson, subtopic.difficulty.toLowerCase(), 5);
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

  const handleQuizComplete = async (result) => {
    try {
      // Save quiz result to database
      const quizData = {
        session_id: sessionId,
        child_id: child.id,
        quiz_type: subtopic.title,
        total_questions: result.totalQuestions,
        correct_answers: result.correctAnswers,
        score_percentage: result.score,
        questions_data: questions,
        strengths: result.score >= 80 ? [subtopic.lessons[currentLessonIndex]] : [],
        areas_for_improvement: result.score < 70 ? [subtopic.lessons[currentLessonIndex]] : []
      };

      await quizService.saveQuizResult(quizData);

      // Mark lesson as completed
      const newCompletedLessons = [...completedLessons, currentLessonIndex];
      setCompletedLessons(newCompletedLessons);

      // Update learning session
      if (sessionId) {
        const completionPercentage = Math.round((newCompletedLessons.length / subtopic.lessons.length) * 100);
        await learningService.updateLearningSession(sessionId, {
          completion_percentage: completionPercentage,
          points_earned: result.score,
          session_data: {
            ...subtopic,
            completed_lessons: newCompletedLessons,
            current_lesson: currentLessonIndex
          }
        });
      }

      setCurrentStep('complete');
      
      if (result.score >= 80) {
        setTutorState({
          name: 'AI Tutor',
          mood: 'celebrating',
          message: `Wow! You scored ${result.score}%! You've mastered "${subtopic.lessons[currentLessonIndex]}"! 🎉⭐`
        });
      } else if (result.score >= 60) {
        setTutorState({
          name: 'AI Tutor',
          mood: 'happy',
          message: `Good job! You scored ${result.score}%. Keep practicing and you'll master this lesson! 👍`
        });
      } else {
        setTutorState({
          name: 'AI Tutor',
          mood: 'thinking',
          message: `You scored ${result.score}%. That's okay! Learning takes practice. Want to try again or move to the next lesson? 💪`
        });
      }
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < subtopic.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setCurrentStep('lessons');
    } else {
      // All lessons completed
      setTutorState({
        name: 'AI Tutor',
        mood: 'celebrating',
        message: `Amazing! You've completed all lessons in ${subtopic.title}! You're a superstar! 🌟🎊`
      });
      
      // Navigate back to topics or show completion
      setTimeout(() => {
        navigate(`/subjects/${subjectId}`, { state: { child } });
      }, 3000);
    }
  };

  const handleRetryLesson = () => {
    setCurrentStep('content');
  };

  if (!subject || !subtopic || !child) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(`/subjects/${subjectId}`, { state: { child } })}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to {subject.title}
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
              <h1 className="text-3xl font-bold mb-2">{subtopic.title}</h1>
              <p className="text-white text-opacity-90">{subtopic.description}</p>
              <div className="mt-4 flex items-center space-x-4 text-sm">
                <span className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{subtopic.lessons.length} Lessons</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{subtopic.estimatedTime}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4" />
                  <span>{completedLessons.length}/{subtopic.lessons.length} Complete</span>
                </span>
              </div>
            </div>
            <span className="text-6xl">{subtopic.icon}</span>
          </div>
        </div>

        {/* AI Tutor */}
        <div className="mb-6 flex justify-center">
          <TutorAvatar tutorState={tutorState} />
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {currentStep === 'lessons' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-blue-500" />
                Choose a Lesson
              </h2>

              <div className="grid gap-4">
                {subtopic.lessons.map((lesson, index) => {
                  const isCompleted = completedLessons.includes(index);
                  const isCurrent = index === currentLessonIndex;
                  const isLocked = index > 0 && !completedLessons.includes(index - 1) && !isCompleted;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        isCompleted 
                          ? 'border-green-200 bg-green-50' 
                          : isLocked
                            ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                            : isCurrent
                              ? 'border-blue-300 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                      }`}
                      onClick={() => !isLocked && handleLessonClick(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isCompleted 
                              ? 'bg-green-500 text-white' 
                              : isLocked
                                ? 'bg-gray-300 text-gray-500'
                                : 'bg-blue-500 text-white'
                          }`}>
                            {isCompleted ? <CheckCircle size={16} /> : index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{lesson}</h3>
                            <p className="text-sm text-gray-600">
                              {isCompleted ? 'Completed' : isLocked ? 'Locked' : 'Ready to start'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isCompleted && (
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3].map((star) => (
                                <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          )}
                          {!isLocked && (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 'content' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2 text-blue-500" />
                  {subtopic.lessons[currentLessonIndex]}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>~10 min read</span>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Lesson {currentLessonIndex + 1} of {subtopic.lessons.length}
                  </div>
                </div>
              </div>

              {contentLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating personalized lesson content...</p>
                </div>
              ) : content ? (
                <div className="prose max-w-none">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                    <div 
                      className="text-gray-800 leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <button 
                      onClick={() => setCurrentStep('lessons')}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300 flex items-center space-x-2"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>Back to Lessons</span>
                    </button>
                    
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
                  <p className="text-gray-600">Content will appear here once generated!</p>
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
                  You've completed "{subtopic.lessons[currentLessonIndex]}"!
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                {currentLessonIndex < subtopic.lessons.length - 1 ? (
                  <>
                    <button
                      onClick={handleRetryLesson}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
                    >
                      Review Lesson
                    </button>
                    <button
                      onClick={handleNextLesson}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2"
                    >
                      <Play className="w-5 h-5" />
                      <span>Next Lesson</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate(`/subjects/${subjectId}`, { state: { child } })}
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center space-x-2"
                  >
                    <Trophy className="w-5 h-5" />
                    <span>Choose New Topic</span>
                  </button>
                )}
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