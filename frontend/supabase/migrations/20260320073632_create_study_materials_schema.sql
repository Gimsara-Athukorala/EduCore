/*
  # Study Material Repository Schema

  1. New Tables
    - `modules`
      - `id` (uuid, primary key)
      - `year` (integer, 1-4)
      - `semester` (integer, 1-2)
      - `code` (text, e.g., "IT2030")
      - `name` (text, e.g., "Database Management Systems")
      - `created_at` (timestamptz)
    
    - `materials`
      - `id` (uuid, primary key)
      - `module_id` (uuid, foreign key to modules)
      - `title` (text)
      - `type` (text, enum: 'past_paper', 'short_note', 'kuppi_video')
      - `file_url` (text)
      - `description` (text)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (for student viewing)
    - Add policies for authenticated insert (for uploading)
*/

CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL CHECK (year >= 1 AND year <= 4),
  semester integer NOT NULL CHECK (semester >= 1 AND semester <= 2),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('past_paper', 'short_note', 'kuppi_video')),
  file_url text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view modules"
  ON modules FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view materials"
  ON materials FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert modules"
  ON modules FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert materials"
  ON materials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_modules_year_semester ON modules(year, semester);
CREATE INDEX IF NOT EXISTS idx_materials_module_id ON materials(module_id);
CREATE INDEX IF NOT EXISTS idx_materials_type ON materials(type);