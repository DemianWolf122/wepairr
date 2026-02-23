import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'TU_PROJECT_URL_ACA';
const supabaseAnonKey = 'TU_ANON_KEY_ACA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);