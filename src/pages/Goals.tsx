import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Goal } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEcoPoints } from '@/hooks/useEcoPoints';
import { Target, Plus, CheckCircle, Calendar, Trophy } from 'lucide-react';
import { toast } from 'sonner';

const GOAL_CATEGORIES = [
  { id: 'water-saving', name: 'Water Conservation', icon: '💧', color: 'text-blue-600' },
  { id: 'energy-saving', name: 'Energy Efficiency', icon: '⚡', color: 'text-yellow-600' },
  { id: 'recycling', name: 'Recycling & Waste', icon: '♻️', color: 'text-green-600' },
  { id: 'learning', name: 'Eco Learning', icon: '📚', color: 'text-purple-600' },
  { id: 'social', name: 'Community Impact', icon: '🤝', color: 'text-pink-600' }
];

const PRESET_GOALS = [
  {
    title: 'Water Warrior Week',
    description: 'Take shorter showers for 7 days',
    type: 'weekly' as const,
    target: 7,
    category: 'water-saving' as const,
    ecoPointsReward: 50
  },
  {
    title: 'Energy Saver Challenge',
    description: 'Turn off lights when leaving rooms',
    type: 'daily' as const,
    target: 10,
    category: 'energy-saving' as const,
    ecoPointsReward: 75
  },
  {
    title: 'Recycling Champion',
    description: 'Recycle items properly every day',
    type: 'weekly' as const,
    target: 7,
    category: 'recycling' as const,
    ecoPointsReward: 60
  },
  {
    title: 'Green Knowledge Quest',
    description: 'Complete environmental learning modules',
    type: 'monthly' as const,
    target: 5,
    category: 'learning' as const,
    ecoPointsReward: 100
  }
];

export const Goals = () => {
  const [goals, setGoals] = useLocalStorage<Goal[]>('eco-goals', []);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    type: 'daily' as Goal['type'],
    target: 1,
    category: 'water-saving' as Goal['category'],
    ecoPointsReward: 10
  });
  const { addPoints } = useEcoPoints();

  const createGoal = (goalTemplate?: typeof PRESET_GOALS[0]) => {
    const goalData = goalTemplate || newGoal;
    
    if (!goalData.title.trim()) {
      toast.error('Please enter a goal title');
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: goalData.title,
      description: goalData.description,
      type: goalData.type,
      target: goalData.target,
      current: 0,
      ecoPointsReward: goalData.ecoPointsReward,
      isCompleted: false,
      category: goalData.category,
      deadline: goalData.type === 'daily' 
        ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        : goalData.type === 'weekly' 
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    setGoals(prev => [...prev, goal]);
    setShowCreateForm(false);
    setNewGoal({
      title: '',
      description: '',
      type: 'daily',
      target: 1,
      category: 'water-saving',
      ecoPointsReward: 10
    });

    toast.success('🎯 Goal created!', {
      description: 'Start working towards your eco-friendly target!'
    });
  };

  const updateProgress = (goalId: string, increment: number = 1) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId && !goal.isCompleted) {
        const newCurrent = Math.min(goal.target, goal.current + increment);
        const isNowCompleted = newCurrent >= goal.target;

        if (isNowCompleted && !goal.isCompleted) {
          addPoints(goal.ecoPointsReward, `Completed goal: ${goal.title}`);
          toast.success('🏆 Goal Completed!', {
            description: `Earned ${goal.ecoPointsReward} eco-points!`
          });
        }

        return {
          ...goal,
          current: newCurrent,
          isCompleted: isNowCompleted
        };
      }
      return goal;
    }));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    toast.success('Goal deleted');
  };

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);
  const totalPointsEarned = completedGoals.reduce((sum, g) => sum + g.ecoPointsReward, 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">🎯 My Goals</h1>
        <p className="text-muted-foreground">Set and track your environmental goals!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="eco-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{activeGoals.length}</div>
            <div className="text-sm text-muted-foreground">Active Goals</div>
          </CardContent>
        </Card>
        <Card className="eco-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-eco-growth">{completedGoals.length}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card className="eco-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-eco-leaf">{totalPointsEarned}</div>
            <div className="text-sm text-muted-foreground">Points Earned</div>
          </CardContent>
        </Card>
        <Card className="eco-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">
              {activeGoals.length > 0 ? Math.round(activeGoals.reduce((sum, g) => sum + (g.current / g.target * 100), 0) / activeGoals.length) : 0}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Progress</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Goals */}
      <Card className="eco-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Quick Start Challenges
          </CardTitle>
          <CardDescription>Popular eco-friendly goals to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRESET_GOALS.map((preset, index) => {
              const category = GOAL_CATEGORIES.find(c => c.id === preset.category);
              return (
                <div key={index} className="p-4 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">{preset.title}</h4>
                      <p className="text-xs text-muted-foreground">{preset.description}</p>
                    </div>
                    <Button size="sm" onClick={() => createGoal(preset)}>
                      Add
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="outline" className={category?.color}>
                      {category?.icon} {category?.name}
                    </Badge>
                    <span className="text-sm font-medium text-eco-growth">
                      +{preset.ecoPointsReward} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Create Custom Goal */}
      <Card className="eco-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Custom Goal
            </span>
            <Button 
              variant="outline" 
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Cancel' : 'New Goal'}
            </Button>
          </CardTitle>
        </CardHeader>
        {showCreateForm && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Reduce plastic usage"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newGoal.category} onValueChange={(value: Goal['category']) => setNewGoal(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GOAL_CATEGORIES.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newGoal.description}
                onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your goal..."
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="type">Duration</Label>
                <Select value={newGoal.type} onValueChange={(value: Goal['type']) => setNewGoal(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="target">Target</Label>
                <Input
                  id="target"
                  type="number"
                  min="1"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, target: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="reward">Reward Points</Label>
                <Input
                  id="reward"
                  type="number"
                  min="1"
                  value={newGoal.ecoPointsReward}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, ecoPointsReward: Number(e.target.value) }))}
                />
              </div>
            </div>
            <Button onClick={() => createGoal()} className="w-full">
              🎯 Create Goal
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">🎯 Active Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGoals.map((goal) => {
              const category = GOAL_CATEGORIES.find(c => c.id === goal.category);
              const progress = (goal.current / goal.target) * 100;
              const isOverdue = goal.deadline && new Date() > goal.deadline;
              
              return (
                <Card key={goal.id} className={`eco-card ${isOverdue ? 'border-red-500' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        <CardDescription>{goal.description}</CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteGoal(goal.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={category?.color}>
                        {category?.icon} {goal.type}
                      </Badge>
                      {isOverdue && <Badge variant="destructive">Overdue</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{goal.current} / {goal.target}</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {goal.deadline && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {goal.deadline.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-medium text-eco-growth">
                        +{goal.ecoPointsReward} points
                      </div>
                    </div>

                    <Button
                      onClick={() => updateProgress(goal.id)}
                      className="w-full"
                      disabled={goal.isCompleted}
                    >
                      ⬆️ Mark Progress
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Completed Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {completedGoals.map((goal) => {
              const category = GOAL_CATEGORIES.find(c => c.id === goal.category);
              return (
                <Card key={goal.id} className="eco-card border-eco-growth">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🏆</div>
                      <h4 className="font-semibold text-sm mb-1">{goal.title}</h4>
                      <Badge variant="outline" className={category?.color}>
                        {category?.icon} Completed
                      </Badge>
                      <div className="mt-2 text-sm text-eco-growth font-medium">
                        +{goal.ecoPointsReward} points earned
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <Card className="eco-card text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">No Goals Yet</h3>
          <p className="text-muted-foreground mb-4">
            Set your first environmental goal and start your eco-journey!
          </p>
          <Button onClick={() => setShowCreateForm(true)}>
            🎯 Create Your First Goal
          </Button>
        </Card>
      )}
    </div>
  );
};