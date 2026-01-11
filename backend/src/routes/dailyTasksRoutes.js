const express = require("express");
const { supabaseAdmin, isSupabaseConfigured } = require("../config/supabaseClient");

const router = express.Router();

// Get tasks by technology and difficulty
router.get("/tasks", async (req, res) => {
    try {
        const { technology, difficulty } = req.query;

        if (!isSupabaseConfigured() || !supabaseAdmin) {
            return res.status(503).json({
                success: false,
                error: "Database not configured",
            });
        }

        let query = supabaseAdmin.from("daily_tasks").select("*");

        if (technology && technology !== "all") {
            query = query.eq("technology", technology);
        }

        if (difficulty && difficulty !== "all") {
            query = query.eq("difficulty", difficulty);
        }

        const { data, error } = await query.order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching tasks:", error);
            return res.status(500).json({
                success: false,
                error: "Failed to fetch tasks",
            });
        }

        res.json({
            success: true,
            data: data || [],
        });
    } catch (error) {
        console.error("Tasks fetch error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to fetch tasks",
        });
    }
});

// Get available technologies
router.get("/technologies", async (req, res) => {
    try {
        if (!isSupabaseConfigured() || !supabaseAdmin) {
            return res.status(503).json({
                success: false,
                error: "Database not configured",
            });
        }

        const { data, error } = await supabaseAdmin
            .from("daily_tasks")
            .select("technology")
            .order("technology");

        if (error) {
            return res.status(500).json({
                success: false,
                error: "Failed to fetch technologies",
            });
        }

        // Get unique technologies
        const technologies = [...new Set(data.map(d => d.technology))];

        res.json({
            success: true,
            data: technologies,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// Complete a task
router.post("/complete", async (req, res) => {
    try {
        const { userId, taskId, xpEarned } = req.body;

        if (!userId || !taskId) {
            return res.status(400).json({
                success: false,
                error: "User ID and Task ID are required",
            });
        }

        if (!isSupabaseConfigured() || !supabaseAdmin) {
            return res.status(503).json({
                success: false,
                error: "Database not configured",
            });
        }

        // Record task completion
        const { data, error } = await supabaseAdmin
            .from("user_completed_tasks")
            .insert({
                user_id: userId,
                task_id: taskId,
                xp_earned: xpEarned || 10,
                completed_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            // Check if already completed
            if (error.code === "23505") {
                return res.json({
                    success: true,
                    message: "Task already completed",
                    alreadyCompleted: true,
                });
            }
            console.error("Error completing task:", error);
            return res.status(500).json({
                success: false,
                error: "Failed to complete task",
            });
        }

        res.json({
            success: true,
            data: {
                id: data.id,
                xpEarned: xpEarned || 10,
            },
        });
    } catch (error) {
        console.error("Task completion error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to complete task",
        });
    }
});

// Get user's completed tasks for today
router.get("/completed/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!isSupabaseConfigured() || !supabaseAdmin) {
            return res.status(503).json({
                success: false,
                error: "Database not configured",
            });
        }

        // Get today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const { data, error } = await supabaseAdmin
            .from("user_completed_tasks")
            .select("task_id, xp_earned, completed_at")
            .eq("user_id", userId)
            .gte("completed_at", today.toISOString())
            .lt("completed_at", tomorrow.toISOString());

        if (error) {
            return res.status(500).json({
                success: false,
                error: "Failed to fetch completed tasks",
            });
        }

        const totalXp = (data || []).reduce((sum, t) => sum + (t.xp_earned || 0), 0);

        res.json({
            success: true,
            data: {
                completedTaskIds: (data || []).map(t => t.task_id),
                totalXpToday: totalXp,
                tasksCompletedToday: (data || []).length,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// Get user's streak
router.get("/streak/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!isSupabaseConfigured() || !supabaseAdmin) {
            return res.status(503).json({
                success: false,
                error: "Database not configured",
            });
        }

        const { data, error } = await supabaseAdmin
            .from("user_streaks")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (error && error.code !== "PGRST116") {
            return res.status(500).json({
                success: false,
                error: "Failed to fetch streak",
            });
        }

        // Check if user was active today
        const today = new Date().toISOString().split("T")[0];
        const lastActivityDate = data?.last_activity_date;
        const isActiveToday = lastActivityDate === today;

        res.json({
            success: true,
            data: {
                currentStreak: data?.current_streak || 0,
                longestStreak: data?.longest_streak || 0,
                lastActivityDate: lastActivityDate,
                isActiveToday,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// Update streak (called when user completes a task or interview)
router.post("/update-streak", async (req, res) => {
    try {
        const { userId, activityType, xpEarned } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
            });
        }

        if (!isSupabaseConfigured() || !supabaseAdmin) {
            return res.status(503).json({
                success: false,
                error: "Database not configured",
            });
        }

        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

        // Get current streak data
        const { data: streakData } = await supabaseAdmin
            .from("user_streaks")
            .select("*")
            .eq("user_id", userId)
            .single();

        let newStreak = 1;
        let longestStreak = 1;
        let isFirstActivityToday = true;

        if (streakData) {
            const lastActivity = streakData.last_activity_date;

            if (lastActivity === today) {
                // Already active today, keep current streak
                newStreak = streakData.current_streak;
                isFirstActivityToday = false;
            } else if (lastActivity === yesterday) {
                // Consecutive day, increment streak
                newStreak = streakData.current_streak + 1;
            }
            // else: streak breaks, starts at 1

            longestStreak = Math.max(newStreak, streakData.longest_streak || 0);
        }

        // Upsert streak data
        const { error: upsertError } = await supabaseAdmin
            .from("user_streaks")
            .upsert({
                user_id: userId,
                current_streak: newStreak,
                longest_streak: longestStreak,
                last_activity_date: today,
                updated_at: new Date().toISOString(),
            }, { onConflict: "user_id" });

        if (upsertError) {
            console.error("Error updating streak:", upsertError);
        }

        // Log activity (ignore duplicates)
        await supabaseAdmin
            .from("user_activity_log")
            .insert({
                user_id: userId,
                activity_type: activityType || "task_completed",
                activity_date: today,
                xp_earned: xpEarned || 0,
            })
            .catch(() => { }); // Ignore duplicate entry errors

        res.json({
            success: true,
            data: {
                currentStreak: newStreak,
                longestStreak,
                isFirstActivityToday,
            },
        });
    } catch (error) {
        console.error("Streak update error:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

module.exports = router;

