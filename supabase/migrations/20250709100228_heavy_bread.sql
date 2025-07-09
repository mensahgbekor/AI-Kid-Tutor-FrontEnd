/*
  # AI Kid Tutor - Complete Database Schema

  1. Core User Tables
    - `user_profiles` - Child profiles with age, learning preferences
    - `subscriptions` - Payment and subscription management  
    - `parent_profiles` - Parent dashboard access
    - `child_profiles` - Multi-child family support

  2. Learning Activity Tables
    - `learning_sessions` - All learning activity tracking
    - `quiz_results` - Quiz performance and analytics
    - `game_results` - Educational game performance
    - `family_activities` - Family learning tracking

  3. Analytics & AI Tables
    - `learning_analytics` - Processed performance data
    - `ai_recommendations` - AI-generated suggestions
    - `learning_style_profiles` - Learning style analysis
    - `difficulty_profiles` - Adaptive difficulty settings
    - `study_schedule_profiles` - Optimal learning times
    - `personalized_learning_paths` - Custom learning journeys
    - `screen_time_logs` - Screen time monitoring

  4. Security
    - Enable RLS on all tables
    - Add appropriate policies for data protection
*/

-- Core User Tables
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'parent' CHECK (role IN ('parent', 'child', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS parent_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  phone text,
  timezone text DEFAULT 'UTC',
  notification_preferences jsonb DEFAULT '{"email": true, "push": true, "weekly_reports": true}',
  parental_controls jsonb DEFAULT '{"screen_time_limit": 60, "content_filter": "moderate", "bedtime_mode": true}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS child_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES parent_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  age integer NOT NULL CHECK (age >= 3 AND age <= 18),
  grade_level text,
  avatar_url text,
  learning_preferences jsonb DEFAULT '{"visual": 50, "auditory": 30, "kinesthetic": 20}',
  interests text[] DEFAULT '{}',
  special_needs text[] DEFAULT '{}',
  language_preference text DEFAULT 'en',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES parent_profiles(id) ON DELETE CASCADE,
  plan_type text NOT NULL CHECK (plan_type IN ('free_trial', 'monthly', 'family', 'annual')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  stripe_subscription_id text UNIQUE,
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_end timestamptz,
  price_amount integer, -- in cents
  currency text DEFAULT 'usd',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Learning Activity Tables
CREATE TABLE IF NOT EXISTS learning_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  session_type text NOT NULL CHECK (session_type IN ('lesson', 'quiz', 'game', 'free_play', 'assessment')),
  subject text NOT NULL,
  topic text NOT NULL,
  difficulty_level text DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes integer DEFAULT 0,
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  points_earned integer DEFAULT 0,
  ai_feedback jsonb DEFAULT '{}',
  session_data jsonb DEFAULT '{}',
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES learning_sessions(id) ON DELETE CASCADE,
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  quiz_type text NOT NULL,
  total_questions integer NOT NULL,
  correct_answers integer NOT NULL,
  score_percentage integer NOT NULL CHECK (score_percentage >= 0 AND score_percentage <= 100),
  time_taken_seconds integer,
  questions_data jsonb DEFAULT '[]',
  ai_analysis jsonb DEFAULT '{}',
  strengths text[] DEFAULT '{}',
  areas_for_improvement text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS game_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES learning_sessions(id) ON DELETE CASCADE,
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  game_type text NOT NULL,
  level_reached integer DEFAULT 1,
  final_score integer DEFAULT 0,
  achievements_unlocked text[] DEFAULT '{}',
  game_data jsonb DEFAULT '{}',
  skills_practiced text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS family_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES parent_profiles(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  title text NOT NULL,
  description text,
  participating_children uuid[] DEFAULT '{}',
  completion_status text DEFAULT 'in_progress' CHECK (completion_status IN ('planned', 'in_progress', 'completed')),
  scheduled_for timestamptz,
  completed_at timestamptz,
  activity_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Analytics & AI Tables
CREATE TABLE IF NOT EXISTS learning_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  analysis_date date DEFAULT CURRENT_DATE,
  total_session_time_minutes integer DEFAULT 0,
  sessions_completed integer DEFAULT 0,
  average_score_percentage numeric(5,2) DEFAULT 0,
  subjects_studied text[] DEFAULT '{}',
  learning_velocity numeric(5,2) DEFAULT 0, -- lessons per hour
  engagement_score numeric(5,2) DEFAULT 0, -- 0-100
  performance_trends jsonb DEFAULT '{}',
  weekly_progress jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(child_id, analysis_date)
);

CREATE TABLE IF NOT EXISTS ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  recommendation_type text NOT NULL CHECK (recommendation_type IN ('next_lesson', 'difficulty_adjustment', 'learning_path', 'break_suggestion', 'skill_focus')),
  title text NOT NULL,
  description text NOT NULL,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  ai_confidence_score numeric(3,2) DEFAULT 0.5 CHECK (ai_confidence_score >= 0 AND ai_confidence_score <= 1),
  recommendation_data jsonb DEFAULT '{}',
  is_applied boolean DEFAULT false,
  applied_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS learning_style_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  visual_score numeric(5,2) DEFAULT 33.33,
  auditory_score numeric(5,2) DEFAULT 33.33,
  kinesthetic_score numeric(5,2) DEFAULT 33.33,
  reading_writing_score numeric(5,2) DEFAULT 0,
  social_score numeric(5,2) DEFAULT 0,
  solitary_score numeric(5,2) DEFAULT 0,
  confidence_level numeric(3,2) DEFAULT 0.5,
  last_assessment_date timestamptz DEFAULT now(),
  assessment_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(child_id)
);

CREATE TABLE IF NOT EXISTS difficulty_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  subject text NOT NULL,
  current_level text DEFAULT 'beginner' CHECK (current_level IN ('beginner', 'intermediate', 'advanced')),
  mastery_percentage numeric(5,2) DEFAULT 0,
  optimal_difficulty numeric(3,2) DEFAULT 0.5,
  adaptation_rate numeric(3,2) DEFAULT 0.1,
  last_adjustment timestamptz DEFAULT now(),
  performance_history jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(child_id, subject)
);

CREATE TABLE IF NOT EXISTS study_schedule_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  optimal_study_times jsonb DEFAULT '{"morning": 0.3, "afternoon": 0.4, "evening": 0.3}',
  session_duration_minutes integer DEFAULT 20,
  break_frequency_minutes integer DEFAULT 15,
  weekly_schedule jsonb DEFAULT '{}',
  timezone text DEFAULT 'UTC',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(child_id)
);

CREATE TABLE IF NOT EXISTS personalized_learning_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  path_name text NOT NULL,
  subject text NOT NULL,
  current_step integer DEFAULT 1,
  total_steps integer NOT NULL,
  estimated_completion_days integer,
  path_data jsonb DEFAULT '{}',
  milestones jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS screen_time_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  session_date date DEFAULT CURRENT_DATE,
  total_minutes integer DEFAULT 0,
  learning_minutes integer DEFAULT 0,
  break_minutes integer DEFAULT 0,
  session_count integer DEFAULT 0,
  hourly_breakdown jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(child_id, session_date)
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_style_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE difficulty_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_schedule_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalized_learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE screen_time_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id);

-- RLS Policies for parent_profiles
CREATE POLICY "Parents can manage own profile"
  ON parent_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = parent_profiles.user_id 
      AND auth_user_id = auth.uid()
    )
  );

-- RLS Policies for child_profiles
CREATE POLICY "Parents can manage their children"
  ON child_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_profiles p
      JOIN user_profiles u ON p.user_id = u.id
      WHERE p.id = child_profiles.parent_id 
      AND u.auth_user_id = auth.uid()
    )
  );

-- RLS Policies for subscriptions
CREATE POLICY "Parents can view own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_profiles p
      JOIN user_profiles u ON p.user_id = u.id
      WHERE p.id = subscriptions.parent_id 
      AND u.auth_user_id = auth.uid()
    )
  );

-- RLS Policies for learning_sessions
CREATE POLICY "Parents can view children's sessions"
  ON learning_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM child_profiles c
      JOIN parent_profiles p ON c.parent_id = p.id
      JOIN user_profiles u ON p.user_id = u.id
      WHERE c.id = learning_sessions.child_id 
      AND u.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert learning sessions"
  ON learning_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Similar policies for other tables
CREATE POLICY "Parents can view children's quiz results"
  ON quiz_results
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM child_profiles c
      JOIN parent_profiles p ON c.parent_id = p.id
      JOIN user_profiles u ON p.user_id = u.id
      WHERE c.id = quiz_results.child_id 
      AND u.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view children's game results"
  ON game_results
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM child_profiles c
      JOIN parent_profiles p ON c.parent_id = p.id
      JOIN user_profiles u ON p.user_id = u.id
      WHERE c.id = game_results.child_id 
      AND u.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Parents can manage family activities"
  ON family_activities
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_profiles p
      JOIN user_profiles u ON p.user_id = u.id
      WHERE p.id = family_activities.parent_id 
      AND u.auth_user_id = auth.uid()
    )
  );

-- Analytics and AI table policies
CREATE POLICY "Parents can view children's analytics"
  ON learning_analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM child_profiles c
      JOIN parent_profiles p ON c.parent_id = p.id
      JOIN user_profiles u ON p.user_id = u.id
      WHERE c.id = learning_analytics.child_id 
      AND u.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view children's AI recommendations"
  ON ai_recommendations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM child_profiles c
      JOIN parent_profiles p ON c.parent_id = p.id
      JOIN user_profiles u ON p.user_id = u.id
      WHERE c.id = ai_recommendations.child_id 
      AND u.auth_user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_user_id ON user_profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_child_profiles_parent_id ON child_profiles(parent_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_child_id ON learning_sessions(child_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_created_at ON learning_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_quiz_results_child_id ON quiz_results(child_id);
CREATE INDEX IF NOT EXISTS idx_game_results_child_id ON game_results(child_id);
CREATE INDEX IF NOT EXISTS idx_learning_analytics_child_id ON learning_analytics(child_id);
CREATE INDEX IF NOT EXISTS idx_learning_analytics_date ON learning_analytics(analysis_date);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_child_id ON ai_recommendations(child_id);
CREATE INDEX IF NOT EXISTS idx_screen_time_logs_child_date ON screen_time_logs(child_id, session_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parent_profiles_updated_at BEFORE UPDATE ON parent_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_child_profiles_updated_at BEFORE UPDATE ON child_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_style_profiles_updated_at BEFORE UPDATE ON learning_style_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_difficulty_profiles_updated_at BEFORE UPDATE ON difficulty_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_study_schedule_profiles_updated_at BEFORE UPDATE ON study_schedule_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personalized_learning_paths_updated_at BEFORE UPDATE ON personalized_learning_paths FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();