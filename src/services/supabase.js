// Supabase Client Configuration and Database Services
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Auth Services
export const authService = {
  // Sign up new user
  async signUp(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Reset password
  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }
};

// User Profile Services
export const userService = {
  // Create user profile
  async createUserProfile(userData) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get user profile
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('auth_user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('auth_user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Parent Profile Services
export const parentService = {
  // Create parent profile
  async createParentProfile(parentData) {
    const { data, error } = await supabase
      .from('parent_profiles')
      .insert(parentData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get parent profile with user data
  async getParentProfile(userId) {
    const { data, error } = await supabase
      .from('parent_profiles')
      .select(`
        *,
        user_profiles!inner(*)
      `)
      .eq('user_profiles.auth_user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update parent profile
  async updateParentProfile(parentId, updates) {
    const { data, error } = await supabase
      .from('parent_profiles')
      .update(updates)
      .eq('id', parentId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Child Profile Services
export const childService = {
  // Create child profile
  async createChildProfile(childData) {
    const { data, error } = await supabase
      .from('child_profiles')
      .insert(childData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get all children for a parent
  async getChildrenByParent(parentId) {
    const { data, error } = await supabase
      .from('child_profiles')
      .select('*')
      .eq('parent_id', parentId)
      .eq('is_active', true)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Get child profile
  async getChildProfile(childId) {
    const { data, error } = await supabase
      .from('child_profiles')
      .select('*')
      .eq('id', childId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update child profile
  async updateChildProfile(childId, updates) {
    const { data, error } = await supabase
      .from('child_profiles')
      .update(updates)
      .eq('id', childId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Deactivate child profile
  async deactivateChild(childId) {
    const { data, error } = await supabase
      .from('child_profiles')
      .update({ is_active: false })
      .eq('id', childId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Learning Session Services
export const learningService = {
  // Create learning session
  async createLearningSession(sessionData) {
    const { data, error } = await supabase
      .from('learning_sessions')
      .insert(sessionData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update learning session
  async updateLearningSession(sessionId, updates) {
    const { data, error } = await supabase
      .from('learning_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get learning sessions for child
  async getChildSessions(childId, limit = 50) {
    const { data, error } = await supabase
      .from('learning_sessions')
      .select('*')
      .eq('child_id', childId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  // Get recent sessions with analytics
  async getRecentSessionsWithAnalytics(childId, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('learning_sessions')
      .select('*')
      .eq('child_id', childId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Quiz Results Services
export const quizService = {
  // Save quiz result
  async saveQuizResult(quizData) {
    const { data, error } = await supabase
      .from('quiz_results')
      .insert(quizData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get quiz results for child
  async getChildQuizResults(childId, limit = 20) {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('child_id', childId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  // Get quiz analytics
  async getQuizAnalytics(childId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('child_id', childId)
      .gte('created_at', startDate.toISOString());
    
    if (error) throw error;
    return data;
  }
};

// Game Results Services
export const gameService = {
  // Save game result
  async saveGameResult(gameData) {
    const { data, error } = await supabase
      .from('game_results')
      .insert(gameData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get game results for child
  async getChildGameResults(childId, limit = 20) {
    const { data, error } = await supabase
      .from('game_results')
      .select('*')
      .eq('child_id', childId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
};

// Analytics Services
export const analyticsService = {
  // Create or update daily analytics
  async updateDailyAnalytics(childId, analyticsData) {
    const { data, error } = await supabase
      .from('learning_analytics')
      .upsert({
        child_id: childId,
        analysis_date: new Date().toISOString().split('T')[0],
        ...analyticsData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get analytics for child
  async getChildAnalytics(childId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('learning_analytics')
      .select('*')
      .eq('child_id', childId)
      .gte('analysis_date', startDate.toISOString().split('T')[0])
      .order('analysis_date', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// AI Recommendations Services
export const aiService = {
  // Save AI recommendation
  async saveRecommendation(recommendationData) {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .insert(recommendationData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get active recommendations for child
  async getActiveRecommendations(childId) {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('child_id', childId)
      .eq('is_applied', false)
      .or('expires_at.is.null,expires_at.gt.now()')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Mark recommendation as applied
  async applyRecommendation(recommendationId) {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .update({
        is_applied: true,
        applied_at: new Date().toISOString()
      })
      .eq('id', recommendationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Learning Style Services
export const learningStyleService = {
  // Update learning style profile
  async updateLearningStyle(childId, styleData) {
    const { data, error } = await supabase
      .from('learning_style_profiles')
      .upsert({
        child_id: childId,
        ...styleData,
        last_assessment_date: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get learning style profile
  async getLearningStyle(childId) {
    const { data, error } = await supabase
      .from('learning_style_profiles')
      .select('*')
      .eq('child_id', childId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
};

// Difficulty Profile Services
export const difficultyService = {
  // Update difficulty profile
  async updateDifficultyProfile(childId, subject, difficultyData) {
    const { data, error } = await supabase
      .from('difficulty_profiles')
      .upsert({
        child_id: childId,
        subject: subject,
        ...difficultyData,
        last_adjustment: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get difficulty profiles for child
  async getDifficultyProfiles(childId) {
    const { data, error } = await supabase
      .from('difficulty_profiles')
      .select('*')
      .eq('child_id', childId);
    
    if (error) throw error;
    return data;
  }
};

// Screen Time Services
export const screenTimeService = {
  // Log screen time
  async logScreenTime(childId, screenTimeData) {
    const { data, error } = await supabase
      .from('screen_time_logs')
      .upsert({
        child_id: childId,
        session_date: new Date().toISOString().split('T')[0],
        ...screenTimeData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get screen time logs
  async getScreenTimeLogs(childId, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('screen_time_logs')
      .select('*')
      .eq('child_id', childId)
      .gte('session_date', startDate.toISOString().split('T')[0])
      .order('session_date', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Lesson Progress Services
export const lessonProgressService = {
  // Get lesson progress for child
  async getLessonProgress(childId, subjectId, subtopicId) {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('child_id', childId)
      .eq('subject_id', subjectId)
      .eq('subtopic_id', subtopicId)
      .order('lesson_id');
    
    if (error) throw error;
    return data || [];
  },

  // Update lesson progress
  async updateLessonProgress(childId, subjectId, subtopicId, lessonId, progressData) {
    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert({
        child_id: childId,
        subject_id: subjectId,
        subtopic_id: subtopicId,
        lesson_id: lessonId,
        ...progressData,
        last_accessed_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Mark lesson as completed
  async completeLessson(childId, subjectId, subtopicId, lessonId, quizScore = null) {
    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert({
        child_id: childId,
        subject_id: subjectId,
        subtopic_id: subtopicId,
        lesson_id: lessonId,
        status: 'completed',
        completion_percentage: 100,
        quiz_score: quizScore,
        completed_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Subject Progress Services
export const subjectProgressService = {
  // Get subject progress
  async getSubjectProgress(childId, subjectId, subtopicId = null) {
    let query = supabase
      .from('subject_progress')
      .select('*')
      .eq('child_id', childId)
      .eq('subject_id', subjectId);
    
    if (subtopicId) {
      query = query.eq('subtopic_id', subtopicId);
    }
    
    const { data, error } = await query.limit(1);
    
    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  },

  // Update subject progress
  async updateSubjectProgress(childId, subjectId, subtopicId, progressData) {
    const { data, error } = await supabase
      .from('subject_progress')
      .upsert({
        child_id: childId,
        subject_id: subjectId,
        subtopic_id: subtopicId,
        ...progressData,
        last_accessed_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Real-time subscriptions
export const realtimeService = {
  // Subscribe to child's learning sessions
  subscribeToChildSessions(childId, callback) {
    return supabase
      .channel(`child_sessions_${childId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'learning_sessions',
          filter: `child_id=eq.${childId}`
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to AI recommendations
  subscribeToRecommendations(childId, callback) {
    return supabase
      .channel(`recommendations_${childId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_recommendations',
          filter: `child_id=eq.${childId}`
        },
        callback
      )
      .subscribe();
  },

  // Unsubscribe from channel
  unsubscribe(subscription) {
    return supabase.removeChannel(subscription);
  }
};

// Utility functions
export const dbUtils = {
  // Check if user has active subscription
  async hasActiveSubscription(parentId) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('parent_id', parentId)
      .eq('status', 'active')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },

  // Get subscription details
  async getSubscription(parentId) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
};

export default supabase;