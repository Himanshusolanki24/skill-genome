import { useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Eye, Smile, Move, AlertCircle, Loader2 } from "lucide-react";
import type { BodyLanguageMetrics } from "@/hooks/useMediaPipe";

interface BodyLanguageAnalyzerProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    metrics: BodyLanguageMetrics;
    isReady: boolean;
    isLoading: boolean;
    error: string | null;
}

const MetricBar = ({
    label,
    value,
    icon: Icon,
    color,
}: {
    label: string;
    value: number;
    icon: any;
    color: string;
}) => (
    <div className="flex items-center gap-3">
        <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}20` }}
        >
            <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-foreground truncate">
                    {label}
                </span>
                <span className="text-xs font-bold" style={{ color }}>
                    {value}%
                </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>
        </div>
    </div>
);

export const BodyLanguageAnalyzer = ({
    videoRef,
    canvasRef,
    metrics,
    isReady,
    isLoading,
    error,
}: BodyLanguageAnalyzerProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            <div className="relative group">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/40 to-blue-500/40 rounded-2xl opacity-50 blur-sm" />
                <div className="relative bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Camera className="w-4 h-4 text-violet-400" />
                            <span className="text-sm font-semibold text-foreground">
                                Body Language
                            </span>
                        </div>
                        {isReady && metrics.faceDetected && (
                            <span className="flex items-center gap-1.5 text-xs text-green-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                Live
                            </span>
                        )}
                        {isReady && !metrics.faceDetected && (
                            <span className="flex items-center gap-1.5 text-xs text-amber-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                No face
                            </span>
                        )}
                    </div>

                    {/* Video area */}
                    <div className="relative aspect-[4/3] bg-black/40">
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover mirror"
                            style={{ transform: "scaleX(-1)" }}
                            autoPlay
                            playsInline
                            muted
                        />
                        <canvas
                            ref={canvasRef}
                            className="absolute inset-0 w-full h-full"
                            style={{ transform: "scaleX(-1)" }}
                        />

                        {/* Loading overlay */}
                        {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                                <Loader2 className="w-8 h-8 text-violet-400 animate-spin mb-2" />
                                <span className="text-sm text-muted-foreground">
                                    Loading AI model...
                                </span>
                            </div>
                        )}

                        {/* Error overlay */}
                        {error && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                                <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
                                <span className="text-xs text-muted-foreground text-center">
                                    {error}
                                </span>
                            </div>
                        )}

                        {/* Expression badge */}
                        {isReady && metrics.faceDetected && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-medium text-white"
                            >
                                {metrics.currentExpression === "Happy" && "😊 "}
                                {metrics.currentExpression === "Tense" && "😟 "}
                                {metrics.currentExpression === "Neutral" && "😐 "}
                                {metrics.currentExpression}
                            </motion.div>
                        )}

                        {/* Confidence badge */}
                        {isReady && metrics.faceDetected && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-500/80 to-blue-500/80 backdrop-blur-md text-xs font-bold text-white"
                            >
                                {metrics.confidenceScore}%
                            </motion.div>
                        )}
                    </div>

                    {/* Metrics panel */}
                    <div className="p-4 space-y-3">
                        <MetricBar
                            label="Eye Contact"
                            value={metrics.eyeContactScore}
                            icon={Eye}
                            color="#3b82f6"
                        />
                        <MetricBar
                            label="Expression"
                            value={metrics.expressionScore}
                            icon={Smile}
                            color="#8b5cf6"
                        />
                        <MetricBar
                            label="Head Stability"
                            value={metrics.headStabilityScore}
                            icon={Move}
                            color="#06b6d4"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
