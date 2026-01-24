import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { NeuralBackground } from "@/components/NeuralBackground";
import { useAuth } from "@/contexts/AuthContext";
import {
    ArrowRight,
    Loader2,
    CheckCircle,
    XCircle,
    AlertCircle,
    Brain,
    Sparkles,
    Target,
    Trophy,
    RotateCcw,
    Home,
    ChevronRight,
} from "lucide-react";
import { API_BASE_URL, parseApiResponse } from "@/lib/api";

interface Skill {
    name: string;
    color: string;
    textColor: string;
}

interface StoredSkills {
    skills: Skill[];
}

interface Evaluation {
    score: number;
    feedback: string;
    strengths?: string;
    improvements?: string;
}

interface AnswerResult {
    questionNumber: number;
    question: string;
    answer: string;
    evaluation: Evaluation;
}

const TechnicalInterview = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // State
    const [skills, setSkills] = useState<Skill[]>([]);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<string>("");
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
    const [totalQuestions] = useState(6);
    const [answer, setAnswer] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
    const [results, setResults] = useState<AnswerResult[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [averageScore, setAverageScore] = useState(0);
    const [showEvaluation, setShowEvaluation] = useState(false);
    const [lastEvaluation, setLastEvaluation] = useState<Evaluation | null>(null);

    // Load skills on mount
    useEffect(() => {
        const storedSkills = localStorage.getItem("extractedSkills");
        if (storedSkills) {
            try {
                const parsed: StoredSkills = JSON.parse(storedSkills);
                setSkills(parsed.skills || []);
            } catch (e) {
                console.error("Failed to parse skills", e);
            }
        }
    }, []);

    // Start interview
    const startInterview = async () => {
        if (skills.length === 0) {
            setError("No skills found. Please extract skills first.");
            return;
        }

        setIsLoading(true);
        setLoadingMessage("Generating your first question...");
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/interview/start`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    skills: skills.map(s => s.name),
                    userId: user?.id,
                }),
            });

            const data = await parseApiResponse(response);

            if (!data.success) {
                throw new Error(data.error || "Failed to start interview");
            }

            setSessionId(data.data.sessionId);
            setCurrentQuestion(data.data.question);
            setCurrentQuestionNumber(1);
            setPreviousQuestions([data.data.question]);
        } catch (err: any) {
            setError(err.message || "Failed to start interview");
        } finally {
            setIsLoading(false);
            setLoadingMessage("");
        }
    };

    // Submit answer
    const submitAnswer = async () => {
        if (!answer.trim()) {
            setError("Please provide an answer");
            return;
        }

        setIsLoading(true);
        setLoadingMessage("AI is evaluating your answer...");
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/interview/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    questionNumber: currentQuestionNumber,
                    question: currentQuestion,
                    answer: answer.trim(),
                    skills: skills.map(s => s.name),
                    userId: user?.id,
                    previousQuestions,
                }),
            });

            const data = await parseApiResponse(response);

            if (!data.success) {
                throw new Error(data.error || "Failed to submit answer");
            }

            const evaluation = data.data.evaluation;

            // Store result
            const result: AnswerResult = {
                questionNumber: currentQuestionNumber,
                question: currentQuestion,
                answer: answer.trim(),
                evaluation,
            };
            setResults(prev => [...prev, result]);

            // Show evaluation
            setLastEvaluation(evaluation);
            setShowEvaluation(true);

            if (data.data.isComplete) {
                // Interview complete
                setIsComplete(true);
                setAverageScore(data.data.averageScore);

                // Save results to database for Dashboard
                if (user?.id) {
                    // Include all skills in the interview record, not just the first one
                    const skillNames = skills.map(s => s.name);
                    const skillLabel = skillNames.length > 3
                        ? `${skillNames.slice(0, 3).join(", ")} +${skillNames.length - 3} more`
                        : skillNames.join(", ") || "General";

                    try {
                        await fetch(`${API_BASE_URL}/api/interview/save-results`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                userId: user.id,
                                skill: skillLabel,
                                skillsArray: skillNames, // Pass all skills for individual tracking
                                averageScore: data.data.averageScore,
                                totalQuestions: 6,
                                correctAnswers: Math.round((data.data.averageScore / 10) * 6),
                                xpEarned: Math.round(data.data.averageScore * 10),
                            }),
                        });
                    } catch (saveErr) {
                        console.error("Failed to save interview results:", saveErr);
                    }
                }
            } else {
                // After showing evaluation, load next question
                setTimeout(() => {
                    setShowEvaluation(false);
                    setCurrentQuestion(data.data.nextQuestion);
                    setCurrentQuestionNumber(data.data.nextQuestionNumber);
                    setPreviousQuestions(prev => [...prev, data.data.nextQuestion]);
                    setAnswer("");
                    setLastEvaluation(null);
                }, 3000);
            }
        } catch (err: any) {
            setError(err.message || "Failed to submit answer");
        } finally {
            setIsLoading(false);
            setLoadingMessage("");
        }
    };

    // Get score color
    const getScoreColor = (score: number) => {
        if (score >= 8) return "text-green-400";
        if (score >= 6) return "text-yellow-400";
        if (score >= 4) return "text-orange-400";
        return "text-red-400";
    };

    const getScoreBg = (score: number) => {
        if (score >= 8) return "from-green-500/20 to-emerald-500/20 border-green-500/30";
        if (score >= 6) return "from-yellow-500/20 to-amber-500/20 border-yellow-500/30";
        if (score >= 4) return "from-orange-500/20 to-red-500/20 border-orange-500/30";
        return "from-red-500/20 to-rose-500/20 border-red-500/30";
    };

    // Render interview start screen
    const renderStartScreen = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
        >
            <div className="relative group mb-8">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/50 to-cyan-500/50 rounded-2xl opacity-50 blur-sm" />
                <div className="relative bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 p-8">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/30">
                        <Brain className="w-10 h-10 text-blue-400" />
                    </div>

                    <h1 className="text-3xl font-bold text-foreground mb-3">
                        Technical Interview
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        You'll answer {totalQuestions} questions based on your skill genome.
                        Each answer will be evaluated by AI in real-time.
                    </p>

                    {skills.length > 0 && (
                        <div className="mb-6">
                            <p className="text-sm text-muted-foreground mb-3">
                                Questions will be based on:
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {skills.slice(0, 8).map((skill) => (
                                    <span
                                        key={skill.name}
                                        className="px-3 py-1 rounded-full text-xs font-medium"
                                        style={{
                                            backgroundColor: skill.color,
                                            color: skill.textColor,
                                        }}
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                                {skills.length > 8 && (
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                        +{skills.length - 8} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <div className="flex items-center gap-2 text-red-400">
                                <AlertCircle className="w-5 h-5" />
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    <Button
                        variant="genome"
                        size="lg"
                        onClick={startInterview}
                        disabled={isLoading || skills.length === 0}
                        className="w-full group"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {loadingMessage}
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Start Interview
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </Button>

                    {skills.length === 0 && (
                        <p className="text-sm text-amber-400 mt-4">
                            No skills found. Please extract skills from GitHub or resume first.
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );

    // Render question screen
    const renderQuestionScreen = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
        >
            {/* Progress bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                        Question {currentQuestionNumber} of {totalQuestions}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {Math.round((currentQuestionNumber / totalQuestions) * 100)}% complete
                    </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentQuestionNumber / totalQuestions) * 100}%` }}
                        className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Question card */}
            <div className="relative group mb-6">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-2xl opacity-50 blur-sm" />
                <div className="relative bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 p-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Target className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-primary">
                            Question {currentQuestionNumber}
                        </span>
                    </div>

                    <h2 className="text-xl font-semibold text-foreground mb-6 leading-relaxed">
                        {currentQuestion}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                            <div className="flex items-center gap-2 text-red-400">
                                <AlertCircle className="w-4 h-4" />
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        rows={6}
                        disabled={isLoading || showEvaluation}
                        className="w-full bg-background/50 border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 resize-none"
                    />

                    <div className="flex justify-end mt-4">
                        <Button
                            variant="genome"
                            size="lg"
                            onClick={submitAnswer}
                            disabled={isLoading || !answer.trim() || showEvaluation}
                            className="group"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {loadingMessage}
                                </>
                            ) : (
                                <>
                                    Submit Answer
                                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Evaluation popup */}
            <AnimatePresence>
                {showEvaluation && lastEvaluation && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            className="max-w-lg mx-4"
                        >
                            <div className={`relative bg-card/95 backdrop-blur-xl rounded-2xl border ${getScoreBg(lastEvaluation.score)} p-8 text-center`}>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r ${getScoreBg(lastEvaluation.score)} flex items-center justify-center`}
                                >
                                    <span className={`text-4xl font-bold ${getScoreColor(lastEvaluation.score)}`}>
                                        {lastEvaluation.score}
                                    </span>
                                </motion.div>

                                <h3 className="text-xl font-semibold text-foreground mb-2">
                                    {lastEvaluation.score >= 8
                                        ? "Excellent!"
                                        : lastEvaluation.score >= 6
                                            ? "Good Job!"
                                            : lastEvaluation.score >= 4
                                                ? "Keep Improving"
                                                : "Needs Work"}
                                </h3>

                                <p className="text-muted-foreground mb-4">
                                    {lastEvaluation.feedback}
                                </p>

                                {!isComplete && (
                                    <p className="text-sm text-primary animate-pulse">
                                        Loading next question...
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );

    // Render results screen
    const renderResultsScreen = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            {/* Final score card */}
            <div className="relative group mb-8">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/50 via-purple-500/50 to-pink-500/50 rounded-2xl opacity-75 blur-sm" />
                <div className="relative bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 p-8 text-center">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />

                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Interview Complete!
                    </h1>

                    <p className="text-muted-foreground mb-6">
                        Here's how you performed across all {totalQuestions} questions
                    </p>

                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 flex items-center justify-center border-4 border-primary/30">
                        <div className="text-center">
                            <div className={`text-4xl font-bold ${getScoreColor(averageScore)}`}>
                                {averageScore.toFixed(1)}
                            </div>
                            <div className="text-xs text-muted-foreground">out of 10</div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4">
                        <Button
                            variant="genome-outline"
                            onClick={() => {
                                setResults([]);
                                setIsComplete(false);
                                setCurrentQuestionNumber(0);
                                setSessionId(null);
                                setPreviousQuestions([]);
                                setAnswer("");
                            }}
                        >
                            <RotateCcw className="w-4 h-4" />
                            Try Again
                        </Button>
                        <Button
                            variant="genome"
                            onClick={() => navigate("/dashboard")}
                        >
                            Go to Dashboard
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Individual results */}
            <h2 className="text-xl font-semibold text-foreground mb-4">
                Question by Question Breakdown
            </h2>
            <div className="space-y-4">
                {results.map((result, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group"
                    >
                        <div className="relative bg-card/80 backdrop-blur-xl rounded-xl border border-border/50 p-6">
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getScoreBg(result.evaluation.score)}`}>
                                    <span className={`text-lg font-bold ${getScoreColor(result.evaluation.score)}`}>
                                        {result.evaluation.score}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-medium text-primary">
                                            Question {result.questionNumber}
                                        </span>
                                        {result.evaluation.score >= 7 ? (
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-orange-400" />
                                        )}
                                    </div>

                                    <p className="text-foreground font-medium mb-2">
                                        {result.question}
                                    </p>

                                    <p className="text-sm text-muted-foreground mb-2">
                                        <span className="font-medium">Your answer:</span>{" "}
                                        {result.answer.length > 150
                                            ? result.answer.substring(0, 150) + "..."
                                            : result.answer}
                                    </p>

                                    <p className="text-sm text-primary">
                                        {result.evaluation.feedback}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12">
                <NeuralBackground />

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl"
                />

                <div className="container mx-auto px-4 relative z-10">
                    {currentQuestionNumber === 0 && !isComplete && renderStartScreen()}
                    {currentQuestionNumber > 0 && !isComplete && renderQuestionScreen()}
                    {isComplete && renderResultsScreen()}
                </div>
            </section>
        </div>
    );
};

export default TechnicalInterview;
