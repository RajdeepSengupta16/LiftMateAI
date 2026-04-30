import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle,
  Clock,
  Target,
  Zap,
  ArrowLeft
} from "lucide-react";

import PoseEstimation from "./PoseEstimation"; // Adjust import path if needed
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"; // Your dialog/modal component

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: number; // seconds
  instructions: string;
}

interface WorkoutSessionProps {
  workout: {
    title: string;
    exercises: Exercise[];
    difficulty: string;
  };
  onComplete: () => void;
  onExit: () => void;
}

const WorkoutSession = ({ workout, onComplete, onExit }: WorkoutSessionProps) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSets, setCompletedSets] = useState<{[key: number]: number}>({});

  // NEW: State to control if Pose Estimation modal is visible
  const [showPoseEstimation, setShowPoseEstimation] = useState(false);

  const currentExercise = workout.exercises[currentExerciseIndex];
  const totalExercises = workout.exercises.length;
  const progress = ((currentExerciseIndex + (currentSet - 1) / currentExercise.sets) / totalExercises) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  const startRestTimer = () => {
    setTimeRemaining(currentExercise.rest);
    setIsResting(true);
    setIsTimerRunning(true);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setTimeRemaining(currentExercise.rest);
    setIsTimerRunning(false);
  };

  // NEW: Modified to only update sets after PoseEstimation is done
  const handleCompleteSetClicked = () => {
    setShowPoseEstimation(true);
  };

  // NEW: Called when user finishes Pose Estimation and clicks Done
  const onPoseEstimationDone = () => {
    setShowPoseEstimation(false);
    completeSet();
  };

  const completeSet = () => {
    const exerciseKey = currentExerciseIndex;
    setCompletedSets(prev => ({
      ...prev,
      [exerciseKey]: (prev[exerciseKey] || 0) + 1
    }));

    if (currentSet < currentExercise.sets) {
      setCurrentSet(prev => prev + 1);
      startRestTimer();
    } else {
      // Move to next exercise
      if (currentExerciseIndex < totalExercises - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
        setIsResting(false);
        setTimeRemaining(0);
        setIsTimerRunning(false);
      } else {
        // Workout complete
        onComplete();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onExit} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Workout</span>
        </Button>
        <Badge variant="outline" className="px-3 py-1">
          {workout.difficulty}
        </Badge>
      </div>

      {/* Progress */}
      <Card className="p-6 mb-6 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">{workout.title}</h1>
          <span className="text-muted-foreground">
            Exercise {currentExerciseIndex + 1} of {totalExercises}
          </span>
        </div>
        <Progress value={progress} className="h-3 mb-2" />
        <p className="text-sm text-muted-foreground text-center">{Math.round(progress)}% Complete</p>
      </Card>

      {/* Current Exercise */}
      <Card className="p-6 mb-6 bg-card border-border">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">{currentExercise.name}</h2>
          <div className="flex items-center justify-center space-x-6 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Set {currentSet} of {currentExercise.sets}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>{currentExercise.reps} reps</span>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-2">Instructions:</h3>
          <p className="text-muted-foreground">{currentExercise.instructions}</p>
        </div>

        {/* Rest Timer */}
        {isResting && (
          <Card className="p-4 mb-6 bg-secondary/10 border-secondary/30">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Rest Time</h3>
              <div className="text-4xl font-bold text-secondary mb-4">
                {formatTime(timeRemaining)}
              </div>
              <div className="flex justify-center space-x-2">
                <Button variant="outline" size="sm" onClick={toggleTimer}>
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={resetTimer}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Action Button */}
        <div className="text-center">
          {!isResting ? (
            <Button 
              variant="fitness" 
              size="lg" 
              onClick={handleCompleteSetClicked}  // <-- UPDATED here
              className="px-8 py-4 text-lg"
            >
              <CheckCircle className="w-5 h-5" />
              Complete Set {currentSet}
            </Button>
          ) : (
            <div className="text-muted-foreground">
              <Clock className="w-6 h-6 mx-auto mb-2" />
              <p>Take your rest, you've earned it!</p>
            </div>
          )}
        </div>
      </Card>

      {/* Exercise Summary */}
      <Card className="p-4 bg-card border-border">
        <h3 className="font-semibold text-foreground mb-3">Exercise Progress</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {workout.exercises.map((exercise, index) => {
            const completed = completedSets[index] || 0;
            const isActive = index === currentExerciseIndex;
            const isCompleted = completed >= exercise.sets;
            
            return (
              <div 
                key={index}
                className={`p-2 rounded-lg text-sm ${
                  isActive 
                    ? 'bg-primary/20 border border-primary/30' 
                    : isCompleted 
                    ? 'bg-green-500/20 border border-green-500/30'
                    : 'bg-muted/30'
                }`}
              >
                <div className="font-medium text-foreground truncate">{exercise.name}</div>
                <div className="text-muted-foreground">
                  {completed}/{exercise.sets} sets
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* === PoseEstimation Modal === */}
      {showPoseEstimation && (
        <Dialog open={showPoseEstimation} onOpenChange={setShowPoseEstimation}>
          <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" overflow-y-auto />
          <DialogContent className="flex flex-col items-center justify-center w-full max-w-3xl min-h-[80vh] overflow-y-auto mx-auto my-auto">
            <h2 className="text-2xl font-semibold mb-4">Pose Estimation</h2>

            <PoseEstimation />

            <div className="mt-6 flex space-x-3">
              <Button variant="outline" onClick={() => setShowPoseEstimation(false)}>
                Cancel
              </Button>
              <Button onClick={onPoseEstimationDone}>Done</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default WorkoutSession;
