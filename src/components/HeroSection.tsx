import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-fitness.jpg";
import { MessageCircle, Target, TrendingUp, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-hero-gradient opacity-90" />
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Meet <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">LiftMate</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Your AI-powered fitness companion that creates personalized workouts, 
            tracks your progress, and motivates you every step of the way.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              <MessageCircle className="w-5 h-5" />
              Start Training with AI
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Target className="w-5 h-5" />
              Set Your Goals
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="p-6 bg-card-gradient backdrop-blur-lg border-white/20 hover:scale-105 transition-all duration-300 animate-scale-in">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full mb-4 mx-auto">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI Chat Coach</h3>
            <p className="text-white/80">Get instant, personalized fitness advice and workout guidance from your AI trainer.</p>
          </Card>

          <Card className="p-6 bg-card-gradient backdrop-blur-lg border-white/20 hover:scale-105 transition-all duration-300 animate-scale-in">
            <div className="flex items-center justify-center w-12 h-12 bg-secondary rounded-full mb-4 mx-auto">
              <Target className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Smart Workouts</h3>
            <p className="text-white/80">Customized exercise routines that adapt to your fitness level and goals.</p>
          </Card>

          <Card className="p-6 bg-card-gradient backdrop-blur-lg border-white/20 hover:scale-105 transition-all duration-300 animate-scale-in">
            <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-full mb-4 mx-auto">
              <TrendingUp className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Progress Tracking</h3>
            <p className="text-white/80">Monitor your gains with intelligent analytics and motivational insights.</p>
          </Card>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-bounce">
        <div className="w-4 h-4 bg-secondary rounded-full opacity-60" />
      </div>
      <div className="absolute bottom-20 right-10 animate-bounce delay-300">
        <div className="w-6 h-6 bg-accent rounded-full opacity-40" />
      </div>
      <div className="absolute top-1/3 right-20 animate-pulse">
        <Zap className="w-8 h-8 text-primary opacity-50" />
      </div>
    </div>
  );
};

export default HeroSection;