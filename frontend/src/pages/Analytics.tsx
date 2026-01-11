import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Target,
  Zap,
  Calendar,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

interface InterviewResult {
  id: string;
  skill: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  interview_date: string;
  xp_earned: number;
}

interface SkillGrowthData {
  skill: string;
  questionsThisMonth: number;
  percentage: number;
}

interface ScoreTrendData {
  label: string;
  score: number;
}

interface SkillDistributionData {
  name: string;
  value: number;
  color: string;
}

const SKILL_COLORS = [
  "hsl(330, 94%, 73%)", // Pink
  "hsl(199, 89%, 48%)", // Blue
  "hsl(142, 71%, 45%)", // Green
  "hsl(45, 93%, 58%)",  // Yellow
  "hsl(280, 87%, 65%)", // Purple
  "hsl(15, 90%, 55%)",  // Orange
  "hsl(180, 70%, 45%)", // Cyan
  "hsl(60, 80%, 50%)",  // Lime
];

const Analytics = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [interviewResults, setInterviewResults] = useState<InterviewResult[]>([]);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);

  // Stats
  const [stats, setStats] = useState({
    overallScore: 0,
    overallScoreChange: 0,
    monthlyXp: 0,
    monthlyXpChange: 0,
    tasksThisMonth: 0,
    tasksChange: 0,
    careerReadiness: 0,
  });

  // Chart data
  const [scoreTrend, setScoreTrend] = useState<ScoreTrendData[]>([]);
  const [skillDistribution, setSkillDistribution] = useState<SkillDistributionData[]>([]);
  const [skillGrowth, setSkillGrowth] = useState<SkillGrowthData[]>([]);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "6months">("month");

  // Load extracted skills from localStorage
  useEffect(() => {
    const storedSkills = localStorage.getItem("extractedSkills");
    if (storedSkills) {
      try {
        const parsed = JSON.parse(storedSkills);
        const skillNames = parsed.skills?.map((s: { name: string }) => s.name) || [];
        setExtractedSkills(skillNames);
      } catch (e) {
        console.error("Failed to parse stored skills", e);
      }
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchAnalyticsData();
    } else {
      setLoading(false);
    }
  }, [user?.id, timeRange, extractedSkills]);

  const fetchAnalyticsData = async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      // Fetch all interview results for the user
      const { data: interviews, error } = await supabase
        .from("interview_results")
        .select("*")
        .eq("user_id", user.id)
        .order("interview_date", { ascending: true });

      if (error) {
        console.error("Error fetching interview results:", error);
        setLoading(false);
        return;
      }

      const data = interviews || [];
      setInterviewResults(data);

      // Calculate all analytics
      calculateStats(data);
      calculateScoreTrend(data);
      calculateSkillDistribution(data);
      calculateSkillGrowth(data);

    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: InterviewResult[]) => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    // Filter data for this month and last month
    const thisMonthData = data.filter(d => {
      const date = new Date(d.interview_date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

    const lastMonthData = data.filter(d => {
      const date = new Date(d.interview_date);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    });

    // Overall Score (average of all interview scores)
    const overallScore = data.length > 0
      ? Math.round(data.reduce((sum, d) => {
        const pct = d.total_questions > 0 ? (d.correct_answers / d.total_questions) * 100 : 0;
        return sum + pct;
      }, 0) / data.length)
      : 0;

    // Last month overall score for comparison
    const lastMonthScore = lastMonthData.length > 0
      ? Math.round(lastMonthData.reduce((sum, d) => {
        const pct = d.total_questions > 0 ? (d.correct_answers / d.total_questions) * 100 : 0;
        return sum + pct;
      }, 0) / lastMonthData.length)
      : 0;

    const overallScoreChange = lastMonthScore > 0 ? overallScore - lastMonthScore : 0;

    // Monthly XP
    const monthlyXp = thisMonthData.reduce((sum, d) => sum + (d.xp_earned || 0), 0);
    const lastMonthXp = lastMonthData.reduce((sum, d) => sum + (d.xp_earned || 0), 0);
    const monthlyXpChange = monthlyXp - lastMonthXp;

    // Tasks/Interviews this month
    const tasksThisMonth = thisMonthData.length;
    const tasksLastMonth = lastMonthData.length;
    const tasksChange = tasksThisMonth - tasksLastMonth;

    // Career Readiness (based on skills mastered with >= 70% score)
    const skillScores = new Map<string, number[]>();
    data.forEach(d => {
      const pct = d.total_questions > 0 ? (d.correct_answers / d.total_questions) * 100 : 0;
      const existing = skillScores.get(d.skill) || [];
      skillScores.set(d.skill, [...existing, pct]);
    });

    let masteredSkills = 0;
    skillScores.forEach(scores => {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avgScore >= 70) masteredSkills++;
    });

    const totalSkills = Math.max(skillScores.size, 1);
    const careerReadiness = Math.round((masteredSkills / totalSkills) * 100);

    setStats({
      overallScore,
      overallScoreChange,
      monthlyXp,
      monthlyXpChange,
      tasksThisMonth,
      tasksChange,
      careerReadiness,
    });
  };

  const calculateScoreTrend = (data: InterviewResult[]) => {
    const now = new Date();
    const trendData: ScoreTrendData[] = [];

    if (timeRange === "week") {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

        const dayData = data.filter(d => {
          const interviewDate = new Date(d.interview_date);
          return interviewDate.toDateString() === date.toDateString();
        });

        const avgScore = dayData.length > 0
          ? Math.round(dayData.reduce((sum, d) => {
            const pct = d.total_questions > 0 ? (d.correct_answers / d.total_questions) * 100 : 0;
            return sum + pct;
          }, 0) / dayData.length)
          : 0;

        trendData.push({ label: dayName, score: avgScore });
      }
    } else if (timeRange === "month") {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() - i * 7);

        const weekData = data.filter(d => {
          const interviewDate = new Date(d.interview_date);
          return interviewDate >= weekStart && interviewDate < weekEnd;
        });

        const avgScore = weekData.length > 0
          ? Math.round(weekData.reduce((sum, d) => {
            const pct = d.total_questions > 0 ? (d.correct_answers / d.total_questions) * 100 : 0;
            return sum + pct;
          }, 0) / weekData.length)
          : 0;

        trendData.push({ label: `Week ${4 - i}`, score: avgScore });
      }
    } else {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now);
        monthDate.setMonth(monthDate.getMonth() - i);
        const monthName = monthDate.toLocaleDateString("en-US", { month: "short" });

        const monthData = data.filter(d => {
          const interviewDate = new Date(d.interview_date);
          return interviewDate.getMonth() === monthDate.getMonth() &&
            interviewDate.getFullYear() === monthDate.getFullYear();
        });

        const avgScore = monthData.length > 0
          ? Math.round(monthData.reduce((sum, d) => {
            const pct = d.total_questions > 0 ? (d.correct_answers / d.total_questions) * 100 : 0;
            return sum + pct;
          }, 0) / monthData.length)
          : 0;

        trendData.push({ label: monthName, score: avgScore });
      }
    }

    setScoreTrend(trendData);
  };

  const calculateSkillDistribution = (data: InterviewResult[]) => {
    const skillCounts = new Map<string, number>();

    data.forEach(d => {
      const count = skillCounts.get(d.skill) || 0;
      skillCounts.set(d.skill, count + 1);
    });

    const total = data.length || 1;
    const distribution: SkillDistributionData[] = [];

    Array.from(skillCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .forEach(([skill, count], index) => {
        distribution.push({
          name: skill,
          value: Math.round((count / total) * 100),
          color: SKILL_COLORS[index % SKILL_COLORS.length],
        });
      });

    setSkillDistribution(distribution);
  };

  const calculateSkillGrowth = (data: InterviewResult[]) => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    // Get this month's data
    const thisMonthData = data.filter(d => {
      const date = new Date(d.interview_date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

    // Count questions per skill this month
    const skillQuestions = new Map<string, { total: number; correct: number }>();

    // First, add all extracted skills with 0 values
    extractedSkills.forEach(skillName => {
      skillQuestions.set(skillName, { total: 0, correct: 0 });
    });

    // Then update with actual interview data
    thisMonthData.forEach(d => {
      const existing = skillQuestions.get(d.skill) || { total: 0, correct: 0 };
      skillQuestions.set(d.skill, {
        total: existing.total + d.total_questions,
        correct: existing.correct + d.correct_answers,
      });
    });

    const growth: SkillGrowthData[] = Array.from(skillQuestions.entries())
      .map(([skill, data]) => ({
        skill,
        questionsThisMonth: data.total,
        percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      }))
      .sort((a, b) => b.questionsThisMonth - a.questionsThisMonth)
      .slice(0, 12);

    setSkillGrowth(growth);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

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
              Analytics & Progress
            </h1>
            <p className="text-muted-foreground">
              Track your skill evolution and growth trends
            </p>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <Card variant="genome" className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <span className={`flex items-center text-sm font-medium ${stats.overallScoreChange >= 0 ? "text-skill-advanced" : "text-red-500"}`}>
                  {stats.overallScoreChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stats.overallScoreChange >= 0 ? "+" : ""}{stats.overallScoreChange}%
                </span>
              </div>
              <p className="text-2xl font-display font-bold text-foreground">
                {stats.overallScore}%
              </p>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </Card>

            <Card variant="genome" className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-skill-intermediate/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-skill-intermediate" />
                </div>
                <span className={`flex items-center text-sm font-medium ${stats.monthlyXpChange >= 0 ? "text-skill-advanced" : "text-red-500"}`}>
                  {stats.monthlyXpChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stats.monthlyXpChange >= 0 ? "+" : ""}{stats.monthlyXpChange}
                </span>
              </div>
              <p className="text-2xl font-display font-bold text-foreground">
                {stats.monthlyXp.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Monthly XP</p>
            </Card>

            <Card variant="genome" className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-skill-advanced/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-skill-advanced" />
                </div>
                <span className={`flex items-center text-sm font-medium ${stats.tasksChange >= 0 ? "text-skill-advanced" : "text-red-500"}`}>
                  {stats.tasksChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stats.tasksChange >= 0 ? "+" : ""}{stats.tasksChange}
                </span>
              </div>
              <p className="text-2xl font-display font-bold text-foreground">
                {stats.tasksThisMonth}
              </p>
              <p className="text-sm text-muted-foreground">Interviews This Month</p>
            </Card>

            <Card variant="genome" className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-skill-beginner/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-skill-beginner" />
                </div>
                <span className="flex items-center text-primary text-sm font-medium">
                  {stats.careerReadiness >= 70 ? "Expert" : stats.careerReadiness >= 40 ? "Growing" : "Beginner"}
                </span>
              </div>
              <p className="text-2xl font-display font-bold text-foreground">
                {stats.careerReadiness}%
              </p>
              <p className="text-sm text-muted-foreground">Career Readiness</p>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Score Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card variant="genome">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Score Trend
                    </CardTitle>
                    <div className="flex gap-1">
                      {(["week", "month", "6months"] as const).map((range) => (
                        <Button
                          key={range}
                          variant={timeRange === range ? "genome" : "ghost"}
                          size="sm"
                          onClick={() => setTimeRange(range)}
                          className="text-xs px-2 py-1"
                        >
                          {range === "week" ? "Week" : range === "month" ? "Month" : "6M"}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    {scoreTrend.some(d => d.score > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={scoreTrend}>
                          <defs>
                            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 100]}
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                            formatter={(value: number) => [`${value}%`, "Score"]}
                          />
                          <Area
                            type="monotone"
                            dataKey="score"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            fill="url(#scoreGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No interview data for this period
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Skill Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card variant="genome">
                <CardHeader>
                  <CardTitle>Skill Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px] flex items-center">
                    {skillDistribution.length > 0 ? (
                      <>
                        <ResponsiveContainer width="60%" height="100%">
                          <PieChart>
                            <Pie
                              data={skillDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {skillDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "rgba(0, 0, 0, 0.85)",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                borderRadius: "8px",
                                padding: "10px 14px",
                              }}
                              labelStyle={{ color: "#fff", fontWeight: "bold" }}
                              itemStyle={{ color: "#fff" }}
                              formatter={(value: number, name: string, props: any) => [
                                `${value}%`,
                                props.payload?.name || "Share"
                              ]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-3 flex-1">
                          {skillDistribution.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm text-foreground truncate">
                                {item.name}
                              </span>
                              <span className="text-sm text-muted-foreground ml-auto">
                                {item.value}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center w-full text-muted-foreground">
                        No skill data available yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Skill Growth This Month */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card variant="genome">
              <CardHeader>
                <CardTitle>Skill Growth This Month</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Questions answered per skill and success rate
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {skillGrowth.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={skillGrowth} layout="vertical">
                        <XAxis
                          type="number"
                          domain={[0, 100]}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        />
                        <YAxis
                          dataKey="skill"
                          type="category"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                          width={100}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number, name: string) => [
                            name === "percentage" ? `${value}%` : value,
                            name === "percentage" ? "Success Rate" : "Questions",
                          ]}
                        />
                        <Bar
                          dataKey="percentage"
                          fill="hsl(var(--primary))"
                          radius={[0, 4, 4, 0]}
                          barSize={20}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No skill data for this month yet. Complete some interviews!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
