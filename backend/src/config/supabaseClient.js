const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Check if Supabase URL is valid
const isValidUrl = (url) => {
    try {
        return url && /^https?:\/\//i.test(url);
    } catch {
        return false;
    }
};

// Service client for backend operations (has elevated permissions)
let supabaseAdmin = null;
let supabase = null;

if (isValidUrl(supabaseUrl)) {
    try {
        if (supabaseServiceKey) {
            supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
        }
        if (supabaseAnonKey) {
            supabase = createClient(supabaseUrl, supabaseAnonKey);
        }
        console.log("✅ Supabase client initialized successfully");
    } catch (error) {
        console.warn("⚠️ Failed to initialize Supabase client:", error.message);
    }
} else {
    console.warn("⚠️ Supabase not configured. Add valid SUPABASE_URL to .env file.");
}

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
    return supabase !== null || supabaseAdmin !== null;
};

module.exports = {
    supabase,
    supabaseAdmin,
    isSupabaseConfigured,
};
