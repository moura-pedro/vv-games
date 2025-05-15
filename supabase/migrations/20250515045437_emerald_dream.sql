/*
  # Initial schema for VV Games

  1. Tables
    - sessions
      - id (uuid, primary key)
      - name (text)
      - created_at (timestamptz)
      - user_id (uuid, references auth.users)
    - players
      - id (uuid, primary key)
      - name (text)
      - session_id (uuid, references sessions)
      - created_at (timestamptz)
    - games
      - id (uuid, primary key)
      - name (text)
      - winner_id (uuid, references players)
      - session_id (uuid, references sessions)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create sessions table
CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sessions"
  ON sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create players table
CREATE TABLE players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  session_id uuid REFERENCES sessions ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read players in their sessions"
  ON players
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = players.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert players in their sessions"
  ON players
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = players.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete players in their sessions"
  ON players
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = players.session_id
      AND sessions.user_id = auth.uid()
    )
  );

-- Create games table
CREATE TABLE games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  winner_id uuid REFERENCES players ON DELETE CASCADE NOT NULL,
  session_id uuid REFERENCES sessions ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read games in their sessions"
  ON games
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = games.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert games in their sessions"
  ON games
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = games.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete games in their sessions"
  ON games
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = games.session_id
      AND sessions.user_id = auth.uid()
    )
  );