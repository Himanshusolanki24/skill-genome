import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Zap,
  Target,
  CheckCircle,
  Clock,
  Star,
  Flame,
  ChevronRight,
  Sparkles,
  Trophy,
  Loader2,
} from "lucide-react";
import { API_BASE_URL, parseApiResponse } from "@/lib/api";

interface Task {
  id: string;
  technology: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  question: string;
  hint: string;
  xp_reward: number;
  expected_time_minutes: number;
  completed?: boolean;
}

const difficultyColors = {
  beginner: "bg-skill-beginner/10 text-skill-beginner border-skill-beginner/30",
  intermediate:
    "bg-skill-intermediate/10 text-skill-intermediate border-skill-intermediate/30",
  advanced: "bg-skill-advanced/10 text-skill-advanced border-skill-advanced/30",
};

const difficultyLabels = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const TECHNOLOGIES = ["all", "JavaScript", "TypeScript", "HTML", "CSS", "React", "Python", "C", "C++", "Node.js", "Java", "SQL", "AI/ML"];

const Tasks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedTech, setSelectedTech] = useState<string>("all");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalXpToday, setTotalXpToday] = useState(0);
  const [streak, setStreak] = useState(0);

  // Fetch tasks on mount and when filters change
  useEffect(() => {
    fetchTasks();
  }, [selectedDifficulty, selectedTech]);

  // Fetch user's completed tasks and streak
  useEffect(() => {
    if (user?.id) {
      fetchCompletedTasks();
      fetchStreak();
    }
  }, [user?.id]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const techParam = selectedTech !== "all" ? `technology=${selectedTech}` : "";
      const diffParam = selectedDifficulty !== "all" ? `difficulty=${selectedDifficulty}` : "";
      const params = [techParam, diffParam].filter(Boolean).join("&");

      const response = await fetch(`${API_BASE_URL}/api/daily-tasks/tasks?${params}`);
      const data = await parseApiResponse(response);

      if (data.success) {
        setTasks(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStreak = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/daily-tasks/streak/${user?.id}`);
      const data = await parseApiResponse(response);
      if (data.success) {
        setStreak(data.data.currentStreak || 0);
      }
    } catch (error) {
      console.error("Error fetching streak:", error);
    }
  };

  const fetchCompletedTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/daily-tasks/completed/${user?.id}`);
      const data = await parseApiResponse(response);
      if (data.success) {
        setCompletedTaskIds(data.data.completedTaskIds || []);
        setTotalXpToday(data.data.totalXpToday || 0);
      }
    } catch (error) {
      console.error("Error fetching completed tasks:", error);
    }
  };

  const filteredTasks = tasks.map(task => ({
    ...task,
    completed: completedTaskIds.includes(task.id)
  }));

  const completedCount = completedTaskIds.length;
  const totalXP = totalXpToday;

  const handleStartTask = (task: Task) => {
    if (!user?.id) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to start tasks.",
        variant: "destructive",
      });
      return;
    }

    // Store task in localStorage for the detail page
    localStorage.setItem("currentTask", JSON.stringify(task));

    // Navigate to task detail page
    navigate(`/tasks/${task.id}`);
  };

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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                  Daily Tasks
                </h1>
                <p className="text-muted-foreground">
                  Complete micro-tasks to strengthen your weak skills
                </p>
              </div>

              {/* Stats Pills */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Flame className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {streak} Day Streak
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-skill-intermediate/10 border border-skill-intermediate/20">
                  <Zap className="w-4 h-4 text-skill-intermediate" />
                  <span className="text-sm font-medium text-foreground">
                    {totalXP} XP Today
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Technology Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">
                Technology:
              </span>
              {TECHNOLOGIES.map((tech) => (
                <Button
                  key={tech}
                  variant={selectedTech === tech ? "genome" : "genome-outline"}
                  size="sm"
                  onClick={() => setSelectedTech(tech)}
                >
                  {tech === "all" ? "All" : tech}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Difficulty Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-8"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">
                Difficulty:
              </span>
              {["all", "beginner", "intermediate", "advanced"].map((diff) => (
                <Button
                  key={diff}
                  variant={selectedDifficulty === diff ? "genome" : "genome-outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(diff)}
                  className="capitalize"
                >
                  {diff === "all" ? "All Tasks" : diff}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Card variant="genome">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Target className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-foreground">
                        Today's Progress
                      </h3>
                      <p className="text-muted-foreground">
                        {completedCount} tasks completed today
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 max-w-md w-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Progress
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {tasks.length > 0 ? Math.round((completedCount / Math.min(tasks.length, 10)) * 100) : 0}%
                      </span>
                    </div>
                    <div className="progress-genome h-3">
                      <motion.div
                        className="progress-genome-fill"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${tasks.length > 0 ? (completedCount / Math.min(tasks.length, 10)) * 100 : 0}%`,
                        }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-3xl font-display font-bold text-primary">
                      {totalXP}
                    </p>
                    <p className="text-sm text-muted-foreground">XP Earned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Tasks Grid */}
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredTasks.slice(0, 12).map((task, index) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      variant="genome"
                      className={`relative overflow-hidden ${task.completed ? "opacity-75" : ""
                        }`}
                    >

                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${difficultyColors[task.difficulty]
                                  }`}
                              >
                                {difficultyLabels[task.difficulty]}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {task.technology}
                              </span>
                            </div>
                            <CardTitle className="text-lg line-clamp-2">{task.question}</CardTitle>
                          </div>
                          {task.completed && (
                            <CheckCircle className="w-6 h-6 text-skill-advanced flex-shrink-0" />
                          )}
                        </div>
                      </CardHeader>

                      <CardContent>
                        {task.hint && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            Hint: {task.hint}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-sm mb-4">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {task.technology}
                          </span>
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            ~{task.expected_time_minutes} min
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-primary">
                            <Star className="w-4 h-4" />
                            <span className="font-medium">{task.xp_reward} XP</span>
                          </div>

                          {task.completed ? (
                            <span className="text-sm text-skill-advanced font-medium">
                              Completed
                            </span>
                          ) : (
                            <Button
                              variant="genome"
                              size="sm"
                              onClick={() => handleStartTask(task)}
                            >
                              Start Task
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tasks found. Try different filters or run the SQL to add tasks.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Tasks;
