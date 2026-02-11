import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Map as MapIcon,
    BookOpen,
    MessageSquare,
    Mic,
    Code,
    Target,
    Sparkles,
    ArrowRight,
    CheckCircle,
    Clock,
    Brain,
    Zap,
    TrendingUp,
    Lightbulb,
    Volume2,
    Timer,
    Pause,
    Award,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

interface InterviewResult {
    skill: string;
    total_questions: number;
    correct_answers: number;
    xp_earned: number;
}

const GrowthRoadmap = () => {
    const { user } = useAuth();
    const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
    const [weakSkills, setWeakSkills] = useState<{ skill: string; score: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalInterviews, setTotalInterviews] = useState(0);

    useEffect(() => {
        const storedSkills = localStorage.getItem("extractedSkills");
        if (storedSkills) {
            try {
                const parsed = JSON.parse(storedSkills);
                setExtractedSkills(parsed.skills?.map((s: { name: string }) => s.name) || []);
            } catch (e) {
                console.error("Failed to parse stored skills", e);
            }
        }
    }, []);

    useEffect(() => {
        if (user?.id) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [user?.id]);

    const fetchData = async () => {
        if (!user?.id) return;
        try {
            const { data: interviews } = await supabase
                .from("interview_results")
                .select("*")
                .eq("user_id", user.id)
                .order("interview_date", { ascending: false });

            const results: InterviewResult[] = interviews || [];
            setTotalInterviews(results.length);

            // Calculate weak skills
            const skillScores = new Map<string, { total: number; correct: number }>();
            results.forEach((r) => {
                const existing = skillScores.get(r.skill) || { total: 0, correct: 0 };
                skillScores.set(r.skill, {
                    total: existing.total + r.total_questions,
                    correct: existing.correct + r.correct_answers,
                });
            });

            const scored = Array.from(skillScores.entries())
                .map(([skill, data]) => ({
                    skill,
                    score: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
                }))
                .sort((a, b) => a.score - b.score);

            setWeakSkills(scored.slice(0, 5));
        } catch (e) {
            console.error("Error fetching data:", e);
        } finally {
            setLoading(false);
        }
    };

    // Communication exercises data
    const communicationExercises = [
        {
            title: "Filler Word Elimination",
            description: "Practice speaking for 2 minutes without filler words (uh, um, like, you know).",
            icon: Volume2,
            difficulty: "Intermediate",
            duration: "5 min",
        },
        {
            title: "Pace Control Drill",
            description: "Read a technical paragraph aloud at 130 words/minute. Then repeat at 100 and 160.",
            icon: Timer,
            difficulty: "Beginner",
            duration: "10 min",
        },
        {
            title: "Pause Confidence",
            description: "Answer a question, pausing 2 seconds before each new point. Natural pauses convey confidence.",
            icon: Pause,
            difficulty: "Advanced",
            duration: "5 min",
        },
        {
            title: "STAR Storytelling",
            description: "Structure a behavioral answer: Situation → Task → Action → Result. Practice with 3 stories.",
            icon: MessageSquare,
            difficulty: "Intermediate",
            duration: "15 min",
        },
    ];

    // Generate suggested projects based on weak skills
    const getSuggestedProjects = () => {
        const allSuggestions: { title: string; description: string; skill: string; icon: typeof Code }[] = [];
        const skills = weakSkills.length > 0 ? weakSkills.map((w) => w.skill) : extractedSkills.slice(0, 3);

        skills.forEach((skill) => {
            const lowerSkill = skill.toLowerCase();
            if (lowerSkill.includes("react") || lowerSkill.includes("frontend")) {
                allSuggestions.push({
                    title: `Build a ${skill} Dashboard`,
                    description: "Create an interactive dashboard with data visualization and responsive layouts.",
                    skill,
                    icon: Code,
                });
            } else if (lowerSkill.includes("python") || lowerSkill.includes("ml") || lowerSkill.includes("data")) {
                allSuggestions.push({
                    title: `${skill} Data Pipeline`,
                    description: "Build an ETL pipeline that processes, transforms, and visualizes data.",
                    skill,
                    icon: Brain,
                });
            } else if (lowerSkill.includes("api") || lowerSkill.includes("node") || lowerSkill.includes("express")) {
                allSuggestions.push({
                    title: `REST API with ${skill}`,
                    description: "Design and build a RESTful API with authentication, validation, and documentation.",
                    skill,
                    icon: Zap,
                });
            } else if (lowerSkill.includes("sql") || lowerSkill.includes("database") || lowerSkill.includes("postgres")) {
                allSuggestions.push({
                    title: `${skill} Schema Design`,
                    description: "Design a normalized database schema with indexes, constraints, and migration scripts.",
                    skill,
                    icon: Target,
                });
            } else {
                allSuggestions.push({
                    title: `Mini-Project: ${skill}`,
                    description: `Build a small project that exercises key ${skill} concepts and patterns.`,
                    skill,
                    icon: Lightbulb,
                });
            }
        });

        return allSuggestions.slice(0, 4);
    };

    const suggestedProjects = getSuggestedProjects();
    const hasData = totalInterviews > 0;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-20 pb-12">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <MapIcon className="w-5 h-5 text-primary" />
                            <span className="text-sm text-primary font-medium">Personalized for You</span>
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                            Growth{" "}
                            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Roadmap
                            </span>
                        </h1>
                        <p className="text-muted-foreground">
                            Custom learning paths, communication exercises, and projects based on your Skill Genome
                        </p>
                    </motion.div>

                    {/* Section 1: Custom Learning Path */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8"
                    >
                        <Card variant="genome">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                    Custom Learning Path
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {hasData
                                        ? "Focus areas based on your interview performance"
                                        : "Build your Genome to get personalized recommendations"}
                                </p>
                            </CardHeader>
                            <CardContent>
                                {weakSkills.length > 0 ? (
                                    <div className="space-y-4">
                                        {weakSkills.map((ws, i) => (
                                            <div key={ws.skill} className="flex items-center gap-4">
                                                <div
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${ws.score < 40
                                                        ? "bg-gradient-to-br from-red-500 to-orange-500"
                                                        : ws.score < 60
                                                            ? "bg-gradient-to-br from-yellow-500 to-orange-500"
                                                            : "bg-gradient-to-br from-blue-500 to-cyan-500"
                                                        }`}
                                                >
                                                    {i + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-medium text-foreground">{ws.skill}</span>
                                                        <span className="text-xs text-muted-foreground">{ws.score}%</span>
                                                    </div>
                                                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                                                        <motion.div
                                                            className={`h-full rounded-full ${ws.score < 40
                                                                ? "bg-gradient-to-r from-red-500 to-orange-500"
                                                                : ws.score < 60
                                                                    ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                                                    : "bg-gradient-to-r from-blue-500 to-cyan-500"
                                                                }`}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${ws.score}%` }}
                                                            transition={{ duration: 1, delay: 0.2 + i * 0.15 }}
                                                        />
                                                    </div>
                                                </div>
                                                <Link to="/interview">
                                                    <Button variant="genome-ghost" size="sm">
                                                        Practice
                                                    </Button>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Complete interviews to identify skill gaps and get a learning path.
                                        </p>
                                        <Link to="/interview">
                                            <Button variant="genome" size="sm">Start Interview</Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Section 2: Communication Exercises */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <Card variant="genome">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mic className="w-5 h-5 text-primary" />
                                    Communication Exercises
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Improve speech clarity, filler words, and pacing
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {communicationExercises.map((exercise, i) => {
                                        const Icon = exercise.icon;
                                        return (
                                            <motion.div
                                                key={exercise.title}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 + i * 0.1 }}
                                                className="group relative"
                                            >
                                                <div className="relative bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 p-5 transition-all hover:border-primary/30 hover:bg-card/80">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                            <Icon className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-foreground mb-1">
                                                                {exercise.title}
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground mb-3">
                                                                {exercise.description}
                                                            </p>
                                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    {exercise.duration}
                                                                </span>
                                                                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                                                    {exercise.difficulty}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Section 3: Mock Interview Feedback */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8"
                    >
                        <Card variant="genome">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    Mock Interview Feedback
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Summary of your recent interview performance
                                </p>
                            </CardHeader>
                            <CardContent>
                                {hasData ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 p-4 text-center">
                                            <p className="text-2xl font-bold text-blue-400">{totalInterviews}</p>
                                            <p className="text-xs text-muted-foreground mt-1">Interviews Done</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 p-4 text-center">
                                            <p className="text-2xl font-bold text-green-400">
                                                {weakSkills.length > 0
                                                    ? Math.round(weakSkills.reduce((s, w) => s + w.score, 0) / weakSkills.length)
                                                    : 0}%
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">Avg Score</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-xl border border-purple-500/20 p-4 text-center">
                                            <p className="text-2xl font-bold text-purple-400">{weakSkills.length}</p>
                                            <p className="text-xs text-muted-foreground mt-1">Skills Tested</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-xl border border-pink-500/20 p-4 text-center">
                                            <p className="text-2xl font-bold text-pink-400">
                                                {weakSkills.filter((w) => w.score >= 70).length}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">Skills Mastered</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Award className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-sm text-muted-foreground">
                                            Complete mock interviews to see your feedback summary here.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Section 4: Suggested Projects & Topics */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-8"
                    >
                        <Card variant="genome">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5 text-primary" />
                                    Suggested Projects & Topics
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Hands-on projects targeting your weakest skills
                                </p>
                            </CardHeader>
                            <CardContent>
                                {suggestedProjects.length > 0 ? (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {suggestedProjects.map((project, i) => {
                                            const Icon = project.icon;
                                            return (
                                                <motion.div
                                                    key={project.title}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.5 + i * 0.1 }}
                                                    whileHover={{ y: -3 }}
                                                    className="relative bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 p-5 transition-all hover:border-primary/30 hover:bg-card/80"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center shrink-0">
                                                            <Icon className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-foreground mb-1">
                                                                {project.title}
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground mb-2">
                                                                {project.description}
                                                            </p>
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                                                                <Target className="w-3 h-3" />
                                                                {project.skill}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-sm text-muted-foreground">
                                            Build your Genome to get personalized project suggestions.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-center"
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/skill-genome-report">
                                <Button variant="genome-outline" size="lg" className="group">
                                    <Sparkles className="w-5 h-5" />
                                    View Skill Genome Report
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Link to="/interview">
                                <Button variant="genome" size="lg" className="group">
                                    Practice Interview
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default GrowthRoadmap;
