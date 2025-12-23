
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://frqalqtokogxtkeiwlaj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZycWFscXRva29neHRrZWl3bGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0NjAxODksImV4cCI6MjA4MjAzNjE4OX0.6dFxyoqXYA5uRJpVAkdjETUF_13uEhdFA6i311h3Be0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * SQL for Supabase SQL Editor:
 * 
 * -- 1. System Config Table (For LINE Keys)
 * CREATE TABLE IF NOT EXISTS system_config (
 *   config_key TEXT PRIMARY KEY,
 *   config_value TEXT,
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- 2. Pre-fill keys (Optional)
 * INSERT INTO system_config (config_key, config_value) 
 * VALUES 
 * ('LINE_ACCESS_TOKEN', ''),
 * ('LINE_GROUP_ID', '')
 * ON CONFLICT (config_key) DO NOTHING;
 * 
 * -- 3. (Rest of existing tables...)
 */
