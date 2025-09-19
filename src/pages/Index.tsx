import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEcoPoints } from '@/hooks/useEcoPoints';
import { getRandomImpactFact } from '@/utils/impactCalculator';
import { Sprout, Target, Calendar, ShoppingBag, Trophy, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import petPlantImage from '@/assets/pet-plant.png';
import treeImage from '@/assets/tree-silhouette.png';

const Index = () => {
  const [user] = useLocalStorage('eco-user', {
    name: 'Eco Explorer',
    ecoPoints: 250,
    level: 3,
    streakDays: 12
  });
  
  const [impactFact] = useState(getRandomImpactFact());
  const { ecoPoints } = useEcoPoints(user.ecoPoints);

  const quickActions = [
    { name: 'Water Plants', icon: '💧', points: '+5', action: 'gardens' },
    { name: 'Complete Goal', icon: '🎯', points: '+15', action: 'goals' },
    { name: 'Log Habit', icon: '✅', points: '+10', action: 'habits' },
    { name: 'Visit Shop', icon: '🛒', points: '', action: 'shop' }
  ];

  return (
    <Layout currentUser={{ name: user.name, ecoPoints, level: user.level }}>
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl p-8 nature-gradient text-primary-foreground">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}! 🌱</h1>
            <p className="text-xl opacity-90">Ready to make a positive environmental impact today?</p>
          </div>
          <img 
            src={treeImage} 
            alt="Tree" 
            className="absolute bottom-0 right-4 h-32 opacity-30 animate-sway"
          />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="eco-card">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{ecoPoints}</div>
              <div className="text-sm text-muted-foreground">Eco-Points</div>
            </CardContent>
          </Card>
          <Card className="eco-card">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-eco-growth">Level {user.level}</div>
              <div className="text-sm text-muted-foreground">Current Level</div>
            </CardContent>
          </Card>
          <Card className="eco-card">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-eco-leaf flex items-center justify-center gap-1">
                🔥 {user.streakDays}
              </div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
          <Card className="eco-card">
            <CardContent className="p-4 text-center">
              <img 
                src={petPlantImage} 
                alt="Pet Plant" 
                className="w-10 h-10 mx-auto mb-1 animate-bounce-soft"
              />
              <div className="text-sm text-muted-foreground">Your Pet Buddy</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle>🚀 Quick Actions</CardTitle>
            <CardDescription>Fast ways to earn eco-points and help the environment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action, index) => (
                <Button key={index} variant="outline" className="h-auto p-4 flex flex-col gap-2" asChild>
                  <Link to={`/${action.action}`}>
                    <span className="text-2xl">{action.icon}</span>
                    <span className="text-sm font-medium">{action.name}</span>
                    {action.points && <Badge className="eco-badge text-xs">{action.points}</Badge>}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Impact Fact */}
        <Card className="eco-card border-eco-growth">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🌍</div>
              <div>
                <h3 className="font-semibold text-eco-leaf">Did You Know?</h3>
                <p className="text-sm text-muted-foreground">{impactFact}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
