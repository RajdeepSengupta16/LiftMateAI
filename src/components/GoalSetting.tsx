import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Edit2, CheckCircle, Calendar, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'Strength' | 'Cardio' | 'Weight Loss' | 'Muscle Gain' | 'Flexibility';
  target: string;
  current: string;
  deadline: string;
  progress: number;
  completed: boolean;
}

const GoalSetting = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Bench Press 200lbs',
      description: 'Increase bench press to 200 pounds',
      category: 'Strength',
      target: '200',
      current: '185',
      deadline: '2024-03-01',
      progress: 92.5,
      completed: false
    },
    {
      id: '2',
      title: 'Run 5K in 25 minutes',
      description: 'Improve 5K running time to under 25 minutes',
      category: 'Cardio',
      target: '25:00',
      current: '27:30',
      deadline: '2024-02-15',
      progress: 75,
      completed: false
    }
  ]);

  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'Strength' as Goal['category'],
    target: '',
    current: '',
    deadline: ''
  });

  const categories: Goal['category'][] = ['Strength', 'Cardio', 'Weight Loss', 'Muscle Gain', 'Flexibility'];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Strength': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Cardio': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Weight Loss': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Muscle Gain': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Flexibility': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const addGoal = () => {
    if (!newGoal.title || !newGoal.target || !newGoal.deadline) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      progress: 0,
      completed: false
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: 'Strength',
      target: '',
      current: '',
      deadline: ''
    });
    setShowNewGoalForm(false);

    toast({
      title: "Goal created! 🎯",
      description: `Your goal "${goal.title}" has been added`,
    });
  };

  const updateGoalProgress = (goalId: string, newProgress: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const current = parseFloat(newProgress) || 0;
        const target = parseFloat(goal.target) || 1;
        const progress = Math.min((current / target) * 100, 100);
        const completed = progress >= 100;
        
        if (completed && !goal.completed) {
          toast({
            title: "Goal achieved! 🎉",
            description: `Congratulations on reaching your goal: ${goal.title}`,
          });
        }
        
        return {
          ...goal,
          current: newProgress,
          progress,
          completed
        };
      }
      return goal;
    }));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    toast({
      title: "Goal removed",
      description: "Goal has been deleted successfully",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Fitness Goals</h2>
          <p className="text-muted-foreground">Set and track your fitness objectives</p>
        </div>
        <Button variant="fitness" onClick={() => setShowNewGoalForm(!showNewGoalForm)}>
          <Plus className="w-4 h-4" />
          New Goal
        </Button>
      </div>

      {/* New Goal Form */}
      {showNewGoalForm && (
        <Card className="p-6 mb-6 bg-card border-border">
          <h3 className="text-xl font-semibold text-foreground mb-4">Create New Goal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title *</Label>
              <Input
                id="title"
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({...prev, title: e.target.value}))}
                placeholder="e.g., Bench Press 200lbs"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={newGoal.category} onValueChange={(value: Goal['category']) => setNewGoal(prev => ({...prev, category: value}))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Target Value *</Label>
              <Input
                id="target"
                value={newGoal.target}
                onChange={(e) => setNewGoal(prev => ({...prev, target: e.target.value}))}
                placeholder="e.g., 200 or 25:00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current">Current Value</Label>
              <Input
                id="current"
                value={newGoal.current}
                onChange={(e) => setNewGoal(prev => ({...prev, current: e.target.value}))}
                placeholder="e.g., 185 or 27:30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Target Date *</Label>
              <Input
                id="deadline"
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal(prev => ({...prev, deadline: e.target.value}))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newGoal.description}
                onChange={(e) => setNewGoal(prev => ({...prev, description: e.target.value}))}
                placeholder="Describe your goal and why it's important to you"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="fitness" onClick={addGoal}>
              Create Goal
            </Button>
            <Button variant="outline" onClick={() => setShowNewGoalForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className={`p-6 bg-card border-border hover:shadow-card transition-all duration-300 ${goal.completed ? 'ring-2 ring-green-500/30' : ''}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`text-lg font-semibold ${goal.completed ? 'text-green-400' : 'text-foreground'}`}>
                    {goal.title}
                  </h3>
                  {goal.completed && <CheckCircle className="w-5 h-5 text-green-400" />}
                </div>
                <p className="text-muted-foreground text-sm mb-3">{goal.description}</p>
                <Badge className={`text-xs ${getCategoryColor(goal.category)}`}>
                  {goal.category}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">{Math.round(goal.progress)}%</span>
              </div>
              <Progress value={goal.progress} className="h-2" />
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Current: {goal.current || '0'}</span>
                <span className="text-muted-foreground">Target: {goal.target}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                <Zap className="w-4 h-4 ml-auto" />
                <span className={new Date(goal.deadline) < new Date() ? 'text-red-400' : 'text-green-400'}>
                  {new Date(goal.deadline) < new Date() ? 'Overdue' : 'On Track'}
                </span>
              </div>
            </div>

            {!goal.completed && (
              <div className="mt-4 space-y-2">
                <Label htmlFor={`update-${goal.id}`} className="text-sm">Update Progress</Label>
                <div className="flex gap-2">
                  <Input
                    id={`update-${goal.id}`}
                    placeholder="Current value"
                    defaultValue={goal.current}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        updateGoalProgress(goal.id, (e.target as HTMLInputElement).value);
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.getElementById(`update-${goal.id}`) as HTMLInputElement;
                      updateGoalProgress(goal.id, input.value);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              {goal.completed && (
                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteGoal(goal.id)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">No goals yet</h3>
          <p className="text-muted-foreground mb-4">Set your first fitness goal to start tracking your progress</p>
          <Button variant="fitness" onClick={() => setShowNewGoalForm(true)}>
            <Plus className="w-4 h-4" />
            Create Your First Goal
          </Button>
        </div>
      )}
    </div>
  );
};

export default GoalSetting;