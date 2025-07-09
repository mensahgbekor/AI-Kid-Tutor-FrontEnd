// Custom React hooks for AI integration
import { useState, useEffect, useCallback } from 'react';
import {
  generateLearningContent,
  generateQuizQuestions,
  analyzePerformance,
  generateLearningPath,
  generateDifficultyAdjustment,
  chatWithTutor,
  generateMotivationalFeedback
} from '../services/gemini';
import { aiService, learningService, quizService } from '../services/supabase';

// Hook for generating learning content
export const useAIContent = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateContent = useCallback(async (topic, ageGroup, difficulty = 'beginner') => {
    setLoading(true);
    setError(null);
    
    try {
      const generatedContent = await generateLearningContent(topic, ageGroup, difficulty);
      setContent(generatedContent);
      return generatedContent;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    content,
    loading,
    error,
    generateContent,
    clearContent: () => setContent(''),
    clearError: () => setError(null)
  };
};

// Hook for generating quiz questions
export const useAIQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateQuiz = useCallback(async (subject, topic, difficulty = 'beginner', questionCount = 5) => {
    setLoading(true);
    setError(null);
    
    try {
      const generatedQuestions = await generateQuizQuestions(subject, topic, difficulty, questionCount);
      setQuestions(generatedQuestions);
      return generatedQuestions;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    questions,
    loading,
    error,
    generateQuiz,
    clearQuestions: () => setQuestions([]),
    clearError: () => setError(null)
  };
};

// Hook for AI performance analysis
export const useAIAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeChildPerformance = useCallback(async (childProfile, recentSessions, quizResults) => {
    setLoading(true);
    setError(null);
    
    try {
      const performanceAnalysis = await analyzePerformance(childProfile, recentSessions, quizResults);
      setAnalysis(performanceAnalysis);
      
      // Save recommendations to database
      if (performanceAnalysis.recommendations) {
        for (const recommendation of performanceAnalysis.recommendations) {
          await aiService.saveRecommendation({
            child_id: childProfile.id,
            recommendation_type: recommendation.type,
            title: recommendation.title,
            description: recommendation.description,
            priority: recommendation.priority,
            ai_confidence_score: 0.8,
            recommendation_data: recommendation
          });
        }
      }
      
      return performanceAnalysis;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    analysis,
    loading,
    error,
    analyzeChildPerformance,
    clearAnalysis: () => setAnalysis(null),
    clearError: () => setError(null)
  };
};

// Hook for AI tutor chat
export const useAITutor = (childProfile) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const conversationHistory = messages.slice(-10); // Last 10 messages for context
      const aiResponse = await chatWithTutor(childProfile, message, conversationHistory);
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      return aiMessage;
    } catch (err) {
      setError(err.message);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm having trouble right now, but I'm still here to help! Can you try asking me again? 😊",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [childProfile, messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearChat,
    clearError: () => setError(null)
  };
};

// Hook for AI recommendations
export const useAIRecommendations = (childId) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async () => {
    if (!childId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await aiService.getActiveRecommendations(childId);
      setRecommendations(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [childId]);

  const applyRecommendation = useCallback(async (recommendationId) => {
    try {
      await aiService.applyRecommendation(recommendationId);
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendationId 
            ? { ...rec, is_applied: true, applied_at: new Date().toISOString() }
            : rec
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    fetchRecommendations,
    applyRecommendation,
    clearError: () => setError(null)
  };
};

// Hook for learning path generation
export const useLearningPath = () => {
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePath = useCallback(async (childProfile, currentLevel, targetSkills) => {
    setLoading(true);
    setError(null);
    
    try {
      const path = await generateLearningPath(childProfile, currentLevel, targetSkills);
      setLearningPath(path);
      return path;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    learningPath,
    loading,
    error,
    generatePath,
    clearPath: () => setLearningPath(null),
    clearError: () => setError(null)
  };
};

// Hook for difficulty adjustment
export const useDifficultyAdjustment = () => {
  const [adjustment, setAdjustment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const adjustDifficulty = useCallback(async (childId, subject, performanceHistory) => {
    setLoading(true);
    setError(null);
    
    try {
      const difficultyAdjustment = await generateDifficultyAdjustment(childId, subject, performanceHistory);
      setAdjustment(difficultyAdjustment);
      return difficultyAdjustment;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    adjustment,
    loading,
    error,
    adjustDifficulty,
    clearAdjustment: () => setAdjustment(null),
    clearError: () => setError(null)
  };
};

// Hook for motivational feedback
export const useMotivationalFeedback = () => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateFeedback = useCallback(async (childProfile, achievement) => {
    setLoading(true);
    setError(null);
    
    try {
      const motivationalFeedback = await generateMotivationalFeedback(childProfile, achievement);
      setFeedback(motivationalFeedback);
      return motivationalFeedback;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    feedback,
    loading,
    error,
    generateFeedback,
    clearFeedback: () => setFeedback(''),
    clearError: () => setError(null)
  };
};

// Combined hook for comprehensive AI features
export const useAITutorSystem = (childProfile) => {
  const content = useAIContent();
  const quiz = useAIQuiz();
  const analysis = useAIAnalysis();
  const tutor = useAITutor(childProfile);
  const recommendations = useAIRecommendations(childProfile?.id);
  const learningPath = useLearningPath();
  const difficulty = useDifficultyAdjustment();
  const motivation = useMotivationalFeedback();

  return {
    content,
    quiz,
    analysis,
    tutor,
    recommendations,
    learningPath,
    difficulty,
    motivation,
    isLoading: content.loading || quiz.loading || analysis.loading || tutor.loading || 
               recommendations.loading || learningPath.loading || difficulty.loading || motivation.loading
  };
};