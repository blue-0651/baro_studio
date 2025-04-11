import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseApiKey = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
    throw new Error("api key를 확인하세요");
}
if (!supabaseAnonKey) {
    throw new Error("api key를 확인하세요");
}
if (!supabaseApiKey) { 
    throw new Error("api key를 확인하세요");
}
//이전방식
//export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseApiKey);