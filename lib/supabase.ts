import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  author_id: string;
  published: boolean;
  created_at: string;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  area_interesse: string;
  created_at: string;
};
