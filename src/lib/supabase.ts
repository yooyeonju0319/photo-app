import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'https://your-project-id.supabase.co' || 
    supabaseAnonKey === 'your-anon-key-here') {
  throw new Error('Please configure your Supabase credentials by clicking "Connect to Supabase" button');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DatabaseUser {
  id: string;
  username: string;
  password: string;
  question: string;
  answer: string;
  profile_pic: string;
  created_at: string;
}

export interface DatabasePhoto {
  id: string;
  uploader: string;
  url: string;
  title: string;
  tags: string;
  description: string;
  likes: string[];
  created_at: string;
}