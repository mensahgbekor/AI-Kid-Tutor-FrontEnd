/*
  # Add lesson progress table and update learning sessions

  1. New Tables
    - `lesson_progress`
      - `id` (uuid, primary key)
      - `child_id` (uuid, foreign key to child_profiles)
      - `subject_id` (text)
      - `subtopic_id` (text)
      - `lesson_id` (text)
      - `lesson_title` (text)
      - `status` (text, enum: not_started, in_progress, completed)
      - `completion_percentage` (integer, 0-100)
      - `quiz_score` (integer, nullable)
      - `completed_at` (timestamptz, nullable)
      - `last_accessed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Table Updates
    - Add `subtopic_id` column to `learning_sessions` table

  3. Security
    - Enable RLS on `lesson_progress` table
    - Add policies for parents to manage their children's lesson progress
*/

-- Add subtopic_id column to learning_sessions table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'learning_sessions' AND column_name = 'subtopic_id'
  ) THEN
    ALTER TABLE learning_sessions ADD COLUMN subtopic_id text;
  END IF;
END $$;

-- Create lesson_progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  subject_id text NOT NULL,
  subtopic_id text NOT NULL,
  lesson_id text NOT NULL,
  lesson_title text,
  status text DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  quiz_score integer CHECK (quiz_score >= 0 AND quiz_score <= 100),
  completed_at timestamptz,
  last_accessed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(child_id, subject_id, subtopic_id, lesson_id)
);

-- Enable RLS on lesson_progress table
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for lesson_progress table
CREATE POLICY "Parents can view children's lesson progress"
  ON lesson_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM child_profiles c
      JOIN parent_profiles p ON c.parent_id = p.id
      JOIN user_profiles u ON p.user_id = u.id
      WHERE c.id = lesson_progress.child_id
        AND u.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Parents can insert children's lesson progress"
  ON lesson_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM child_profiles c
      JOIN parent_profiles p ON c.parent_id = p.id
      JOIN user_profiles u ON p.user_id = u.id
      WHERE c.id = lesson_progress.child_id
        AND u.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Parents can update children's lesson progress"
  ON lesson_progress
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM child_profiles c
      JOIN parent_profiles p ON c.parent_id = p.id
      JOIN user_profiles u ON p.user_id = u.id
      WHERE c.id = lesson_progress.child_id
        AND u.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Parents can delete children's lesson progress"
  ON lesson_progress
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM child_profiles c
      JOIN parent_profiles p ON c.parent_id = p.id
      JOIN user_profiles u ON p.user_id = u.id
      WHERE c.id = lesson_progress.child_id
        AND u.auth_user_id = auth.uid()
    )
  );

-- Create trigger for updated_at column
CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lesson_progress_child_id ON lesson_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_subject ON lesson_progress(subject_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_subtopic ON lesson_progress(subtopic_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_status ON lesson_progress(status);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_last_accessed ON lesson_progress(last_accessed_at);