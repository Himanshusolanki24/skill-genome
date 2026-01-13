import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NeuralBackground } from "@/components/NeuralBackground";
import { useAuth } from "@/contexts/AuthContext";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    User,
    Dna,
    ArrowRight,
    Sparkles,
    Loader2,
    AlertCircle,
} from "lucide-react";

type AuthMode = "login" | "register";

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

// LinkedIn Icon Component - Using white fill for visibility on blue background
const LinkedInIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const Auth = () => {
    const [mode, setMode] = useState<AuthMode>("login");
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const { user, signIn, signUp, signInWithGoogle, signInWithLinkedIn, isConfigured } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsSubmitting(true);

        try {
            if (mode === "register") {
                const { error } = await signUp(email, password, name);
                if (error) {
                    setError(error.message);
                } else {
                    setSuccessMessage("Account created! Redirecting to complete your profile...");
                    setTimeout(() => {
                        navigate("/dashboard");
                    }, 1500);
                }
            } else {
                const { error } = await signIn(email, password);
                if (error) {
                    setError(error.message);
                } else {
                    navigate("/dashboard");
                }
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleAuth = async () => {
        setError(null);
        const { error } = await signInWithGoogle();
        if (error) {
            setError(error.message);
        }
    };

    const handleLinkedInAuth = async () => {
        setError(null);
        const { error } = await signInWithLinkedIn();
        if (error) {
            setError(error.message);
        }
    };

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
                className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl"
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

                {/* Main Card - Matching BuildGenome style */}
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative group"
                >
                    {/* Animated gradient border */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-primary via-primary/50 to-primary rounded-2xl opacity-75 blur-sm group-hover:opacity-100 transition duration-500" />
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-primary via-primary/50 to-primary rounded-2xl opacity-50 animate-pulse" />

                    <div className="relative bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 p-8 overflow-hidden">
                        <div className="relative z-10">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4"
                                >
                                    <Sparkles className="w-3 h-3" />
                                    <span>AI-Powered Growth</span>
                                </motion.div>

                                <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                                    {mode === "login" ? "Welcome Back" : "Create Account"}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {mode === "login"
                                        ? "Sign in to continue your skill evolution"
                                        : "Start your journey to skill mastery"}
                                </p>
                            </div>

                            {/* Supabase not configured warning */}
                            {!isConfigured && (
                                <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-amber-500">Setup Required</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Supabase is not configured. Add your credentials to .env file.
                                            </p>
                                        </div>
                                    </div>
                                </div>
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

                            {/* Success Message */}
                            {successMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20"
                                >
                                    <p className="text-sm text-green-400">{successMessage}</p>
                                </motion.div>
                            )}

                            {/* Mode Toggle */}
                            <div className="flex bg-background/50 rounded-xl p-1 mb-6 border border-border">
                                <button
                                    onClick={() => {
                                        setMode("login");
                                        setError(null);
                                        setSuccessMessage(null);
                                    }}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${mode === "login"
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => {
                                        setMode("register");
                                        setError(null);
                                        setSuccessMessage(null);
                                    }}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${mode === "register"
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    Sign Up
                                </button>
                            </div>

                            {/* Form - Email/Password FIRST */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <AnimatePresence mode="wait">
                                    {mode === "register" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Full Name
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Enter your full name"
                                                    className="w-full bg-background/50 border border-border rounded-xl py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                            className="w-full bg-background/50 border border-border rounded-xl py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                            minLength={6}
                                            className="w-full bg-background/50 border border-border rounded-xl py-3 pl-12 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {mode === "login" && (
                                    <div className="flex justify-end">
                                        <Link
                                            to="/forgot-password"
                                            className="text-sm text-primary hover:text-primary/80 transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                )}

                                {/* Divider */}
                                <div className="relative flex items-center py-2">
                                    <div className="flex-1 border-t border-border"></div>
                                    <span className="px-4 text-sm text-muted-foreground">
                                        or continue with
                                    </span>
                                    <div className="flex-1 border-t border-border"></div>
                                </div>

                                {/* OAuth Buttons - Only Google and LinkedIn */}
                                <div className="grid grid-cols-2 gap-3">
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleGoogleAuth}
                                        disabled={!isConfigured}
                                        className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-xl transition-all duration-300 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <GoogleIcon />
                                        <span>Google</span>
                                    </motion.button>

                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleLinkedInAuth}
                                        disabled={!isConfigured}
                                        className="flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <LinkedInIcon />
                                        <span>LinkedIn</span>
                                    </motion.button>
                                </div>

                                {/* Sign In Button */}
                                <Button
                                    type="submit"
                                    variant="genome"
                                    size="lg"
                                    className="w-full group mt-2"
                                    disabled={isSubmitting || !isConfigured}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {mode === "login" ? "Signing In..." : "Creating Account..."}
                                        </>
                                    ) : (
                                        <>
                                            {mode === "login" ? "Sign In" : "Create Account"}
                                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            {/* Footer */}
                            <p className="text-center text-sm text-muted-foreground mt-6">
                                {mode === "login" ? (
                                    <>
                                        Don't have an account?{" "}
                                        <button
                                            onClick={() => {
                                                setMode("register");
                                                setError(null);
                                                setSuccessMessage(null);
                                            }}
                                            className="text-primary hover:text-primary/80 font-medium transition-colors"
                                        >
                                            Sign up
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{" "}
                                        <button
                                            onClick={() => {
                                                setMode("login");
                                                setError(null);
                                                setSuccessMessage(null);
                                            }}
                                            className="text-primary hover:text-primary/80 font-medium transition-colors"
                                        >
                                            Sign in
                                        </button>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Auth;

