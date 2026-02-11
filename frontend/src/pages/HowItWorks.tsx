import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NeuralBackground } from "@/components/NeuralBackground";
import {
    Brain,
    Dna,
    Target,
    Zap,
    TrendingUp,
    ChevronRight,
    Sparkles,
    GitBranch,
    BarChart3,
    Rocket,
    Shield,
    Users,
    Award,
    CheckCircle,
    ArrowRight,
    Code,
    FileText,
    LogIn,
    Video,
    Eye,
    ScanFace,
    Mic,
    PieChart,
    Map,
} from "lucide-react";
import { useRef } from "react";

const steps = [
    {
        step: 1,
        title: "User Logs In",
        description:
            "Sign in securely via email or social login. Your profile is created with encrypted credentials, and all data stays private throughout your journey.",
        icon: LogIn,
        color: "from-blue-500 to-cyan-500",
        features: ["Secure Auth", "OAuth / Email", "Privacy First"],
    },
    {
        step: 2,
        title: "Resume + GitHub Parsed",
        description:
            "Upload your resume or link your GitHub. Our NLP engine extracts skills, detects your tech stack, and compares claimed skills vs actual work in your repos.",
        icon: GitBranch,
        color: "from-primary to-pink-400",
        features: ["Resume NLP", "Tech Stack Detection", "Skill Verification"],
    },
    {
        step: 3,
        title: "AI Interview Starts",
        description:
            "Begin a real-time webcam + microphone interview. The AI asks adaptive technical and behavioral questions tailored to your extracted skill genome.",
        icon: Video,
        color: "from-purple-500 to-violet-500",
        features: ["Webcam + Mic", "Adaptive Questions", "Real-Time Feedback"],
    },
    {
        step: 4,
        title: "MediaPipe Analyzes Body Language",
        description:
            "Google's MediaPipe Holistic tracks your eye contact, facial expressions, head stability, posture, and hand movements in real time — right in the browser.",
        icon: ScanFace,
        color: "from-orange-500 to-yellow-500",
        features: ["Eye Gaze Tracking", "Expression Analysis", "Posture Detection"],
    },
    {
        step: 5,
        title: "NLP Evaluates Communication",
        description:
            "Speech clarity, filler words (uh, um, like), speaking pace, and pause patterns are analyzed. You receive a communication confidence score with improvement tips.",
        icon: Mic,
        color: "from-green-500 to-emerald-500",
        features: ["Filler Detection", "Speech Pace", "Clarity Score"],
    },
    {
        step: 6,
        title: "Scores Aggregated",
        description:
            "Technical accuracy, body language scores, communication metrics, and consistency data are combined into a holistic, bias-free evaluation — no college or appearance bias.",
        icon: PieChart,
        color: "from-pink-500 to-rose-500",
        features: ["Holistic Scoring", "Bias-Free", "Multi-Signal Fusion"],
    },
    {
        step: 7,
        title: "Skill Genome Generated",
        description:
            "Your unique Skill Genome Map is created — a radar chart, skill heatmap, and strength/weakness summary across 6 dimensions: Technical, Communication, Confidence, Problem Solving, Consistency, and Learning Ability.",
        icon: Dna,
        color: "from-indigo-500 to-blue-500",
        features: ["Radar Chart", "Skill Heatmap", "Strength Summary"],
    },
    {
        step: 8,
        title: "Growth Roadmap Suggested",
        description:
            "Based on your Skill Genome, receive a personalized growth roadmap with custom learning paths, communication exercises, mock interview feedback, and suggested projects.",
        icon: Map,
        color: "from-teal-500 to-cyan-500",
        features: ["Learning Path", "Communication Drills", "Project Ideas"],
    },
];

const mlModels = [
    {
        name: "MediaPipe Holistic",
        description: "Body, face, hands, and iris landmark detection by Google",
        icon: ScanFace,
    },
    {
        name: "Eye Gaze Estimation",
        description: "Real-time iris direction and focus analysis model",
        icon: Eye,
    },
    {
        name: "Facial Expression Classifier",
        description: "Detects confidence, nervousness, and engagement cues",
        icon: Brain,
    },
    {
        name: "Speech-to-Text Model",
        description: "Transcribes and analyzes spoken answers for clarity",
        icon: Mic,
    },
    {
        name: "Confidence Scoring Model",
        description: "Multi-signal fusion of posture, speech, and accuracy data",
        icon: Award,
    },
];

const benefits = [
    {
        icon: Rocket,
        title: "10x Faster Growth",
        description: "Focused learning paths accelerate your skill development",
    },
    {
        icon: Shield,
        title: "Bias-Free Evaluation",
        description: "No college, appearance, or demographic bias — skills only",
    },
    {
        icon: Users,
        title: "Community Driven",
        description: "Learn from peers and contribute to the skill ecosystem",
    },
    {
        icon: Award,
        title: "Verified Skills",
        description: "Get recognized for your competencies with verified badges",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const HowItWorks = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-16">
                <NeuralBackground />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>8-Step System Architecture</span>
                        </motion.div>

                        <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
                            How{" "}
                            <span className="text-gradient-pink">Skill Genome</span>
                            <br />
                            Works
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                            From login to growth roadmap — see how our AI evaluates candidates
                            holistically using resume analysis, live interviews, body language, and communication feedback.
                        </p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link to="/build">
                                <Button variant="genome" size="xl" className="group">
                                    Start Building
                                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Link to="/interview">
                                <Button variant="genome-outline" size="xl" className="group">
                                    Try Interview
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Floating Icons */}
                <motion.div
                    animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-[10%] top-1/3 hidden lg:block"
                >
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center backdrop-blur-sm">
                        <Code className="w-8 h-8 text-blue-400" />
                    </div>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute right-[10%] top-1/2 hidden lg:block"
                >
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center backdrop-blur-sm">
                        <Brain className="w-10 h-10 text-primary" />
                    </div>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-[20%] bottom-1/4 hidden lg:block"
                >
                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center backdrop-blur-sm">
                        <FileText className="w-7 h-7 text-green-400" />
                    </div>
                </motion.div>
            </section>

            {/* 8-Step Architecture Section */}
            <section ref={containerRef} className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="font-display text-4xl font-bold text-foreground mb-4">
                            System Architecture
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Eight powerful steps that map your true skill DNA
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Connection Line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 hidden lg:block" />

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={containerVariants}
                            className="space-y-16 lg:space-y-24"
                        >
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isEven = index % 2 === 0;

                                return (
                                    <motion.div
                                        key={step.step}
                                        variants={itemVariants}
                                        transition={{ duration: 0.6 }}
                                        className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${isEven ? "" : "lg:flex-row-reverse"
                                            }`}
                                    >
                                        {/* Content */}
                                        <div className="flex-1 text-center lg:text-left">
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className="relative group"
                                            >
                                                <div
                                                    className={`absolute -inset-4 bg-gradient-to-r ${step.color} rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`}
                                                />
                                                <div className="relative genome-card">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div
                                                            className={`w-12 h-12 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg`}
                                                        >
                                                            <Icon className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <span className="text-sm text-primary font-medium">
                                                                Step {step.step}
                                                            </span>
                                                            <h3 className="font-display text-2xl font-bold text-foreground">
                                                                {step.title}
                                                            </h3>
                                                        </div>
                                                    </div>

                                                    <p className="text-muted-foreground mb-6">
                                                        {step.description}
                                                    </p>

                                                    <div className="flex flex-wrap gap-2">
                                                        {step.features.map((feature) => (
                                                            <span
                                                                key={feature}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm"
                                                            >
                                                                <CheckCircle className="w-3.5 h-3.5" />
                                                                {feature}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Step Number Circle */}
                                        <div className="relative hidden lg:flex items-center justify-center">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                className={`w-20 h-20 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-3xl font-display font-bold text-white shadow-lg shadow-primary/20 relative z-10`}
                                            >
                                                {step.step}
                                            </motion.div>
                                            <div
                                                className={`absolute w-28 h-28 rounded-full bg-gradient-to-r ${step.color} opacity-20 blur-xl`}
                                            />
                                        </div>

                                        {/* Spacer for layout */}
                                        <div className="flex-1 hidden lg:block" />
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ML Models Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-500/5 to-background" />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-display text-4xl font-bold text-foreground mb-4">
                            🧪 ML Models Used
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Powered by cutting-edge machine learning for accurate, real-time analysis
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 max-w-6xl mx-auto"
                    >
                        {mlModels.map((model) => {
                            const Icon = model.icon;
                            return (
                                <motion.div
                                    key={model.name}
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                    className="genome-card text-center"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4 border border-primary/10">
                                        <Icon className="w-7 h-7 text-primary" />
                                    </div>
                                    <h3 className="font-display font-semibold text-sm text-foreground mb-2">
                                        {model.name}
                                    </h3>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        {model.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 relative overflow-hidden">
                <motion.div
                    style={{ y }}
                    className="absolute -right-64 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
                />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-display text-4xl font-bold text-foreground mb-4">
                            Why Choose Skill Genome?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Built for developers who want to accelerate their growth
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {benefits.map((benefit) => {
                            const Icon = benefit.icon;
                            return (
                                <motion.div
                                    key={benefit.title}
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                    className="genome-card text-center"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-7 h-7 text-primary" />
                                    </div>
                                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        {benefit.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-3xl bg-card border border-border p-12 md:p-16 text-center overflow-hidden"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-2xl" />

                        <div className="relative z-10">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
                            >
                                <Dna className="w-10 h-10 text-primary" />
                            </motion.div>

                            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                                Ready to Map Your Skill DNA?
                            </h2>

                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
                                Skill Genome doesn't judge you by your past — it maps your future.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/build">
                                    <Button variant="genome" size="xl" className="group">
                                        Build Your Skill Genome
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                                <Link to="/interview">
                                    <Button variant="genome-outline" size="xl" className="group">
                                        Start Interview
                                        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HowItWorks;
