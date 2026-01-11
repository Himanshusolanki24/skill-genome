import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NeuralBackground } from "@/components/NeuralBackground";
import { SkillGenomePreview } from "@/components/SkillGenomePreview";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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
} from "lucide-react";

const valueProps = [
  {
    icon: Dna,
    title: "Skill Mapping",
    description: "Visualize your entire skill profile as an interconnected genome",
  },
  {
    icon: Target,
    title: "Weakness Detection",
    description: "AI identifies gaps and prioritizes areas for improvement",
  },
  {
    icon: Zap,
    title: "Daily Micro-Tasks",
    description: "Bite-sized challenges tailored to your growth trajectory",
  },
  {
    icon: TrendingUp,
    title: "Career Alignment",
    description: "Match your skills to real career paths and opportunities",
  },
];

const howItWorks = [
  { step: 1, title: "Assessment", icon: Brain },
  { step: 2, title: "Genome Map", icon: Dna },
  { step: 3, title: "Weak Skills", icon: Target },
  { step: 4, title: "Daily Tasks", icon: Zap },
  { step: 5, title: "Growth", icon: TrendingUp },
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <NeuralBackground />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Skill Evolution</span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Visualize Your Skills.
              <br />
              <span className="text-gradient-pink">Evolve Your Future.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Map your skills as a living genome, identify weaknesses with AI precision,
              and grow daily through personalized micro-tasks.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/build">
                <Button variant="genome" size="xl" className="group">
                  Build My Skill Genome
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="genome-outline" size="xl">
                  See How It Works
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-10 top-1/3 hidden lg:block"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <GitBranch className="w-8 h-8 text-primary" />
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-10 top-1/2 hidden lg:block"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Brain className="w-10 h-10 text-primary" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {valueProps.map((prop, index) => {
              const Icon = prop.icon;
              return (
                <motion.div
                  key={prop.title}
                  variants={itemVariants}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="genome-card h-full">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {prop.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {prop.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
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
              From assessment to mastery in five simple steps
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2"
          >
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  variants={itemVariants}
                  className="flex items-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-3 relative group hover:border-primary/50 transition-colors">
                      <Icon className="w-7 h-7 text-primary" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                        {step.step}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {step.title}
                    </span>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <ChevronRight className="w-6 h-6 text-muted-foreground mx-2 hidden md:block" />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Live Preview */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-4xl font-bold text-foreground mb-6">
                Your Skills,{" "}
                <span className="text-gradient-pink">Visualized</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                See your entire skill profile as an interconnected genome.
                Identify strengths, spot weaknesses, and track your evolution
                over time with beautiful, interactive visualizations.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time skill proficiency tracking",
                  "AI-powered weakness identification",
                  "Personalized improvement recommendations",
                  "Career path alignment insights",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/dashboard">
                  <Button variant="genome" size="lg">
                    Explore Dashboard
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <SkillGenomePreview />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl bg-card border border-border p-12 md:p-16 text-center overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Ready to Evolve?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
                Join thousands of learners who are transforming their skills
                daily with AI-powered micro-tasks and personalized growth paths.
              </p>
              <Link to="/dashboard">
                <Button variant="genome" size="xl" className="group">
                  Start Your Journey
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
