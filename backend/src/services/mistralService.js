const { Mistral } = require("@mistralai/mistralai");
const { getQuestionByIndex } = require("./questionService");

const apiKey = process.env.MISTRAL_API_KEY;
let client = null;

// Initialize Mistral client
if (apiKey && apiKey !== "your_mistral_api_key_here") {
    try {
        client = new Mistral({ apiKey });
        console.log("✅ Mistral AI initialized successfully");
    } catch (error) {
        console.warn("⚠️ Failed to initialize Mistral:", error.message);
    }
} else {
    console.warn("⚠️ Mistral not configured. Add MISTRAL_API_KEY to .env file.");
}

// Check if Mistral is configured
const isMistralConfigured = () => {
    return client !== null;
};

// Fallback questions when Mistral is unavailable or quota exceeded
const fallbackQuestions = [
    "Explain the difference between let, const, and var in JavaScript. When would you use each?",
    "What is the event loop in JavaScript and how does it handle asynchronous operations?",
    "Describe the concept of closures in JavaScript with a practical example.",
    "What are the differences between REST and GraphQL APIs? When would you choose one over the other?",
    "Explain Big O notation and give examples of O(1), O(n), and O(n²) time complexity.",
    "What is the difference between authentication and authorization? How would you implement them?",
];

// Generate a technical interview question based on user skills
const generateQuestion = async (skills, questionNumber, previousQuestions = []) => {
    const skillNames = Array.isArray(skills)
        ? skills.map(s => typeof s === 'object' ? s.name : s)
        : [skills];

    // Use fallback if Mistral not configured
    if (!client) {
        console.log("Using database fallback (Mistral not configured)");
        const dbQuestion = await getQuestionByIndex(skillNames, questionNumber);
        return dbQuestion || fallbackQuestions[questionNumber - 1] || fallbackQuestions[0];
    }

    const skillsList = skillNames.join(", ");

    const prompt = `You are a technical interviewer. Generate question #${questionNumber} of 6 for a software developer interview.

The candidate has these skills: ${skillsList}

${previousQuestions.length > 0 ? `Previous questions asked (avoid repeating similar topics):
${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}` : ""}

Requirements:
- Ask a practical, real-world technical question
- Focus on problem-solving, not just definitions
- Vary difficulty: questions 1-2 are easy, 3-4 medium, 5-6 hard
- Keep the question concise but clear
- Don't ask multi-part questions

Respond with ONLY the question text, nothing else.`;

    try {
        const response = await client.chat.complete({
            model: "mistral-large-latest",
            messages: [
                { role: "user", content: prompt }
            ],
        });

        const question = response.choices[0].message.content.trim();
        return question;
    } catch (error) {
        console.error("Mistral error, using database fallback:", error.message);
        // Try database fallback first, then hardcoded
        const dbQuestion = await getQuestionByIndex(skillNames, questionNumber);
        return dbQuestion || fallbackQuestions[questionNumber - 1] || fallbackQuestions[0];
    }
};

// Evaluate an answer and return score with feedback
const evaluateAnswer = async (question, answer, skills) => {
    // Fallback evaluation when Mistral is not available
    if (!client) {
        console.log("Using fallback evaluation (Mistral not configured)");
        const score = Math.floor(Math.random() * 3) + 6; // Random 6-8 score
        return {
            score,
            feedback: "Your answer has been recorded. Detailed AI evaluation is temporarily unavailable.",
            strengths: "Answer was provided",
            improvements: "Enable Mistral for detailed feedback"
        };
    }

    const prompt = `You are a technical interviewer evaluating a candidate's answer.

Question: ${question}

Candidate's Answer: ${answer}

Candidate's Skills: ${Array.isArray(skills) ? skills.join(", ") : skills}

Evaluate the answer based on:
1. Technical accuracy
2. Completeness
3. Clarity of explanation
4. Practical understanding

Respond in this exact JSON format (no markdown, just JSON):
{
    "score": <number from 0 to 10>,
    "feedback": "<brief constructive feedback, 1-2 sentences>",
    "strengths": "<what they did well, if any>",
    "improvements": "<what could be improved, if any>"
}`;

    try {
        const response = await client.chat.complete({
            model: "mistral-large-latest",
            messages: [
                { role: "user", content: prompt }
            ],
        });

        let text = response.choices[0].message.content.trim();

        // Clean up the response if it has markdown code blocks
        if (text.startsWith("```json")) {
            text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
        } else if (text.startsWith("```")) {
            text = text.replace(/```\n?/g, "");
        }

        const evaluation = JSON.parse(text);

        // Ensure score is within bounds
        evaluation.score = Math.max(0, Math.min(10, Number(evaluation.score) || 0));

        return evaluation;
    } catch (error) {
        console.error("Mistral evaluation error:", error);
        // Return a default evaluation if parsing fails
        return {
            score: 5,
            feedback: "Unable to fully evaluate the answer. Please review manually.",
            strengths: "Answer was provided",
            improvements: "Could not parse evaluation"
        };
    }
};

module.exports = {
    generateQuestion,
    evaluateAnswer,
    isMistralConfigured,
};
