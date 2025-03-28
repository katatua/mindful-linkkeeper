
// This file contains queries to initialize the database with the required tables and settings

export const initializeDatabaseSettings = `
-- Create AI provider and model settings if they don't exist
INSERT INTO ani_database_settings (setting_key, setting_value)
VALUES 
  ('ai_provider', 'gemini'),
  ('ai_model', 'gemini-2.5-pro-exp-03-25'),
  ('openai_model', 'gpt-4o-2024-11-20'),
  ('gemini_model', 'gemini-2.5-pro-exp-03-25')
ON CONFLICT (setting_key) DO UPDATE
SET setting_value = EXCLUDED.setting_value,
    updated_at = now();
`;
