import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Bell,
  Target,
  Zap,
  Trophy,
  Palette,
  Save,
  Edit,
  GraduationCap,
  Phone,
  Linkedin,
  Github,
  Loader2,
  Building,
  BookOpen,
  Flame,
  Star,
  ChevronRight,
  Moon,
  Sun,
  Mail,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

const SKILL_SUGGESTIONS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python",
  "Java", "C++", "HTML/CSS", "SQL", "MongoDB",
  "Git", "Docker", "AWS", "Machine Learning", "Data Analysis",
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile, isProfileComplete } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport: true,
    achievements: true,
    streakAlerts: false,
  });
  const [imageError, setImageError] = useState(false);

  // Refresh profile data on mount to ensure we have latest data
  useEffect(() => {
    refreshProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setSelectedSkills(profile.skills || []);
    }
  }, [profile]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => {
      const newSkills = prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill];
      setHasChanges(true);
      return newSkills;
    });
  };

  const handleDifficultyChange = (level: "beginner" | "intermediate" | "advanced") => {
    setDifficulty(level);
    setHasChanges(true);
  };

  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: checked }));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          skills: selectedSkills,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (error) throw error;
      await refreshProfile();
      setHasChanges(false);
      toast({
        title: "Changes saved! ✨",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error saving changes",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const allSkills = Array.from(new Set([...selectedSkills, ...SKILL_SUGGESTIONS])).slice(0, 15);

  // State for real stats
  const [stats, setStats] = useState({
    totalXp: 0,
    streak: 0,
    tasksCompleted: 0,
    interviewsDone: 0,
    skillsMastered: 0,
    rank: "Newcomer",
  });

  // Fetch real stats from database
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

      try {
        // Fetch interview results for XP and interview count
        const { data: interviews, error: interviewError } = await supabase
          .from("interview_results")
          .select("*")
          .eq("user_id", user.id);

        if (!interviewError && interviews) {
          // Calculate total XP from interviews
          const totalXp = interviews.reduce((sum, i) => sum + (i.xp_earned || 0), 0);

          // Count skills mastered (scored >= 70% in any skill)
          const skillScores = new Map<string, number>();
          interviews.forEach((interview) => {
            const percentage = interview.total_questions > 0
              ? (interview.correct_answers / interview.total_questions) * 100
              : 0;
            const existing = skillScores.get(interview.skill) || 0;
            skillScores.set(interview.skill, Math.max(existing, percentage));
          });
          const masteredSkills = Array.from(skillScores.values()).filter(score => score >= 70).length;

          // Calculate rank based on XP
          let rank = "Newcomer";
          if (totalXp >= 5000) rank = "Legend";
          else if (totalXp >= 2500) rank = "Expert";
          else if (totalXp >= 1000) rank = "Rising Star";
          else if (totalXp >= 500) rank = "Learner";
          else if (totalXp >= 100) rank = "Explorer";

          setStats({
            totalXp: profile?.total_xp || totalXp,
            streak: profile?.streak_count || 0,
            tasksCompleted: 0, // Will be updated when task_completions table exists
            interviewsDone: interviews.length,
            skillsMastered: masteredSkills || selectedSkills.length,
            rank,
          });
        }

        // Try to fetch task completions if table exists
        try {
          const { count } = await supabase
            .from("task_completions")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id);

          if (count !== null) {
            setStats(prev => ({ ...prev, tasksCompleted: count }));
          }
        } catch (e) {
          // Table might not exist yet, ignore
          console.log("task_completions table not available");
        }

      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [user?.id, profile, selectedSkills.length]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Hero Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-8"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl opacity-50" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-genome-card/80 backdrop-blur-xl">
              {/* Edit Button */}
              <div className="absolute top-4 right-4 z-20">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate("/complete-profile")}
                  className="shadow-lg hover:scale-105 transition-transform"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              {/* Banner */}
              <div className="h-32 bg-gradient-to-r from-primary via-purple-500 to-pink-500 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              </div>

              <div className="px-6 pb-6 -mt-16">
                <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6">
                  {/* Avatar */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                  >
                    <div className="w-32 h-32 rounded-2xl border-4 border-background shadow-2xl overflow-hidden bg-genome-card">
                      {profile?.avatar_url && !imageError ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.full_name || "User"}
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                          <User className="w-16 h-16 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>

                  {/* User Info */}
                  <div className="flex-1 pt-4 lg:pt-0">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-display font-bold text-foreground mb-1">
                          {profile?.username || profile?.full_name || "Complete Your Profile"}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {profile?.email || user?.email}
                          </span>
                          {profile?.academic_year && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {profile.academic_year}
                            </span>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Tags */}
                    {isProfileComplete && profile && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {profile.institute_name && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm">
                            <Building className="w-3.5 h-3.5 text-primary" />
                            {profile.institute_name}
                          </span>
                        )}
                        {profile.course && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm">
                            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                            {profile.course}
                          </span>
                        )}
                        {profile.specialization && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm">
                            <GraduationCap className="w-3.5 h-3.5 text-pink-400" />
                            {profile.specialization}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Bio */}
                    {profile?.short_bio && (
                      <p className="mt-4 text-muted-foreground max-w-2xl">
                        {profile.short_bio}
                      </p>
                    )}

                    {/* Social Links */}
                    {isProfileComplete && profile && (
                      <div className="flex items-center gap-3 mt-4">
                        {profile.linkedin_url && (
                          <a
                            href={profile.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-all"
                          >
                            <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                          </a>
                        )}
                        {profile.github_username && (
                          <a
                            href={`https://github.com/${profile.github_username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-all"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                        {profile.whatsapp_number && (
                          <span className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm">
                            <Phone className="w-4 h-4 text-green-400" />
                            {profile.whatsapp_number}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
          >
            {[
              { label: "Total XP", value: stats.totalXp.toLocaleString(), icon: Star, color: "text-yellow-400", bg: "bg-yellow-400/10" },
              { label: "Day Streak", value: stats.streak, icon: Flame, color: "text-orange-400", bg: "bg-orange-400/10" },
              { label: "Tasks Done", value: stats.tasksCompleted, icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10" },
              { label: "Interviews", value: stats.interviewsDone, icon: Award, color: "text-blue-400", bg: "bg-blue-400/10" },
              { label: "Skills", value: stats.skillsMastered, icon: Target, color: "text-purple-400", bg: "bg-purple-400/10" },
              { label: "Rank", value: stats.rank, icon: TrendingUp, color: "text-pink-400", bg: "bg-pink-400/10" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-4 rounded-2xl bg-genome-card border border-white/10 hover:border-white/20 transition-all">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Settings Grid */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Skills Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="genome" className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-semibold text-foreground">Skills & Interests</h3>
                      <p className="text-sm text-muted-foreground">{selectedSkills.length} skills selected</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {allSkills.map((skill) => (
                      <motion.button
                        key={skill}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedSkills.includes(skill)
                          ? "bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg shadow-primary/25"
                          : "bg-white/5 border border-white/10 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                          }`}
                      >
                        {skill}
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Difficulty Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="genome" className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-semibold text-foreground">Difficulty Level</h3>
                      <p className="text-sm text-muted-foreground">Set your preferred challenge</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { level: "beginner", label: "Beginner", desc: "5-10 min tasks", color: "from-green-500 to-emerald-500" },
                      { level: "intermediate", label: "Intermediate", desc: "15-25 min tasks", color: "from-yellow-500 to-orange-500" },
                      { level: "advanced", label: "Advanced", desc: "25-45 min tasks", color: "from-red-500 to-pink-500" },
                    ].map((item) => (
                      <motion.button
                        key={item.level}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleDifficultyChange(item.level as any)}
                        className={`w-full p-4 rounded-xl text-left transition-all flex items-center justify-between ${difficulty === item.level
                          ? "bg-gradient-to-r " + item.color + " text-white shadow-lg"
                          : "bg-white/5 border border-white/10 hover:border-white/20"
                          }`}
                      >
                        <div>
                          <p className={`font-semibold ${difficulty === item.level ? "text-white" : "text-foreground"}`}>
                            {item.label}
                          </p>
                          <p className={`text-sm ${difficulty === item.level ? "text-white/80" : "text-muted-foreground"}`}>
                            {item.desc}
                          </p>
                        </div>
                        {difficulty === item.level && <CheckCircle className="w-5 h-5" />}
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notifications Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card variant="genome" className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                      <Bell className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-semibold text-foreground">Notifications</h3>
                      <p className="text-sm text-muted-foreground">Manage your alerts</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: "dailyReminder", label: "Daily Reminder", desc: "Get reminded to practice" },
                      { key: "weeklyReport", label: "Weekly Report", desc: "Summary of your progress" },
                      { key: "achievements", label: "Achievements", desc: "When you unlock badges" },
                      { key: "streakAlerts", label: "Streak Alerts", desc: "Don't break your streak" },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch
                          checked={notifications[item.key as keyof typeof notifications]}
                          onCheckedChange={(checked) => handleNotificationChange(item.key, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Theme Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card variant="genome" className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <Palette className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-semibold text-foreground">Appearance</h3>
                      <p className="text-sm text-muted-foreground">Customize your look</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTheme("dark")}
                      className={`p-6 rounded-2xl text-center transition-all ${theme === "dark"
                        ? "bg-gradient-to-br from-primary/20 to-purple-500/20 border-2 border-primary"
                        : "bg-white/5 border border-white/10 hover:border-white/20"
                        }`}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-[#0a0a0f] border border-white/20 mx-auto mb-3 flex items-center justify-center">
                        <Moon className={`w-6 h-6 ${theme === "dark" ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <p className={`font-semibold ${theme === "dark" ? "text-primary" : "text-foreground"}`}>Dark</p>
                      <p className="text-xs text-muted-foreground mt-1">Easy on eyes</p>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTheme("light")}
                      className={`p-6 rounded-2xl text-center transition-all ${theme === "light"
                        ? "bg-gradient-to-br from-primary/20 to-purple-500/20 border-2 border-primary"
                        : "bg-white/5 border border-white/10 hover:border-white/20"
                        }`}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 mx-auto mb-3 flex items-center justify-center">
                        <Sun className={`w-6 h-6 ${theme === "light" ? "text-primary" : "text-gray-400"}`} />
                      </div>
                      <p className={`font-semibold ${theme === "light" ? "text-primary" : "text-foreground"}`}>Light</p>
                      <p className="text-xs text-muted-foreground mt-1">Classic look</p>
                    </motion.button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Save Button */}
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
            >
              <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-genome-card/95 backdrop-blur-xl border border-white/20 shadow-2xl">
                <span className="text-sm text-muted-foreground">You have unsaved changes</span>
                <Button
                  variant="genome"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
