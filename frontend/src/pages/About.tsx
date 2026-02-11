import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { NeuralBackground } from "@/components/NeuralBackground";
import {
    Dna,
    Brain,
    CheckCircle,
    ArrowRight,
    Sparkles,
    Github,
    Linkedin,
    Code,
    Server,
    Cpu,
    ChevronRight,
    Shield,
    Eye,
    TrendingUp,
    Heart,
} from "lucide-react";

const teamMembers = [
    {
        name: "Mayur Khanna",
        role: "AI & Full-Stack Lead",
        avatar: "MK",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        name: "Himanshu Solanki",
        role: "Backend & ML Engineer",
        avatar: "HS",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        name: "Vedansh Mittal",
        role: "Frontend & Design",
        avatar: "VM",
        gradient: "from-orange-500 to-yellow-500",
    },
    {
        name: "Ishika Pandey",
        role: "AI Research & NLP",
        avatar: "IP",
        gradient: "from-green-500 to-emerald-500",
    },
];

const uniquePoints = [
    {
        icon: CheckCircle,
        text: "Combines AI Interview + Resume + GitHub",
    },
    {
        icon: Eye,
        text: "Focuses on how you think & communicate",
    },
    {
        icon: Shield,
        text: "Eliminates traditional hiring bias",
    },
    {
        icon: TrendingUp,
        text: "Provides growth, not just rejection",
    },
];

const techStack = [
    {
        category: "Frontend",
        icon: Code,
        color: "from-blue-500 to-cyan-500",
        items: ["React + TypeScript", "Vite", "Tailwind CSS", "Framer Motion", "Recharts", "ShadCN/Radix UI"],
    },
    {
        category: "Backend",
        icon: Server,
        color: "from-purple-500 to-pink-500",
        items: ["Node.js", "Express.js", "Supabase / PostgreSQL", "WebSockets", "REST APIs"],
    },
    {
        category: "AI / ML",
        icon: Cpu,
        color: "from-orange-500 to-yellow-500",
        items: ["MediaPipe Holistic", "Eye Gaze Estimation", "Facial Expression Classifier", "Speech-to-Text", "NLP for Resume & Speech"],
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const About = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-16">
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
                            <span>AI | Full-Stack | Future Tech</span>
                        </motion.div>

                        <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
                            About{" "}
                            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Skill Genome
                            </span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Skill Genome doesn't judge you by your past — it maps your future. 🔥
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Vision */}
            <section className="py-20 relative">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                            🚀 Our Vision
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                            Traditional hiring focuses too much on resumes and college names. Skill Genome changes the game by evaluating:
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="grid md:grid-cols-3 gap-6 mb-16"
                    >
                        {[
                            { emoji: "📄", label: "What you claim", sub: "Resume" },
                            { emoji: "💻", label: "What you built", sub: "GitHub & Projects" },
                            { emoji: "🎤", label: "How you perform", sub: "AI-powered live interview" },
                        ].map((item) => (
                            <motion.div
                                key={item.label}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="genome-card text-center"
                            >
                                <div className="text-4xl mb-3">{item.emoji}</div>
                                <h3 className="font-semibold text-foreground mb-1">{item.label}</h3>
                                <p className="text-sm text-muted-foreground">{item.sub}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Why Unique */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <h3 className="font-display text-2xl font-bold text-foreground text-center mb-8">
                            🏆 Why Skill Genome is Unique
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {uniquePoints.map((point) => {
                                const Icon = point.icon;
                                return (
                                    <motion.div
                                        key={point.text}
                                        whileHover={{ x: 4 }}
                                        className="flex items-center gap-3 p-4 rounded-xl bg-card/60 border border-border/50 hover:border-primary/30 transition-all"
                                    >
                                        <Icon className="w-5 h-5 text-green-400 shrink-0" />
                                        <span className="text-sm font-medium text-foreground">{point.text}</span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-20 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                            🧠 Tech Stack
                        </h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
                    >
                        {techStack.map((stack) => {
                            const Icon = stack.icon;
                            return (
                                <motion.div
                                    key={stack.category}
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                    className="genome-card"
                                >
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stack.color} flex items-center justify-center mb-4`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="font-display font-bold text-lg text-foreground mb-3">
                                        {stack.category}
                                    </h3>
                                    <ul className="space-y-2">
                                        {stack.items.map((item) => (
                                            <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20 relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                            👨‍💻 Meet the Team
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            AI | Full-Stack | Future Tech Enthusiasts
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
                    >
                        {teamMembers.map((member) => (
                            <motion.div
                                key={member.name}
                                variants={itemVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="genome-card text-center"
                            >
                                <div
                                    className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-2xl font-display font-bold mb-4 shadow-lg`}
                                >
                                    {member.avatar}
                                </div>
                                <h3 className="font-semibold text-foreground text-sm mb-1">{member.name}</h3>
                                <p className="text-xs text-muted-foreground">{member.role}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* License + CTA */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-3xl bg-card border border-border p-12 md:p-16 text-center overflow-hidden max-w-4xl mx-auto"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
                            >
                                <Dna className="w-10 h-10 text-primary" />
                            </motion.div>

                            <p className="text-sm text-muted-foreground mb-2">📜 Licensed under MIT</p>

                            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                                Ready to Map Your Future?
                            </h2>

                            <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-10">
                                This ensures fair, skill-first, bias-free hiring.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/build">
                                    <Button variant="genome" size="xl" className="group">
                                        Build Your Skill Genome
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                                <Link to="/how-it-works">
                                    <Button variant="genome-outline" size="xl" className="group">
                                        How It Works
                                        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            </div>

                            <p className="mt-8 text-sm text-muted-foreground flex items-center justify-center gap-1">
                                Built with <Heart className="w-4 h-4 text-pink-400 fill-pink-400" /> for continuous learners
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
