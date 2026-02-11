import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";
import {
    Dna,
    Brain,
    MessageSquare,
    Shield,
    Puzzle,
    Clock,
    TrendingUp,
    Award,
    ChevronRight,
    Sparkles,
    ArrowRight,
    Target,
    Zap,
    CheckCircle,
    AlertTriangle,
    Star,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

interface InterviewResult {
    id: string;
    skill: string;
    score: number;
    total_questions: number;
    correct_answers: number;
    interview_date: string;
    xp_earned: number;
}

// The 6 genome dimensions from the README
const genomeDimensions = [
    { key: "technical", label: "Technical Skills", icon: Brain, emoji: "🧠" },
    { key: "communication", label: "Communication", icon: MessageSquare, emoji: "💬" },
    { key: "confidence", label: "Confidence", icon: Shield, emoji: "😎" },
    { key: "problemSolving", label: "Problem Solving", icon: Puzzle, emoji: "🧩" },
    { key: "consistency", label: "Consistency", icon: Clock, emoji: "⏱️" },
    { key: "learningAbility", label: "Learning Ability", icon: TrendingUp, emoji: "📈" },
];

const SkillGenomeReport = () => {
    const { user } = useAuth();
    const [interviewResults, setInterviewResults] = useState<InterviewResult[]>([]);
    const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

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
            setInterviewResults(interviews || []);
        } catch (e) {
            console.error("Error fetching data:", e);
        } finally {
            setLoading(false);
        }
    };

    // Calculate genome scores from interview data
    const calculateGenomeScores = () => {
        if (interviewResults.length === 0) {
            return genomeDimensions.map((d) => ({ dimension: d.label, value: 0, fullMark: 100 }));
        }

        const avgScore =
            interviewResults.reduce((sum, i) => {
                return sum + (i.total_questions > 0 ? (i.correct_answers / i.total_questions) * 100 : 0);
            }, 0) / interviewResults.length;

        // Derive dimension scores from interview data patterns
        const uniqueSkills = new Set(interviewResults.map((i) => i.skill)).size;
        const totalInterviews = interviewResults.length;
        const recentScores = interviewResults.slice(0, 5).map((i) =>
            i.total_questions > 0 ? (i.correct_answers / i.total_questions) * 100 : 0
        );
        const recentAvg = recentScores.length > 0 ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length : 0;

        return [
            { dimension: "Technical Skills", value: Math.round(avgScore), fullMark: 100 },
            { dimension: "Communication", value: Math.round(Math.min(avgScore * 0.85 + 10, 100)), fullMark: 100 },
            { dimension: "Confidence", value: Math.round(Math.min(recentAvg * 0.9 + 5, 100)), fullMark: 100 },
            { dimension: "Problem Solving", value: Math.round(Math.min(avgScore * 0.95, 100)), fullMark: 100 },
            { dimension: "Consistency", value: Math.round(Math.min(totalInterviews * 8, 100)), fullMark: 100 },
            { dimension: "Learning Ability", value: Math.round(Math.min(uniqueSkills * 12 + recentAvg * 0.3, 100)), fullMark: 100 },
        ];
    };

    const genomeScores = calculateGenomeScores();
    const overallScore = genomeScores.length > 0
        ? Math.round(genomeScores.reduce((sum, s) => sum + s.value, 0) / genomeScores.length)
        : 0;

    const getGrade = (score: number) => {
        if (score >= 90) return { grade: "A+", label: "Exceptional", color: "text-green-400" };
        if (score >= 80) return { grade: "A", label: "Excellent", color: "text-green-400" };
        if (score >= 70) return { grade: "B+", label: "Strong", color: "text-blue-400" };
        if (score >= 60) return { grade: "B", label: "Good", color: "text-blue-400" };
        if (score >= 50) return { grade: "C+", label: "Developing", color: "text-yellow-400" };
        if (score >= 40) return { grade: "C", label: "Growing", color: "text-yellow-400" };
        return { grade: "D", label: "Beginner", color: "text-orange-400" };
    };

    const gradeInfo = getGrade(overallScore);

    // Strengths and weaknesses
    const strengths = [...genomeScores].sort((a, b) => b.value - a.value).slice(0, 3);
    const weaknesses = [...genomeScores].sort((a, b) => a.value - b.value).slice(0, 3);

    // Skill heatmap (from extracted skills + interview scores)
    const skillHeatmapData = () => {
        const skillScores = new Map<string, number>();
        interviewResults.forEach((r) => {
            const pct = r.total_questions > 0 ? (r.correct_answers / r.total_questions) * 100 : 0;
            const existing = skillScores.get(r.skill);
            if (!existing || pct > existing) {
                skillScores.set(r.skill, Math.round(pct));
            }
        });
        // Add extracted skills that haven't been interviewed
        extractedSkills.forEach((s) => {
            if (!skillScores.has(s)) {
                skillScores.set(s, 0);
            }
        });
        return Array.from(skillScores.entries())
            .map(([skill, score]) => ({ skill, score }))
            .sort((a, b) => b.score - a.score);
    };

    const heatmap = skillHeatmapData();

    const getHeatColor = (score: number) => {
        if (score >= 80) return "bg-green-500/80 text-white";
        if (score >= 60) return "bg-blue-500/70 text-white";
        if (score >= 40) return "bg-yellow-500/70 text-black";
        if (score > 0) return "bg-orange-500/60 text-white";
        return "bg-muted/50 text-muted-foreground";
    };

    const hasData = interviewResults.length > 0;

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
                            <Sparkles className="w-5 h-5 text-primary" />
                            <span className="text-sm text-primary font-medium">Your Unique Report</span>
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                            Skill Genome{" "}
                            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Report
                            </span>
                        </h1>
                        <p className="text-muted-foreground">
                            Your holistic skill DNA across 6 evaluation dimensions
                        </p>
                    </motion.div>

                    {!hasData ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <Dna className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-foreground mb-2">No Genome Data Yet</h2>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                Complete at least one interview to generate your
                                Skill Genome Report with radar chart, heatmap, and growth analysis.
                            </p>
                            <Link to="/interview">
                                <Button variant="genome" size="lg" className="group">
                                    Start Your First Interview
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            {/* Top Row: Radar Chart + Grade */}
                            <div className="grid lg:grid-cols-3 gap-6 mb-6">
                                {/* Radar Chart */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="lg:col-span-2"
                                >
                                    <Card variant="genome" className="h-full">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Dna className="w-5 h-5 text-primary" />
                                                Skill Genome Map
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground">
                                                6 dimensions of holistic evaluation
                                            </p>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-[380px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={genomeScores}>
                                                        <PolarGrid stroke="hsl(var(--border))" />
                                                        <PolarAngleAxis
                                                            dataKey="dimension"
                                                            tick={{
                                                                fill: "hsl(var(--muted-foreground))",
                                                                fontSize: 11,
                                                            }}
                                                        />
                                                        <PolarRadiusAxis
                                                            angle={30}
                                                            domain={[0, 100]}
                                                            tick={{
                                                                fill: "hsl(var(--muted-foreground))",
                                                                fontSize: 10,
                                                            }}
                                                            axisLine={false}
                                                        />
                                                        <Radar
                                                            name="Genome"
                                                            dataKey="value"
                                                            stroke="hsl(var(--primary))"
                                                            fill="hsl(var(--primary))"
                                                            fillOpacity={0.3}
                                                            strokeWidth={2}
                                                        />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Grade + Overall */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-6"
                                >
                                    <Card variant="genome">
                                        <CardContent className="pt-6 text-center">
                                            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 border-2 border-primary/30 flex items-center justify-center mb-4">
                                                <span className={`text-4xl font-display font-bold ${gradeInfo.color}`}>
                                                    {gradeInfo.grade}
                                                </span>
                                            </div>
                                            <p className="text-lg font-semibold text-foreground">{gradeInfo.label}</p>
                                            <p className="text-sm text-muted-foreground">Overall: {overallScore}%</p>
                                        </CardContent>
                                    </Card>

                                    {/* Dimension Scores List */}
                                    <Card variant="genome">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-sm">Dimension Scores</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {genomeDimensions.map((dim, i) => {
                                                    const score = genomeScores[i]?.value || 0;
                                                    return (
                                                        <div key={dim.key}>
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                                    <span>{dim.emoji}</span>
                                                                    {dim.label}
                                                                </span>
                                                                <span className="text-xs font-medium text-foreground">{score}%</span>
                                                            </div>
                                                            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                                                <motion.div
                                                                    className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500"
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${score}%` }}
                                                                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* Strengths & Weaknesses */}
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Card variant="genome" className="h-full">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-green-400">
                                                <CheckCircle className="w-5 h-5" />
                                                Top Strengths
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {strengths.map((s, i) => (
                                                    <div key={s.dimension} className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                                            <Star className="w-4 h-4 text-green-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-foreground">{s.dimension}</p>
                                                            <p className="text-xs text-muted-foreground">Score: {s.value}%</p>
                                                        </div>
                                                        <span className="text-sm font-bold text-green-400">#{i + 1}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Card variant="genome" className="h-full">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-orange-400">
                                                <AlertTriangle className="w-5 h-5" />
                                                Areas to Improve
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {weaknesses.map((s, i) => (
                                                    <div key={s.dimension} className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                                            <Target className="w-4 h-4 text-orange-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-foreground">{s.dimension}</p>
                                                            <p className="text-xs text-muted-foreground">Score: {s.value}%</p>
                                                        </div>
                                                        <span className="text-sm font-bold text-orange-400">Focus</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <Link to="/growth-roadmap" className="block mt-4">
                                                <Button variant="genome-outline" size="sm" className="w-full group">
                                                    View Growth Roadmap
                                                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* Skill Heatmap */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Card variant="genome">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-primary" />
                                            Skill Heatmap
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            Proficiency level per skill based on interview performance
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        {heatmap.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {heatmap.map((item, i) => (
                                                    <motion.div
                                                        key={item.skill}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.6 + i * 0.03 }}
                                                        className={`px-3 py-2 rounded-lg text-sm font-medium ${getHeatColor(item.score)}`}
                                                    >
                                                        {item.skill}
                                                        <span className="ml-1.5 text-xs opacity-80">
                                                            {item.score > 0 ? `${item.score}%` : "—"}
                                                        </span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground text-center py-8">
                                                No skill data yet. Build your Genome or take an interview.
                                            </p>
                                        )}

                                        {/* Legend */}
                                        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border/50 justify-center flex-wrap">
                                            {[
                                                { label: "Expert (80%+)", cls: "bg-green-500/80" },
                                                { label: "Strong (60-79%)", cls: "bg-blue-500/70" },
                                                { label: "Growing (40-59%)", cls: "bg-yellow-500/70" },
                                                { label: "Beginner (<40%)", cls: "bg-orange-500/60" },
                                                { label: "Not tested", cls: "bg-muted/50" },
                                            ].map((l) => (
                                                <div key={l.label} className="flex items-center gap-1.5">
                                                    <div className={`w-3 h-3 rounded ${l.cls}`} />
                                                    <span className="text-xs text-muted-foreground">{l.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* CTA to Growth Roadmap */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="mt-8 text-center"
                            >
                                <div className="relative inline-block group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-xl opacity-60 blur-sm group-hover:opacity-100 transition-all duration-500" />
                                    <Link to="/growth-roadmap">
                                        <Button variant="genome" size="xl" className="relative group">
                                            <Award className="w-5 h-5" />
                                            View Your Growth Roadmap
                                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SkillGenomeReport;
