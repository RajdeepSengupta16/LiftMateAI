import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Zap, Play, Eye } from "lucide-react";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: number;
  instructions: string;
}

interface WorkoutCardProps {
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  exercises: Exercise[];
  category: string;
  onStartWorkout: () => void;
  onPreview: () => void;
}

const WorkoutCard = ({ 
  title, 
  description, 
  duration, 
  difficulty, 
  exercises, 
  category,
  onStartWorkout,
  onPreview
}: WorkoutCardProps) => {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  return (
    <Card className="p-6 bg-card border-border hover:shadow-card transition-all duration-300 hover:scale-105 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm mb-3">
            {description}
          </p>
        </div>
        <Badge variant="outline" className="ml-4">
          {category}
        </Badge>
      </div>

      <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{duration}</span>
        </div>
         <div className="flex items-center space-x-1">
           <Target className="w-4 h-4" />
           <span>{exercises.length} exercises</span>
         </div>
         <div className="flex items-center space-x-1">
           <Zap className="w-4 h-4" />
           <Badge className={`text-xs ${getDifficultyColor(difficulty)}`}>
             {difficulty}
           </Badge>
         </div>
       </div>

       <div className="flex space-x-2">
         <Button variant="fitness" className="flex-1" onClick={onStartWorkout}>
           <Play className="w-4 h-4" />
           Start Workout
         </Button>
         <Button variant="outline" size="sm" onClick={onPreview}>
           <Eye className="w-4 h-4" />
           Preview
         </Button>
       </div>
     </Card>
   );
 };

export default WorkoutCard;