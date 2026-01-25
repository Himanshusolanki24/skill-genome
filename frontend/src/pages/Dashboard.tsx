import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Award,
  Zap,
  Target,
  TrendingUp,
  Clock,
  ChevronRight,
  Star,
  Trophy,
  AlertCircle,
  BookCheck,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { API_BASE_URL, parseApiResponse } from "@/lib/api";
import ActivityHeatmap from "@/components/ActivityHeatmap";

interface InterviewResult {
  id: string;
  skill: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  interview_date: string;
  xp_earned: number;
}

interface WeeklyData {
  day: string;
  xp: number;
}

interface SkillData {
  skill: string;
  value: number;
  fullMark: number;
}

interface FocusArea {
  name: string;
  level: number;
  improvement: string;
}

interface ExtractedSkill {
  name: string;
  color: string;
  textColor: string;
}

interface ActivityData {
  date: string;
  count: number;
}

const Dashboard = () => {
  const { user, profile, isProfileComplete } = useAuth();
  const [interviewResults, setInterviewResults] = useState<InterviewResult[]>([]);
  const [skillData, setSkillData] = useState<SkillData[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyData[]>([]);
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [stats, setStats] = useState({
    skillsMastered: 0,
    totalXp: 0,
    interviewsDone: 0,
    overallScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [heatmapLoading, setHeatmapLoading] = useState(true);

  // Get username or fallback
  const displayName = profile?.username || profile?.full_name?.split(" ")[0] || "there";

  // Load extracted skills from localStorage
  useEffect(() => {
    const storedSkills = localStorage.getItem("extractedSkills");
    if (storedSkills) {
      try {
        const parsed = JSON.parse(storedSkills);
        const skillNames = parsed.skills?.map((s: ExtractedSkill) => s.name) || [];
        setExtractedSkills(skillNames);
      } catch (e) {
        console.error("Failed to parse stored skills", e);
      }
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
      fetchActivityHeatmap();
    } else {
      setLoading(false);
      setHeatmapLoading(false);
    }
  }, [user?.id, extractedSkills]);

  const fetchActivityHeatmap = async () => {
    if (!user?.id) return;
    setHeatmapLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/daily-tasks/activity-heatmap/${user.id}`);
      const data = await parseApiResponse(response);
      if (data.success) {
        setActivityData(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching activity heatmap:", error);
    } finally {
      setHeatmapLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    if (!user?.id) return;

    try {
      // Fetch interview results
      const { data: interviews, error: interviewError } = await supabase
        .from("interview_results")
        .select("*")
        .eq("user_id", user.id)
        .order("interview_date", { ascending: false });

      if (interviewError) {
        console.log("No interview results yet or error:", interviewError);
      }

      const interviewData = interviews || [];
      setInterviewResults(interviewData);

      // Calculate stats
      if (interviewData.length > 0) {
        // Total XP
        const totalXp = interviewData.reduce((sum, i) => sum + (i.xp_earned || 0), 0);

        // Overall score (average percentage)
        const avgScore = interviewData.reduce((sum, i) => {
          const percentage = i.total_questions > 0
            ? (i.correct_answers / i.total_questions) * 100
            : 0;
          return sum + percentage;
        }, 0) / interviewData.length;

        // Build skill data for radar chart - combine extracted skills with interview results
        const skillMap = new Map<string, { total: number; count: number }>();

        // First, add all extracted skills with 0 score
        extractedSkills.slice(0, 8).forEach((skillName) => {
          skillMap.set(skillName, { total: 0, count: 0 });
        });

        // Then, update with interview results
        interviewData.forEach((interview) => {
          const existing = skillMap.get(interview.skill) || { total: 0, count: 0 };
          const score = interview.total_questions > 0
            ? (interview.correct_answers / interview.total_questions) * 100
            : 0;
          skillMap.set(interview.skill, {
            total: existing.total + score,
            count: existing.count + 1,
          });
        });

        const skills: SkillData[] = Array.from(skillMap.entries()).map(([skill, data]) => ({
          skill,
          value: data.count > 0 ? Math.round(data.total / data.count) : 0,
          fullMark: 100,
        }));
        setSkillData(skills);

        // Focus areas (lowest 3 skills)
        const sortedSkills = [...skills].sort((a, b) => a.value - b.value);
        const focus: FocusArea[] = sortedSkills.slice(0, 3).map((s) => ({
          name: s.skill,
          level: s.value,
          improvement: "+0%", // Can be calculated from historical data
        }));
        setFocusAreas(focus);

        // Count skills mastered (scored >= 70%)
        const masteredSkills = skills.filter(s => s.value >= 70).length;

        setStats({
          skillsMastered: masteredSkills,
          totalXp,
          interviewsDone: interviewData.length,
          overallScore: Math.round(avgScore),
        });
      } else if (extractedSkills.length > 0) {
        // No interviews yet, but show extracted skills in chart with 0 values
        const skills: SkillData[] = extractedSkills.slice(0, 8).map((skillName) => ({
          skill: skillName,
          value: 0,
          fullMark: 100,
        }));
        setSkillData(skills);
      }

      // Build weekly progress (last 7 days)
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const today = new Date();
      const weekData: WeeklyData[] = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dayName = days[date.getDay()];

        // Sum XP earned on this day
        const dayXp = interviewData
          .filter((interview) => {
            const interviewDate = new Date(interview.interview_date);
            return interviewDate.toDateString() === date.toDateString();
          })
          .reduce((sum, i) => sum + (i.xp_earned || 0), 0);

        weekData.push({ day: dayName, xp: dayXp });
      }
      setWeeklyProgress(weekData);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Default data for new users
  const defaultSkillData: SkillData[] = profile?.skills?.slice(0, 8).map((skill) => ({
    skill,
    value: 0,
    fullMark: 100,
  })) || [
      { skill: "JavaScript", value: 0, fullMark: 100 },
      { skill: "Python", value: 0, fullMark: 100 },
      { skill: "React", value: 0, fullMark: 100 },
      { skill: "SQL", value: 0, fullMark: 100 },
    ];

  const defaultWeeklyProgress: WeeklyData[] = [
    { day: "Mon", xp: 0 },
    { day: "Tue", xp: 0 },
    { day: "Wed", xp: 0 },
    { day: "Thu", xp: 0 },
    { day: "Fri", xp: 0 },
    { day: "Sat", xp: 0 },
    { day: "Sun", xp: 0 },
  ];

  // Ensure we always have at least 3 data points for radar chart to render properly
  const ensureMinimumPoints = (data: SkillData[]): SkillData[] => {
    if (data.length >= 3) return data;
    const defaultPoints: SkillData[] = [
      { skill: "JavaScript", value: 0, fullMark: 100 },
      { skill: "Python", value: 0, fullMark: 100 },
      { skill: "React", value: 0, fullMark: 100 },
      { skill: "SQL", value: 0, fullMark: 100 },
      { skill: "HTML", value: 0, fullMark: 100 },
    ];
    // Add default points that aren't already in data
    const existingSkills = new Set(data.map(d => d.skill));
    const additionalPoints = defaultPoints.filter(p => !existingSkills.has(p.skill));
    return [...data, ...additionalPoints].slice(0, Math.max(data.length, 5));
  };

  const displaySkillData = ensureMinimumPoints(skillData.length > 0 ? skillData : defaultSkillData);
  const displayWeeklyProgress = weeklyProgress.some((d) => d.xp > 0) ? weeklyProgress : defaultWeeklyProgress;
  const hasData = interviewResults.length > 0;
  const isChartReady = !loading && displaySkillData.length >= 3;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Welcome back, <span className="text-gradient-pink">{displayName}</span>
            </h1>
            <p className="text-muted-foreground">
              {stats.skillsMastered > 0
                ? `You've mastered ${stats.skillsMastered} skill${stats.skillsMastered > 1 ? 's' : ''}! Keep evolving.`
                : "Start your learning journey by taking an interview!"}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card variant="genome" className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {stats.skillsMastered}
                  </p>
                  <p className="text-sm text-muted-foreground">Skills Mastered</p>
                </div>
              </div>
            </Card>

            <Card variant="genome" className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-skill-intermediate/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-skill-intermediate" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {stats.totalXp.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total XP</p>
                </div>
              </div>
            </Card>

            <Card variant="genome" className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-skill-advanced/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-skill-advanced" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {stats.interviewsDone}
                  </p>
                  <p className="text-sm text-muted-foreground">Interviews</p>
                </div>
              </div>
            </Card>

            <Card variant="genome" className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-skill-beginner/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-skill-beginner" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {stats.overallScore}%
                  </p>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* GyaniX Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card variant="genome" className="h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Your GyaniX</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {hasData
                        ? "Based on your interview performance"
                        : "Take interviews to build your skill map"}
                    </p>
                  </div>
                  <Link to="/build">
                    <Button variant="genome-ghost" size="sm">
                      Build GyaniX
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    {loading ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : displaySkillData.length >= 3 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart
                          cx="50%"
                          cy="50%"
                          outerRadius="80%"
                          data={displaySkillData}
                        >
                          <PolarGrid stroke="hsl(var(--border))" />
                          <PolarAngleAxis
                            dataKey="skill"
                            tick={{
                              fill: "hsl(var(--muted-foreground))",
                              fontSize: 12,
                            }}
                          />
                          <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={{
                              fill: "hsl(var(--muted-foreground))",
                              fontSize: 10,
                            }}
                            axisLine={false}
                          />
                          <Radar
                            name="Skills"
                            dataKey="value"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={hasData ? 0.3 : 0.1}
                            strokeWidth={2}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No skill data yet</p>
                        <Link to="/interview" className="mt-4">
                          <Button variant="genome">Start Your First Interview</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Focus Areas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card variant="genome" className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Focus Areas
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {hasData
                      ? "Skills that need attention based on your interviews"
                      : "Complete interviews to identify weak areas"}
                  </p>
                </CardHeader>
                <CardContent>
                  {focusAreas.length > 0 ? (
                    <div className="space-y-4">
                      {focusAreas.map((skill, index) => (
                        <div key={skill.name}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">
                              {skill.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-skill-advanced">
                                {skill.improvement}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {skill.level}%
                              </span>
                            </div>
                          </div>
                          <div className="progress-genome">
                            <motion.div
                              className="progress-genome-fill"
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Target className="w-10 h-10 text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground mb-4">
                        No focus areas identified yet
                      </p>
                    </div>
                  )}
                  <Link to="/tasks" className="block mt-6">
                    <Button variant="genome" className="w-full">
                      {hasData ? "Practice Weak Skills" : "Build Genome"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Bottom Row */}
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            {/* Weekly Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card variant="genome">
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {hasData
                      ? "XP earned this week from interviews"
                      : "Your weekly XP will appear here"}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={displayWeeklyProgress}>
                        <defs>
                          <linearGradient
                            id="xpGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="hsl(var(--primary))"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="hsl(var(--primary))"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "hsl(var(--foreground))" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="xp"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          fill="url(#xpGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card variant="genome">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Activity</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Your latest interviews
                    </p>
                  </div>
                  <Link to="/interview">
                    <Button variant="genome-ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {interviewResults.length > 0 ? (
                    <div className="space-y-3">
                      {interviewResults.slice(0, 4).map((interview) => {
                        const percentage = interview.total_questions > 0
                          ? Math.round((interview.correct_answers / interview.total_questions) * 100)
                          : 0;
                        const isPassed = percentage >= 60;

                        return (
                          <div
                            key={interview.id}
                            className={`flex items-center justify-between p-3 rounded-lg border ${isPassed
                              ? "border-skill-advanced/30 bg-skill-advanced/5"
                              : "border-border bg-card"
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPassed
                                  ? "bg-skill-advanced/20"
                                  : "bg-muted"
                                  }`}
                              >
                                {isPassed ? (
                                  <Trophy className="w-4 h-4 text-skill-advanced" />
                                ) : (
                                  <Clock className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <span className="text-sm font-medium text-foreground">
                                  {interview.skill} Interview
                                </span>
                                <p className="text-xs text-muted-foreground">
                                  {interview.correct_answers}/{interview.total_questions} correct • {percentage}%
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-primary">
                              <Star className="w-3 h-3" />
                              <span className="text-sm font-medium">
                                {interview.xp_earned} XP
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Clock className="w-10 h-10 text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground mb-4">
                        No recent activity yet
                      </p>
                      <Link to="/interview">
                        <Button variant="genome-outline">Start Interview</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Activity Heatmap - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6"
          >
            <Card variant="genome">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Activity Overview
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Your learning activity over the past year
                </p>
              </CardHeader>
              <CardContent>
                <ActivityHeatmap data={activityData} loading={heatmapLoading} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
