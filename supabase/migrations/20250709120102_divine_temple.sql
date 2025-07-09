/*
  # Add RLS policies for learning sessions and lesson progress

  1. Security
    - Add INSERT policy for learning_sessions table
    - Add INSERT and UPDATE policies for lesson_progress table
    - All policies ensure parents can only manage their own children's data

  2. Changes
    - Drop existing policies if they exist to avoid conflicts
    - Create new policies with proper authentication checks
*/

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Parents can create learning sessions for children" ON learning_sessions;
DROP POLICY IF EXISTS "Parents can insert children's lesson progress" ON lesson_progress;
DROP POLICY IF EXISTS "Parents can update children's lesson progress" ON lesson_progress;

-- Add INSERT policy for learning_sessions table
CREATE POLICY "Parents can create learning sessions for children"
  ON learning_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM ((child_profiles c
        JOIN parent_profiles p ON ((c.parent_id = p.id)))
        JOIN user_profiles u ON ((p.user_id = u.id)))
      WHERE ((c.id = learning_sessions.child_id) AND (u.auth_user_id = auth.uid()))
    )
  );

-- Add INSERT policy for lesson_progress table
CREATE POLICY "Parents can insert children's lesson progress"
  ON lesson_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM ((child_profiles c
        JOIN parent_profiles p ON ((c.parent_id = p.id)))
        JOIN user_profiles u ON ((p.user_id = u.id)))
      WHERE ((c.id = lesson_progress.child_id) AND (u.auth_user_id = auth.uid()))
    )
  );

-- Add UPDATE policy for lesson_progress table
CREATE POLICY "Parents can update children's lesson progress"
  ON lesson_progress
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM ((child_profiles c
        JOIN parent_profiles p ON ((c.parent_id = p.id)))
        JOIN user_profiles u ON ((p.user_id = u.id)))
      WHERE ((c.id = lesson_progress.child_id) AND (u.auth_user_id = auth.uid()))
    )
  );