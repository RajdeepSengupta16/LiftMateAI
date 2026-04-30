import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import ChatInterface from "@/components/ChatInterface";
import WorkoutLibrary from "@/components/WorkoutLibrary";
import ProgressDashboard from "@/components/ProgressDashboard";
import GoalSetting from "@/components/GoalSetting";
import Navigation from "@/components/Navigation";

const Index = () => {
  const [activeSection, setActiveSection] = useState('hero');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'hero':
        return <HeroSection />;
      case 'chat':
        return <ChatInterface />;
      case 'workouts':
        return <WorkoutLibrary />;
      case 'progress':
        return <ProgressDashboard />;
      case 'profile':
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Profile Coming Soon</h2>
              <p className="text-muted-foreground">Manage your fitness profile and preferences</p>
            </div>
          </div>
        );
      default:
        return <HeroSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      {renderActiveSection()}
    </div>
  );
};

export default Index;
