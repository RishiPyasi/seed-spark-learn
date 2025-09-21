import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, X, Minimize2, Bot, User } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const VerdantChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useLocalStorage<Message[]>('verdant-chat', [
    {
      id: '1',
      text: "Hi! I'm Verdant, your AI environmental learning assistant! 🌱 I can help you with eco-friendly tips, answer questions about sustainability, and guide you through your environmental learning journey. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock AI responses - In a real app, this would connect to an AI service
  const getVerdantResponse = (userMessage: string): string => {
    const responses = {
      greetings: [
        "Hello! 🌿 How can I help you learn about the environment today?",
        "Hi there! 🌱 Ready to explore some eco-friendly knowledge?",
        "Welcome! 🍃 I'm here to guide your environmental learning adventure!"
      ],
      recycling: [
        "Great question about recycling! ♻️ Here are some key tips: Sort materials properly (paper, plastic, glass, metal), clean containers before recycling, and check your local recycling guidelines as they vary by location. Did you know that recycling one aluminum can saves enough energy to power a TV for 3 hours?",
        "Recycling is super important! 🗂️ Remember the 3 R's: Reduce, Reuse, Recycle. Try to reduce consumption first, then reuse items creatively, and finally recycle properly. What specific material are you wondering about?"
      ],
      energy: [
        "Energy conservation is crucial! 💡 Some easy ways to save energy: Switch to LED bulbs, unplug electronics when not in use, use natural light during the day, and adjust your thermostat by just 2 degrees. Small changes make a big impact!",
        "Let's talk energy efficiency! ⚡ You can save energy by using a programmable thermostat, air-drying clothes instead of using the dryer, and choosing energy-efficient appliances. What's your biggest energy concern at home?"
      ],
      water: [
        "Water conservation is vital! 💧 Simple tips: Fix leaky faucets, take shorter showers, use a broom instead of a hose to clean driveways, and collect rainwater for plants. Every drop counts in protecting our precious water resources!",
        "Smart water usage helps our planet! 🚰 Try installing low-flow showerheads, running dishwashers only when full, and choosing native plants that need less water. What water-saving method interests you most?"
      ],
      default: [
        "That's an interesting question! 🤔 While I'm learning more about that topic, I can help you with recycling, energy conservation, water saving, sustainable transportation, and eco-friendly habits. What specific area would you like to explore?",
        "I'd love to help you learn more about that! 🌟 I specialize in environmental topics like climate change, sustainability practices, renewable energy, and green living tips. Is there a particular eco-topic you're curious about?",
        "Thanks for that question! 🌍 I'm continuously learning to better assist with environmental education. I can currently help with waste reduction, energy efficiency, water conservation, and sustainable lifestyle choices. What would you like to know more about?"
      ]
    };

    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
    }
    
    if (message.includes('recycle') || message.includes('trash') || message.includes('waste')) {
      return responses.recycling[Math.floor(Math.random() * responses.recycling.length)];
    }
    
    if (message.includes('energy') || message.includes('electricity') || message.includes('power')) {
      return responses.energy[Math.floor(Math.random() * responses.energy.length)];
    }
    
    if (message.includes('water') || message.includes('conservation') || message.includes('save')) {
      return responses.water[Math.floor(Math.random() * responses.water.length)];
    }
    
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getVerdantResponse(inputMessage),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-eco-leaf to-eco-growth shadow-lg hover:shadow-xl transition-all duration-300 z-50"
      >
        <Bot className="w-6 h-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 h-96 eco-card shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-eco-leaf to-eco-growth text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold">Verdant</div>
            <div className="text-xs opacity-90">AI Learning Assistant</div>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <CardContent className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isUser && (
                  <div className="w-6 h-6 rounded-full bg-eco-leaf/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-eco-leaf" />
                  </div>
                )}
                
                <div
                  className={`max-w-[70%] p-3 rounded-lg text-sm ${
                    message.isUser
                      ? 'bg-eco-leaf text-white ml-auto'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {message.text}
                </div>

                {message.isUser && (
                  <div className="w-6 h-6 rounded-full bg-eco-growth/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-eco-growth" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-eco-leaf/20 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-eco-leaf" />
                </div>
                <div className="bg-muted text-foreground p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-eco-leaf rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-eco-leaf rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-eco-leaf rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <div className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Verdant about the environment..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                size="sm"
                className="bg-eco-leaf hover:bg-eco-leaf/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};