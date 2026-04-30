import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrendingUp, Award, Calendar, Target, Plus, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ProgressDashboard = () => {
  const [workoutStreak, setWorkoutStreak] = useState(12);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState(4);
  const [monthlyGoal, setMonthlyGoal] = useState({ current: 18, target: 20 });
  
  const [personalRecords, setPersonalRecords] = useState([
    { exercise: "Bench Press", weight: "185 lbs", date: "2024-01-15" },
    { exercise: "Squat", weight: "225 lbs", date: "2024-01-10" },
    { exercise: "Deadlift", weight: "275 lbs", date: "2024-01-08" }
  ]);

  const addWorkout = () => {
    setWeeklyWorkouts(prev => Math.min(prev + 1, 7));
    setWorkoutStreak(prev => prev + 1);
    setMonthlyGoal(prev => ({ ...prev, current: Math.min(prev.current + 1, prev.target) }));
    toast({
      title: "Great job! 💪",
      description: "Workout completed successfully!",
    });
  };

  const resetWeek = () => {
    setWeeklyWorkouts(0);
    toast({
      title: "Week reset",
      description: "Starting fresh for the new week!",
    });
  };

  const stats = [
    {
      label: "Workouts This Week",
      value: weeklyWorkouts.toString(),
      target: "5",
      progress: (weeklyWorkouts / 5) * 100,
      icon: Calendar,
      color: "text-primary"
    },
    {
      label: "Current Streak",
      value: workoutStreak.toString(),
      unit: "days",
      progress: Math.min((workoutStreak / 30) * 100, 100),
      icon: Award,
      color: "text-secondary"
    },
    {
      label: "Monthly Goal",
      value: monthlyGoal.current.toString(),
      target: monthlyGoal.target.toString(),
      progress: (monthlyGoal.current / monthlyGoal.target) * 100,
      icon: Target,
      color: "text-accent"
    },
    {
      label: "Strength Gain",
      value: "+15%",
      unit: "this month",
      progress: 65,
      icon: TrendingUp,
      color: "text-green-400"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="text-center flex-1">
          <h2 className="text-3xl font-bold text-foreground mb-2">Your Progress</h2>
          <p className="text-muted-foreground">Track your fitness journey and celebrate your achievements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="fitness" onClick={addWorkout}>
            <Plus className="w-4 h-4" />
            Log Workout
          </Button>
          <Button variant="outline" onClick={resetWeek}>
            Reset Week
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 bg-card border-border hover:shadow-card transition-all duration-300 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                  {stat.target && <span className="text-muted-foreground text-lg">/{stat.target}</span>}
                </div>
                {stat.unit && <div className="text-sm text-muted-foreground">{stat.unit}</div>}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">{stat.label}</span>
                <span className="text-sm text-muted-foreground">{stat.progress}%</span>
              </div>
              <Progress value={stat.progress} className="h-2" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-xl font-semibold text-foreground mb-4">Weekly Activity</h3>
          <div className="space-y-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const values = [85, 92, 0, 78, 88, 95, 0];
              const isToday = index === 3; // Thursday for demo
              return (
                <div key={day} className="flex items-center space-x-3">
                  <span className={`w-12 text-sm font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                    {day}
                  </span>
                  <div className="flex-1">
                    <Progress 
                      value={values[index]} 
                      className={`h-3 ${isToday ? 'animate-glow-pulse' : ''}`}
                    />
                  </div>
                  <span className="w-12 text-sm text-muted-foreground">
                    {values[index] > 0 ? `${values[index]}%` : '-'}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Achievements */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-xl font-semibold text-foreground mb-4">Recent Achievements</h3>
          <div className="space-y-4">
            {[
              { title: "First Week Complete!", description: "Completed your first week of training", icon: Award, color: "text-secondary" },
              { title: "Strength Milestone", description: "Increased bench press by 10lbs", icon: TrendingUp, color: "text-accent" },
              { title: "Consistency King", description: "5 workouts in a row", icon: Target, color: "text-primary" }
            ].map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className={`w-10 h-10 rounded-full bg-card flex items-center justify-center`}>
                  <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProgressDashboard;