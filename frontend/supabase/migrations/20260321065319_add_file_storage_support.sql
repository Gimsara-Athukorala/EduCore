/*
  # Add file storage metadata to materials table

  1. Changes
    - Add `file_path` column to store Supabase Storage path
    - Add `original_filename` column for display purposes
    - Add `file_size` column (in bytes) for UI feedback
    - Add `file_type` column (mime type) for validation
    - Keep `file_url` for backward compatibility with URL links
  
  2. Notes
    - Files will be stored in Supabase Storage under materials/{module_id}/{timestamp}/
    - Both file uploads and URL links are supported
    - Updated_at column added for tracking modifications
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'materials' AND column_name = 'file_path'
  ) THEN
    ALTER TABLE materials 
    ADD COLUMN file_path text,
    ADD COLUMN original_filename text,
    ADD COLUMN file_size integer,
    ADD COLUMN file_type text,
    ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;