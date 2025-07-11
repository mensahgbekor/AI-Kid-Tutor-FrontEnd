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
  ChevronLeft,
  Lock,
  RotateCcw
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAIContent, useAIQuiz } from '../hooks/useAI';
import InteractiveQuiz from '../components/InteractiveQuiz';
import { subjects } from '../data/subjects';
import TutorAvatar from '../components/TutorAvatar';
import AITutorChat from '../components/AITutorChat';
import ReactMarkdown from 'react-markdown';
import { 
  learningService, 
  quizService, 
  lessonProgressService, 
  subjectProgressService 
} from '../services/supabase';

const LearningPage = () => {
  const { subjectId, subtopicId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { subjectId: stateSubjectId, subtopicId: stateSubtopicId, child: user } = location.state || {};
  
  // Get subject and subtopic from local data using IDs
  const subject = subjects.find(s => s.id === (stateSubjectId || subjectId));
  const subtopic = subject?.subtopics.find(st => st.id === (stateSubtopicId || subtopicId));
  
  const [currentStep, setCurrentStep] = useState('lessons'); // 'lessons', 'content', 'quiz', 'complete'
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [lessonProgress, setLessonProgress] = useState([]);
  const [showAIChat, setShowAIChat] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tutorState, setTutorState] = useState({
    name: 'AI Tutor',
    mood: 'happy',
    message: `Hi ${user?.name}! Ready to explore ${subtopic?.title}? Let's start learning! 🚀`
  });

  const { content, loading: contentLoading, generateContent } = useAIContent();
  const { questions, loading: quizLoading, generateQuiz } = useAIQuiz();

  // Add state for questions to ensure they persist
  const [quizQuestions, setQuizQuestions] = useState([]);

  useEffect(() => {
    if (!subject || !subtopic || !user || !user.id) {
      console.error('Missing required data:', { subject, subtopic, user });
      navigate('/subjects');
      return;
    }

    initializeLearning();
  }, [subject, subtopic, user, navigate]);

  const initializeLearning = async () => {
    try {
      setLoading(true);
      
      // Validate user profile has a valid database ID
      if (!user || !user.id) {
        console.error('Invalid user profile:', user);
        navigate('/subjects');
        return;
      }
      
      // Create learning session
      await createLearningSession();
      
      // Load lesson progress
      await loadLessonProgress();
      
    } catch (error) {
      console.error('Error initializing learning:', error);
    } finally {
      setLoading(false);
    }
  };

  const createLearningSession = async () => {
    try {
      // Double-check user ID exists
      if (!user || !user.id) {
        throw new Error('User profile is missing or invalid');
      }

      const sessionData = {
        child_id: user.id,
        session_type: 'lesson',
        subject: subject.title,
        topic: subtopic.title,
        subtopic_id: subtopic.id,
        difficulty_level: subtopic.difficulty.toLowerCase(),
        session_data: {
          subtopic_id: subtopic.id,
          total_lessons: subtopic.lessons.length,
          subject_id: subject.id
        }
      };

      const session = await learningService.createLearningSession(sessionData);
      setSessionId(session.id);
    } catch (error) {
      console.error('Error creating learning session:', error);
    }
  };

  const loadLessonProgress = async () => {
    try {
      const progress = await lessonProgressService.getLessonProgress(
        user.id, 
        subject.id, 
        subtopic.id
      );
      
      setLessonProgress(progress);
      
      // Find the first incomplete lesson or start from beginning
      const firstIncomplete = progress.findIndex(p => p.status !== 'completed');
      if (firstIncomplete !== -1) {
        setCurrentLessonIndex(firstIncomplete);
      }
    } catch (error) {
      console.error('Error loading lesson progress:', error);
      setLessonProgress([]);
    }
  };

  const getLessonStatus = (lessonIndex) => {
    const progress = lessonProgress.find(p => p.lesson_id === lessonIndex.toString());
    return progress?.status || 'not_started';
  };

  const isLessonLocked = (lessonIndex) => {
    if (lessonIndex === 0) return false; // First lesson is always unlocked
    
    // Check if previous lesson is completed
    const previousProgress = lessonProgress.find(p => p.lesson_id === (lessonIndex - 1).toString());
    return !previousProgress || previousProgress.status !== 'completed';
  };

  const handleLessonClick = async (lessonIndex) => {
    if (isLessonLocked(lessonIndex)) return;
    
    const lesson = subtopic.lessons[lessonIndex];
    setCurrentLessonIndex(lessonIndex);
    setCurrentStep('content');

    // Update lesson progress to in_progress
    try {
      await lessonProgressService.updateLessonProgress(
        user.id,
        subject.id,
        subtopic.id,
        lessonIndex.toString(),
        {
          lesson_title: lesson,
          status: 'in_progress',
          completion_percentage: 0
        }
      );
      
      // Refresh progress
      await loadLessonProgress();
    } catch (error) {
      console.error('Error updating lesson progress:', error);
    }

    setTutorState({
      name: 'AI Tutor',
      mood: 'thinking',
      message: `Let me prepare an exciting lesson about "${lesson}" for ${user.name}! 🤔`
    });

    try {
      const prompt = `Create a comprehensive lesson about "${lesson}" in the context of ${subtopic.title} for ${subject.title}. This is for a student at ${subtopic.difficulty} level.`;
      await generateContent(prompt, 'student', subtopic.difficulty.toLowerCase());
      
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
    
    if (!currentLesson) {
      setTutorState({
        name: 'AI Tutor',
        mood: 'thinking',
        message: 'Oops! There seems to be an issue with the lesson. Let me try again! 🔄'
      });
      return;
    }

    setTutorState({
      name: 'AI Tutor',
      mood: 'thinking',
      message: 'Creating a fun quiz just for you! This will help me see how much you learned! 🧠'
    });

    try {
      const quizSubject = subject.title;
      const quizTopic = currentLesson;
      const difficulty = subtopic.difficulty.toLowerCase();
      
      console.log('Generating quiz with:', { quizSubject, quizTopic, difficulty });
      
      const generatedQuestions = await generateQuiz(quizSubject, quizTopic, difficulty, 5);
      setQuizQuestions(generatedQuestions);
      setCurrentStep('quiz');
      setTutorState({
        name: 'AI Tutor',
        mood: 'excited',
        message: 'Quiz time! Take your time and do your best. Remember, learning is about trying! 🌟'
      });
    } catch (error) {
      console.error('Quiz generation error:', error);
      setTutorState({
        name: 'AI Tutor',
        mood: 'thinking',
        message: 'Having trouble creating the quiz. Let me try a different approach! 🔄'
      });
      
      // Fallback: Create a simple quiz manually if AI generation fails
      setTimeout(() => {
        const fallbackQuestions = createFallbackQuiz(currentLesson);
        setQuizQuestions(fallbackQuestions);
      }, 2000);
    }
  };

  const createFallbackQuiz = (lessonTitle) => {
    return [
      {
        id: 1,
        question: `What did you learn about in the "${lessonTitle}" lesson?`,
        options: [
          { id: 'A', text: 'Important concepts and ideas', isCorrect: true },
          { id: 'B', text: 'Nothing useful', isCorrect: false },
          { id: 'C', text: 'Only basic information', isCorrect: false },
          { id: 'D', text: 'Confusing topics', isCorrect: false }
        ],
        explanation: 'Great! You learned important concepts that will help you understand the topic better.'
      },
      {
        id: 2,
        question: `How would you rate your understanding of "${lessonTitle}"?`,
        options: [
          { id: 'A', text: 'I understand it well', isCorrect: true },
          { id: 'B', text: 'I need more practice', isCorrect: true },
          { id: 'C', text: 'It was too difficult', isCorrect: false },
          { id: 'D', text: 'I didn\'t pay attention', isCorrect: false }
        ],
        explanation: 'Both understanding well and needing more practice are good responses - learning is a process!'
      }
    ];
  };

  const handleQuizComplete = async (result) => {
    try {
      // Save quiz result to database
      const quizData = {
        session_id: sessionId,
        child_id: user.id,
        quiz_type: subtopic.title,
        subject: subject.title,
        topic: subtopic.title,
        total_questions: result.totalQuestions,
        correct_answers: result.correctAnswers,
        score_percentage: result.score,
        questions_data: questions,
        strengths: result.score >= 80 ? [subtopic.lessons[currentLessonIndex]] : [],
        areas_for_improvement: result.score < 70 ? [subtopic.lessons[currentLessonIndex]] : []
      };

      await quizService.saveQuizResult(quizData);

      // Mark lesson as completed
      await lessonProgressService.completeLessson(
        user.id,
        subject.id,
        subtopic.id,
        currentLessonIndex.toString(),
        result.score
      );

      // Update subject progress
      await updateSubjectProgress();

      // Update learning session
      if (sessionId) {
        const completedLessons = lessonProgress.filter(p => p.status === 'completed').length + 1;
        const completionPercentage = Math.round((completedLessons / subtopic.lessons.length) * 100);
        
        await learningService.updateLearningSession(sessionId, {
          completion_percentage: completionPercentage,
          points_earned: result.score,
          session_data: {
            ...subtopic,
            completed_lessons: completedLessons,
            current_lesson: currentLessonIndex
          }
        });
      }

      // Refresh progress
      await loadLessonProgress();

      setCurrentStep('complete');
      
      if (result.score >= 80) {
        setTutorState({
          name: 'AI Tutor',
          mood: 'celebrating',
          message: `Wow ${user.name}! You scored ${result.score}%! You've mastered "${subtopic.lessons[currentLessonIndex]}"! 🎉⭐`
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

  const updateSubjectProgress = async () => {
    try {
      const completedLessons = lessonProgress.filter(p => p.status === 'completed').length + 1;
      const totalLessons = subtopic.lessons.length;
      const completionPercentage = Math.round((completedLessons / totalLessons) * 100);
      
      // Calculate average score
      const completedWithScores = lessonProgress.filter(p => p.quiz_score !== null);
      const averageScore = completedWithScores.length > 0 
        ? Math.round(completedWithScores.reduce((sum, p) => sum + p.quiz_score, 0) / completedWithScores.length)
        : 0;

      await subjectProgressService.updateSubjectProgress(
        user.id,
        subject.id,
        subtopic.id,
        {
          subject_title: subject.title,
          subtopic_title: subtopic.title,
          total_lessons: totalLessons,
          completed_lessons: completedLessons,
          completion_percentage: completionPercentage,
          average_score: averageScore,
          current_difficulty: subtopic.difficulty.toLowerCase()
        }
      );
    } catch (error) {
      console.error('Error updating subject progress:', error);
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
      
      // Navigate back to topics after celebration
      setTimeout(() => {
        navigate(`/subjects/${subjectId}`, { state: { child: user } });
      }, 3000);
    }
  };

  const handleRetryLesson = () => {
    setCurrentStep('content');
  };

  const getCompletedLessonsCount = () => {
    return lessonProgress.filter(p => p.status === 'completed').length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  if (!subject || !subtopic || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <p>Missing required information. Please select a subject.</p>
          </div>
          <button
            onClick={() => navigate('/subjects')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Subjects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(`/subjects/${subjectId}`, { state: { child: user } })}
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
                  <span>{getCompletedLessonsCount()}/{subtopic.lessons.length} Complete</span>
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
                  const status = getLessonStatus(index);
                  const isCompleted = status === 'completed';
                  const isInProgress = status === 'in_progress';
                  const isLocked = isLessonLocked(index);
                  const progress = lessonProgress.find(p => p.lesson_id === index.toString());

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        isCompleted 
                          ? 'border-green-200 bg-green-50' 
                          : isLocked
                            ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                            : isInProgress
                              ? 'border-blue-300 bg-blue-50 cursor-pointer'
                              : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
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
                                : isInProgress
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-400 text-white'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle size={16} />
                            ) : isLocked ? (
                              <Lock size={16} />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{lesson}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>
                                {isCompleted ? 'Completed' : 
                                 isLocked ? 'Locked' : 
                                 isInProgress ? 'In Progress' : 'Ready to start'}
                              </span>
                              {progress?.completion_percentage > 0 && !isCompleted && (
                                <span>{progress.completion_percentage}% complete</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isCompleted && progress?.quiz_score && (
                            <div className="flex items-center space-x-1">
                              <span className="text-sm font-medium text-green-600">
                                {progress.quiz_score}%
                              </span>
                              {[1, 2, 3].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`w-4 h-4 ${
                                    progress.quiz_score >= star * 30 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`} 
                                />
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
                    <div className="text-gray-800 leading-relaxed">
                      <div className="prose prose-lg max-w-none">
                        <ReactMarkdown children={content} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => setCurrentStep('lessons')}
                      className="text-gray-600 hover:text-gray-800 transition-colors flex items-center space-x-2"
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
              {quizQuestions.length > 0 ? (
                <InteractiveQuiz
                  questions={quizQuestions}
                  onComplete={handleQuizComplete}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Preparing your quiz questions...</p>
                  <button 
                    onClick={() => {
                      const fallbackQuestions = createFallbackQuiz(subtopic.lessons[currentLessonIndex]);
                      setQuizQuestions(fallbackQuestions);
                      setTutorState({
                        name: 'AI Tutor',
                        mood: 'excited',
                        message: 'Here\'s a quick quiz to check your understanding! 📝'
                      });
                    }}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Start Simple Quiz
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="p-6 text-center">
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Great Job, {user.name}!
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
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300 flex items-center space-x-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span>Review Lesson</span>
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
                    onClick={() => navigate(`/subjects/${subjectId}`, { state: { child: user } })}
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
        childProfile={user}
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
      />
    </div>
  );
};

export default LearningPage;