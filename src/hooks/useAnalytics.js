// Custom React hooks for analytics and reporting
import { useState, useEffect, useCallback } from 'react';
import {
  analyticsProcessor,
  aiLearningReportGenerator,
  progressReportGenerator,
  learningInsightsGenerator
} from '../services/analytics';
import { learningService, quizService, analyticsService } from '../services/supabase';

// Hook for real-time analytics processing
export const useAnalyticsProcessor = (childId) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const processSession = useCallback(async (sessionData) => {
    if (!childId) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await analyticsProcessor.processLearningSession({
        ...sessionData,
        child_id: childId
      });
      
      setLastUpdate(new Date());
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [childId]);

  const subscribeToUpdates = useCallback((callback) => {
    return analyticsProcessor.subscribe('session_update', callback);
  }, []);

  return {
    processSession,
    subscribeToUpdates,
    isProcessing,
    error,
    lastUpdate,
    clearError: () => setError(null)
  };
};

// Hook for AI learning reports
export const useAILearningReport = (childId) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = useCallback(async (timeframe = 'week') => {
    if (!childId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const generatedReport = await aiLearningReportGenerator.generateLearningReport(childId, timeframe);
      setReport(generatedReport);
      return generatedReport;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [childId]);

  const refreshReport = useCallback(() => {
    if (report) {
      generateReport(report.timeframe);
    }
  }, [report, generateReport]);

  return {
    report,
    loading,
    error,
    generateReport,
    refreshReport,
    clearError: () => setError(null),
    clearReport: () => setReport(null)
  };
};

// Hook for progress reports
export const useProgressReport = (childId) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = useCallback(async (timeframe = 'week') => {
    if (!childId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const generatedReport = await progressReportGenerator.generateProgressReport(childId, timeframe);
      setReport(generatedReport);
      return generatedReport;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [childId]);

  const refreshReport = useCallback(() => {
    if (report) {
      generateReport(report.timeframe);
    }
  }, [report, generateReport]);

  return {
    report,
    loading,
    error,
    generateReport,
    refreshReport,
    clearError: () => setError(null),
    clearReport: () => setReport(null)
  };
};

// Hook for learning insights
export const useLearningInsights = (childId) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateInsights = useCallback(async () => {
    if (!childId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const generatedInsights = await learningInsightsGenerator.generateLearningInsights(childId);
      setInsights(generatedInsights);
      return generatedInsights;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [childId]);

  const refreshInsights = useCallback(() => {
    generateInsights();
  }, [generateInsights]);

  // Auto-refresh insights periodically
  useEffect(() => {
    if (childId) {
      generateInsights();
      
      // Refresh every 30 minutes
      const interval = setInterval(generateInsights, 30 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [childId, generateInsights]);

  return {
    insights,
    loading,
    error,
    generateInsights,
    refreshInsights,
    clearError: () => setError(null),
    clearInsights: () => setInsights(null)
  };
};

// Hook for real-time analytics data
export const useRealTimeAnalytics = (childId) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRealTime, setIsRealTime] = useState(false);

  const fetchAnalytics = useCallback(async (days = 7) => {
    if (!childId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await analyticsService.getChildAnalytics(childId, days);
      setAnalyticsData(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [childId]);

  const enableRealTime = useCallback(() => {
    if (!childId || isRealTime) return;
    
    const unsubscribe = analyticsProcessor.subscribe('session_update', (sessionData) => {
      if (sessionData.child_id === childId) {
        // Refresh analytics data when new session is processed
        fetchAnalytics();
      }
    });
    
    setIsRealTime(true);
    
    return () => {
      unsubscribe();
      setIsRealTime(false);
    };
  }, [childId, isRealTime, fetchAnalytics]);

  const disableRealTime = useCallback(() => {
    setIsRealTime(false);
  }, []);

  useEffect(() => {
    if (childId) {
      fetchAnalytics();
    }
  }, [childId, fetchAnalytics]);

  return {
    analyticsData,
    loading,
    error,
    isRealTime,
    fetchAnalytics,
    enableRealTime,
    disableRealTime,
    clearError: () => setError(null)
  };
};

// Hook for session tracking
export const useSessionTracking = (childId) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSessions = useCallback(async (limit = 50) => {
    if (!childId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await learningService.getChildSessions(childId, limit);
      setSessions(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [childId]);

  const addSession = useCallback(async (sessionData) => {
    if (!childId) return;
    
    try {
      const newSession = await learningService.createLearningSession({
        ...sessionData,
        child_id: childId
      });
      
      setSessions(prev => [newSession, ...prev]);
      
      // Process session for analytics
      await analyticsProcessor.processLearningSession(newSession);
      
      return newSession;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [childId]);

  const updateSession = useCallback(async (sessionId, updates) => {
    try {
      const updatedSession = await learningService.updateLearningSession(sessionId, updates);
      
      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId ? updatedSession : session
        )
      );
      
      // Process updated session for analytics
      await analyticsProcessor.processLearningSession(updatedSession);
      
      return updatedSession;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    if (childId) {
      fetchSessions();
    }
  }, [childId, fetchSessions]);

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    addSession,
    updateSession,
    clearError: () => setError(null)
  };
};

// Hook for quiz analytics
export const useQuizAnalytics = (childId) => {
  const [quizData, setQuizData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuizData = useCallback(async (days = 30) => {
    if (!childId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [quizResults, quizAnalytics] = await Promise.all([
        quizService.getChildQuizResults(childId),
        quizService.getQuizAnalytics(childId, days)
      ]);
      
      setQuizData(quizResults);
      
      // Calculate analytics
      const analytics = {
        total_quizzes: quizResults.length,
        average_score: quizResults.reduce((sum, q) => sum + q.score_percentage, 0) / quizResults.length || 0,
        perfect_scores: quizResults.filter(q => q.score_percentage === 100).length,
        improvement_rate: calculateImprovementRate(quizResults),
        subject_performance: calculateSubjectPerformance(quizResults),
        recent_performance: calculateRecentPerformance(quizResults)
      };
      
      setAnalytics(analytics);
      return { quizResults, analytics };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [childId]);

  const addQuizResult = useCallback(async (quizData) => {
    if (!childId) return;
    
    try {
      const newQuizResult = await quizService.saveQuizResult({
        ...quizData,
        child_id: childId
      });
      
      setQuizData(prev => [newQuizResult, ...prev]);
      
      // Recalculate analytics
      fetchQuizData();
      
      return newQuizResult;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [childId, fetchQuizData]);

  useEffect(() => {
    if (childId) {
      fetchQuizData();
    }
  }, [childId, fetchQuizData]);

  return {
    quizData,
    analytics,
    loading,
    error,
    fetchQuizData,
    addQuizResult,
    clearError: () => setError(null)
  };
};

// Helper functions for quiz analytics
const calculateImprovementRate = (quizResults) => {
  if (quizResults.length < 2) return 0;
  
  const sortedResults = quizResults.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  const firstHalf = sortedResults.slice(0, Math.floor(sortedResults.length / 2));
  const secondHalf = sortedResults.slice(Math.floor(sortedResults.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, q) => sum + q.score_percentage, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, q) => sum + q.score_percentage, 0) / secondHalf.length;
  
  return Math.round(((secondAvg - firstAvg) / firstAvg) * 100) || 0;
};

const calculateSubjectPerformance = (quizResults) => {
  const subjects = {};
  
  quizResults.forEach(quiz => {
    const subject = quiz.quiz_type || 'general';
    if (!subjects[subject]) {
      subjects[subject] = { scores: [], total: 0 };
    }
    subjects[subject].scores.push(quiz.score_percentage);
    subjects[subject].total++;
  });
  
  Object.keys(subjects).forEach(subject => {
    const data = subjects[subject];
    data.average = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length;
    data.best = Math.max(...data.scores);
    data.worst = Math.min(...data.scores);
  });
  
  return subjects;
};

const calculateRecentPerformance = (quizResults) => {
  const recent = quizResults
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  
  if (recent.length === 0) return null;
  
  return {
    average_score: recent.reduce((sum, q) => sum + q.score_percentage, 0) / recent.length,
    quiz_count: recent.length,
    trend: recent.length >= 3 ? calculateTrend(recent.slice(0, 3)) : 'stable'
  };
};

const calculateTrend = (recentQuizzes) => {
  if (recentQuizzes.length < 3) return 'stable';
  
  const scores = recentQuizzes.map(q => q.score_percentage);
  const firstScore = scores[scores.length - 1]; // Oldest of the 3
  const lastScore = scores[0]; // Most recent
  
  const change = ((lastScore - firstScore) / firstScore) * 100;
  
  if (change > 10) return 'improving';
  if (change < -10) return 'declining';
  return 'stable';
};

// Combined analytics hook
export const useComprehensiveAnalytics = (childId) => {
  const aiReport = useAILearningReport(childId);
  const progressReport = useProgressReport(childId);
  const insights = useLearningInsights(childId);
  const realTimeAnalytics = useRealTimeAnalytics(childId);
  const sessionTracking = useSessionTracking(childId);
  const quizAnalytics = useQuizAnalytics(childId);
  const analyticsProcessor = useAnalyticsProcessor(childId);

  const generateAllReports = useCallback(async (timeframe = 'week') => {
    const results = await Promise.allSettled([
      aiReport.generateReport(timeframe),
      progressReport.generateReport(timeframe),
      insights.generateInsights()
    ]);
    
    return {
      aiReport: results[0].status === 'fulfilled' ? results[0].value : null,
      progressReport: results[1].status === 'fulfilled' ? results[1].value : null,
      insights: results[2].status === 'fulfilled' ? results[2].value : null,
      errors: results.filter(r => r.status === 'rejected').map(r => r.reason)
    };
  }, [aiReport, progressReport, insights]);

  const isLoading = aiReport.loading || progressReport.loading || insights.loading || 
                   realTimeAnalytics.loading || sessionTracking.loading || quizAnalytics.loading;

  const hasError = aiReport.error || progressReport.error || insights.error || 
                   realTimeAnalytics.error || sessionTracking.error || quizAnalytics.error;

  return {
    // Individual hooks
    aiReport,
    progressReport,
    insights,
    realTimeAnalytics,
    sessionTracking,
    quizAnalytics,
    analyticsProcessor,
    
    // Combined operations
    generateAllReports,
    isLoading,
    hasError,
    
    // Quick access to data
    data: {
      aiReport: aiReport.report,
      progressReport: progressReport.report,
      insights: insights.insights,
      realTimeAnalytics: realTimeAnalytics.analyticsData,
      sessions: sessionTracking.sessions,
      quizAnalytics: quizAnalytics.analytics
    }
  };
};