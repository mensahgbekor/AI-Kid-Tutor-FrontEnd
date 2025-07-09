/*
  # Learning System Database Schema

  1. New Tables
    - `learning_sessions` - Track individual learning sessions
    - `quiz_results` - Store quiz results and performance data
    - `lesson_progress` - Track progress through individual lessons
    - `subject_progress` - Overall progress in subjects and subtopics

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to access their own data
    - Parents can view their children's data

  3. Indexes
    - Add performance indexes for common queries
    - Foreign key relationships properly indexed
*/

-- Create learning_sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS learning_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  session_type text NOT NULL CHECK (session_type IN ('lesson', 'quiz', 'game', 'free_play', 'assessment')),
  subject text NOT NULL,
  topic text NOT NULL,
  subtopic_id text,
  lesson_id text,
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

-- Create quiz_results table if it doesn't exist
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES learning_sessions(id) ON DELETE CASCADE,
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  quiz_type text NOT NULL,
  subject text NOT NULL,
  topic text NOT NULL,
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

-- Create lesson_progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  subject_id text NOT NULL,
  subtopic_id text NOT NULL,
  lesson_id text NOT NULL,
  lesson_title text NOT NULL,
  status text DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  time_spent_minutes integer DEFAULT 0,
  quiz_score integer,
  attempts integer DEFAULT 0,
  last_accessed_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(child_id, subject_id, subtopic_id, lesson_id)
);

-- Create subject_progress table
CREATE TABLE IF NOT EXISTS subject_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  subject_id text NOT NULL,
  subject_title text NOT NULL,
  subtopic_id text,
  subtopic_title text,
  total_lessons integer DEFAULT 0,
  completed_lessons integer DEFAULT 0,
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  average_score integer DEFAULT 0,
  time_spent_minutes integer DEFAULT 0,
  current_difficulty text DEFAULT 'beginner' CHECK (current_difficulty IN ('beginner', 'intermediate', 'advanced')),
  last_accessed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(child_id, subject_id, subtopic_id)
);

-- Enable RLS on all tables
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for learning_sessions
CREATE POLICY "Parents can view children's sessions"
  ON learning_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM child_profiles c
      JOIN parent_profiles p ON c.parent_id = p.id
      JOIN user_profiles u ON p.user_id = u.id
      WHERE c.id = learning_sessions.child_id AND u.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert learning sessions"
  ON learning_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update learning sessions"
  ON learning_sessions
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for quiz_results
CREATE POLICY "Parents can view children's quiz results"
  ON quiz_results
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM child_profiles c
      JOIN parent_profiles p ON c.parent_id = p.id
      JOIN user_profiles u ON p.user_id = u.id
      WHERE c.id = quiz_results.child_id AND u.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert quiz results"
  ON quiz_results
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for lesson_progress
CREATE POLICY "Parents can view children's lesson progress"
  ON lesson_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM child_profiles c
      JOIN parent_profiles p ON c.parent_id = p.id
      JOIN user_profiles u ON p.user_id = u.id
      WHERE c.id = lesson_progress.child_id AND u.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "System can manage lesson progress"
  ON lesson_progress
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for subject_progress
CREATE POLICY "Parents can view children's subject progress"
  ON subject_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM child_profiles c
      JOIN parent_profiles p ON c.parent_id = p.id
      JOIN user_profiles u ON p.user_id = u.id
      WHERE c.id = subject_progress.child_id AND u.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "System can manage subject progress"
  ON subject_progress
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_learning_sessions_child_id ON learning_sessions(child_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_created_at ON learning_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_subject ON learning_sessions(subject);

CREATE INDEX IF NOT EXISTS idx_quiz_results_child_id ON quiz_results(child_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON quiz_results(created_at);
CREATE INDEX IF NOT EXISTS idx_quiz_results_subject ON quiz_results(subject);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_child_id ON lesson_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_subject ON lesson_progress(subject_id, subtopic_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_status ON lesson_progress(status);

CREATE INDEX IF NOT EXISTS idx_subject_progress_child_id ON subject_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_subject_progress_subject ON subject_progress(subject_id);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lesson_progress_updated_at
    BEFORE UPDATE ON lesson_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subject_progress_updated_at
    BEFORE UPDATE ON subject_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();