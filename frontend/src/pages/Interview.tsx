import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NeuralBackground } from "@/components/NeuralBackground";
import {
    Play,
    Mic,
    Video,
    Clock,
    Target,
    Brain,
    Sparkles,
    ChevronRight,
    Zap,
    Award,
    Lock,
    CheckCircle,
    Star,
    MessageSquare,
    Code,
    Users,
    Briefcase,
} from "lucide-react";

interface Skill {
    name: string;
    color: string;
    textColor: string;
}

interface StoredSkills {
    skills: Skill[];
    repoCount?: number;
    username?: string;
    filename?: string;
}

const Interview = () => {
    const [extractedSkills, setExtractedSkills] = useState<StoredSkills | null>(null);
    const [selectedInterviewType, setSelectedInterviewType] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Load skills from localStorage
        const storedSkills = localStorage.getItem("extractedSkills");
        if (storedSkills) {
            try {
                setExtractedSkills(JSON.parse(storedSkills));
            } catch (e) {
                console.error("Failed to parse stored skills", e);
            }
        }
    }, []);

    const interviewTypes = [
        {
            id: "technical",
            title: "Technical Interview",
            description: "Algorithm, data structures, and coding challenges tailored to your skills",
            icon: Code,
            duration: "~15 min",
            difficulty: "Adaptive",
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-500/10 to-cyan-500/10",
            available: true,
        },
        {
            id: "behavioral",
            title: "Behavioral Interview",
            description: "STAR method questions based on your experience and soft skills",
            icon: MessageSquare,
            duration: "30-45 min",
            difficulty: "Intermediate",
            gradient: "from-purple-500 to-pink-500",
            bgGradient: "from-purple-500/10 to-pink-500/10",
            comingSoon: true,
        },
        {
            id: "system-design",
            title: "System Design",
            description: "Architecture and design problems for senior roles",
            icon: Brain,
            duration: "60-90 min",
            difficulty: "Advanced",
            gradient: "from-orange-500 to-red-500",
            bgGradient: "from-orange-500/10 to-red-500/10",
            comingSoon: true,
        },
        {
            id: "manager",
            title: "Manager Round",
            description: "Leadership, team management, and strategic thinking",
            icon: Users,
            duration: "45-60 min",
            difficulty: "Senior",
            gradient: "from-green-500 to-emerald-500",
            bgGradient: "from-green-500/10 to-emerald-500/10",
            comingSoon: true,
        },
    ];

    const features = [
        {
            icon: Mic,
            title: "Voice Analysis",
            description: "AI evaluates your communication clarity and confidence",
        },
        {
            icon: Video,
            title: "Video Recording",
            description: "Review your performance with detailed playback",
        },
        {
            icon: Target,
            title: "Personalized Questions",
            description: "Questions based on your extracted GyaniX",
        },
        {
            icon: Award,
            title: "Performance Score",
            description: "Get detailed feedback and improvement suggestions",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
                <NeuralBackground />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                {/* Animated Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-primary/15 to-pink-500/15 rounded-full blur-3xl"
                />

                <div className="container mx-auto px-4 relative z-10 py-20">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center max-w-4xl mx-auto mb-16"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 text-primary text-sm font-medium mb-6"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>AI-Powered Interview Prep</span>
                        </motion.div>

                        <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
                            Master Your{" "}
                            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Interview
                            </span>
                        </h1>

                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Practice with AI-driven mock interviews tailored to your GyaniX.
                            Get real-time feedback and ace your next opportunity.
                        </p>
                    </motion.div>

                    {/* Skills Preview - Only show if skills exist */}
                    {extractedSkills && extractedSkills.skills.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-3xl mx-auto mb-12"
                        >
                            <div className="relative group">
                                <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/50 via-purple-500/50 to-pink-500/50 rounded-2xl opacity-50 blur-sm" />
                                <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Target className="w-5 h-5 text-primary" />
                                        <h3 className="font-semibold text-foreground">Your GyaniX</h3>
                                        <span className="text-sm text-muted-foreground">
                                            ({extractedSkills.skills.length} skills detected)
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {extractedSkills.skills.slice(0, 12).map((skill, index) => (
                                            <motion.span
                                                key={skill.name}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.4 + index * 0.05 }}
                                                className="px-3 py-1.5 rounded-full text-sm font-medium"
                                                style={{
                                                    backgroundColor: skill.color,
                                                    color: skill.textColor,
                                                }}
                                            >
                                                {skill.name}
                                            </motion.span>
                                        ))}
                                        {extractedSkills.skills.length > 12 && (
                                            <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-muted text-muted-foreground">
                                                +{extractedSkills.skills.length - 12} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Interview Type Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="max-w-5xl mx-auto mb-16"
                    >
                        <h2 className="text-xl font-semibold text-foreground text-center mb-8">
                            Choose Your Interview Type
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {interviewTypes.map((type, index) => (
                                <motion.div
                                    key={type.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    className={`relative group ${type.comingSoon ? "cursor-not-allowed" : "cursor-pointer"}`}
                                    onClick={() => {
                                        if (!type.comingSoon) {
                                            setSelectedInterviewType(type.id);
                                        }
                                    }}
                                >
                                    <div
                                        className={`relative bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 p-6 transition-all duration-300 ${selectedInterviewType === type.id
                                            ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                                            : ""
                                            } ${type.comingSoon ? "opacity-60" : ""}`}
                                    >
                                        {type.comingSoon && (
                                            <div className="absolute top-4 right-4">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-gray-500/20 to-gray-600/20 border border-gray-500/30 text-gray-400 text-xs font-medium">
                                                    <Clock className="w-3 h-3" />
                                                    Coming Soon
                                                </span>
                                            </div>
                                        )}
                                        {type.available && (
                                            <div className="absolute top-4 right-4">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 text-xs font-medium">
                                                    <Zap className="w-3 h-3" />
                                                    Available
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-start gap-4">
                                            <div
                                                className={`w-14 h-14 rounded-xl bg-gradient-to-r ${type.bgGradient} flex items-center justify-center border border-border/50`}
                                            >
                                                <type.icon
                                                    className={`w-7 h-7 bg-gradient-to-r ${type.gradient} bg-clip-text text-transparent`}
                                                    style={{
                                                        stroke: `url(#${type.id}-gradient)`,
                                                    }}
                                                />
                                                <svg width="0" height="0">
                                                    <defs>
                                                        <linearGradient
                                                            id={`${type.id}-gradient`}
                                                            x1="0%"
                                                            y1="0%"
                                                            x2="100%"
                                                            y2="0%"
                                                        >
                                                            <stop
                                                                offset="0%"
                                                                stopColor={
                                                                    type.gradient.includes("blue")
                                                                        ? "#3b82f6"
                                                                        : type.gradient.includes("purple")
                                                                            ? "#a855f7"
                                                                            : type.gradient.includes("orange")
                                                                                ? "#f97316"
                                                                                : "#22c55e"
                                                                }
                                                            />
                                                            <stop
                                                                offset="100%"
                                                                stopColor={
                                                                    type.gradient.includes("cyan")
                                                                        ? "#06b6d4"
                                                                        : type.gradient.includes("pink")
                                                                            ? "#ec4899"
                                                                            : type.gradient.includes("red")
                                                                                ? "#ef4444"
                                                                                : "#10b981"
                                                                }
                                                            />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-foreground mb-1">
                                                    {type.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mb-3">
                                                    {type.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {type.duration}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Zap className="w-3.5 h-3.5" />
                                                        {type.difficulty}
                                                    </span>
                                                </div>
                                            </div>

                                            {selectedInterviewType === type.id && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute top-4 right-4"
                                                >
                                                    <CheckCircle className="w-6 h-6 text-primary" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="max-w-4xl mx-auto mb-16"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 + index * 0.1 }}
                                    whileHover={{ y: -4 }}
                                    className="group"
                                >
                                    <div className="relative bg-card/60 backdrop-blur-xl rounded-xl border border-border/50 p-5 text-center transition-all duration-300 hover:border-primary/30 hover:bg-card/80">
                                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <feature.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <h4 className="font-medium text-foreground text-sm mb-1">
                                            {feature.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Start Interview CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="text-center"
                    >
                        <div className="relative inline-block group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-xl opacity-75 blur-sm group-hover:opacity-100 transition-all duration-500" />
                            <Button
                                variant="genome"
                                size="xl"
                                className="relative bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-2xl shadow-primary/25"
                                disabled={!selectedInterviewType || selectedInterviewType !== "technical"}
                                onClick={() => {
                                    if (selectedInterviewType === "technical") {
                                        navigate("/interview/technical");
                                    }
                                }}
                            >
                                <Play className="w-5 h-5" />
                                Start Mock Interview
                                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                        {!selectedInterviewType && (
                            <p className="text-sm text-muted-foreground mt-4">
                                Select Technical Interview to begin
                            </p>
                        )}
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="max-w-3xl mx-auto mt-20"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/30 via-purple-500/30 to-pink-500/30 rounded-2xl opacity-50 blur-sm" />
                            <div className="relative bg-card/60 backdrop-blur-xl rounded-2xl border border-border/50 p-8">
                                <div className="grid grid-cols-3 gap-8 text-center">
                                    <div>
                                        <div className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                                            10K+
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">
                                            Interviews Completed
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                                            94%
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">
                                            Success Rate
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                                            500+
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">
                                            Companies Hiring
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Interview;
