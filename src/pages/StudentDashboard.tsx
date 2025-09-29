import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEcoPoints } from '@/hooks/useEcoPoints';
import { getRandomImpactFact } from '@/utils/impactCalculator';
import { 
  Trophy, Star, Zap, Heart, Sprout, Users, School, 
  Target, BookOpen, ShoppingBag, FileText, MessageCircle, 
  Calculator, Award, Thermometer, Gamepad2, Calendar,
  TrendingUp, Crown, Leaf, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import petDogImage from '@/assets/pet-dog.png';
import petCatImage from '@/assets/pet-cat.png';
import petPlantImage from '@/assets/pet-plant.png';
import petDuckImage from '@/assets/pet-duck.png';
import petHorseImage from '@/assets/pet-horse.png';
import garden3dImage from '@/assets/garden-3d.png';
import { ComingSoonDialog } from '@/components/ComingSoonDialog';
import { CommunityPopup } from '@/components/CommunityPopup';
import { ImpactPopup } from '@/components/ImpactPopup';

interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  rank: number;
}

interface VirtualPet {
  name: string;
  type: 'dog' | 'cat' | 'plant';
  hunger: number;
  joy: number;
  image: string;
}

const StudentDashboard = () => {
  const [user] = useLocalStorage('eco-user', {
    name: 'Eco Explorer',
    ecoPoints: 250,
    level: 3,
    streakDays: 12,
    rank: 7
  });
  
  const [environmentalFact] = useState(getRandomImpactFact());
  const { ecoPoints, addPoints } = useEcoPoints(user.ecoPoints);
  const [pointAnimation, setPointAnimation] = useState(false);
  const [streakAnimation, setStreakAnimation] = useState(false);
  
  // Pet data with multiple types
  const [virtualPets, setVirtualPets] = useLocalStorage<VirtualPet[]>('virtual-pets', [
    {
      name: 'Buddy',
      type: 'dog',
      hunger: 75,
      joy: 85,
      image: petDogImage
    }
  ]);
  
  const currentPet = virtualPets[0] || virtualPets[0];

  // Mock leaderboard data
  const [leaderboard] = useState<LeaderboardUser[]>([
    { id: '1', name: 'EcoChampion', points: 450, rank: 1 },
    { id: '2', name: 'GreenGuru', points: 380, rank: 2 },
    { id: '3', name: 'TreeHugger', points: 320, rank: 3 },
    { id: '4', name: 'EarthSaver', points: 295, rank: 4 },
    { id: '5', name: 'NatureLover', points: 280, rank: 5 },
    { id: '6', name: 'EcoWarrior', points: 265, rank: 6 },
    { id: '7', name: user.name, points: ecoPoints, rank: 7 }
  ]);

  // Mock garden plants
  const gardenPlants = {
    myGarden: [
      { id: '1', name: 'Sunflower', stage: 3, health: 90 },
      { id: '2', name: 'Tomato', stage: 2, health: 85 },
      { id: '3', name: 'Rose', stage: 4, health: 95 }
    ],
    classGarden: [
      { id: '4', name: 'Oak Sapling', stage: 2, health: 80 },
      { id: '5', name: 'Herb Garden', stage: 3, health: 75 },
      { id: '6', name: 'Butterfly Bush', stage: 1, health: 90 }
    ],
    schoolGarden: [
      { id: '7', name: 'Community Tree', stage: 5, health: 100 },
      { id: '8', name: 'Vegetable Patch', stage: 4, health: 85 },
      { id: '9', name: 'Flower Meadow', stage: 3, health: 92 }
    ]
  };

  // Quick action items with special handlers
  const quickActions = [
    { name: 'Challenges', icon: Target, color: 'text-eco-growth', href: '/challenges', special: false },
    { name: 'Quizzes', icon: BookOpen, color: 'text-eco-leaf', href: '/quiz', special: false },
    { name: 'Shop', icon: ShoppingBag, color: 'text-eco-earth', href: '/shop', special: false },
    { name: 'Journal', icon: FileText, color: 'text-eco-growth', href: '/journal', special: false },
    { name: 'Discussion', icon: MessageCircle, color: 'text-eco-leaf', href: '/discussion', special: 'community' },
    { name: 'Habits', icon: Target, color: 'text-eco-earth', href: '/habits', special: false },
    { name: 'Lessons', icon: BookOpen, color: 'text-eco-growth', href: '/lessons', special: false },
    { name: 'Impact Calculator', icon: Calculator, color: 'text-eco-leaf', href: '/impact', special: 'impact' },
    { name: 'Badges', icon: Award, color: 'text-eco-earth', href: '/profile', special: false },
    { name: 'Heatmap', icon: Thermometer, color: 'text-eco-growth', href: '/habits', special: false },
    { name: 'Meditation', icon: Leaf, color: 'text-eco-leaf', href: '/meditation', special: false },
    { name: 'Pomodoro', icon: Clock, color: 'text-eco-earth', href: '/pomodoro', special: false },
    { name: 'Spin Wheel', icon: Gamepad2, color: 'text-eco-leaf', href: '/spin', special: 'coming-soon' },
    { name: 'Events', icon: Calendar, color: 'text-eco-earth', href: '/events', special: 'coming-soon' }
  ];

  // Trigger animations on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setPointAnimation(true);
      setStreakAnimation(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getPetImage = (type: string) => {
    switch (type) {
      case 'cat': return petCatImage;
      case 'plant': return petPlantImage;
      case 'duck': return petDuckImage;
      case 'horse': return petHorseImage;
      default: return petDogImage;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-500';
    if (health >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStageEmoji = (stage: number) => {
    const stages = ['🌱', '🌿', '🌳', '🌲', '🌳'];
    return stages[stage - 1] || '🌱';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="p-6 space-y-6">
            {/* Environmental Fact Banner */}
        <Card className="eco-card bg-gradient-to-r from-eco-leaf/10 to-eco-growth/10 border-eco-growth">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl animate-bounce-soft">🌍</div>
              <div>
                <h3 className="font-semibold text-eco-leaf">Environmental Fact of the Day</h3>
                <p className="text-sm text-muted-foreground">{environmentalFact}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hero Stats Card */}
        <Card className="eco-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Eco Points */}
              <div className="text-center">
                <div className={`text-4xl font-bold text-eco-growth transition-all duration-500 ${
                  pointAnimation ? 'transform scale-110' : ''
                }`}>
                  {ecoPoints}
                </div>
                <div className="text-sm text-muted-foreground">Eco-Points</div>
                <Badge className="eco-badge mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15 today
                </Badge>
              </div>

              {/* Streak */}
              <div className="text-center">
                <div className={`text-4xl font-bold text-eco-leaf flex items-center justify-center gap-2 transition-all duration-500 ${
                  streakAnimation ? 'transform scale-110' : ''
                }`}>
                  🔥 {user.streakDays}
                </div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
                <Badge className="eco-badge mt-1">Personal Best!</Badge>
              </div>

              {/* Leaderboard Rank */}
              <div className="text-center">
                <div className="text-4xl font-bold text-eco-earth flex items-center justify-center gap-2">
                  <Crown className="w-8 h-8" />
                  #{user.rank}
                </div>
                <div className="text-sm text-muted-foreground">Class Rank</div>
                <Badge className="eco-badge mt-1">
                  <Star className="w-3 h-3 mr-1" />
                  Top 10
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Cards - Pet & Garden */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Virtual Pet Card */}
          <Card className="eco-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Virtual Pet - {currentPet?.name}
              </CardTitle>
              <CardDescription>Take care of your eco-companion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentPet && (
                <>
                  <Link to="/pets" className="block">
                    <div className="text-center hover:scale-105 transition-transform cursor-pointer">
                      <img 
                        src={getPetImage(currentPet.type)} 
                        alt={currentPet.name}
                        className="w-20 h-20 mx-auto animate-bounce-soft"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Click to manage pets</p>
                    </div>
                  </Link>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Hunger</span>
                        <span>{currentPet.hunger}%</span>
                      </div>
                      <Progress value={currentPet.hunger} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Joy</span>
                        <span>{currentPet.joy}%</span>
                      </div>
                      <Progress value={currentPet.joy} className="h-2" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => addPoints(5, `Fed ${currentPet.name}`)}
                    >
                      🍖 Feed
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => addPoints(5, `Played with ${currentPet.name}`)}
                    >
                      🎾 Play
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Virtual Garden Card */}
          <Card className="eco-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-eco-growth" />
                Virtual Garden
              </CardTitle>
              <CardDescription>Watch your impact grow</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="myGarden" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="myGarden">My Garden</TabsTrigger>
                  <TabsTrigger value="classGarden">
                    <Users className="w-4 h-4 mr-1" />
                    Class
                  </TabsTrigger>
                  <TabsTrigger value="schoolGarden">
                    <School className="w-4 h-4 mr-1" />
                    School
                  </TabsTrigger>
                </TabsList>

                {Object.entries(gardenPlants).map(([key, plants]) => (
                  <TabsContent key={key} value={key} className="space-y-3 mt-4">
                    <div className="relative">
                      <img 
                        src={garden3dImage} 
                        alt="Garden" 
                        className="w-full h-32 object-cover rounded-lg opacity-50"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-2">
                          {plants.slice(0, 3).map((plant) => (
                            <div key={plant.id} className="text-center">
                              <div className="text-2xl animate-sway">{getStageEmoji(plant.stage)}</div>
                              <div className="text-xs text-muted-foreground">{plant.name}</div>
                              <div className={`text-xs ${getHealthColor(plant.health)}`}>
                                {plant.health}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <ComingSoonDialog
                      title="Dynamic Gardens"
                      description="Watch plants grow in real-time with your classmates and school!"
                      feature="interactive 3D gardens with real plant growth simulation"
                    >
                      <Button 
                        size="sm" 
                        className="w-full" 
                        variant="outline"
                      >
                        <Leaf className="w-4 h-4 mr-1" />
                        Water Plants
                      </Button>
                    </ComingSoonDialog>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle>🚀 Quick Actions</CardTitle>
            <CardDescription>Explore activities to earn eco-points and make an impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {quickActions.map((action, index) => {
                const ActionComponent = ({ children }: { children: React.ReactNode }) => {
                  switch (action.special) {
                    case 'community':
                      return <CommunityPopup>{children}</CommunityPopup>;
                    case 'impact':
                      return <ImpactPopup>{children}</ImpactPopup>;
                    case 'coming-soon':
                      return (
                        <ComingSoonDialog
                          title={action.name}
                          description={`${action.name} feature coming soon!`}
                          feature={`${action.name.toLowerCase()} functionality`}
                        >
                          {children}
                        </ComingSoonDialog>
                      );
                    default:
                      return <Link to={action.href}>{children}</Link>;
                  }
                };

                return (
                  <ActionComponent key={index}>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col gap-2 hover-scale transition-all duration-200 w-full"
                    >
                      <action.icon className={`w-6 h-6 ${action.color}`} />
                      <span className="text-xs font-medium text-center leading-tight">
                        {action.name}
                      </span>
                      <Badge className="eco-badge text-xs">
                        {action.special ? 'Soon' : 'Open'}
                      </Badge>
                    </Button>
                  </ActionComponent>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Mini Leaderboard */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Class Leaderboard
            </CardTitle>
            <CardDescription>See how you rank among your classmates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((student, index) => (
                <div 
                  key={student.id}
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                    student.name === user.name ? 'bg-eco-leaf/10 border border-eco-leaf/30' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {student.rank}
                    </div>
                    <span className={`font-medium ${student.name === user.name ? 'text-eco-leaf' : ''}`}>
                      {student.name}
                    </span>
                    {student.name === user.name && <Badge className="eco-badge text-xs">You</Badge>}
                  </div>
                  <span className="font-bold text-eco-growth">{student.points}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/leaderboard">View Full Leaderboard</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Teacher Tools Beta Section */}
        <Card className="eco-card border-dashed border-2 border-eco-leaf/30">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-eco-leaf mb-2">🍎 Teacher Tools - Beta Trial</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Access advanced teaching features and class management tools
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" asChild className="flex-1 max-w-48">
                  <Link to="/teacher-auth">
                    <School className="w-4 h-4 mr-2" />
                    Teacher Login
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1 max-w-48">
                  <Link to="/teacher-dashboard">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Teacher Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default StudentDashboard;