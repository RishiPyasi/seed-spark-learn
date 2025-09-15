import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Habit } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEcoPoints } from '@/hooks/useEcoPoints';
import { Calendar, Flame, Plus, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const PRESET_HABITS = [
  {
    name: 'Shorter Showers',
    description: 'Take 5-minute showers to save water',
    ecoPointsPerDay: 10,
    category: 'water' as const
  },
  {
    name: 'Lights Off',
    description: 'Turn off lights when leaving rooms',
    ecoPointsPerDay: 8,
    category: 'energy' as const
  },
  {
    name: 'Walk or Bike',
    description: 'Use eco-friendly transport for short trips',
    ecoPointsPerDay: 15,
    category: 'transport' as const
  },
  {
    name: 'Separate Waste',
    description: 'Properly sort recyclables and compost',
    ecoPointsPerDay: 12,
    category: 'waste' as const
  },
  {
    name: 'Learn Something New',
    description: 'Read about environmental topics',
    ecoPointsPerDay: 5,
    category: 'learning' as const
  }
];

const CATEGORY_COLORS = {
  water: 'bg-blue-500',
  energy: 'bg-yellow-500',
  transport: 'bg-green-500',
  waste: 'bg-purple-500',
  learning: 'bg-pink-500'
};

const CATEGORY_ICONS = {
  water: '💧',
  energy: '⚡',
  transport: '🚲',
  waste: '♻️',
  learning: '📚'
};

// Generate calendar dates for current month and previous month
const generateCalendarDates = () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Get dates for current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dates = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(new Date(currentYear, currentMonth, day));
  }
  
  // Add some days from previous month for context
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const startDayOfWeek = startOfMonth.getDay();
  
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(currentYear, currentMonth, -i);
    dates.unshift(prevDate);
  }
  
  return dates.slice(0, 42); // Limit to 6 weeks
};

export const Habits = () => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('eco-habits', []);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { addPoints } = useEcoPoints();

  const addHabit = (habitTemplate: typeof PRESET_HABITS[0]) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitTemplate.name,
      description: habitTemplate.description,
      ecoPointsPerDay: habitTemplate.ecoPointsPerDay,
      completedDates: [],
      streak: 0,
      category: habitTemplate.category
    };

    setHabits(prev => [...prev, newHabit]);
    toast.success(`🎯 "${habitTemplate.name}" habit added!`);
  };

  const toggleHabitForDate = (habitId: string, date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(dateString);
        let newCompletedDates;
        
        if (isCompleted) {
          // Remove the date
          newCompletedDates = habit.completedDates.filter(d => d !== dateString);
          addPoints(-habit.ecoPointsPerDay, `Removed: ${habit.name}`);
        } else {
          // Add the date
          newCompletedDates = [...habit.completedDates, dateString].sort();
          addPoints(habit.ecoPointsPerDay, `Completed: ${habit.name}`);
        }

        // Calculate new streak
        const today = new Date().toISOString().split('T')[0];
        let streak = 0;
        const sortedDates = newCompletedDates.sort().reverse();
        
        for (let i = 0; i < sortedDates.length; i++) {
          const checkDate = new Date();
          checkDate.setDate(checkDate.getDate() - i);
          const checkDateString = checkDate.toISOString().split('T')[0];
          
          if (sortedDates.includes(checkDateString)) {
            streak++;
          } else {
            break;
          }
        }

        return {
          ...habit,
          completedDates: newCompletedDates,
          streak
        };
      }
      return habit;
    }));
  };

  const removeHabit = (habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
    toast.success('Habit removed');
  };

  const calendarDates = useMemo(() => generateCalendarDates(), []);
  const today = new Date().toISOString().split('T')[0];
  
  const totalPointsEarned = habits.reduce((sum, habit) => 
    sum + (habit.completedDates.length * habit.ecoPointsPerDay), 0
  );
  
  const currentStreak = Math.max(...habits.map(h => h.streak), 0);
  const completedToday = habits.filter(habit => 
    habit.completedDates.includes(today)
  ).length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">📅 Habit Tracker</h1>
        <p className="text-muted-foreground">Build eco-friendly habits with our visual heatmap!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="eco-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{habits.length}</div>
            <div className="text-sm text-muted-foreground">Active Habits</div>
          </CardContent>
        </Card>
        <Card className="eco-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-eco-growth">{completedToday}</div>
            <div className="text-sm text-muted-foreground">Completed Today</div>
          </CardContent>
        </Card>
        <Card className="eco-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-eco-leaf flex items-center justify-center gap-1">
              <Flame className="h-6 w-6 text-orange-500" />
              {currentStreak}
            </div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </CardContent>
        </Card>
        <Card className="eco-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">{totalPointsEarned}</div>
            <div className="text-sm text-muted-foreground">Points Earned</div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Habits */}
      <Card className="eco-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Eco-Habits
          </CardTitle>
          <CardDescription>Choose from popular environmental habits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRESET_HABITS.filter(preset => 
              !habits.some(habit => habit.name === preset.name)
            ).map((preset, index) => (
              <div key={index} className="p-3 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{CATEGORY_ICONS[preset.category]}</span>
                    <div>
                      <h4 className="font-semibold text-sm">{preset.name}</h4>
                      <p className="text-xs text-muted-foreground">{preset.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Badge className="eco-badge text-xs">
                    +{preset.ecoPointsPerDay} pts/day
                  </Badge>
                  <Button size="sm" onClick={() => addHabit(preset)}>
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Habit Heatmap */}
      {habits.length > 0 && (
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Habit Heatmap - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </CardTitle>
            <CardDescription>Track your daily progress visually</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-xs font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-6">
              {calendarDates.map((date, index) => {
                const dateString = date.toISOString().split('T')[0];
                const isToday = dateString === today;
                const isCurrentMonth = date.getMonth() === new Date().getMonth();
                
                // Count completed habits for this date
                const completedHabitsCount = habits.filter(habit =>
                  habit.completedDates.includes(dateString)
                ).length;
                
                const completionRatio = habits.length > 0 ? completedHabitsCount / habits.length : 0;
                
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      aspect-square p-1 text-xs rounded-md border transition-all
                      ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground opacity-50'}
                      ${isToday ? 'ring-2 ring-primary' : ''}
                      ${selectedDate.toDateString() === date.toDateString() ? 'ring-2 ring-eco-leaf' : ''}
                      ${completionRatio === 0 ? 'bg-muted' : 
                        completionRatio <= 0.25 ? 'bg-eco-leaf-light' :
                        completionRatio <= 0.5 ? 'bg-eco-leaf/50' :
                        completionRatio <= 0.75 ? 'bg-eco-leaf/75' :
                        'bg-eco-leaf'}
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-muted"></div>
                <div className="w-3 h-3 rounded-sm bg-eco-leaf-light"></div>
                <div className="w-3 h-3 rounded-sm bg-eco-leaf/50"></div>
                <div className="w-3 h-3 rounded-sm bg-eco-leaf/75"></div>
                <div className="w-3 h-3 rounded-sm bg-eco-leaf"></div>
              </div>
              <span>More</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Habit Checklist */}
      {habits.length > 0 && (
        <Card className="eco-card">
          <CardHeader>
            <CardTitle>
              Today's Habits - {selectedDate.toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {habits.map((habit) => {
              const dateString = selectedDate.toISOString().split('T')[0];
              const isCompleted = habit.completedDates.includes(dateString);
              const canModify = dateString <= today; // Can only modify today or past dates
              
              return (
                <div key={habit.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => canModify && toggleHabitForDate(habit.id, selectedDate)}
                      disabled={!canModify}
                      className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                        ${isCompleted 
                          ? 'bg-eco-leaf border-eco-leaf text-white' 
                          : 'border-muted-foreground hover:border-eco-leaf'
                        }
                        ${!canModify ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      {isCompleted && <Check className="h-3 w-3" />}
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{CATEGORY_ICONS[habit.category]}</span>
                      <div>
                        <h4 className="font-medium">{habit.name}</h4>
                        <p className="text-sm text-muted-foreground">{habit.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {habit.streak > 0 && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Flame className="h-3 w-3 text-orange-500" />
                        {habit.streak}
                      </Badge>
                    )}
                    <Badge className="eco-badge">
                      +{habit.ecoPointsPerDay}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeHabit(habit.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {habits.length === 0 && (
        <Card className="eco-card text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold mb-2">Start Building Eco-Habits</h3>
          <p className="text-muted-foreground mb-4">
            Add your first habit and start tracking your environmental impact!
          </p>
          <Button onClick={() => addHabit(PRESET_HABITS[0])}>
            🌱 Add Your First Habit
          </Button>
        </Card>
      )}
    </div>
  );
};