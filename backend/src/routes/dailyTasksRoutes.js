const express = require("express");
const { supabaseAdmin, isSupabaseConfigured } = require("../config/supabaseClient");
const { evaluateAnswer, isMistralConfigured } = require("../services/mistralService");

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

        // Also record in activity log for heatmap
        const today = new Date().toISOString().split("T")[0];
        await supabaseAdmin
            .from("user_activity_log")
            .insert({
                user_id: userId,
                activity_type: "task_completed",
                activity_date: today,
                xp_earned: xpEarned || 10,
            })
            .catch(err => {
                // Ignore unique violation if user already has an activity entry for this task on this day
                // But generally we want to track every task completion count if we want intensity
                // However, the table might have a unique constraint. 
                // Let's check if we want one entry per day or multiple. 
                // The heatmap counts *submissions*, so we should probably allow multiple.
                // If the table has UNIQUE(user_id, activity_date, activity_type), then we can only track one per type per day.
                // Let's assume we want to track counts. 
                // If the constraint exists, we might need a separate 'count' column or remove the constraint.
                // For now, let's just log it and see.
                console.log("Activity log note:", err.message);
            });

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

// Validate user's answer using Mistral AI
router.post("/validate-answer", async (req, res) => {
    try {
        const { taskId, userId, answer, question, technology } = req.body;

        if (!answer || !question) {
            return res.status(400).json({
                success: false,
                error: "Answer and question are required",
            });
        }

        // Minimum answer length check
        if (answer.trim().length < 10) {
            return res.json({
                success: true,
                isCorrect: false,
                score: 0,
                feedback: "Your answer is too short. Please provide a more detailed response.",
                strengths: "",
                improvements: "Add more detail and explanation to your answer.",
            });
        }

        // Use Mistral AI to evaluate the answer
        const evaluation = await evaluateAnswer(question, answer, technology || "General");

        // Consider score >= 6 as correct (passing grade)
        const isCorrect = evaluation.score >= 6;

        res.json({
            success: true,
            isCorrect,
            score: evaluation.score,
            feedback: evaluation.feedback,
            strengths: evaluation.strengths,
            improvements: evaluation.improvements,
        });
    } catch (error) {
        console.error("Answer validation error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to validate answer",
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
            const dayBeforeYesterday = new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0];

            if (lastActivity === today) {
                // Already active today, keep current streak
                newStreak = streakData.current_streak;
                isFirstActivityToday = false;
            } else if (lastActivity === yesterday) {
                // Consecutive day, increment streak
                newStreak = streakData.current_streak + 1;
            } else if (lastActivity === dayBeforeYesterday) {
                // Missed one day, decrement streak by 1 (minimum 0)
                newStreak = Math.max(0, streakData.current_streak - 1);
            } else {
                // Missed more than one day, reset streak to 1
                newStreak = 1;
            }

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

// Get activity heatmap data (last 365 days)
router.get("/activity-heatmap/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!isSupabaseConfigured() || !supabaseAdmin) {
            return res.status(503).json({
                success: false,
                error: "Database not configured",
            });
        }

        // Calculate date range (last 365 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 364);

        const { data, error } = await supabaseAdmin
            .from("user_activity_log")
            .select("activity_date, activity_type")
            .eq("user_id", userId)
            .gte("activity_date", startDate.toISOString().split("T")[0])
            .lte("activity_date", endDate.toISOString().split("T")[0]);

        if (error) {
            console.error("Error fetching activity heatmap:", error);
            return res.status(500).json({
                success: false,
                error: "Failed to fetch activity data",
            });
        }

        // Aggregate activities by date
        const activityMap = new Map();
        (data || []).forEach((activity) => {
            const date = activity.activity_date;
            activityMap.set(date, (activityMap.get(date) || 0) + 1);
        });

        // Convert to array format
        const heatmapData = Array.from(activityMap.entries()).map(([date, count]) => ({
            date,
            count,
        }));

        res.json({
            success: true,
            data: heatmapData,
        });
    } catch (error) {
        console.error("Activity heatmap error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to fetch activity heatmap",
        });
    }
});

module.exports = router;

