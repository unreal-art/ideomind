import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseAnonKey = PUBLIC_SUPABASE_ANON_KEY;

// export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export let supabase: SupabaseClient;

if (supabaseUrl) {
	supabase = createClient(supabaseUrl, supabaseAnonKey);
}
