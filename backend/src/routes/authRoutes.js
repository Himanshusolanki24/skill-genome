const express = require("express");
const { supabase, supabaseAdmin, isSupabaseConfigured } = require("../config/supabaseClient");

const router = express.Router();

// Check if Supabase is configured middleware
const checkSupabaseConfig = (req, res, next) => {
    if (!isSupabaseConfigured()) {
        return res.status(503).json({
            success: false,
            error: "Authentication service not configured. Please set up Supabase credentials.",
        });
    }
    next();
};

// Apply to all routes in this router
router.use(checkSupabaseConfig);

// Sign up with email and password
router.post("/signup", async (req, res) => {
    try {
        const { email, password, fullName } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Email and password are required",
            });
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName || "",
                },
            },
        });

        if (error) {
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }

        // If using supabaseAdmin, create user profile in database
        if (supabaseAdmin && data.user) {
            await supabaseAdmin.from("profiles").upsert({
                id: data.user.id,
                email: data.user.email,
                full_name: fullName || "",
                avatar_url: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
        }

        res.json({
            success: true,
            data: {
                user: data.user,
                session: data.session,
            },
            message: data.session
                ? "Signup successful!"
                : "Please check your email to confirm your account.",
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error during signup",
        });
    }
});

// Login with email and password
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Email and password are required",
            });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return res.status(401).json({
                success: false,
                error: error.message,
            });
        }

        res.json({
            success: true,
            data: {
                user: data.user,
                session: data.session,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error during login",
        });
    }
});

// Get current user profile
router.get("/user", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "No authorization token provided",
            });
        }

        const token = authHeader.split(" ")[1];

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                success: false,
                error: "Invalid or expired token",
            });
        }

        // Get additional profile data if available
        let profile = null;
        if (supabaseAdmin) {
            const { data: profileData } = await supabaseAdmin
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();
            profile = profileData;
        }

        res.json({
            success: true,
            data: {
                user,
                profile,
            },
        });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
});

// Logout (client-side handles most of this, but we can invalidate server-side)
router.post("/logout", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            // Sign out the user
            await supabase.auth.signOut();
        }

        res.json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error during logout",
        });
    }
});

// Verify session (useful for frontend to check if session is valid)
router.post("/verify", async (req, res) => {
    try {
        const { access_token } = req.body;

        if (!access_token) {
            return res.status(400).json({
                success: false,
                error: "Access token is required",
            });
        }

        const { data: { user }, error } = await supabase.auth.getUser(access_token);

        if (error || !user) {
            return res.status(401).json({
                success: false,
                error: "Invalid or expired token",
            });
        }

        res.json({
            success: true,
            data: { user },
        });
    } catch (error) {
        console.error("Verify error:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
});

module.exports = router;
