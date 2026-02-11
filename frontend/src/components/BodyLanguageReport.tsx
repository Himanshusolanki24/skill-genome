import { motion } from "framer-motion";
import { Eye, Smile, Move, Shield, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
} from "recharts";

interface BodyLanguageReportProps {
    scores: {
        eyeContactScore: number;
        expressionScore: number;
        headStabilityScore: number;
        confidenceScore: number;
    };
}

function getGrade(score: number): { letter: string; color: string; bg: string } {
    if (score >= 90) return { letter: "A+", color: "text-green-400", bg: "from-green-500/20 to-emerald-500/20 border-green-500/30" };
    if (score >= 80) return { letter: "A", color: "text-green-400", bg: "from-green-500/20 to-emerald-500/20 border-green-500/30" };
    if (score >= 70) return { letter: "B", color: "text-blue-400", bg: "from-blue-500/20 to-cyan-500/20 border-blue-500/30" };
    if (score >= 60) return { letter: "C", color: "text-yellow-400", bg: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30" };
    if (score >= 50) return { letter: "D", color: "text-orange-400", bg: "from-orange-500/20 to-red-500/20 border-orange-500/30" };
    return { letter: "F", color: "text-red-400", bg: "from-red-500/20 to-rose-500/20 border-red-500/30" };
}

function getTip(metric: string, score: number): string {
    if (metric === "eye") {
        if (score >= 70) return "Great! You maintained strong eye contact.";
        if (score >= 50) return "Try to look at the camera more consistently.";
        return "Practice keeping your gaze focused on the screen.";
    }
    if (metric === "expression") {
        if (score >= 70) return "Your expressions convey confidence!";
        if (score >= 50) return "Try relaxing your facial muscles and smiling naturally.";
        return "Practice a calm, pleasant expression in the mirror.";
    }
    if (metric === "stability") {
        if (score >= 70) return "Excellent composure and minimal head movement.";
        if (score >= 50) return "Try to keep your head more steady during answers.";
        return "Excessive head movement may appear nervous. Practice sitting still.";
    }
    return "";
}

function getTrend(score: number) {
    if (score >= 70) return { icon: TrendingUp, color: "text-green-400" };
    if (score >= 50) return { icon: Minus, color: "text-yellow-400" };
    return { icon: TrendingDown, color: "text-red-400" };
}

const metricConfigs = [
    { key: "eyeContactScore" as const, label: "Eye Contact", icon: Eye, tipKey: "eye", chartLabel: "Eye Contact" },
    { key: "expressionScore" as const, label: "Facial Expression", icon: Smile, tipKey: "expression", chartLabel: "Expression" },
    { key: "headStabilityScore" as const, label: "Head Stability", icon: Move, tipKey: "stability", chartLabel: "Stability" },
];

export const BodyLanguageReport = ({ scores }: BodyLanguageReportProps) => {
    const grade = getGrade(scores.confidenceScore);

    const chartData = [
        { metric: "Eye Contact", score: scores.eyeContactScore, fullMark: 100 },
        { metric: "Expression", score: scores.expressionScore, fullMark: 100 },
        { metric: "Stability", score: scores.headStabilityScore, fullMark: 100 },
        { metric: "Confidence", score: scores.confidenceScore, fullMark: 100 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative group"
        >
            <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/40 via-blue-500/40 to-cyan-500/40 rounded-2xl opacity-50 blur-sm" />
            <div className="relative bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500/20 to-blue-500/20 flex items-center justify-center border border-violet-500/30">
                        <Shield className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">
                            Body Language Report
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            AI analysis of your non-verbal communication
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Radar chart */}
                    <div className="flex flex-col items-center">
                        <div className="w-full h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={chartData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                    <PolarAngleAxis
                                        dataKey="metric"
                                        tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }}
                                    />
                                    <PolarRadiusAxis
                                        angle={90}
                                        domain={[0, 100]}
                                        tick={false}
                                        axisLine={false}
                                    />
                                    <Radar
                                        name="Score"
                                        dataKey="score"
                                        stroke="#8b5cf6"
                                        fill="#8b5cf6"
                                        fillOpacity={0.3}
                                        strokeWidth={2}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Overall grade */}
                        <div className={`mt-4 px-6 py-3 rounded-xl bg-gradient-to-r ${grade.bg} border text-center`}>
                            <div className="text-xs text-muted-foreground mb-1">Overall Grade</div>
                            <div className={`text-3xl font-bold ${grade.color}`}>
                                {grade.letter}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                Confidence Score: {scores.confidenceScore}%
                            </div>
                        </div>
                    </div>

                    {/* Metric breakdowns */}
                    <div className="space-y-4">
                        {metricConfigs.map((config) => {
                            const score = scores[config.key];
                            const trend = getTrend(score);
                            const TrendIcon = trend.icon;
                            const tip = getTip(config.tipKey, score);

                            return (
                                <motion.div
                                    key={config.key}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-background/40 rounded-xl p-4 border border-border/30"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <config.icon className="w-4 h-4 text-violet-400" />
                                            <span className="text-sm font-medium text-foreground">
                                                {config.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <TrendIcon className={`w-3.5 h-3.5 ${trend.color}`} />
                                            <span className={`text-sm font-bold ${trend.color}`}>
                                                {score}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-2">
                                        <motion.div
                                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${score}%` }}
                                            transition={{ duration: 0.8, delay: 0.5 }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">{tip}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
