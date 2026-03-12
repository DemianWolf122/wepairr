import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wjxekfxyxrfvmsfbqvsj.supabase.co';
const supabaseAnonKey = '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);