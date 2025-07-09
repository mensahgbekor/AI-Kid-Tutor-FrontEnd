/*
  # Create subject_progress table

  1. New Tables
    - `subject_progress`
      - `id` (uuid, primary key)
      - `child_id` (uuid, foreign key to child_profiles)
      - `subject_id` (text, identifier for the subject)
      - `subtopic_id` (text, identifier for the subtopic)
      - `subject_title` (text, human-readable subject name)
      - `subtopic_title` (text, human-readable subtopic name)
      - `total_lessons` (integer, total number of lessons in subtopic)
      - `completed_lessons` (integer, number of completed lessons)
      - `completion_percentage` (integer, percentage of completion)
      - `average_score` (integer, average quiz/assessment score)
      - `current_difficulty` (text, current difficulty level)
      - `last_accessed_at` (timestamp, when last accessed)
      - `created_at` (timestamp, when record was created)
      - `updated_at` (timestamp, when record was last updated)

  2. Security
    - Enable RLS on `subject_progress` table
    - Add policies for parents to manage their children's subject progress

  3. Constraints
    - Unique constraint on (child_id, subject_id, subtopic_id)
    - Check constraint for completion_percentage (0-100)
    - Check constraint for current_difficulty values
*/

CREATE TABLE IF NOT EXISTS subject_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  subject_id text NOT NULL,
  subtopic_id text NOT NULL,
  subject_title text,
  subtopic_title text,
  total_lessons integer DEFAULT 0,
  completed_lessons integer DEFAULT 0,
  completion_percentage integer DEFAULT 0,
  average_score integer DEFAULT 0,
  current_difficulty text DEFAULT 'beginner',
  last_accessed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(child_id, subject_id, subtopic_id)
);

-- Add constraints
ALTER TABLE subject_progress 
ADD CONSTRAINT subject_progress_completion_percentage_check 
CHECK (completion_percentage >= 0 AND completion_percentage <= 100);

ALTER TABLE subject_progress 
ADD CONSTRAINT subject_progress_current_difficulty_check 
CHECK (current_difficulty IN ('beginner', 'intermediate', 'advanced'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subject_progress_child_id ON subject_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_subject_progress_subject ON subject_progress(subject_id);
CREATE INDEX IF NOT EXISTS idx_subject_progress_last_accessed ON subject_progress(last_accessed_at);

-- Enable Row Level Security
ALTER TABLE subject_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Parents can view children's subject progress"
  ON subject_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM child_profiles c
      JOIN parent_profiles p ON c.parent_id = p.id
      JOIN user_profiles u ON p.user_id = u.id
      WHERE c.id = subject_progress.child_id 
      AND u.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Parents can insert children's subject progress"
  ON subject_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM child_profiles c
      JOIN parent_profiles p ON c.parent_id = p.id
      JOIN user_profiles u ON p.user_id = u.id
      WHERE c.id = subject_progress.child_id 
      AND u.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Parents can update children's subject progress"
  ON subject_progress
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM child_profiles c
      JOIN parent_profiles p ON c.parent_id = p.id
      JOIN user_profiles u ON p.user_id = u.id
      WHERE c.id = subject_progress.child_id 
      AND u.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Parents can delete children's subject progress"
  ON subject_progress
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM child_profiles c
      JOIN parent_profiles p ON c.parent_id = p.id
      JOIN user_profiles u ON p.user_id = u.id
      WHERE c.id = subject_progress.child_id 
      AND u.auth_user_id = auth.uid()
    )
  );

-- Add trigger for updated_at
CREATE TRIGGER update_subject_progress_updated_at
  BEFORE UPDATE ON subject_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();