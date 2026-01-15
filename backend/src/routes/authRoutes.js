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
                .from("users")
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
