const { supabaseAdmin, isSupabaseConfigured } = require("../config/supabaseClient");

/**
 * Get questions from the database based on user skills
 * @param {string[]} skills - Array of skill names
 * @param {number} count - Number of questions to fetch
 * @returns {Promise<string[]>} - Array of questions
 */
const getQuestionsForSkills = async (skills, count = 6) => {
    if (!isSupabaseConfigured() || !supabaseAdmin) {
        console.log("Supabase not configured, cannot fetch questions from DB");
        return [];
    }

    try {
        // Normalize skill names (case-insensitive matching)
        const normalizedSkills = skills.map(s =>
            typeof s === 'object' ? s.name : s
        );

        // Fetch questions matching user skills
        const { data: skillQuestions, error: skillError } = await supabaseAdmin
            .from("question_bank")
            .select("question, skill, difficulty")
            .in("skill", normalizedSkills)
            .order("difficulty", { ascending: true });

        if (skillError) {
            console.error("Error fetching skill questions:", skillError);
            return [];
        }

        // Fetch general fallback questions
        const { data: generalQuestions, error: generalError } = await supabaseAdmin
            .from("question_bank")
            .select("question, skill, difficulty")
            .eq("skill", "General")
            .order("difficulty", { ascending: true });

        if (generalError) {
            console.error("Error fetching general questions:", generalError);
        }

        // Combine and select questions
        const allQuestions = [...(skillQuestions || []), ...(generalQuestions || [])];

        if (allQuestions.length === 0) {
            return [];
        }

        // Distribute questions across skills
        const selectedQuestions = [];
        const usedSkills = new Set();

        // First pass: try to get one question per skill
        for (const skill of normalizedSkills) {
            if (selectedQuestions.length >= count) break;

            const skillQ = allQuestions.find(q =>
                q.skill.toLowerCase() === skill.toLowerCase() &&
                !selectedQuestions.includes(q.question)
            );

            if (skillQ) {
                selectedQuestions.push(skillQ.question);
                usedSkills.add(skillQ.skill);
            }
        }

        // Second pass: fill remaining with any available questions
        for (const q of allQuestions) {
            if (selectedQuestions.length >= count) break;
            if (!selectedQuestions.includes(q.question)) {
                selectedQuestions.push(q.question);
            }
        }

        // Shuffle to mix difficulty
        return shuffleArray(selectedQuestions.slice(0, count));
    } catch (error) {
        console.error("Error in getQuestionsForSkills:", error);
        return [];
    }
};

/**
 * Get a single question by index from the database
 */
const getQuestionByIndex = async (skills, questionNumber) => {
    const questions = await getQuestionsForSkills(skills, 6);

    if (questions.length === 0) {
        return null;
    }

    // Get question by index (1-based questionNumber)
    const index = (questionNumber - 1) % questions.length;
    return questions[index];
};

/**
 * Shuffle array using Fisher-Yates algorithm
 */
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

module.exports = {
    getQuestionsForSkills,
    getQuestionByIndex,
};
