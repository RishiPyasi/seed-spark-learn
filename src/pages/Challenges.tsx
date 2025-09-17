import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ComingSoonDialog } from '@/components/ComingSoonDialog';
import { Target, Trophy, Zap, Clock, Users, CheckCircle } from 'lucide-react';

const MOCK_CHALLENGES = [
  {
    id: '1',
    title: 'Water Conservation Week',
    description: 'Reduce water usage by 20% this week',
    category: 'water',
    difficulty: 'Easy',
    points: 100,
    duration: '7 days',
    progress: 65,
    participants: 147,
    icon: '💧'
  },
  {
    id: '2',
    title: 'Zero Waste Challenge',
    description: 'Generate no plastic waste for 3 days',
    category: 'waste',
    difficulty: 'Hard',
    points: 200,
    duration: '3 days',
    progress: 30,
    participants: 89,
    icon: '♻️'
  },
  {
    id: '3',
    title: 'Green Commute',
    description: 'Use eco-friendly transport all week',
    category: 'transport',
    difficulty: 'Medium',
    points: 150,
    duration: '7 days',
    progress: 85,
    participants: 203,
    icon: '🚲'
  },
  {
    id: '4',
    title: 'Energy Saver',
    description: 'Reduce electricity usage by 15%',
    category: 'energy',
    difficulty: 'Medium',
    points: 120,
    duration: '5 days',
    progress: 0,
    participants: 156,
    icon: '⚡'
  }
];

export const Challenges = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">🎯 Eco Challenges</h1>
        <p className="text-muted-foreground">Complete challenges to earn points and make an impact!</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="eco-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">4</div>
            <div className="text-sm text-muted-foreground">Active Challenges</div>
          </CardContent>
        </Card>
        <Card className="eco-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-eco-growth">2</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card className="eco-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-eco-leaf">570</div>
            <div className="text-sm text-muted-foreground">Points Earned</div>
          </CardContent>
        </Card>
        <Card className="eco-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">85%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Challenges */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-eco-leaf" />
          Available Challenges
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_CHALLENGES.map((challenge) => (
            <Card key={challenge.id} className="eco-card hover-scale transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{challenge.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <CardDescription>{challenge.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {challenge.progress > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{challenge.progress}%</span>
                    </div>
                    <Progress value={challenge.progress} className="h-2" />
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span>{challenge.points} pts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{challenge.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{challenge.participants}</span>
                  </div>
                </div>

                <ComingSoonDialog
                  title="Challenge Verification"
                  description="Upload photos or complete verification steps to prove your challenge completion!"
                  feature="photo verification and progress tracking"
                >
                  <Button 
                    className="w-full" 
                    variant={challenge.progress > 0 ? "default" : "outline"}
                  >
                    {challenge.progress > 0 ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Continue Challenge
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Start Challenge
                      </>
                    )}
                  </Button>
                </ComingSoonDialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Weekly Leaderboard */}
      <Card className="eco-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Weekly Challenge Leaderboard
          </CardTitle>
          <CardDescription>Top performers this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'EcoChampion', points: 450, challenges: 3 },
              { name: 'GreenWarrior', points: 380, challenges: 2 },
              { name: 'NatureLover', points: 320, challenges: 2 },
              { name: 'EarthSaver', points: 250, challenges: 1 },
            ].map((user, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-amber-600 text-white' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium">{user.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {user.challenges} challenges
                  </Badge>
                </div>
                <span className="font-bold text-eco-growth">{user.points} pts</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};