import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wjxekfxyxrfvmsfbqvsj.supabase.co';
const supabaseAnonKey = 'sb_publishable_4Asc-X1Wrs2FI1QAvi7FuA_SuSXbCMJ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);