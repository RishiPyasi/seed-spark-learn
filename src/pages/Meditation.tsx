import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, 
  Leaf, Waves, Bird, Zap, Timer, Mountain,
  Moon, Sun, Cloud, TreePine, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MeditationSession {
  id: string;
  title: string;
  description: string;
  category: 'nature' | 'focus' | 'relaxation' | 'energy';
  duration: number;
  icon: React.ReactNode;
  color: string;
  audioUrl?: string;
  backgroundImage: string;
  guided?: boolean;
}

const meditationSessions: MeditationSession[] = [
  {
    id: 'forest-sounds',
    title: 'Forest Sanctuary',
    description: 'Immerse yourself in the peaceful sounds of a thriving forest ecosystem',
    category: 'nature',
    duration: 600, // 10 minutes
    icon: <TreePine className="w-6 h-6" />,
    color: 'eco-leaf',
    backgroundImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    guided: false
  },
  {
    id: 'ocean-waves',
    title: 'Ocean Calm',
    description: 'Relax with the rhythmic sounds of gentle ocean waves',
    category: 'relaxation',
    duration: 900, // 15 minutes
    icon: <Waves className="w-6 h-6" />,
    color: 'eco-water',
    backgroundImage: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    guided: false
  },
  {
    id: 'mountain-peace',
    title: 'Mountain Serenity',
    description: 'Find inner peace inspired by majestic mountain landscapes',
    category: 'focus',
    duration: 480, // 8 minutes
    icon: <Mountain className="w-6 h-6" />,
    color: 'eco-earth',
    backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    guided: true
  },
  {
    id: 'dawn-energy',
    title: 'Dawn Awakening',
    description: 'Energize your day with a sunrise-inspired meditation',
    category: 'energy',
    duration: 300, // 5 minutes
    icon: <Sun className="w-6 h-6" />,
    color: 'eco-growth',
    backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    guided: true
  },
  {
    id: 'rainfall-focus',
    title: 'Gentle Rainfall',
    description: 'Enhance focus and concentration with soothing rain sounds',
    category: 'focus',
    duration: 1200, // 20 minutes
    icon: <Cloud className="w-6 h-6" />,
    color: 'eco-water',
    backgroundImage: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    guided: false
  },
  {
    id: 'evening-wind',
    title: 'Evening Breeze',
    description: 'Unwind with the gentle whisper of evening wind through leaves',
    category: 'relaxation',
    duration: 720, // 12 minutes
    icon: <Leaf className="w-6 h-6" />,
    color: 'eco-leaf',
    backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    guided: false
  }
];

export const Meditation = () => {
  const navigate = useNavigate();
  const [currentSession, setCurrentSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [customDuration, setCustomDuration] = useState<number | null>(null);
  const [completedSessions, setCompletedSessions] = useLocalStorage<string[]>('meditation-sessions', []);
  const [totalMeditationTime, setTotalMeditationTime] = useLocalStorage('total-meditation-time', 0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = (session: MeditationSession, duration?: number) => {
    setCurrentSession(session);
    setCurrentTime(0);
    setCustomDuration(duration || null);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseSession();
    } else {
      playSession();
    }
  };

  const playSession = () => {
    setIsPlaying(true);
    
    // Start audio if available
    if (audioRef.current) {
      audioRef.current.play();
    }

    // Start timer
    intervalRef.current = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 1;
        const sessionDuration = customDuration || (currentSession?.duration ?? 0);
        
        if (newTime >= sessionDuration) {
          completeSession();
          return sessionDuration;
        }
        return newTime;
      });
    }, 1000);
  };

  const pauseSession = () => {
    setIsPlaying(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resetSession = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
  };

  const completeSession = () => {
    if (!currentSession) return;
    
    setIsPlaying(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Add to completed sessions
    const sessionId = `${currentSession.id}-${Date.now()}`;
    setCompletedSessions(prev => [...prev, sessionId]);
    
    // Add to total meditation time
    const sessionDuration = customDuration || currentSession.duration;
    setTotalMeditationTime(prev => prev + sessionDuration);
    
    // Show completion message
    setTimeout(() => {
      alert('🧘‍♀️ Meditation complete! Well done on taking time for yourself and the planet.');
    }, 500);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume / 100 : 0;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nature': return 'text-eco-leaf bg-eco-leaf/10';
      case 'focus': return 'text-eco-growth bg-eco-growth/10';
      case 'relaxation': return 'text-eco-water bg-eco-water/10';
      case 'energy': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-eco-leaf bg-eco-leaf/10';
    }
  };

  const getTotalMeditationStats = () => {
    const totalHours = Math.floor(totalMeditationTime / 3600);
    const totalMinutes = Math.floor((totalMeditationTime % 3600) / 60);
    const completedCount = completedSessions.length;
    
    return { totalHours, totalMinutes, completedCount };
  };

  const stats = getTotalMeditationStats();

  if (currentSession) {
    const sessionDuration = customDuration || currentSession.duration;
    const progress = (currentTime / sessionDuration) * 100;

    return (
      <div 
        className="min-h-screen relative flex items-center justify-center p-6"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${currentSession.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Hidden audio element for background sounds */}
        <audio
          ref={audioRef}
          loop
          preload="none"
        >
          {/* In a real app, these would be actual audio files */}
          <source src="/meditation-sounds/forest.mp3" type="audio/mpeg" />
        </audio>

        <Card className="w-full max-w-md eco-card backdrop-blur-sm bg-white/90 dark:bg-black/80">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-full bg-${currentSession.color}/20`}>
                {currentSession.icon}
              </div>
            </div>
            <CardTitle className="text-2xl">{currentSession.title}</CardTitle>
            <p className="text-muted-foreground">{currentSession.description}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Timer Display */}
            <div className="text-center">
              <div className="text-4xl font-mono font-bold mb-2">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-muted-foreground">
                / {formatTime(sessionDuration)}
              </div>
              <Progress value={progress} className="mt-4" />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={resetSession}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              
              <Button
                size="lg"
                onClick={togglePlayPause}
                className="w-16 h-16 rounded-full bg-eco-leaf hover:bg-eco-leaf/90"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentSession(null)}
              >
                End
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="flex-1"
              />
            </div>

            {/* Guided Meditation Note */}
            {currentSession.guided && (
              <div className="p-3 bg-eco-growth/10 rounded-lg border border-eco-growth/20">
                <p className="text-sm text-eco-growth text-center">
                  🎧 This is a guided meditation with voice instructions
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-leaf/5 to-eco-water/5 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            🧘‍♀️ Mindful Nature Meditation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with nature through peaceful meditation sessions designed to reduce stress and increase environmental awareness
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="eco-card">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-eco-leaf">{stats.completedCount}</div>
              <div className="text-sm text-muted-foreground">Sessions Completed</div>
            </CardContent>
          </Card>
          <Card className="eco-card">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-eco-growth">{stats.totalHours}h {stats.totalMinutes}m</div>
              <div className="text-sm text-muted-foreground">Total Meditation Time</div>
            </CardContent>
          </Card>
          <Card className="eco-card">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-eco-water">🌱</div>
              <div className="text-sm text-muted-foreground">Mindfulness Level: Growing</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Timer Options */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              Quick Meditation Timer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[3, 5, 10, 15].map(minutes => (
                <Button
                  key={minutes}
                  variant="outline"
                  onClick={() => startSession(meditationSessions[0], minutes * 60)}
                  className="p-4 h-auto flex flex-col gap-1"
                >
                  <Timer className="w-5 h-5" />
                  <span>{minutes} min</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Meditation Sessions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meditationSessions.map((session) => (
            <Card key={session.id} className="eco-card group cursor-pointer hover:scale-105 transition-all">
              <div
                className="h-48 bg-cover bg-center rounded-t-lg relative"
                style={{ backgroundImage: `url(${session.backgroundImage})` }}
              >
                <div className="absolute inset-0 bg-black/30 rounded-t-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => startSession(session)}
                    size="lg"
                    className="bg-white/90 text-black hover:bg-white rounded-full"
                  >
                    <Play className="w-6 h-6" />
                  </Button>
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(session.category)}`}>
                    {session.category}
                  </span>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {session.icon}
                  {session.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {session.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Timer className="w-4 h-4" />
                    {Math.floor(session.duration / 60)} min
                  </span>
                  {session.guided && (
                    <span className="flex items-center gap-1 text-eco-growth">
                      <Zap className="w-4 h-4" />
                      Guided
                    </span>
                  )}
                </div>

                <Button
                  onClick={() => startSession(session)}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Session
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits */}
        <Card className="eco-card">
          <CardContent className="p-6">
            <h3 className="text-2xl font-semibold mb-4 text-center">
              🌿 Benefits of Nature Meditation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2">🧠</div>
                <h4 className="font-semibold mb-1">Reduces Stress</h4>
                <p className="text-sm text-muted-foreground">Lower cortisol levels and anxiety</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🌱</div>
                <h4 className="font-semibold mb-1">Eco-Connection</h4>
                <p className="text-sm text-muted-foreground">Deeper connection with nature</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💚</div>
                <h4 className="font-semibold mb-1">Better Sleep</h4>
                <p className="text-sm text-muted-foreground">Improved sleep quality and duration</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-semibold mb-1">Enhanced Focus</h4>
                <p className="text-sm text-muted-foreground">Better concentration and clarity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};