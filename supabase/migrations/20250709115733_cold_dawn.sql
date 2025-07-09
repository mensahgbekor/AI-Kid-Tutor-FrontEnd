/*
  # Fix Learning Sessions RLS Policies

  1. Security Updates
    - Add missing INSERT policy for learning_sessions table
    - Ensure authenticated users can create learning sessions for their children
    - Add missing INSERT and UPDATE policies for lesson_progress table
    - Ensure parents can manage their children's lesson progress

  2. Changes
    - CREATE POLICY for INSERT on learning_sessions
    - CREATE POLICY for INSERT on lesson_progress  
    - CREATE POLICY for UPDATE on lesson_progress
*/

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
      WHERE ((c.id = learning_sessions.child_id) AND (u.auth_user_id = uid()))
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
      WHERE ((c.id = lesson_progress.child_id) AND (u.auth_user_id = uid()))
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
      WHERE ((c.id = lesson_progress.child_id) AND (u.auth_user_id = uid()))
    )
  );