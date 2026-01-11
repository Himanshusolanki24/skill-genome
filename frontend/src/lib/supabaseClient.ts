import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Supabase configuration - Replace these with your actual Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Check if URL is valid
const isValidUrl = (url: string): boolean => {
    try {
        return Boolean(url && /^https?:\/\//i.test(url));
    } catch {
        return false;
    }
};

// Check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
    return isValidUrl(supabaseUrl) && Boolean(supabaseAnonKey);
};

// Create Supabase client only if configured properly
let supabase: SupabaseClient;

if (isSupabaseConfigured()) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    // Create a mock client that won't crash but won't work either
    console.warn("⚠️ Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env");
    // Create with placeholder to prevent crashes - auth will show "not configured" message
    supabase = createClient("https://placeholder.supabase.co", "placeholder-key");
}

export { supabase };
