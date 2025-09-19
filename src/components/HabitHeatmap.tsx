import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Habit } from '@/types';

interface HabitHeatmapProps {
  habits: Habit[];
}

interface HeatmapDay {
  date: string;
  count: number;
  level: number; // 0-4 intensity levels
}

export const HabitHeatmap = ({ habits }: HabitHeatmapProps) => {
  const heatmapData = useMemo(() => {
    // Get the last 365 days
    const days: HeatmapDay[] = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Count habits completed on this date
      const count = habits.reduce((sum, habit) => {
        return sum + (habit.completedDates.includes(dateStr) ? 1 : 0);
      }, 0);
      
      // Calculate intensity level (0-4)
      let level = 0;
      if (count > 0) level = 1;
      if (count >= 2) level = 2;
      if (count >= 4) level = 3;
      if (count >= 6) level = 4;
      
      days.push({ date: dateStr, count, level });
    }
    
    return days;
  }, [habits]);

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Group days by weeks
  const weeks = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7));
  }

  const getLevelColor = (level: number) => {
    const colors = [
      'bg-gray-100 dark:bg-gray-800', // 0 - no activity
      'bg-eco-leaf/20', // 1 - low activity
      'bg-eco-leaf/40', // 2 - moderate activity
      'bg-eco-leaf/60', // 3 - high activity
      'bg-eco-leaf/80', // 4 - very high activity
    ];
    return colors[level] || colors[0];
  };

  const totalHabits = habits.reduce((sum, habit) => sum + habit.completedDates.length, 0);
  const currentStreak = Math.max(...habits.map(h => h.streak));
  
  return (
    <Card className="eco-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            🔥 Habit Heatmap
            <Badge className="eco-badge">{totalHabits} total</Badge>
          </span>
          <Badge variant="outline">
            {currentStreak} day streak
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Month labels */}
          <div className="grid grid-cols-12 gap-1 text-xs text-muted-foreground mb-2">
            {monthLabels.map((month, index) => (
              <div key={index} className="text-center">{month}</div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="space-y-1">
            {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => (
              <div key={dayOfWeek} className="flex gap-1">
                <div className="w-8 text-xs text-muted-foreground flex items-center">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek]}
                </div>
                <div className="flex gap-1 flex-1">
                  {weeks.map((week, weekIndex) => {
                    const day = week[dayOfWeek];
                    if (!day) return <div key={weekIndex} className="w-3 h-3" />;
                    
                    return (
                      <div
                        key={weekIndex}
                        className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:scale-110 ${getLevelColor(day.level)}`}
                        title={`${day.date}: ${day.count} habits completed`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getLevelColor(level)}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-semibold text-eco-leaf">{totalHabits}</div>
              <div className="text-xs text-muted-foreground">Total Habits</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-eco-growth">{currentStreak}</div>
              <div className="text-xs text-muted-foreground">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">{habits.length}</div>
              <div className="text-xs text-muted-foreground">Active Habits</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};