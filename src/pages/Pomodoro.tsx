import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PushNotificationService } from '@/utils/pushNotifications';
import { 
  Play, Pause, RotateCcw, Settings, BookOpen, 
  Coffee, Target, TrendingUp, Calendar,
  CheckCircle, Clock, Zap, Award
} from 'lucide-react';

interface PomodoroSession {
  id: string;
  startTime: Date;
  endTime: Date;
  type: 'focus' | 'short-break' | 'long-break';
  completed: boolean;
  subject?: string;
}

interface PomodoroStats {
  totalSessions: number;
  totalFocusTime: number; // in minutes
  todaySessions: number;
  currentStreak: number;
}

export const Pomodoro = () => {
  // Timer settings (in minutes)
  const [focusTime, setFocusTime] = useLocalStorage('pomodoro-focus-time', 25);
  const [shortBreakTime, setShortBreakTime] = useLocalStorage('pomodoro-short-break', 5);
  const [longBreakTime, setLongBreakTime] = useLocalStorage('pomodoro-long-break', 15);
  const [longBreakInterval, setLongBreakInterval] = useLocalStorage('pomodoro-long-break-interval', 4);

  // Timer state
  const [currentTime, setCurrentTime] = useState(focusTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentType, setCurrentType] = useState<'focus' | 'short-break' | 'long-break'>('focus');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [currentSubject, setCurrentSubject] = useState('');
  
  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [tempFocusTime, setTempFocusTime] = useState(focusTime);
  const [tempShortBreak, setTempShortBreak] = useState(shortBreakTime);
  const [tempLongBreak, setTempLongBreak] = useState(longBreakTime);
  
  // Data persistence
  const [sessions, setSessions] = useLocalStorage<PomodoroSession[]>('pomodoro-sessions', []);
  const [stats, setStats] = useLocalStorage<PomodoroStats>('pomodoro-stats', {
    totalSessions: 0,
    totalFocusTime: 0,
    todaySessions: 0,
    currentStreak: 0
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const notificationService = PushNotificationService.getInstance();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionDuration = (type: 'focus' | 'short-break' | 'long-break'): number => {
    switch (type) {
      case 'focus': return focusTime * 60;
      case 'short-break': return shortBreakTime * 60;
      case 'long-break': return longBreakTime * 60;
    }
  };

  const startTimer = () => {
    setIsRunning(true);
    
    intervalRef.current = setInterval(() => {
      setCurrentTime(prev => {
        if (prev <= 1) {
          completeSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentTime(getSessionDuration(currentType));
  };

  const completeSession = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Create session record
    const session: PomodoroSession = {
      id: Date.now().toString(),
      startTime: new Date(Date.now() - getSessionDuration(currentType) * 1000),
      endTime: new Date(),
      type: currentType,
      completed: true,
      subject: currentSubject || undefined
    };

    setSessions(prev => [...prev, session]);

    // Update stats
    setStats(prev => {
      const newStats = { ...prev };
      newStats.totalSessions++;
      
      if (currentType === 'focus') {
        newStats.totalFocusTime += focusTime;
        newStats.currentStreak++;
      }
      
      // Check if it's today's session
      const today = new Date().toDateString();
      const sessionDate = new Date().toDateString();
      if (today === sessionDate) {
        newStats.todaySessions++;
      }
      
      return newStats;
    });

    // Send notification
    if (currentType === 'focus') {
      notificationService.sendNotification('🎯 Focus Session Complete!', {
        body: 'Great job! Time for a well-deserved break.',
        tag: 'pomodoro-complete'
      });
      setSessionsCompleted(prev => prev + 1);
    } else {
      notificationService.sendNotification('☕ Break Complete!', {
        body: 'Break time is over. Ready for another focus session?',
        tag: 'break-complete'
      });
    }

    // Auto-advance to next session
    setTimeout(() => {
      nextSession();
    }, 2000);
  };

  const nextSession = () => {
    let nextType: 'focus' | 'short-break' | 'long-break';
    
    if (currentType === 'focus') {
      // After focus: short break or long break
      nextType = (sessionsCompleted % longBreakInterval === 0 && sessionsCompleted > 0) 
        ? 'long-break' 
        : 'short-break';
    } else {
      // After any break: focus session
      nextType = 'focus';
    }
    
    setCurrentType(nextType);
    setCurrentTime(getSessionDuration(nextType));
  };

  const saveSettings = () => {
    setFocusTime(tempFocusTime);
    setShortBreakTime(tempShortBreak);
    setLongBreakTime(tempLongBreak);
    setCurrentTime(getSessionDuration(currentType));
    setShowSettings(false);
  };

  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(s => 
      new Date(s.startTime).toDateString() === today && s.type === 'focus'
    );
    
    const focusTime = todaySessions.reduce((total, session) => {
      return total + focusTime;
    }, 0);
    
    return {
      sessions: todaySessions.length,
      focusTime: focusTime,
      subjects: [...new Set(todaySessions.map(s => s.subject).filter(Boolean))]
    };
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Initialize notifications
    notificationService.initialize();
  }, []);

  const progress = ((getSessionDuration(currentType) - currentTime) / getSessionDuration(currentType)) * 100;
  const todayStats = getTodayStats();

  const getTypeConfig = () => {
    switch (currentType) {
      case 'focus':
        return {
          title: '🎯 Focus Time',
          description: 'Time to concentrate and be productive!',
          color: 'eco-leaf',
          bgColor: 'from-eco-leaf/10 to-eco-growth/10'
        };
      case 'short-break':
        return {
          title: '☕ Short Break',
          description: 'Take a quick breather and recharge.',
          color: 'eco-growth',
          bgColor: 'from-eco-growth/10 to-yellow-100'
        };
      case 'long-break':
        return {
          title: '🧘‍♀️ Long Break',
          description: 'Time for a longer rest and reflection.',
          color: 'eco-water',
          bgColor: 'from-eco-water/10 to-blue-100'
        };
    }
  };

  const typeConfig = getTypeConfig();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${typeConfig.bgColor} p-6`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            🍅 EcoPomodoro Study Timer
          </h1>
          <p className="text-xl text-muted-foreground">
            Boost your productivity while maintaining focus and well-being
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="eco-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-eco-leaf">{todayStats.sessions}</div>
              <div className="text-sm text-muted-foreground">Today's Sessions</div>
            </CardContent>
          </Card>
          <Card className="eco-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-eco-growth">{todayStats.focusTime}m</div>
              <div className="text-sm text-muted-foreground">Focus Time Today</div>
            </CardContent>
          </Card>
          <Card className="eco-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-eco-water">{stats.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </CardContent>
          </Card>
          <Card className="eco-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalSessions}</div>
              <div className="text-sm text-muted-foreground">Total Sessions</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Timer */}
        <Card className="eco-card">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge className={`bg-${typeConfig.color} text-white`}>
                Session {sessionsCompleted + 1}
              </Badge>
              {currentType === 'focus' && (
                <Badge variant="outline">
                  {Math.floor(sessionsCompleted / longBreakInterval) + 1} of {longBreakInterval}
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl">{typeConfig.title}</CardTitle>
            <p className="text-muted-foreground">{typeConfig.description}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Subject Input (only for focus sessions) */}
            {currentType === 'focus' && (
              <div className="max-w-md mx-auto">
                <Input
                  placeholder="What are you studying? (optional)"
                  value={currentSubject}
                  onChange={(e) => setCurrentSubject(e.target.value)}
                  disabled={isRunning}
                />
              </div>
            )}

            {/* Timer Display */}
            <div className="text-center">
              <div className="text-6xl md:text-8xl font-mono font-bold mb-4">
                {formatTime(currentTime)}
              </div>
              <Progress value={progress} className="max-w-md mx-auto mb-4" />
              <div className="text-sm text-muted-foreground">
                {Math.floor(progress)}% complete
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={resetTimer}
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
              
              <Button
                size="lg"
                onClick={isRunning ? pauseTimer : startTimer}
                className={`w-20 h-20 rounded-full bg-${typeConfig.color} hover:bg-${typeConfig.color}/90`}
              >
                {isRunning ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={nextSession}
                disabled={isRunning}
              >
                Skip Session
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentType('focus');
                  setCurrentTime(getSessionDuration('focus'));
                }}
                disabled={isRunning}
              >
                Start Focus
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No sessions completed yet. Start your first Pomodoro!</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {sessions.slice(-5).reverse().map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {session.type === 'focus' ? (
                        <Target className="w-4 h-4 text-eco-leaf" />
                      ) : (
                        <Coffee className="w-4 h-4 text-eco-growth" />
                      )}
                      <span className="text-sm">
                        {session.subject || session.type.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(session.startTime).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="eco-card w-full max-w-md">
              <CardHeader>
                <CardTitle>⚙️ Timer Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Focus Time (minutes)</label>
                  <Input
                    type="number"
                    value={tempFocusTime}
                    onChange={(e) => setTempFocusTime(parseInt(e.target.value) || 25)}
                    min="1"
                    max="60"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Short Break (minutes)</label>
                  <Input
                    type="number"
                    value={tempShortBreak}
                    onChange={(e) => setTempShortBreak(parseInt(e.target.value) || 5)}
                    min="1"
                    max="30"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Long Break (minutes)</label>
                  <Input
                    type="number"
                    value={tempLongBreak}
                    onChange={(e) => setTempLongBreak(parseInt(e.target.value) || 15)}
                    min="1"
                    max="60"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={saveSettings} className="flex-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                  <Button variant="outline" onClick={() => setShowSettings(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tips */}
        <Card className="eco-card">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-center">
              💡 Pomodoro Pro Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <BookOpen className="w-6 h-6 text-eco-leaf flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Plan Your Session</h4>
                  <p className="text-sm text-muted-foreground">Decide what to study before starting the timer</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Zap className="w-6 h-6 text-eco-growth flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Eliminate Distractions</h4>
                  <p className="text-sm text-muted-foreground">Put your phone away and close unnecessary tabs</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Coffee className="w-6 h-6 text-eco-water flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Use Breaks Wisely</h4>
                  <p className="text-sm text-muted-foreground">Step away from your desk and rest your eyes</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Award className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Track Progress</h4>
                  <p className="text-sm text-muted-foreground">Celebrate completing sessions and building streaks</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};