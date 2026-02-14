import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NeuralBackground } from "@/components/NeuralBackground";
import { GyaniXPreview } from "@/components/GyaniXPreview";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import TextReveal from "@/components/ui/TextReveal";
import GlowCard from "@/components/ui/GlowCard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import {
  Dna,
  Target,
  Brain,
  TrendingUp,
  Zap,
  ChevronRight,
  Sparkles,
  GitBranch,
  CheckCircle,
  Eye,
  Smile,
  Move,
  Mic,
  FileText,
  Code,
  BarChart3,
  Shield,
  Users,
  Award,
  Rocket,
  MessageSquare,
  Camera,
  ScanFace,
  Hand,
  BookOpen,
  ArrowRight,
} from "lucide-react";

// 7 Key Features from README
const keyFeatures = [
  {
    icon: Camera,
    title: "AI Interview Engine",
    description:
      "Real-time webcam-based interviews with AI-driven adaptive questions tailored to your skills",
    gradient: "from-blue-500 to-cyan-500",
    bg: "from-blue-500/10 to-cyan-500/10",
  },
  {
    icon: Eye,
    title: "Body Language Analysis",
    description:
      "Eye contact tracking, facial expressions, head pose estimation, and confidence detection",
    gradient: "from-violet-500 to-purple-500",
    bg: "from-violet-500/10 to-purple-500/10",
  },
  {
    icon: Mic,
    title: "Communication Evaluation",
    description:
      "Speech clarity, filler word detection, speaking pace analysis, and fluency scoring",
    gradient: "from-pink-500 to-rose-500",
    bg: "from-pink-500/10 to-rose-500/10",
  },
  {
    icon: GitBranch,
    title: "Resume & GitHub Verification",
    description:
      "NLP resume parsing + GitHub analysis to compare claimed skills vs actual work",
    gradient: "from-green-500 to-emerald-500",
    bg: "from-green-500/10 to-emerald-500/10",
  },
  {
    icon: Dna,
    title: "Skill Genome Report",
    description:
      "Radar chart, skill heatmap, and strength & weakness summary of your true skill DNA",
    gradient: "from-orange-500 to-amber-500",
    bg: "from-orange-500/10 to-amber-500/10",
  },
  {
    icon: Shield,
    title: "Bias-Free Evaluation",
    description:
      "No college name bias, no appearance-based judgment — focuses only on skills & performance",
    gradient: "from-teal-500 to-cyan-500",
    bg: "from-teal-500/10 to-cyan-500/10",
  },
  {
    icon: Rocket,
    title: "Growth Roadmap",
    description:
      "Personalized learning path, mock interview feedback, and project suggestions",
    gradient: "from-purple-500 to-violet-500",
    bg: "from-purple-500/10 to-violet-500/10",
  },
];

// System Architecture Steps (from README)
const architectureSteps = [
  { step: 1, title: "Log In", icon: Users },
  { step: 2, title: "Resume & GitHub Parsed", icon: FileText },
  { step: 3, title: "AI Interview Starts", icon: Camera },
  { step: 4, title: "Body Language Analysis", icon: ScanFace },
  { step: 5, title: "Communication Eval", icon: Mic },
  { step: 6, title: "Scores Aggregated", icon: BarChart3 },
  { step: 7, title: "Skill Genome Generated", icon: Dna },
  { step: 8, title: "Growth Roadmap", icon: TrendingUp },
];

// Body language tracking capabilities
const bodyLanguageCapabilities = [
  { icon: Eye, label: "Eye Contact", detail: "Iris position & gaze direction tracking" },
  { icon: Smile, label: "Facial Expressions", detail: "Blendshape analysis for emotion detection" },
  { icon: Move, label: "Head Stability", detail: "Yaw, pitch & roll variance measurement" },
  { icon: Hand, label: "Gesture Detection", detail: "Hand movement and posture analysis" },
];

// Communication analysis metrics
const commMetrics = [
  { label: "Speech Clarity", value: 92 },
  { label: "Fluency Score", value: 87 },
  { label: "Filler Words", value: 3 },
  { label: "Confidence", value: 89 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <NeuralBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

        {/* Morphing Blob Backgrounds */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 blob-morph blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/8 blob-morph blur-3xl pointer-events-none" style={{ animationDelay: '-4s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/5 blob-morph blur-3xl pointer-events-none" style={{ animationDelay: '-2s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-shimmer"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered • Bias-Free • Skill-First Hiring</span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              <TextReveal text="Map Your True" delay={0.3} className="justify-center" />
              <span className="text-gradient-animated">Skill DNA.</span>
              <br />
              <TextReveal text="Evolve Your Future." delay={0.6} className="justify-center text-gradient-animated" />
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              AI-driven interview analysis, body language detection, resume verification, and personalized growth —
              all in one platform that evaluates you fairly.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/build">
                <Button variant="genome" size="xl" className="group">
                  Build My GyaniX
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/interview">
                <Button variant="genome-outline" size="xl" className="group">
                  <Camera className="w-5 h-5 mr-1" />
                  Start AI Interview
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 8, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-10 top-1/3 hidden lg:block"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center backdrop-blur-sm glow-card-border">
              <GitBranch className="w-8 h-8 text-primary" />
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 12, 0], rotate: [0, -6, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-10 top-1/2 hidden lg:block"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center backdrop-blur-sm glow-card-border">
              <Brain className="w-10 h-10 text-primary" />
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0], rotate: [0, -4, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[15%] top-1/4 hidden xl:block"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center backdrop-blur-sm">
              <Code className="w-7 h-7 text-purple-400" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ 7 KEY FEATURES GRID ═══════════════ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Everything You Need for{" "}
              <span className="text-gradient-pink">Fair Evaluation</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A holistic platform that goes beyond resumes to map your true capabilities
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {keyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group"
                >
                  <GlowCard className="h-full">
                    <div className="p-6 h-full">
                      <motion.div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.bg} flex items-center justify-center mb-4 border border-border/30`}
                        whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                      >
                        <Icon className="w-6 h-6 text-primary" />
                      </motion.div>
                      <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </GlowCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ AI INTERVIEW ENGINE SPOTLIGHT ═══════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-blue-500/5 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
                <Camera className="w-3.5 h-3.5" />
                Core Feature
              </div>
              <h2 className="font-display text-4xl font-bold text-foreground mb-6">
                AI Interview{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Engine
                </span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Real-time webcam-based interviews where AI asks adaptive technical & behavioral questions.
                MediaPipe Holistic tracks your body language while NLP evaluates your communication —
                generating comprehensive confidence scores.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Adaptive questions based on your extracted GyaniX",
                  "Real-time body language tracking via MediaPipe",
                  "Eye contact, facial expression & posture analysis",
                  "Communication clarity & confidence scoring",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/interview">
                <Button variant="genome" size="lg" className="group">
                  Try AI Interview
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Interview Preview Card */}
              <div className="relative group">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/40 to-cyan-500/40 rounded-2xl opacity-60 blur-sm" />
                <div className="relative bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 overflow-hidden">
                  {/* Simulated webcam area */}
                  <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 relative flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/40 flex items-center justify-center mx-auto mb-3">
                        <ScanFace className="w-10 h-10 text-blue-400" />
                      </div>
                      <p className="text-sm text-gray-400">AI-Powered Face & Body Analysis</p>
                    </div>
                    {/* Corners overlay */}
                    <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-blue-400/60 rounded-tl-lg" />
                    <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-blue-400/60 rounded-tr-lg" />
                    <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-blue-400/60 rounded-bl-lg" />
                    <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-blue-400/60 rounded-br-lg" />
                    {/* Live badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/80 text-white text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      LIVE
                    </div>
                  </div>
                  {/* Metrics bar */}
                  <div className="p-4 grid grid-cols-3 gap-3">
                    {[
                      { label: "Eye Contact", value: "87%", color: "text-blue-400" },
                      { label: "Expression", value: "92%", color: "text-violet-400" },
                      { label: "Stability", value: "95%", color: "text-cyan-400" },
                    ].map((m) => (
                      <div key={m.label} className="text-center p-2 rounded-xl bg-muted/30">
                        <div className={`text-lg font-bold ${m.color}`}>{m.value}</div>
                        <div className="text-xs text-muted-foreground">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ BODY LANGUAGE & COMMUNICATION ═══════════════ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-violet-500/5 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Beyond Words:{" "}
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                Complete Analysis
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We evaluate how you think & communicate, not just what you say
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Body Language Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative group h-full">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/30 to-purple-500/30 rounded-2xl opacity-50 blur-sm" />
                <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500/20 to-purple-500/20 flex items-center justify-center border border-violet-500/30">
                      <ScanFace className="w-5 h-5 text-violet-400" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      Body Language Analysis
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {bodyLanguageCapabilities.map((cap, i) => {
                      const Icon = cap.icon;
                      return (
                        <motion.div
                          key={cap.label}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border/30 hover:border-violet-500/30 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-violet-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">{cap.label}</div>
                            <div className="text-xs text-muted-foreground">{cap.detail}</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <p className="mt-6 text-xs text-muted-foreground">
                    Powered by <span className="text-violet-400 font-medium">MediaPipe Holistic</span> —
                    detects nervous patterns like face touching, looking away, and slouching
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Communication Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="relative group h-full">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-pink-500/30 to-rose-500/30 rounded-2xl opacity-50 blur-sm" />
                <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500/20 to-rose-500/20 flex items-center justify-center border border-pink-500/30">
                      <MessageSquare className="w-5 h-5 text-pink-400" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      Communication Evaluation
                    </h3>
                  </div>

                  {/* Simulated metrics */}
                  <div className="space-y-4 mb-6">
                    {commMetrics.map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-foreground">{item.label}</span>
                          <span className="text-sm font-bold text-pink-400">
                            {item.label === "Filler Words" ? `${item.value} detected` : `${item.value}%`}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500"
                            initial={{ width: 0 }}
                            whileInView={{ width: item.label === "Filler Words" ? "8%" : `${item.value}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Filler Detection", detail: '"uh", "um", "like"' },
                      { label: "Speaking Pace", detail: "Words per minute" },
                      { label: "Pause Analysis", detail: "Strategic vs nervous" },
                      { label: "Improvement Tips", detail: "Personalized feedback" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="p-2.5 rounded-lg bg-muted/30 border border-border/30"
                      >
                        <div className="text-xs font-medium text-foreground">{item.label}</div>
                        <div className="text-[10px] text-muted-foreground">{item.detail}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SKILL GENOME REPORT ═══════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <GyaniXPreview />

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium mb-6">
                <Dna className="w-3.5 h-3.5" />
                USP
              </div>
              <h2 className="font-display text-4xl font-bold text-foreground mb-6">
                Your{" "}
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  Skill Genome
                </span>{" "}
                Report
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Each candidate receives a comprehensive Skill Genome Map covering every dimension of their capabilities.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Brain, label: "Technical Skills", color: "text-blue-400" },
                  { icon: MessageSquare, label: "Communication", color: "text-pink-400" },
                  { icon: Shield, label: "Confidence", color: "text-green-400" },
                  { icon: Target, label: "Problem Solving", color: "text-purple-400" },
                  { icon: BarChart3, label: "Consistency", color: "text-cyan-400" },
                  { icon: TrendingUp, label: "Learning Ability", color: "text-orange-400" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border/40">
                      <Icon className={`w-5 h-5 ${item.color}`} />
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                    </div>
                  );
                })}
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                Displayed as <span className="text-primary font-medium">radar charts</span>,{" "}
                <span className="text-primary font-medium">skill heatmaps</span>, and{" "}
                <span className="text-primary font-medium">strength & weakness summaries</span>.
              </p>

              <Link to="/dashboard">
                <Button variant="genome" size="lg" className="group">
                  Explore Dashboard
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ BIAS-FREE EVALUATION ═══════════════ */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute -inset-[1px] bg-gradient-to-r from-teal-500/30 via-cyan-500/30 to-blue-500/30 rounded-3xl blur-sm" />
            <div className="relative bg-card/90 backdrop-blur-xl rounded-3xl border border-border/50 p-12 md:p-16">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium mb-6">
                    <Shield className="w-3.5 h-3.5" />
                    Fair Hiring
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Bias-Free{" "}
                    <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                      Evaluation
                    </span>
                  </h2>
                  <p className="text-muted-foreground text-lg mb-8">
                    Skill Genome doesn't judge you by your past — it maps your future.
                    No college name bias, no appearance-based judgment.
                  </p>

                  <div className="space-y-4">
                    {[
                      { check: true, text: "Evaluates performance, skills & improvement trajectory" },
                      { check: true, text: "No college name or university tier bias" },
                      { check: true, text: "No appearance-based or demographic judgment" },
                      { check: true, text: "Provides growth, not just rejection" },
                    ].map((item) => (
                      <div key={item.text} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { emoji: "🎯", title: "Performance", desc: "Measured by actual responses" },
                    { emoji: "💡", title: "Skills", desc: "Verified through code & projects" },
                    { emoji: "📈", title: "Growth", desc: "Improvement trajectory matters" },
                    { emoji: "🧬", title: "Potential", desc: "Learning ability & adaptability" },
                  ].map((card) => (
                    <motion.div
                      key={card.title}
                      whileHover={{ y: -4 }}
                      className="p-5 rounded-xl bg-muted/30 border border-border/40 text-center hover:border-teal-500/30 transition-colors"
                    >
                      <div className="text-3xl mb-2">{card.emoji}</div>
                      <div className="font-semibold text-foreground text-sm mb-1">{card.title}</div>
                      <div className="text-xs text-muted-foreground">{card.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ SYSTEM ARCHITECTURE (HOW IT WORKS) ═══════════════ */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From login to growth roadmap — your complete evaluation journey
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {architectureSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <div className="relative bg-card/60 backdrop-blur-xl rounded-xl border border-border/50 p-5 text-center transition-all duration-300 hover:border-primary/30">
                    <div className="absolute -top-3 -left-1 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {step.step}
                    </div>
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {step.title}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ GROWTH ROADMAP ═══════════════ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-500/5 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-6">
                <Rocket className="w-3.5 h-3.5" />
                Growth
              </div>
              <h2 className="font-display text-4xl font-bold text-foreground mb-6">
                Personalized{" "}
                <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                  Growth Roadmap
                </span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Don't just get evaluated — get a path forward. Every candidate receives a tailored
                improvement plan based on their Skill Genome analysis.
              </p>

              <ul className="space-y-4">
                {[
                  "Custom learning path based on your skill gaps",
                  "Communication exercises to boost clarity",
                  "Mock interview feedback & practice sessions",
                  "Suggested projects & topics for growth",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link to="/tasks">
                  <Button variant="genome" size="lg" className="group">
                    <BookOpen className="w-5 h-5" />
                    View Daily Tasks
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Simulated Roadmap Cards */}
              <div className="space-y-4">
                {[
                  { week: "Week 1", title: "Foundation Strengthening", tasks: 5, progress: 100, color: "from-green-500 to-emerald-500" },
                  { week: "Week 2", title: "Communication Mastery", tasks: 4, progress: 65, color: "from-purple-500 to-violet-500" },
                  { week: "Week 3", title: "System Design Thinking", tasks: 6, progress: 20, color: "from-blue-500 to-cyan-500" },
                  { week: "Week 4", title: "Mock Interview Sprint", tasks: 3, progress: 0, color: "from-orange-500 to-amber-500" },
                ].map((week, i) => (
                  <motion.div
                    key={week.week}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative group"
                  >
                    <div className="bg-card/80 backdrop-blur-xl rounded-xl border border-border/50 p-5 hover:border-primary/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className={`text-xs font-bold bg-gradient-to-r ${week.color} bg-clip-text text-transparent`}>
                            {week.week}
                          </span>
                          <h4 className="font-semibold text-foreground text-sm">{week.title}</h4>
                        </div>
                        <span className="text-xs text-muted-foreground">{week.tasks} tasks</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${week.color}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${week.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS + CTA ═══════════════ */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {[
              { value: 10000, suffix: "+", label: "Interviews Completed", color: "from-primary to-purple-500" },
              { value: 94, suffix: "%", label: "Success Rate", color: "from-purple-500 to-pink-500" },
              { value: 500, suffix: "+", label: "Companies Hiring", color: "from-pink-500 to-orange-500" },
              { value: 50000, suffix: "+", label: "Skills Mapped", color: "from-orange-500 to-amber-500" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="text-center p-6 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className={`text-3xl font-bold font-display bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2} />
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl bg-card border border-border p-12 md:p-16 text-center overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Ready to Map Your <span className="text-gradient-pink">Skill DNA</span>?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
                Join thousands of candidates being evaluated fairly —
                no bias, no guesswork, just your true potential.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/build">
                  <Button variant="genome" size="xl" className="group">
                    Start Your Journey
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="genome-outline" size="xl">
                    Learn More
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

export default Index;
