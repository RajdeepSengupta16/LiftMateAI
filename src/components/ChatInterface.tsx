import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Dumbbell } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hey! I'm LiftMate, your AI fitness coach. I'm here to help you crush your fitness goals! What would you like to work on today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Fitness-specific responses based on keywords
    if (lowerMessage.includes('workout') || lowerMessage.includes('exercise')) {
      return "I'd love to help you with a workout! What's your main goal today? Are you looking to build strength, improve cardio, or work on flexibility? Also, how much time do you have available?";
    }
    if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition') || lowerMessage.includes('eat')) {
      return "Nutrition is crucial for your fitness goals! For muscle building, aim for 1.6-2.2g protein per kg body weight. Focus on whole foods: lean proteins, complex carbs, healthy fats, and plenty of vegetables. What's your current goal - building muscle, losing fat, or maintaining?";
    }
    if (lowerMessage.includes('beginner') || lowerMessage.includes('start')) {
      return "Welcome to your fitness journey! I recommend starting with 3 full-body workouts per week. Focus on basic movements: squats, push-ups, rows, and planks. Start with bodyweight or light weights. Most importantly - consistency beats intensity when you're starting out!";
    }
    if (lowerMessage.includes('weight loss') || lowerMessage.includes('lose weight')) {
      return "For sustainable weight loss, combine strength training with cardio and focus on a moderate caloric deficit (300-500 calories below maintenance). Aim for 150-300 minutes of moderate exercise weekly. Remember: weight loss happens in the kitchen, but fitness happens in the gym!";
    }
    if (lowerMessage.includes('muscle') || lowerMessage.includes('strength') || lowerMessage.includes('gain')) {
      return "Building muscle requires progressive overload! Focus on compound movements like squats, deadlifts, bench press, and rows. Aim for 3-4 sets of 6-12 reps with challenging weight. Don't forget - muscle is built during recovery, so get 7-9 hours of sleep!";
    }
    if (lowerMessage.includes('cardio')) {
      return "Great cardio options include HIIT (15-20 min), steady-state running/cycling (30-45 min), or circuit training. For fat loss, try 3-4 cardio sessions weekly. For endurance, gradually increase duration. Mix it up to prevent boredom and overuse injuries!";
    }
    if (lowerMessage.includes('rest') || lowerMessage.includes('recovery')) {
      return "Recovery is where the magic happens! Take 1-2 full rest days weekly, get 7-9 hours of sleep, stay hydrated, and consider light activities like walking or yoga on rest days. Listen to your body - soreness is normal, but sharp pain means rest!";
    }
    if (lowerMessage.includes('motivation') || lowerMessage.includes('motivated')) {
      return "Staying motivated is a challenge we all face! Set small, achievable goals, track your progress, find a workout buddy, and remember your 'why'. Progress isn't always linear - celebrate small wins and trust the process. You've got this! 💪";
    }
    
    // Default responses for general fitness queries
    const responses = [
      "That's a great question! Fitness is a journey, and I'm here to guide you every step of the way. What specific aspect would you like to dive deeper into?",
      "I love your dedication! Based on what you're telling me, I think we should focus on creating a sustainable routine that fits your lifestyle. Tell me more about your schedule.",
      "Excellent point! Remember, the best workout is the one you'll actually do consistently. Let's find something you'll enjoy and stick with long-term.",
      "Your commitment to improving your health is inspiring! Let's break down your goals into actionable steps. What would you like to achieve in the next 4 weeks?",
      "Perfect! Consistency and progressive overload are key to seeing results. How has your current routine been working for you so far?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Chat with Your AI Trainer
        </h2>
        <p className="text-muted-foreground">
          Get personalized fitness advice, workout plans, and motivation
        </p>
      </div>

      <Card className="h-[600px] flex flex-col bg-card border-border">
        {/* Chat Header */}
        <div className="flex items-center p-4 border-b border-border bg-muted/30 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">LiftMate AI Coach</h3>
              <p className="text-sm text-muted-foreground">Your personal fitness assistant</p>
            </div>
          </div>
          <div className="ml-auto">
            <Dumbbell className="w-6 h-6 text-primary animate-glow-pulse" />
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className={`flex max-w-[80%] space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-secondary' 
                      : 'bg-primary'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4 text-secondary-foreground" />
                    ) : (
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted text-foreground'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about workouts, nutrition, or fitness goals..."
              className="flex-1 bg-background border-border"
              disabled={isTyping}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              variant="fitness"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;