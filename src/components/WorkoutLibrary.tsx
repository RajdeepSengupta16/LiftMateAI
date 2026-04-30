import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import WorkoutCard from "./WorkoutCard";
import WorkoutSession from "./WorkoutSession";
import { Search, Filter, X } from "lucide-react";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: number;
  instructions: string;
}

const WorkoutLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [isInWorkout, setIsInWorkout] = useState(false);
  const [previewWorkout, setPreviewWorkout] = useState<any>(null);

  const categories = ["All", "Strength", "Cardio", "HIIT", "Flexibility", "Powerlifting"];

  const workouts = [
    {
      title: "Upper Body Strength",
      description: "Build muscle and strength in your chest, shoulders, and arms with compound movements.",
      duration: "45 min",
      difficulty: "Intermediate" as const,
      exercises: [
        {
          name: "Push-ups",
          sets: 3,
          reps: "8-12",
          rest: 60,
          instructions: "Start in plank position, lower body until chest nearly touches floor, push back up."
        },
        {
          name: "Dumbbell Rows",
          sets: 3,
          reps: "10-12",
          rest: 60,
          instructions: "Bend over with dumbbell, row to hip level, squeeze shoulder blades together."
        },
        {
          name: "Overhead Press",
          sets: 3,
          reps: "8-10",
          rest: 90,
          instructions: "Press weights overhead from shoulder level, keep core tight."
        },
        {
          name: "Chest Flyes",
          sets: 3,
          reps: "10-12",
          rest: 60,
          instructions: "Lie back, bring dumbbells together above chest in wide arc motion."
        }
      ],
      category: "Strength"
    },
    {
      title: "HIIT Cardio Blast",
      description: "High-intensity interval training to boost metabolism and burn calories.",
      duration: "20 min",
      difficulty: "Advanced" as const,
      exercises: [
        {
          name: "Burpees",
          sets: 4,
          reps: "30 seconds",
          rest: 30,
          instructions: "Drop to push-up position, jump feet to hands, jump up with arms overhead."
        },
        {
          name: "Mountain Climbers",
          sets: 4,
          reps: "45 seconds",
          rest: 15,
          instructions: "In plank position, alternate bringing knees to chest quickly."
        },
        {
          name: "Jump Squats",
          sets: 4,
          reps: "20 reps",
          rest: 40,
          instructions: "Squat down then explode up jumping as high as possible."
        }
      ],
      category: "HIIT"
    },
    {
      title: "Beginner Full Body",
      description: "Perfect introduction to strength training with basic movements.",
      duration: "30 min",
      difficulty: "Beginner" as const,
      exercises: [
        {
          name: "Bodyweight Squats",
          sets: 2,
          reps: "10-15",
          rest: 45,
          instructions: "Feet shoulder-width apart, sit back like sitting in chair, stand up."
        },
        {
          name: "Modified Push-ups",
          sets: 2,
          reps: "5-10",
          rest: 45,
          instructions: "From knees or against wall, push body away and back."
        },
        {
          name: "Plank Hold",
          sets: 2,
          reps: "20-30 seconds",
          rest: 60,
          instructions: "Hold body straight from head to heels, engage core."
        }
      ],
      category: "Strength"
    }
  ];

  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workout.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || workout.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStartWorkout = (workout: any) => {
    setSelectedWorkout(workout);
    setIsInWorkout(true);
  };

  const handlePreviewWorkout = (workout: any) => {
    setPreviewWorkout(workout);
  };

  const handleWorkoutComplete = () => {
    setIsInWorkout(false);
    setSelectedWorkout(null);
    // Here you could save workout completion to database
  };

  const handleExitWorkout = () => {
    setIsInWorkout(false);
    setSelectedWorkout(null);
  };

  if (isInWorkout && selectedWorkout) {
    return (
      <WorkoutSession
        workout={selectedWorkout}
        onComplete={handleWorkoutComplete}
        onExit={handleExitWorkout}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Workout Library</h2>
        <p className="text-muted-foreground">
          Discover workouts tailored to your fitness level and goals
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search workouts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "fitness" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          {filteredWorkouts.length} workout{filteredWorkouts.length !== 1 ? 's' : ''} found
        </p>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4" />
          More Filters
        </Button>
      </div>

      {/* Workout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkouts.map((workout, index) => (
          <WorkoutCard
            key={index}
            {...workout}
            onStartWorkout={() => handleStartWorkout(workout)}
            onPreview={() => handlePreviewWorkout(workout)}
          />
        ))}
      </div>

      {filteredWorkouts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No workouts found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Preview Dialog */}
      {previewWorkout && (
        <Dialog open={!!previewWorkout} onOpenChange={() => setPreviewWorkout(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                {previewWorkout.title}
                <Button variant="ghost" size="sm" onClick={() => setPreviewWorkout(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">{previewWorkout.description}</p>
              
              <div className="flex gap-4 text-sm">
                <Badge variant="outline">{previewWorkout.difficulty}</Badge>
                <span>{previewWorkout.duration}</span>
                <span>{previewWorkout.exercises.length} exercises</span>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Exercises:</h3>
                {previewWorkout.exercises.map((exercise: Exercise, index: number) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{exercise.name}</h4>
                      <div className="text-sm text-muted-foreground">
                        {exercise.sets} sets × {exercise.reps}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{exercise.instructions}</p>
                    <p className="text-xs text-muted-foreground mt-1">Rest: {exercise.rest}s</p>
                  </div>
                ))}
              </div>

              <Button 
                variant="fitness" 
                className="w-full"
                onClick={() => {
                  setPreviewWorkout(null);
                  handleStartWorkout(previewWorkout);
                }}
              >
                Start This Workout
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default WorkoutLibrary;