// Analytics Service - Real-time data processing and reporting
import { supabase, learningService, quizService, analyticsService } from './supabase';
import { generateLearningContent } from './gemini';

// Real-time Analytics Data Processing
export class AnalyticsProcessor {
  constructor() {
    this.cache = new Map();
    this.subscribers = new Map();
  }

  // Process learning session data in real-time
  async processLearningSession(sessionData) {
    try {
      // Update daily analytics
      await this.updateDailyAnalytics(sessionData.child_id, {
        session_time: sessionData.duration_minutes,
        completion_rate: sessionData.completion_percentage,
        subject: sessionData.subject,
        points_earned: sessionData.points_earned
      });

      // Trigger real-time updates
      this.notifySubscribers('session_update', sessionData);
      
      return true;
    } catch (error) {
      console.error('Error processing learning session:', error);
      return false;
    }
  }

  // Update daily analytics with real-time calculations
  async updateDailyAnalytics(childId, sessionData) {
    const today = new Date().toISOString().split('T')[0];
    
    // Get existing analytics for today
    const { data: existing } = await supabase
      .from('learning_analytics')
      .select('*')
      .eq('child_id', childId)
      .eq('analysis_date', today)
      .single();

    const updatedData = {
      child_id: childId,
      analysis_date: today,
      total_session_time_minutes: (existing?.total_session_time_minutes || 0) + (sessionData.session_time || 0),
      sessions_completed: (existing?.sessions_completed || 0) + 1,
      average_score_percentage: this.calculateAverageScore(existing, sessionData),
      subjects_studied: this.updateSubjectsStudied(existing?.subjects_studied || [], sessionData.subject),
      learning_velocity: this.calculateLearningVelocity(existing, sessionData),
      engagement_score: this.calculateEngagementScore(existing, sessionData),
      performance_trends: this.updatePerformanceTrends(existing?.performance_trends || {}, sessionData),
      weekly_progress: await this.calculateWeeklyProgress(childId)
    };

    await analyticsService.updateDailyAnalytics(childId, updatedData);
    return updatedData;
  }

  // Calculate average score with new session data
  calculateAverageScore(existing, sessionData) {
    if (!existing) return sessionData.completion_rate || 0;
    
    const totalSessions = existing.sessions_completed + 1;
    const currentTotal = existing.average_score_percentage * existing.sessions_completed;
    return Math.round((currentTotal + (sessionData.completion_rate || 0)) / totalSessions);
  }

  // Update subjects studied array
  updateSubjectsStudied(existingSubjects, newSubject) {
    if (!newSubject) return existingSubjects;
    
    const subjects = [...existingSubjects];
    if (!subjects.includes(newSubject)) {
      subjects.push(newSubject);
    }
    return subjects;
  }

  // Calculate learning velocity (lessons per hour)
  calculateLearningVelocity(existing, sessionData) {
    const totalTime = (existing?.total_session_time_minutes || 0) + (sessionData.session_time || 0);
    const totalSessions = (existing?.sessions_completed || 0) + 1;
    
    if (totalTime === 0) return 0;
    return Math.round((totalSessions / (totalTime / 60)) * 100) / 100;
  }

  // Calculate engagement score based on completion rates and time spent
  calculateEngagementScore(existing, sessionData) {
    const completionRate = sessionData.completion_rate || 0;
    const timeSpent = sessionData.session_time || 0;
    const pointsEarned = sessionData.points_earned || 0;
    
    // Weighted engagement score
    const engagementScore = (completionRate * 0.4) + 
                           (Math.min(timeSpent / 30, 1) * 100 * 0.3) + 
                           (Math.min(pointsEarned / 100, 1) * 100 * 0.3);
    
    if (!existing) return Math.round(engagementScore);
    
    // Average with existing score
    const totalSessions = existing.sessions_completed + 1;
    const currentTotal = existing.engagement_score * existing.sessions_completed;
    return Math.round((currentTotal + engagementScore) / totalSessions);
  }

  // Update performance trends
  updatePerformanceTrends(existingTrends, sessionData) {
    const today = new Date().toISOString().split('T')[0];
    const trends = { ...existingTrends };
    
    if (!trends.daily) trends.daily = {};
    trends.daily[today] = {
      completion_rate: sessionData.completion_rate || 0,
      time_spent: sessionData.session_time || 0,
      points_earned: sessionData.points_earned || 0
    };
    
    // Keep only last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    Object.keys(trends.daily).forEach(date => {
      if (new Date(date) < thirtyDaysAgo) {
        delete trends.daily[date];
      }
    });
    
    return trends;
  }

  // Calculate weekly progress
  async calculateWeeklyProgress(childId) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const { data: weeklyData } = await supabase
      .from('learning_analytics')
      .select('*')
      .eq('child_id', childId)
      .gte('analysis_date', weekAgo.toISOString().split('T')[0]);
    
    if (!weeklyData || weeklyData.length === 0) return {};
    
    const totalTime = weeklyData.reduce((sum, day) => sum + (day.total_session_time_minutes || 0), 0);
    const totalSessions = weeklyData.reduce((sum, day) => sum + (day.sessions_completed || 0), 0);
    const avgScore = weeklyData.reduce((sum, day) => sum + (day.average_score_percentage || 0), 0) / weeklyData.length;
    
    return {
      total_time_minutes: totalTime,
      total_sessions: totalSessions,
      average_score: Math.round(avgScore),
      days_active: weeklyData.length,
      subjects_covered: [...new Set(weeklyData.flatMap(day => day.subjects_studied || []))]
    };
  }

  // Subscribe to real-time updates
  subscribe(eventType, callback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType).add(callback);
    
    return () => {
      this.subscribers.get(eventType)?.delete(callback);
    };
  }

  // Notify subscribers of updates
  notifySubscribers(eventType, data) {
    const callbacks = this.subscribers.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}

// AI Learning Report Generator
export class AILearningReportGenerator {
  constructor() {
    this.processor = new AnalyticsProcessor();
  }

  // Generate comprehensive AI learning report
  async generateLearningReport(childId, timeframe = 'week') {
    try {
      const [childProfile, analyticsData, sessions, quizResults] = await Promise.all([
        this.getChildProfile(childId),
        this.getAnalyticsData(childId, timeframe),
        this.getRecentSessions(childId, timeframe),
        this.getQuizResults(childId, timeframe)
      ]);

      const report = {
        child: childProfile,
        timeframe,
        generated_at: new Date().toISOString(),
        performance_analysis: await this.analyzePerformance(analyticsData, sessions, quizResults),
        learning_trends: this.identifyLearningTrends(analyticsData),
        subject_analysis: this.analyzeSubjectPerformance(sessions, quizResults),
        recommendations: await this.generatePersonalizedRecommendations(childProfile, analyticsData, sessions),
        achievements: this.identifyAchievements(sessions, quizResults),
        areas_for_improvement: this.identifyImprovementAreas(sessions, quizResults),
        engagement_metrics: this.calculateEngagementMetrics(analyticsData, sessions)
      };

      return report;
    } catch (error) {
      console.error('Error generating learning report:', error);
      throw error;
    }
  }

  // Get child profile data
  async getChildProfile(childId) {
    const { data, error } = await supabase
      .from('child_profiles')
      .select('*')
      .eq('id', childId)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Get analytics data for timeframe
  async getAnalyticsData(childId, timeframe) {
    const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('learning_analytics')
      .select('*')
      .eq('child_id', childId)
      .gte('analysis_date', startDate.toISOString().split('T')[0])
      .order('analysis_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  // Get recent learning sessions
  async getRecentSessions(childId, timeframe) {
    const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('learning_sessions')
      .select('*')
      .eq('child_id', childId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Get quiz results
  async getQuizResults(childId, timeframe) {
    const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('child_id', childId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Analyze overall performance
  async analyzePerformance(analyticsData, sessions, quizResults) {
    const totalTime = analyticsData.reduce((sum, day) => sum + (day.total_session_time_minutes || 0), 0);
    const totalSessions = sessions.length;
    const avgCompletion = sessions.reduce((sum, s) => sum + (s.completion_percentage || 0), 0) / totalSessions || 0;
    const avgQuizScore = quizResults.reduce((sum, q) => sum + (q.score_percentage || 0), 0) / quizResults.length || 0;
    
    return {
      total_learning_time: totalTime,
      total_sessions: totalSessions,
      average_completion_rate: Math.round(avgCompletion),
      average_quiz_score: Math.round(avgQuizScore),
      learning_consistency: this.calculateConsistency(analyticsData),
      improvement_rate: this.calculateImprovementRate(quizResults),
      performance_level: this.getPerformanceLevel(avgQuizScore, avgCompletion)
    };
  }

  // Identify learning trends
  identifyLearningTrends(analyticsData) {
    if (analyticsData.length < 2) return { trend: 'insufficient_data' };
    
    const recent = analyticsData.slice(-3);
    const earlier = analyticsData.slice(0, -3);
    
    const recentAvg = recent.reduce((sum, day) => sum + (day.average_score_percentage || 0), 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, day) => sum + (day.average_score_percentage || 0), 0) / earlier.length || recentAvg;
    
    const trend = recentAvg > earlierAvg ? 'improving' : recentAvg < earlierAvg ? 'declining' : 'stable';
    const trendStrength = Math.abs(recentAvg - earlierAvg);
    
    return {
      trend,
      strength: trendStrength > 10 ? 'strong' : trendStrength > 5 ? 'moderate' : 'weak',
      recent_average: Math.round(recentAvg),
      previous_average: Math.round(earlierAvg),
      change_percentage: Math.round(((recentAvg - earlierAvg) / earlierAvg) * 100) || 0
    };
  }

  // Analyze subject-specific performance
  analyzeSubjectPerformance(sessions, quizResults) {
    const subjectData = {};
    
    // Analyze sessions by subject
    sessions.forEach(session => {
      if (!subjectData[session.subject]) {
        subjectData[session.subject] = {
          sessions: 0,
          total_time: 0,
          total_completion: 0,
          quiz_scores: []
        };
      }
      
      subjectData[session.subject].sessions++;
      subjectData[session.subject].total_time += session.duration_minutes || 0;
      subjectData[session.subject].total_completion += session.completion_percentage || 0;
    });
    
    // Add quiz data
    quizResults.forEach(quiz => {
      // Assuming we can derive subject from quiz data or session relationship
      const subject = quiz.quiz_type || 'general';
      if (subjectData[subject]) {
        subjectData[subject].quiz_scores.push(quiz.score_percentage);
      }
    });
    
    // Calculate subject metrics
    Object.keys(subjectData).forEach(subject => {
      const data = subjectData[subject];
      data.average_completion = Math.round(data.total_completion / data.sessions) || 0;
      data.average_quiz_score = data.quiz_scores.length > 0 
        ? Math.round(data.quiz_scores.reduce((sum, score) => sum + score, 0) / data.quiz_scores.length)
        : 0;
      data.time_per_session = Math.round(data.total_time / data.sessions) || 0;
      data.strength_level = this.getSubjectStrength(data.average_completion, data.average_quiz_score);
    });
    
    return subjectData;
  }

  // Generate personalized recommendations using AI
  async generatePersonalizedRecommendations(childProfile, analyticsData, sessions) {
    try {
      const prompt = `
      Generate personalized learning recommendations for a ${childProfile.age}-year-old child based on their learning data.
      
      Child Profile:
      - Age: ${childProfile.age}
      - Interests: ${childProfile.interests?.join(', ') || 'General learning'}
      
      Recent Performance:
      - Total sessions: ${sessions.length}
      - Average completion: ${sessions.reduce((sum, s) => sum + (s.completion_percentage || 0), 0) / sessions.length || 0}%
      - Subjects studied: ${[...new Set(sessions.map(s => s.subject))].join(', ')}
      
      Provide 3-5 specific, actionable recommendations in JSON format:
      [
        {
          "type": "skill_focus",
          "title": "Recommendation title",
          "description": "Detailed description",
          "priority": "high|medium|low",
          "estimated_impact": "Description of expected impact"
        }
      ]
      `;

      const recommendations = await generateLearningContent(prompt, `${childProfile.age} years`, 'beginner');
      
      // Try to parse as JSON, fallback to default recommendations
      try {
        return JSON.parse(recommendations);
      } catch {
        return this.getDefaultRecommendations(childProfile, sessions);
      }
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      return this.getDefaultRecommendations(childProfile, sessions);
    }
  }

  // Get default recommendations if AI fails
  getDefaultRecommendations(childProfile, sessions) {
    const recommendations = [];
    
    if (sessions.length < 5) {
      recommendations.push({
        type: 'engagement',
        title: 'Build Learning Routine',
        description: 'Try to complete at least one lesson daily to build a strong learning habit.',
        priority: 'high',
        estimated_impact: 'Improved consistency and retention'
      });
    }
    
    const avgCompletion = sessions.reduce((sum, s) => sum + (s.completion_percentage || 0), 0) / sessions.length || 0;
    if (avgCompletion < 70) {
      recommendations.push({
        type: 'difficulty_adjustment',
        title: 'Focus on Fundamentals',
        description: 'Spend more time on basic concepts before moving to advanced topics.',
        priority: 'high',
        estimated_impact: 'Better understanding and higher completion rates'
      });
    }
    
    return recommendations;
  }

  // Calculate learning consistency
  calculateConsistency(analyticsData) {
    if (analyticsData.length < 3) return 0;
    
    const dailyScores = analyticsData.map(day => day.average_score_percentage || 0);
    const mean = dailyScores.reduce((sum, score) => sum + score, 0) / dailyScores.length;
    const variance = dailyScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / dailyScores.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Lower standard deviation = higher consistency
    return Math.max(0, Math.round(100 - standardDeviation));
  }

  // Calculate improvement rate
  calculateImprovementRate(quizResults) {
    if (quizResults.length < 2) return 0;
    
    const sortedResults = quizResults.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const firstHalf = sortedResults.slice(0, Math.floor(sortedResults.length / 2));
    const secondHalf = sortedResults.slice(Math.floor(sortedResults.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, q) => sum + q.score_percentage, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, q) => sum + q.score_percentage, 0) / secondHalf.length;
    
    return Math.round(((secondAvg - firstAvg) / firstAvg) * 100) || 0;
  }

  // Get performance level
  getPerformanceLevel(avgQuizScore, avgCompletion) {
    const overallScore = (avgQuizScore + avgCompletion) / 2;
    
    if (overallScore >= 90) return 'excellent';
    if (overallScore >= 80) return 'very_good';
    if (overallScore >= 70) return 'good';
    if (overallScore >= 60) return 'fair';
    return 'needs_improvement';
  }

  // Get subject strength level
  getSubjectStrength(completion, quizScore) {
    const combined = (completion + quizScore) / 2;
    
    if (combined >= 85) return 'strong';
    if (combined >= 70) return 'moderate';
    if (combined >= 55) return 'developing';
    return 'needs_focus';
  }

  // Identify achievements
  identifyAchievements(sessions, quizResults) {
    const achievements = [];
    
    // Session-based achievements
    if (sessions.length >= 10) {
      achievements.push({
        type: 'milestone',
        title: 'Learning Champion',
        description: `Completed ${sessions.length} learning sessions!`,
        icon: '🏆'
      });
    }
    
    // Quiz-based achievements
    const perfectScores = quizResults.filter(q => q.score_percentage === 100).length;
    if (perfectScores > 0) {
      achievements.push({
        type: 'performance',
        title: 'Perfect Score',
        description: `Achieved ${perfectScores} perfect quiz score${perfectScores > 1 ? 's' : ''}!`,
        icon: '⭐'
      });
    }
    
    // Consistency achievements
    const recentSessions = sessions.slice(0, 7);
    if (recentSessions.length === 7) {
      achievements.push({
        type: 'consistency',
        title: 'Week Warrior',
        description: 'Completed learning sessions for 7 days straight!',
        icon: '🔥'
      });
    }
    
    return achievements;
  }

  // Identify areas for improvement
  identifyImprovementAreas(sessions, quizResults) {
    const areas = [];
    
    // Low completion rates
    const lowCompletionSessions = sessions.filter(s => (s.completion_percentage || 0) < 60);
    if (lowCompletionSessions.length > sessions.length * 0.3) {
      areas.push({
        area: 'Session Completion',
        description: 'Focus on completing lessons fully before moving to new topics',
        priority: 'high',
        suggestion: 'Break lessons into smaller chunks and take breaks when needed'
      });
    }
    
    // Low quiz scores
    const lowQuizScores = quizResults.filter(q => q.score_percentage < 70);
    if (lowQuizScores.length > quizResults.length * 0.4) {
      areas.push({
        area: 'Quiz Performance',
        description: 'Review lesson content more thoroughly before taking quizzes',
        priority: 'medium',
        suggestion: 'Re-read lessons and ask questions about unclear concepts'
      });
    }
    
    return areas;
  }

  // Calculate engagement metrics
  calculateEngagementMetrics(analyticsData, sessions) {
    const totalTime = analyticsData.reduce((sum, day) => sum + (day.total_session_time_minutes || 0), 0);
    const avgSessionTime = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / sessions.length || 0;
    const avgEngagement = analyticsData.reduce((sum, day) => sum + (day.engagement_score || 0), 0) / analyticsData.length || 0;
    
    return {
      total_time_minutes: totalTime,
      average_session_time: Math.round(avgSessionTime),
      engagement_score: Math.round(avgEngagement),
      engagement_level: avgEngagement >= 80 ? 'high' : avgEngagement >= 60 ? 'medium' : 'low',
      time_distribution: this.calculateTimeDistribution(sessions)
    };
  }

  // Calculate time distribution across subjects
  calculateTimeDistribution(sessions) {
    const distribution = {};
    let totalTime = 0;
    
    sessions.forEach(session => {
      const subject = session.subject || 'other';
      const time = session.duration_minutes || 0;
      
      if (!distribution[subject]) distribution[subject] = 0;
      distribution[subject] += time;
      totalTime += time;
    });
    
    // Convert to percentages
    Object.keys(distribution).forEach(subject => {
      distribution[subject] = Math.round((distribution[subject] / totalTime) * 100) || 0;
    });
    
    return distribution;
  }
}

// Progress Report Generator
export class ProgressReportGenerator {
  // Generate comprehensive progress report
  async generateProgressReport(childId, timeframe = 'week') {
    try {
      const [childProfile, sessions, quizResults, analytics] = await Promise.all([
        this.getChildProfile(childId),
        this.getRecentSessions(childId, timeframe),
        this.getQuizResults(childId, timeframe),
        this.getAnalyticsData(childId, timeframe)
      ]);

      return {
        child: childProfile,
        timeframe,
        generated_at: new Date().toISOString(),
        session_tracking: this.generateSessionTracking(sessions),
        time_analysis: this.generateTimeAnalysis(sessions, analytics),
        achievement_system: this.generateAchievementSystem(sessions, quizResults),
        activity_timeline: this.generateActivityTimeline(sessions, quizResults),
        progress_metrics: this.generateProgressMetrics(sessions, quizResults, analytics)
      };
    } catch (error) {
      console.error('Error generating progress report:', error);
      throw error;
    }
  }

  // Generate session completion tracking
  generateSessionTracking(sessions) {
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => (s.completion_percentage || 0) >= 80).length;
    const partialSessions = sessions.filter(s => (s.completion_percentage || 0) >= 50 && (s.completion_percentage || 0) < 80).length;
    const incompleteSessions = totalSessions - completedSessions - partialSessions;

    return {
      total_sessions: totalSessions,
      completed_sessions: completedSessions,
      partial_sessions: partialSessions,
      incomplete_sessions: incompleteSessions,
      completion_rate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
      average_completion: sessions.reduce((sum, s) => sum + (s.completion_percentage || 0), 0) / totalSessions || 0,
      subjects_covered: [...new Set(sessions.map(s => s.subject))],
      session_types: this.analyzeSessionTypes(sessions)
    };
  }

  // Generate time spent analysis
  generateTimeAnalysis(sessions, analytics) {
    const totalTime = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    const avgSessionTime = totalTime / sessions.length || 0;
    const dailyAverage = analytics.reduce((sum, day) => sum + (day.total_session_time_minutes || 0), 0) / analytics.length || 0;

    return {
      total_time_minutes: totalTime,
      total_time_hours: Math.round((totalTime / 60) * 10) / 10,
      average_session_time: Math.round(avgSessionTime),
      daily_average: Math.round(dailyAverage),
      time_by_subject: this.calculateTimeBySubject(sessions),
      time_by_day: this.calculateTimeByDay(sessions),
      optimal_session_length: this.calculateOptimalSessionLength(sessions)
    };
  }

  // Generate achievement system data
  generateAchievementSystem(sessions, quizResults) {
    const achievements = [];
    let totalPoints = 0;

    // Calculate points from sessions
    sessions.forEach(session => {
      totalPoints += session.points_earned || 0;
    });

    // Session milestones
    if (sessions.length >= 5) achievements.push({ type: 'sessions', title: 'Getting Started', earned: true });
    if (sessions.length >= 10) achievements.push({ type: 'sessions', title: 'Learning Enthusiast', earned: true });
    if (sessions.length >= 25) achievements.push({ type: 'sessions', title: 'Knowledge Seeker', earned: true });

    // Quiz achievements
    const perfectQuizzes = quizResults.filter(q => q.score_percentage === 100).length;
    if (perfectQuizzes >= 1) achievements.push({ type: 'quiz', title: 'Perfect Score', earned: true });
    if (perfectQuizzes >= 5) achievements.push({ type: 'quiz', title: 'Quiz Master', earned: true });

    // Streak achievements
    const currentStreak = this.calculateCurrentStreak(sessions);
    if (currentStreak >= 3) achievements.push({ type: 'streak', title: '3-Day Streak', earned: true });
    if (currentStreak >= 7) achievements.push({ type: 'streak', title: 'Week Warrior', earned: true });

    return {
      total_points: totalPoints,
      achievements_earned: achievements.filter(a => a.earned).length,
      achievements,
      current_streak: currentStreak,
      badges: this.generateBadges(sessions, quizResults),
      next_milestone: this.getNextMilestone(sessions.length, totalPoints)
    };
  }

  // Generate recent activity timeline
  generateActivityTimeline(sessions, quizResults) {
    const activities = [];

    // Add sessions to timeline
    sessions.forEach(session => {
      activities.push({
        type: 'session',
        date: session.created_at,
        title: `${session.session_type} - ${session.topic}`,
        subject: session.subject,
        completion: session.completion_percentage,
        points: session.points_earned,
        duration: session.duration_minutes
      });
    });

    // Add quiz results to timeline
    quizResults.forEach(quiz => {
      activities.push({
        type: 'quiz',
        date: quiz.created_at,
        title: `${quiz.quiz_type} Quiz`,
        score: quiz.score_percentage,
        questions: quiz.total_questions,
        correct: quiz.correct_answers
      });
    });

    // Sort by date (most recent first)
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    return activities.slice(0, 20); // Return last 20 activities
  }

  // Generate progress metrics
  generateProgressMetrics(sessions, quizResults, analytics) {
    const weeklyProgress = this.calculateWeeklyProgress(analytics);
    const subjectProgress = this.calculateSubjectProgress(sessions, quizResults);
    const skillDevelopment = this.calculateSkillDevelopment(sessions, quizResults);

    return {
      weekly_progress: weeklyProgress,
      subject_progress: subjectProgress,
      skill_development: skillDevelopment,
      learning_velocity: this.calculateLearningVelocity(sessions),
      consistency_score: this.calculateConsistencyScore(analytics),
      improvement_trend: this.calculateImprovementTrend(quizResults)
    };
  }

  // Helper methods for calculations
  analyzeSessionTypes(sessions) {
    const types = {};
    sessions.forEach(session => {
      const type = session.session_type || 'unknown';
      types[type] = (types[type] || 0) + 1;
    });
    return types;
  }

  calculateTimeBySubject(sessions) {
    const timeBySubject = {};
    sessions.forEach(session => {
      const subject = session.subject || 'other';
      timeBySubject[subject] = (timeBySubject[subject] || 0) + (session.duration_minutes || 0);
    });
    return timeBySubject;
  }

  calculateTimeByDay(sessions) {
    const timeByDay = {};
    sessions.forEach(session => {
      const day = new Date(session.created_at).toISOString().split('T')[0];
      timeByDay[day] = (timeByDay[day] || 0) + (session.duration_minutes || 0);
    });
    return timeByDay;
  }

  calculateOptimalSessionLength(sessions) {
    const completedSessions = sessions.filter(s => (s.completion_percentage || 0) >= 80);
    if (completedSessions.length === 0) return 20; // Default
    
    const avgTime = completedSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / completedSessions.length;
    return Math.round(avgTime);
  }

  calculateCurrentStreak(sessions) {
    if (sessions.length === 0) return 0;
    
    const sortedSessions = sessions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const dateStr = currentDate.toISOString().split('T')[0];
      const hasSession = sortedSessions.some(session => 
        session.created_at.split('T')[0] === dateStr
      );
      
      if (hasSession) {
        streak++;
      } else if (streak > 0) {
        break; // Streak broken
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  }

  generateBadges(sessions, quizResults) {
    const badges = [];
    
    // Subject badges
    const subjects = [...new Set(sessions.map(s => s.subject))];
    subjects.forEach(subject => {
      const subjectSessions = sessions.filter(s => s.subject === subject);
      if (subjectSessions.length >= 5) {
        badges.push({
          name: `${subject} Explorer`,
          description: `Completed 5+ sessions in ${subject}`,
          icon: '🎯'
        });
      }
    });
    
    // Performance badges
    const avgQuizScore = quizResults.reduce((sum, q) => sum + q.score_percentage, 0) / quizResults.length || 0;
    if (avgQuizScore >= 90) {
      badges.push({
        name: 'Quiz Champion',
        description: 'Maintained 90%+ average quiz score',
        icon: '🏆'
      });
    }
    
    return badges;
  }

  getNextMilestone(sessionCount, totalPoints) {
    if (sessionCount < 10) return { type: 'sessions', target: 10, current: sessionCount, title: 'Learning Enthusiast' };
    if (sessionCount < 25) return { type: 'sessions', target: 25, current: sessionCount, title: 'Knowledge Seeker' };
    if (totalPoints < 500) return { type: 'points', target: 500, current: totalPoints, title: 'Point Master' };
    if (sessionCount < 50) return { type: 'sessions', target: 50, current: sessionCount, title: 'Learning Expert' };
    
    return { type: 'sessions', target: 100, current: sessionCount, title: 'Learning Legend' };
  }

  // Additional helper methods would continue here...
  calculateWeeklyProgress(analytics) {
    // Implementation for weekly progress calculation
    return analytics.reduce((acc, day) => {
      acc.total_time += day.total_session_time_minutes || 0;
      acc.total_sessions += day.sessions_completed || 0;
      acc.avg_score += day.average_score_percentage || 0;
      return acc;
    }, { total_time: 0, total_sessions: 0, avg_score: 0 });
  }

  calculateSubjectProgress(sessions, quizResults) {
    // Implementation for subject progress calculation
    const subjects = {};
    sessions.forEach(session => {
      if (!subjects[session.subject]) {
        subjects[session.subject] = { sessions: 0, avg_completion: 0, quiz_scores: [] };
      }
      subjects[session.subject].sessions++;
      subjects[session.subject].avg_completion += session.completion_percentage || 0;
    });
    
    return subjects;
  }

  calculateSkillDevelopment(sessions, quizResults) {
    // Implementation for skill development tracking
    return {
      problem_solving: this.calculateSkillScore(sessions, 'problem_solving'),
      critical_thinking: this.calculateSkillScore(sessions, 'critical_thinking'),
      creativity: this.calculateSkillScore(sessions, 'creativity'),
      communication: this.calculateSkillScore(sessions, 'communication')
    };
  }

  calculateSkillScore(sessions, skill) {
    // Mock implementation - in real app, this would analyze session data for specific skills
    return Math.floor(Math.random() * 40) + 60; // Random score between 60-100
  }

  calculateLearningVelocity(sessions) {
    if (sessions.length < 2) return 0;
    
    const totalTime = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    return totalTime > 0 ? Math.round((sessions.length / (totalTime / 60)) * 100) / 100 : 0;
  }

  calculateConsistencyScore(analytics) {
    if (analytics.length < 3) return 0;
    
    const scores = analytics.map(day => day.average_score_percentage || 0);
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    
    return Math.max(0, Math.round(100 - Math.sqrt(variance)));
  }

  calculateImprovementTrend(quizResults) {
    if (quizResults.length < 2) return 'stable';
    
    const sorted = quizResults.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
    const secondHalf = sorted.slice(Math.floor(sorted.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, q) => sum + q.score_percentage, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, q) => sum + q.score_percentage, 0) / secondHalf.length;
    
    const improvement = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    if (improvement > 10) return 'improving';
    if (improvement < -10) return 'declining';
    return 'stable';
  }

  // Get child profile, sessions, quiz results, and analytics data
  async getChildProfile(childId) {
    const { data, error } = await supabase
      .from('child_profiles')
      .select('*')
      .eq('id', childId)
      .single();
    
    if (error) throw error;
    return data;
  }

  async getRecentSessions(childId, timeframe) {
    const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('learning_sessions')
      .select('*')
      .eq('child_id', childId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getQuizResults(childId, timeframe) {
    const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('child_id', childId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getAnalyticsData(childId, timeframe) {
    const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('learning_analytics')
      .select('*')
      .eq('child_id', childId)
      .gte('analysis_date', startDate.toISOString().split('T')[0])
      .order('analysis_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }
}

// Learning Insights Generator
export class LearningInsightsGenerator {
  // Generate comprehensive learning insights
  async generateLearningInsights(childId) {
    try {
      const [weeklyAnalytics, performanceTrends, engagementAnalysis, subjectOverview] = await Promise.all([
        this.processWeeklyAnalytics(childId),
        this.analyzePerformanceTrends(childId),
        this.analyzeEngagementLevels(childId),
        this.generateSubjectProgressOverview(childId)
      ]);

      return {
        child_id: childId,
        generated_at: new Date().toISOString(),
        weekly_analytics: weeklyAnalytics,
        performance_trends: performanceTrends,
        engagement_analysis: engagementAnalysis,
        subject_overview: subjectOverview,
        insights_summary: this.generateInsightsSummary(weeklyAnalytics, performanceTrends, engagementAnalysis),
        recommendations: this.generateInsightsRecommendations(weeklyAnalytics, performanceTrends, engagementAnalysis)
      };
    } catch (error) {
      console.error('Error generating learning insights:', error);
      throw error;
    }
  }

  // Process weekly analytics with advanced calculations
  async processWeeklyAnalytics(childId) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const { data: weeklyData } = await supabase
      .from('learning_analytics')
      .select('*')
      .eq('child_id', childId)
      .gte('analysis_date', weekAgo.toISOString().split('T')[0])
      .order('analysis_date', { ascending: true });

    if (!weeklyData || weeklyData.length === 0) {
      return { status: 'insufficient_data', message: 'Not enough data for weekly analysis' };
    }

    const totalTime = weeklyData.reduce((sum, day) => sum + (day.total_session_time_minutes || 0), 0);
    const totalSessions = weeklyData.reduce((sum, day) => sum + (day.sessions_completed || 0), 0);
    const avgScore = weeklyData.reduce((sum, day) => sum + (day.average_score_percentage || 0), 0) / weeklyData.length;
    const avgEngagement = weeklyData.reduce((sum, day) => sum + (day.engagement_score || 0), 0) / weeklyData.length;

    return {
      total_learning_time: totalTime,
      total_sessions: totalSessions,
      average_score: Math.round(avgScore),
      average_engagement: Math.round(avgEngagement),
      days_active: weeklyData.length,
      daily_breakdown: weeklyData.map(day => ({
        date: day.analysis_date,
        time: day.total_session_time_minutes,
        sessions: day.sessions_completed,
        score: day.average_score_percentage,
        engagement: day.engagement_score
      })),
      learning_pattern: this.identifyLearningPattern(weeklyData),
      peak_performance_day: this.findPeakPerformanceDay(weeklyData),
      consistency_rating: this.calculateConsistencyRating(weeklyData)
    };
  }

  // Analyze performance trends over time
  async analyzePerformanceTrends(childId) {
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    
    const { data: monthlyData } = await supabase
      .from('learning_analytics')
      .select('*')
      .eq('child_id', childId)
      .gte('analysis_date', monthAgo.toISOString().split('T')[0])
      .order('analysis_date', { ascending: true });

    if (!monthlyData || monthlyData.length < 7) {
      return { status: 'insufficient_data', message: 'Need at least 7 days of data for trend analysis' };
    }

    const weeklyAverages = this.calculateWeeklyAverages(monthlyData);
    const trendDirection = this.calculateTrendDirection(weeklyAverages);
    const volatility = this.calculatePerformanceVolatility(monthlyData);

    return {
      trend_direction: trendDirection,
      trend_strength: this.calculateTrendStrength(weeklyAverages),
      volatility_score: volatility,
      performance_stability: volatility < 15 ? 'stable' : volatility < 30 ? 'moderate' : 'volatile',
      weekly_averages: weeklyAverages,
      best_week: this.findBestWeek(weeklyAverages),
      improvement_areas: this.identifyImprovementAreas(monthlyData),
      prediction: this.predictNextWeekPerformance(weeklyAverages)
    };
  }

  // Analyze engagement levels and patterns
  async analyzeEngagementLevels(childId) {
    const { data: sessions } = await supabase
      .from('learning_sessions')
      .select('*')
      .eq('child_id', childId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true });

    if (!sessions || sessions.length === 0) {
      return { status: 'no_sessions', message: 'No recent sessions found' };
    }

    const engagementByTimeOfDay = this.analyzeEngagementByTimeOfDay(sessions);
    const engagementBySubject = this.analyzeEngagementBySubject(sessions);
    const sessionLengthAnalysis = this.analyzeSessionLengths(sessions);

    return {
      overall_engagement: this.calculateOverallEngagement(sessions),
      engagement_by_time: engagementByTimeOfDay,
      engagement_by_subject: engagementBySubject,
      optimal_session_length: sessionLengthAnalysis.optimal_length,
      session_length_analysis: sessionLengthAnalysis,
      engagement_trends: this.calculateEngagementTrends(sessions),
      recommendations: this.generateEngagementRecommendations(engagementByTimeOfDay, engagementBySubject)
    };
  }

  // Generate subject progress overview
  async generateSubjectProgressOverview(childId) {
    const [sessions, quizResults] = await Promise.all([
      supabase.from('learning_sessions').select('*').eq('child_id', childId).gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      supabase.from('quiz_results').select('*').eq('child_id', childId).gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    ]);

    const subjectData = {};
    
    // Process sessions by subject
    sessions.data?.forEach(session => {
      if (!subjectData[session.subject]) {
        subjectData[session.subject] = {
          sessions: 0,
          total_time: 0,
          completion_rates: [],
          quiz_scores: [],
          topics_covered: new Set()
        };
      }
      
      const subject = subjectData[session.subject];
      subject.sessions++;
      subject.total_time += session.duration_minutes || 0;
      subject.completion_rates.push(session.completion_percentage || 0);
      subject.topics_covered.add(session.topic);
    });

    // Add quiz data
    quizResults.data?.forEach(quiz => {
      const subject = quiz.quiz_type || 'general'; // Assuming quiz_type maps to subject
      if (subjectData[subject]) {
        subjectData[subject].quiz_scores.push(quiz.score_percentage);
      }
    });

    // Calculate metrics for each subject
    Object.keys(subjectData).forEach(subject => {
      const data = subjectData[subject];
      data.average_completion = data.completion_rates.reduce((sum, rate) => sum + rate, 0) / data.completion_rates.length || 0;
      data.average_quiz_score = data.quiz_scores.reduce((sum, score) => sum + score, 0) / data.quiz_scores.length || 0;
      data.topics_covered = Array.from(data.topics_covered);
      data.proficiency_level = this.calculateProficiencyLevel(data.average_completion, data.average_quiz_score);
      data.progress_rate = this.calculateProgressRate(data.completion_rates, data.quiz_scores);
    });

    return {
      subjects: subjectData,
      strongest_subject: this.findStrongestSubject(subjectData),
      subject_needing_focus: this.findSubjectNeedingFocus(subjectData),
      balanced_learning: this.assessLearningBalance(subjectData),
      subject_recommendations: this.generateSubjectRecommendations(subjectData)
    };
  }

  // Helper methods for calculations and analysis
  identifyLearningPattern(weeklyData) {
    const dailyScores = weeklyData.map(day => day.average_score_percentage || 0);
    const dailyTimes = weeklyData.map(day => day.total_session_time_minutes || 0);
    
    // Identify patterns in learning behavior
    const morningLearner = dailyTimes.slice(0, 3).reduce((sum, time) => sum + time, 0) > dailyTimes.slice(3).reduce((sum, time) => sum + time, 0);
    const consistentLearner = Math.max(...dailyTimes) - Math.min(...dailyTimes) < 30;
    const improvingLearner = dailyScores.slice(-3).reduce((sum, score) => sum + score, 0) > dailyScores.slice(0, 3).reduce((sum, score) => sum + score, 0);
    
    return {
      type: morningLearner ? 'morning_learner' : 'evening_learner',
      consistency: consistentLearner ? 'consistent' : 'variable',
      trend: improvingLearner ? 'improving' : 'stable'
    };
  }

  findPeakPerformanceDay(weeklyData) {
    return weeklyData.reduce((best, day) => 
      (day.average_score_percentage || 0) > (best.average_score_percentage || 0) ? day : best
    );
  }

  calculateConsistencyRating(weeklyData) {
    const scores = weeklyData.map(day => day.average_score_percentage || 0);
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Convert to 0-100 scale (lower deviation = higher consistency)
    return Math.max(0, Math.round(100 - (standardDeviation * 2)));
  }

  calculateWeeklyAverages(monthlyData) {
    const weeks = [];
    let currentWeek = [];
    let weekStart = new Date(monthlyData[0].analysis_date);
    
    monthlyData.forEach(day => {
      const dayDate = new Date(day.analysis_date);
      const daysDiff = Math.floor((dayDate - weekStart) / (1000 * 60 * 60 * 24));
      
      if (daysDiff >= 7) {
        if (currentWeek.length > 0) {
          weeks.push(this.calculateWeekAverage(currentWeek));
        }
        currentWeek = [day];
        weekStart = dayDate;
      } else {
        currentWeek.push(day);
      }
    });
    
    if (currentWeek.length > 0) {
      weeks.push(this.calculateWeekAverage(currentWeek));
    }
    
    return weeks;
  }

  calculateWeekAverage(weekData) {
    return {
      week_start: weekData[0].analysis_date,
      average_score: weekData.reduce((sum, day) => sum + (day.average_score_percentage || 0), 0) / weekData.length,
      total_time: weekData.reduce((sum, day) => sum + (day.total_session_time_minutes || 0), 0),
      total_sessions: weekData.reduce((sum, day) => sum + (day.sessions_completed || 0), 0),
      engagement: weekData.reduce((sum, day) => sum + (day.engagement_score || 0), 0) / weekData.length
    };
  }

  calculateTrendDirection(weeklyAverages) {
    if (weeklyAverages.length < 2) return 'stable';
    
    const firstHalf = weeklyAverages.slice(0, Math.floor(weeklyAverages.length / 2));
    const secondHalf = weeklyAverages.slice(Math.floor(weeklyAverages.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, week) => sum + week.average_score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, week) => sum + week.average_score, 0) / secondHalf.length;
    
    const change = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    if (change > 5) return 'improving';
    if (change < -5) return 'declining';
    return 'stable';
  }

  calculateTrendStrength(weeklyAverages) {
    if (weeklyAverages.length < 2) return 0;
    
    const scores = weeklyAverages.map(week => week.average_score);
    let strength = 0;
    
    for (let i = 1; i < scores.length; i++) {
      strength += Math.abs(scores[i] - scores[i-1]);
    }
    
    return Math.round(strength / (scores.length - 1));
  }

  calculatePerformanceVolatility(monthlyData) {
    const scores = monthlyData.map(day => day.average_score_percentage || 0);
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    
    return Math.round(Math.sqrt(variance));
  }

  findBestWeek(weeklyAverages) {
    return weeklyAverages.reduce((best, week) => 
      week.average_score > best.average_score ? week : best
    );
  }

  identifyImprovementAreas(monthlyData) {
    const areas = [];
    
    // Analyze consistency
    const volatility = this.calculatePerformanceVolatility(monthlyData);
    if (volatility > 20) {
      areas.push({
        area: 'Consistency',
        description: 'Performance varies significantly day to day',
        priority: 'medium'
      });
    }
    
    // Analyze engagement
    const avgEngagement = monthlyData.reduce((sum, day) => sum + (day.engagement_score || 0), 0) / monthlyData.length;
    if (avgEngagement < 70) {
      areas.push({
        area: 'Engagement',
        description: 'Could benefit from more engaging learning activities',
        priority: 'high'
      });
    }
    
    return areas;
  }

  predictNextWeekPerformance(weeklyAverages) {
    if (weeklyAverages.length < 3) return null;
    
    const recentTrend = weeklyAverages.slice(-3);
    const avgChange = recentTrend.reduce((sum, week, index) => {
      if (index === 0) return sum;
      return sum + (week.average_score - recentTrend[index - 1].average_score);
    }, 0) / (recentTrend.length - 1);
    
    const lastScore = weeklyAverages[weeklyAverages.length - 1].average_score;
    const predictedScore = Math.max(0, Math.min(100, lastScore + avgChange));
    
    return {
      predicted_score: Math.round(predictedScore),
      confidence: this.calculatePredictionConfidence(weeklyAverages),
      trend: avgChange > 2 ? 'improving' : avgChange < -2 ? 'declining' : 'stable'
    };
  }

  calculatePredictionConfidence(weeklyAverages) {
    const volatility = this.calculatePerformanceVolatility(weeklyAverages.map(w => ({ average_score_percentage: w.average_score })));
    
    if (volatility < 10) return 'high';
    if (volatility < 20) return 'medium';
    return 'low';
  }

  // Additional helper methods for engagement and subject analysis...
  analyzeEngagementByTimeOfDay(sessions) {
    const timeSlots = {
      morning: { sessions: 0, totalEngagement: 0 },
      afternoon: { sessions: 0, totalEngagement: 0 },
      evening: { sessions: 0, totalEngagement: 0 }
    };
    
    sessions.forEach(session => {
      const hour = new Date(session.created_at).getHours();
      const engagement = (session.completion_percentage || 0) + (session.points_earned || 0) / 10;
      
      if (hour < 12) {
        timeSlots.morning.sessions++;
        timeSlots.morning.totalEngagement += engagement;
      } else if (hour < 17) {
        timeSlots.afternoon.sessions++;
        timeSlots.afternoon.totalEngagement += engagement;
      } else {
        timeSlots.evening.sessions++;
        timeSlots.evening.totalEngagement += engagement;
      }
    });
    
    // Calculate averages
    Object.keys(timeSlots).forEach(slot => {
      const data = timeSlots[slot];
      data.averageEngagement = data.sessions > 0 ? data.totalEngagement / data.sessions : 0;
    });
    
    return timeSlots;
  }

  analyzeEngagementBySubject(sessions) {
    const subjects = {};
    
    sessions.forEach(session => {
      if (!subjects[session.subject]) {
        subjects[session.subject] = { sessions: 0, totalEngagement: 0 };
      }
      
      const engagement = (session.completion_percentage || 0) + (session.points_earned || 0) / 10;
      subjects[session.subject].sessions++;
      subjects[session.subject].totalEngagement += engagement;
    });
    
    Object.keys(subjects).forEach(subject => {
      const data = subjects[subject];
      data.averageEngagement = data.totalEngagement / data.sessions;
    });
    
    return subjects;
  }

  analyzeSessionLengths(sessions) {
    const lengths = sessions.map(s => s.duration_minutes || 0).filter(l => l > 0);
    if (lengths.length === 0) return { optimal_length: 20 };
    
    lengths.sort((a, b) => a - b);
    const median = lengths[Math.floor(lengths.length / 2)];
    const average = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
    
    return {
      optimal_length: Math.round((median + average) / 2),
      median_length: median,
      average_length: Math.round(average),
      shortest: Math.min(...lengths),
      longest: Math.max(...lengths)
    };
  }

  calculateOverallEngagement(sessions) {
    const totalEngagement = sessions.reduce((sum, session) => {
      return sum + (session.completion_percentage || 0) + (session.points_earned || 0) / 10;
    }, 0);
    
    return Math.round(totalEngagement / sessions.length);
  }

  calculateEngagementTrends(sessions) {
    const sortedSessions = sessions.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const firstHalf = sortedSessions.slice(0, Math.floor(sortedSessions.length / 2));
    const secondHalf = sortedSessions.slice(Math.floor(sortedSessions.length / 2));
    
    const firstAvg = this.calculateOverallEngagement(firstHalf);
    const secondAvg = this.calculateOverallEngagement(secondHalf);
    
    const change = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    return {
      trend: change > 10 ? 'increasing' : change < -10 ? 'decreasing' : 'stable',
      change_percentage: Math.round(change),
      first_half_average: firstAvg,
      second_half_average: secondAvg
    };
  }

  generateEngagementRecommendations(timeAnalysis, subjectAnalysis) {
    const recommendations = [];
    
    // Time-based recommendations
    const bestTime = Object.keys(timeAnalysis).reduce((best, time) => 
      timeAnalysis[time].averageEngagement > timeAnalysis[best].averageEngagement ? time : best
    );
    
    recommendations.push({
      type: 'timing',
      title: `Optimize Learning Time`,
      description: `Best engagement is during ${bestTime}. Consider scheduling more sessions then.`,
      priority: 'medium'
    });
    
    // Subject-based recommendations
    const leastEngagingSubject = Object.keys(subjectAnalysis).reduce((worst, subject) => 
      subjectAnalysis[subject].averageEngagement < subjectAnalysis[worst].averageEngagement ? subject : worst
    );
    
    if (subjectAnalysis[leastEngagingSubject].averageEngagement < 60) {
      recommendations.push({
        type: 'subject',
        title: `Improve ${leastEngagingSubject} Engagement`,
        description: `Try different activities or shorter sessions for ${leastEngagingSubject}.`,
        priority: 'high'
      });
    }
    
    return recommendations;
  }

  calculateProficiencyLevel(completion, quizScore) {
    const combined = (completion + quizScore) / 2;
    
    if (combined >= 90) return 'expert';
    if (combined >= 80) return 'proficient';
    if (combined >= 70) return 'developing';
    if (combined >= 60) return 'beginner';
    return 'needs_support';
  }

  calculateProgressRate(completionRates, quizScores) {
    if (completionRates.length < 2) return 0;
    
    const recentCompletion = completionRates.slice(-3).reduce((sum, rate) => sum + rate, 0) / 3;
    const earlierCompletion = completionRates.slice(0, -3).reduce((sum, rate) => sum + rate, 0) / (completionRates.length - 3) || recentCompletion;
    
    return Math.round(((recentCompletion - earlierCompletion) / earlierCompletion) * 100) || 0;
  }

  findStrongestSubject(subjectData) {
    return Object.keys(subjectData).reduce((strongest, subject) => {
      const current = subjectData[subject];
      const best = subjectData[strongest];
      
      const currentScore = (current.average_completion + current.average_quiz_score) / 2;
      const bestScore = (best.average_completion + best.average_quiz_score) / 2;
      
      return currentScore > bestScore ? subject : strongest;
    });
  }

  findSubjectNeedingFocus(subjectData) {
    return Object.keys(subjectData).reduce((weakest, subject) => {
      const current = subjectData[subject];
      const worst = subjectData[weakest];
      
      const currentScore = (current.average_completion + current.average_quiz_score) / 2;
      const worstScore = (worst.average_completion + worst.average_quiz_score) / 2;
      
      return currentScore < worstScore ? subject : weakest;
    });
  }

  assessLearningBalance(subjectData) {
    const subjects = Object.keys(subjectData);
    if (subjects.length < 2) return { balanced: false, reason: 'insufficient_subjects' };
    
    const times = subjects.map(subject => subjectData[subject].total_time);
    const maxTime = Math.max(...times);
    const minTime = Math.min(...times);
    
    const balance = minTime / maxTime;
    
    return {
      balanced: balance > 0.6,
      balance_score: Math.round(balance * 100),
      recommendation: balance < 0.4 ? 'focus_on_neglected_subjects' : balance < 0.6 ? 'slight_rebalancing_needed' : 'well_balanced'
    };
  }

  generateSubjectRecommendations(subjectData) {
    const recommendations = [];
    
    Object.keys(subjectData).forEach(subject => {
      const data = subjectData[subject];
      
      if (data.average_completion < 60) {
        recommendations.push({
          subject,
          type: 'completion',
          title: `Improve ${subject} Completion`,
          description: 'Break lessons into smaller chunks and provide more support',
          priority: 'high'
        });
      }
      
      if (data.average_quiz_score < 70 && data.quiz_scores.length > 0) {
        recommendations.push({
          subject,
          type: 'comprehension',
          title: `Strengthen ${subject} Understanding`,
          description: 'Review concepts more thoroughly before quizzes',
          priority: 'medium'
        });
      }
    });
    
    return recommendations;
  }

  generateInsightsSummary(weeklyAnalytics, performanceTrends, engagementAnalysis) {
    const insights = [];
    
    // Weekly performance insight
    if (weeklyAnalytics.average_score >= 80) {
      insights.push({
        type: 'positive',
        title: 'Strong Weekly Performance',
        description: `Excellent average score of ${weeklyAnalytics.average_score}% this week!`
      });
    } else if (weeklyAnalytics.average_score < 60) {
      insights.push({
        type: 'concern',
        title: 'Performance Needs Attention',
        description: `Average score of ${weeklyAnalytics.average_score}% suggests need for additional support.`
      });
    }
    
    // Trend insight
    if (performanceTrends.trend_direction === 'improving') {
      insights.push({
        type: 'positive',
        title: 'Improving Trend',
        description: 'Performance is trending upward - great progress!'
      });
    } else if (performanceTrends.trend_direction === 'declining') {
      insights.push({
        type: 'concern',
        title: 'Declining Trend',
        description: 'Recent performance shows a downward trend - may need intervention.'
      });
    }
    
    // Engagement insight
    if (engagementAnalysis.overall_engagement >= 80) {
      insights.push({
        type: 'positive',
        title: 'High Engagement',
        description: 'Student shows excellent engagement with learning activities.'
      });
    }
    
    return insights;
  }

  generateInsightsRecommendations(weeklyAnalytics, performanceTrends, engagementAnalysis) {
    const recommendations = [];
    
    // Time-based recommendations
    if (weeklyAnalytics.total_learning_time < 60) {
      recommendations.push({
        type: 'time_management',
        title: 'Increase Learning Time',
        description: 'Consider adding 10-15 minutes to daily learning sessions.',
        priority: 'medium'
      });
    }
    
    // Consistency recommendations
    if (weeklyAnalytics.consistency_rating < 60) {
      recommendations.push({
        type: 'consistency',
        title: 'Improve Learning Consistency',
        description: 'Establish a regular daily learning routine.',
        priority: 'high'
      });
    }
    
    // Performance trend recommendations
    if (performanceTrends.trend_direction === 'declining') {
      recommendations.push({
        type: 'performance',
        title: 'Address Performance Decline',
        description: 'Review recent lessons and provide additional support in challenging areas.',
        priority: 'high'
      });
    }
    
    return recommendations;
  }
}

// Export singleton instances
export const analyticsProcessor = new AnalyticsProcessor();
export const aiLearningReportGenerator = new AILearningReportGenerator();
export const progressReportGenerator = new ProgressReportGenerator();
export const learningInsightsGenerator = new LearningInsightsGenerator();

// Export main analytics service
export default {
  analyticsProcessor,
  aiLearningReportGenerator,
  progressReportGenerator,
  learningInsightsGenerator
};