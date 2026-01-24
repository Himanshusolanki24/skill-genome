const express = require("express");
const { supabaseAdmin, isSupabaseConfigured } = require("../config/supabaseClient");
const { generateQuestion, evaluateAnswer, isMistralConfigured } = require("../services/mistralService");

const router = express.Router();

// Check configuration middleware
const checkConfig = (req, res, next) => {
    if (!isMistralConfigured()) {
        return res.status(503).json({
            success: false,
            error: "Mistral AI is not configured. Please add MISTRAL_API_KEY to .env file.",
        });
    }
    next();
};

// Start a new interview session
router.post("/start", checkConfig, async (req, res) => {
    try {
        const { skills, userId } = req.body;

        if (!skills || !Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Skills array is required",
            });
        }

        // Create session in database if Supabase is configured
        let sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        if (isSupabaseConfigured() && supabaseAdmin && userId) {
            const { data, error } = await supabaseAdmin
                .from("interview_sessions")
                .insert({
                    user_id: userId,
                    skills: skills.map(s => typeof s === 'object' ? s.name : s),
                    total_questions: 6,
                    completed_questions: 0,
                    status: "in_progress",
                })
                .select()
                .single();

            if (error) {
                console.error("Error creating session:", error);
            } else if (data) {
                sessionId = data.id;
            }
        }

        // Generate first question
        const skillNames = skills.map(s => typeof s === 'object' ? s.name : s);
        const question = await generateQuestion(skillNames, 1, []);

        res.json({
            success: true,
            data: {
                sessionId,
                questionNumber: 1,
                totalQuestions: 6,
                question,
            },
        });
    } catch (error) {
        console.error("Interview start error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to start interview",
        });
    }
});

// Submit an answer and get next question or results
router.post("/submit", checkConfig, async (req, res) => {
    try {
        const { sessionId, questionNumber, question, answer, skills, userId, previousQuestions = [] } = req.body;

        if (!question || !answer) {
            return res.status(400).json({
                success: false,
                error: "Question and answer are required",
            });
        }

        const skillNames = skills ? skills.map(s => typeof s === 'object' ? s.name : s) : [];

        // Evaluate the answer
        const evaluation = await evaluateAnswer(question, answer, skillNames);

        // Store answer in database if configured
        if (isSupabaseConfigured() && supabaseAdmin && sessionId && !sessionId.startsWith("session_")) {
            const { error } = await supabaseAdmin
                .from("interview_answers")
                .insert({
                    session_id: sessionId,
                    question_number: questionNumber,
                    question,
                    answer,
                    score: evaluation.score,
                    feedback: evaluation.feedback,
                });

            if (error) {
                console.error("Error storing answer:", error);
            }

            // Update session progress
            await supabaseAdmin
                .from("interview_sessions")
                .update({ completed_questions: questionNumber })
                .eq("id", sessionId);
        }

        // Check if interview is complete
        if (questionNumber >= 6) {
            // Calculate average score
            let averageScore = evaluation.score;

            if (isSupabaseConfigured() && supabaseAdmin && sessionId && !sessionId.startsWith("session_")) {
                // Get all answers for this session
                const { data: answers } = await supabaseAdmin
                    .from("interview_answers")
                    .select("score")
                    .eq("session_id", sessionId);

                if (answers && answers.length > 0) {
                    const totalScore = answers.reduce((sum, a) => sum + Number(a.score), 0);
                    averageScore = totalScore / answers.length;

                    // Update session with final results
                    await supabaseAdmin
                        .from("interview_sessions")
                        .update({
                            average_score: averageScore,
                            status: "completed",
                            completed_at: new Date().toISOString(),
                        })
                        .eq("id", sessionId);
                }
            }

            return res.json({
                success: true,
                data: {
                    isComplete: true,
                    evaluation,
                    averageScore: Math.round(averageScore * 10) / 10,
                },
            });
        }

        // Generate next question
        const allPreviousQuestions = [...previousQuestions, question];
        const nextQuestion = await generateQuestion(skillNames, questionNumber + 1, allPreviousQuestions);

        res.json({
            success: true,
            data: {
                isComplete: false,
                evaluation,
                nextQuestionNumber: questionNumber + 1,
                nextQuestion,
            },
        });
    } catch (error) {
        console.error("Answer submission error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to process answer",
        });
    }
});

// Get interview results
router.get("/results/:sessionId", async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!isSupabaseConfigured() || !supabaseAdmin) {
            return res.status(503).json({
                success: false,
                error: "Database not configured",
            });
        }

        // Get session
        const { data: session, error: sessionError } = await supabaseAdmin
            .from("interview_sessions")
            .select("*")
            .eq("id", sessionId)
            .single();

        if (sessionError || !session) {
            return res.status(404).json({
                success: false,
                error: "Session not found",
            });
        }

        // Get all answers
        const { data: answers, error: answersError } = await supabaseAdmin
            .from("interview_answers")
            .select("*")
            .eq("session_id", sessionId)
            .order("question_number", { ascending: true });

        if (answersError) {
            return res.status(500).json({
                success: false,
                error: "Failed to fetch answers",
            });
        }

        res.json({
            success: true,
            data: {
                session,
                answers,
            },
        });
    } catch (error) {
        console.error("Get results error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to get results",
        });
    }
});

// Get user's interview history
router.get("/history/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!isSupabaseConfigured() || !supabaseAdmin) {
            return res.status(503).json({
                success: false,
                error: "Database not configured",
            });
        }

        const { data: sessions, error } = await supabaseAdmin
            .from("interview_sessions")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            return res.status(500).json({
                success: false,
                error: "Failed to fetch history",
            });
        }

        res.json({
            success: true,
            data: sessions,
        });
    } catch (error) {
        console.error("Get history error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to get history",
        });
    }
});

// Save interview results for dashboard analytics
router.post("/save-results", async (req, res) => {
    try {
        const { userId, skill, skillsArray, averageScore, totalQuestions, correctAnswers, xpEarned } = req.body;

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

        // Calculate correct answers based on average score
        const calculatedCorrect = correctAnswers || Math.round((averageScore / 10) * totalQuestions);
        const calculatedXp = xpEarned || Math.round(averageScore * 10);

        // Insert main interview result (with combined skill label)
        const { data, error } = await supabaseAdmin
            .from("interview_results")
            .insert({
                user_id: userId,
                skill: skill || "General",
                score: Math.round(averageScore * 10), // Convert 0-10 to 0-100
                total_questions: totalQuestions || 6,
                correct_answers: calculatedCorrect,
                xp_earned: calculatedXp,
                interview_date: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error("Error saving interview results:", error);
            return res.status(500).json({
                success: false,
                error: "Failed to save interview results",
            });
        }

        // If skillsArray provided, also save individual skill progress records
        // This allows each skill to be tracked for focus area progress
        if (skillsArray && Array.isArray(skillsArray) && skillsArray.length > 0) {
            const individualSkillRecords = skillsArray.map(skillName => ({
                user_id: userId,
                skill: skillName,
                score: Math.round(averageScore * 10),
                total_questions: Math.ceil(totalQuestions / skillsArray.length) || 1,
                correct_answers: Math.ceil(calculatedCorrect / skillsArray.length) || 0,
                xp_earned: Math.round(calculatedXp / skillsArray.length),
                interview_date: new Date().toISOString(),
            }));

            // Insert individual skill records (ignore errors to not break main flow)
            await supabaseAdmin
                .from("interview_results")
                .insert(individualSkillRecords)
                .catch(err => {
                    console.warn("Could not save individual skill records:", err.message);
                });
        }

        // Also update user's total XP
        await supabaseAdmin.rpc("increment_user_xp", {
            user_id_param: userId,
            xp_amount: calculatedXp,
        }).catch(() => {
            // If RPC doesn't exist, try direct update
            return supabaseAdmin
                .from("users")
                .update({ total_xp: supabaseAdmin.raw(`COALESCE(total_xp, 0) + ${calculatedXp}`) })
                .eq("id", userId);
        });

        res.json({
            success: true,
            data: {
                id: data.id,
                xpEarned: calculatedXp,
            },
        });
    } catch (error) {
        console.error("Save results error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to save results",
        });
    }
});

module.exports = router;

