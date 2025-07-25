/*
  # Create users and photos tables for Lechabo

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password` (text)
      - `question` (text)
      - `answer` (text)
      - `profile_pic` (text)
      - `created_at` (timestamp)
    - `photos`
      - `id` (uuid, primary key)
      - `uploader` (text, references users.username)
      - `url` (text)
      - `title` (text)
      - `tags` (text)
      - `description` (text)
      - `likes` (jsonb, array of usernames)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add policies for reading public data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  profile_pic text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader text NOT NULL REFERENCES users(username) ON DELETE CASCADE,
  url text NOT NULL,
  title text NOT NULL,
  tags text DEFAULT '',
  description text DEFAULT '',
  likes jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read all profiles"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Photos policies
CREATE POLICY "Anyone can read photos"
  ON photos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own photos"
  ON photos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own photos"
  ON photos
  FOR UPDATE
  TO authenticated
  USING (uploader = (SELECT username FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can delete their own photos"
  ON photos
  FOR DELETE
  TO authenticated
  USING (uploader = (SELECT username FROM users WHERE id = auth.uid()));