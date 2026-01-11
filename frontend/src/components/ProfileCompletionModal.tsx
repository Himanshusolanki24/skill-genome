import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Sparkles, UserCircle, ArrowRight } from "lucide-react";

interface ProfileCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
    userName?: string;
}

export const ProfileCompletionModal = ({
    isOpen,
    onClose,
    onComplete,
    userName = "there",
}: ProfileCompletionModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="relative w-full max-w-md">
                            {/* Gradient border glow effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-2xl blur opacity-75 animate-pulse" />

                            {/* Modal content */}
                            <div className="relative bg-genome-card border border-white/10 rounded-2xl p-8 shadow-2xl">
                                {/* Close button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>

                                {/* Icon with gradient background */}
                                <div className="flex justify-center mb-6">
                                    <motion.div
                                        initial={{ rotate: -10 }}
                                        animate={{ rotate: 10 }}
                                        transition={{
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            duration: 2,
                                        }}
                                        className="relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-xl opacity-50" />
                                        <div className="relative w-20 h-20 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center border border-primary/30">
                                            <UserCircle className="w-10 h-10 text-primary" />
                                        </div>
                                        <div className="absolute -top-1 -right-1">
                                            <Sparkles className="w-6 h-6 text-yellow-400" />
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl font-display font-bold text-center text-foreground mb-2">
                                    Welcome, {userName}! 🎉
                                </h2>

                                {/* Description */}
                                <p className="text-center text-muted-foreground mb-6">
                                    Complete your profile to unlock personalized skill
                                    recommendations, connect with peers, and get the most out of
                                    Skill Genome.
                                </p>

                                {/* Benefits list */}
                                <div className="space-y-3 mb-8">
                                    {[
                                        "Get personalized skill recommendations",
                                        "Connect with students from your institute",
                                        "Track your learning journey",
                                        "Unlock achievement badges",
                                    ].map((benefit, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-purple-500" />
                                            <span className="text-sm text-foreground/80">
                                                {benefit}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* CTA Buttons */}
                                <div className="space-y-3">
                                    <Button
                                        variant="genome"
                                        size="lg"
                                        className="w-full group"
                                        onClick={onComplete}
                                    >
                                        Complete Profile
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>

                                    <button
                                        onClick={onClose}
                                        className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        I'll do this later
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProfileCompletionModal;
