import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NeuralBackground } from "@/components/NeuralBackground";
import { useAuth } from "@/contexts/AuthContext";
import {
    Dna,
    Sparkles,
    Loader2,
    AlertCircle,
    Shield,
    Zap,
    Target,
} from "lucide-react";

// Google Icon Component
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
    </svg>
);

// LinkedIn Icon Component
const LinkedInIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const Auth = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<"google" | "linkedin" | null>(null);

    const { user, signInWithGoogle, signInWithLinkedIn, isConfigured } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    const handleGoogleAuth = async () => {
        setError(null);
        setIsLoading("google");
        const { error } = await signInWithGoogle();
        if (error) {
            setError(error.message);
            setIsLoading(null);
        }
    };

    const handleLinkedInAuth = async () => {
        setError(null);
        setIsLoading("linkedin");
        const { error } = await signInWithLinkedIn();
        if (error) {
            setError(error.message);
            setIsLoading(null);
        }
    };

    const features = [
        { icon: Zap, text: "AI-Powered Skill Analysis" },
        { icon: Target, text: "Personalized Learning Paths" },
        { icon: Shield, text: "Secure & Private" },
    ];

    return (
        <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
            <NeuralBackground />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />

            {/* Animated Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.15, 0.3, 0.15],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl"
            />

            <div className="relative z-10 w-full max-w-md px-4 py-8">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <Link to="/" className="inline-flex items-center gap-2 group">
                        <div className="relative">
                            <Dna className="w-10 h-10 text-primary transition-transform duration-300 group-hover:rotate-12" />
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <span className="font-display font-bold text-2xl text-foreground">
                            Skill<span className="text-primary">Genome</span>
                        </span>
                    </Link>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative group"
                >
                    {/* Animated gradient border */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-2xl opacity-75 blur-sm group-hover:opacity-100 transition duration-500" />
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-2xl opacity-50 animate-pulse" />

                    <div className="relative bg-card/95 backdrop-blur-xl rounded-2xl border border-border/50 p-8 overflow-hidden">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-tr-full" />

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>AI-Powered Growth Platform</span>
                                </motion.div>

                                <h1 className="font-display text-3xl font-bold text-foreground mb-3">
                                    Welcome to GyaniX
                                </h1>
                                <p className="text-muted-foreground">
                                    Sign in to unlock your potential with AI-driven skill evolution
                                </p>
                            </div>

                            {/* Supabase not configured warning */}
                            {!isConfigured && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
                                >
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-amber-500">Setup Required</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Supabase is not configured. Add your credentials to .env file.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                                >
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-400">{error}</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* OAuth Buttons */}
                            <div className="space-y-4">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        onClick={handleGoogleAuth}
                                        disabled={!isConfigured || isLoading !== null}
                                        className="w-full h-14 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-xl transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading === "google" ? (
                                            <Loader2 className="w-5 h-5 animate-spin mr-3" />
                                        ) : (
                                            <GoogleIcon />
                                        )}
                                        <span className="ml-3 text-base">Continue with Google</span>
                                    </Button>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        onClick={handleLinkedInAuth}
                                        disabled={!isConfigured || isLoading !== null}
                                        className="w-full h-14 bg-[#0A66C2] hover:bg-[#004182] text-white font-medium rounded-xl transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading === "linkedin" ? (
                                            <Loader2 className="w-5 h-5 animate-spin mr-3" />
                                        ) : (
                                            <LinkedInIcon />
                                        )}
                                        <span className="ml-3 text-base">Continue with LinkedIn</span>
                                    </Button>
                                </motion.div>
                            </div>

                            {/* Features List */}
                            <div className="mt-8 pt-6 border-t border-border/50">
                                <div className="grid grid-cols-3 gap-4">
                                    {features.map((feature, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            className="text-center"
                                        >
                                            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <feature.icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <p className="text-xs text-muted-foreground">{feature.text}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Terms */}
                            <p className="text-center text-xs text-muted-foreground mt-6">
                                By signing in, you agree to our{" "}
                                <Link to="/terms" className="text-primary hover:underline">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link to="/privacy" className="text-primary hover:underline">
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Auth;
