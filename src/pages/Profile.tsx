import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Avatar as AvatarType, User, Pet } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEcoPoints } from '@/hooks/useEcoPoints';
import { Settings, Star, Trophy, Users, Heart } from 'lucide-react';
import { AvatarBuilder } from '@/components/AvatarBuilder';
import { PetCard } from '@/components/PetCard';

const AVATAR_OPTIONS = {
  skinTones: ['#F5DEB3', '#DEB887', '#D2B48C', '#CD853F', '#8B4513', '#654321'],
  hairStyles: ['short', 'long', 'curly', 'braids', 'bald', 'ponytail', 'afro', 'mohawk'],
  hairColors: ['#8B4513', '#000000', '#FFD700', '#FF4500', '#4B0082', '#008000', '#FF69B4', '#FF0000'],
  eyeColors: ['#8B4513', '#000000', '#0000FF', '#008000', '#808080', '#FFA500', '#800080', '#006400'],
  eyeShapes: ['round', 'almond', 'hooded', 'monolid', 'upturned', 'downturned'],
  faceShapes: ['oval', 'round', 'square', 'heart', 'diamond', 'oblong'],
  outfits: ['casual', 'formal', 'eco-warrior', 'scientist', 'gardener', 'explorer', 'student', 'teacher'],
  accessories: ['glasses', 'hat', 'earrings', 'necklace', 'backpack', 'watch', 'scarf', 'none'],
  facialHair: ['none', 'mustache', 'beard', 'goatee', 'stubble'],
  expressions: ['happy', 'neutral', 'excited', 'focused', 'friendly', 'determined']
};

const PET_TYPES = {
  dog: { name: 'Dog', emoji: '🐕', skills: ['Loyalty', 'Energy Boost'], personality: 'playful' },
  cat: { name: 'Cat', emoji: '🐱', skills: ['Curiosity', 'Calm Mind'], personality: 'calm' },
  horse: { name: 'Horse', emoji: '🐴', skills: ['Strength', 'Endurance'], personality: 'gentle' },
  duck: { name: 'Duck', emoji: '🦆', skills: ['Swimming', 'Adaptability'], personality: 'energetic' },
  cow: { name: 'Cow', emoji: '🐄', skills: ['Patience', 'Sustainability'], personality: 'gentle' },
  rabbit: { name: 'Rabbit', emoji: '🐰', skills: ['Speed', 'Agility'], personality: 'energetic' }
};

const ACHIEVEMENTS = [
  { id: 'first-plant', name: 'Green Thumb', description: 'Planted your first seed', icon: '🌱' },
  { id: 'water-master', name: 'Water Guardian', description: 'Watered plants 50 times', icon: '💧' },
  { id: 'eco-warrior', name: 'Eco Warrior', description: 'Earned 1000 eco-points', icon: '🌍' },
  { id: 'streak-keeper', name: 'Consistency Master', description: '30-day streak', icon: '🔥' },
  { id: 'knowledge-seeker', name: 'Knowledge Seeker', description: 'Completed 10 learning modules', icon: '📚' },
  { id: 'community-helper', name: 'Community Helper', description: 'Helped 25 classmates', icon: '🤝' }
];

export const Profile = () => {
  const [user, setUser] = useLocalStorage<User>('eco-user', {
    id: '1',
    name: 'Eco Explorer',
    email: 'explorer@ecologic.com',
    avatar: {
      skinTone: AVATAR_OPTIONS.skinTones[2],
      hairStyle: 'short',
      hairColor: AVATAR_OPTIONS.hairColors[1],
      eyeColor: AVATAR_OPTIONS.eyeColors[2],
      eyeShape: 'round',
      faceShape: 'oval',
      outfit: 'eco-warrior',
      accessories: [],
      facialHair: 'none',
      expression: 'happy'
    },
    role: 'student',
    ecoPoints: 250,
    level: 3,
    streakDays: 12,
    language: 'en',
    joinedAt: new Date('2024-01-15')
  });

  const [pets, setPets] = useLocalStorage<Pet[]>('eco-pets', [
    {
      id: '1',
      name: 'Buddy',
      type: 'dog',
      level: 2,
      happiness: 85,
      energy: 70,
      hunger: 60,
      ecoPointsContributed: user.ecoPoints,
      lastFed: new Date(),
      lastPlayed: new Date(),
      skills: ['Loyalty', 'Energy Boost'],
      personality: 'playful'
    }
  ]);

  const [selectedTab, setSelectedTab] = useState('overview');
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [tempAvatar, setTempAvatar] = useState<AvatarType>(user.avatar);
  const { ecoPoints, addPoints } = useEcoPoints(user.ecoPoints);

  const unlockedAchievements = ACHIEVEMENTS.filter(achievement => {
    switch (achievement.id) {
      case 'first-plant': return user.ecoPoints > 0;
      case 'water-master': return user.ecoPoints > 200;
      case 'eco-warrior': return user.ecoPoints >= 1000;
      case 'streak-keeper': return user.streakDays >= 30;
      case 'knowledge-seeker': return user.level >= 5;
      case 'community-helper': return user.level >= 4;
      default: return false;
    }
  });

  const saveAvatar = () => {
    setUser(prev => ({ ...prev, avatar: tempAvatar }));
    setEditingAvatar(false);
    addPoints(10, 'Avatar customization');
  };

  const feedPet = (petId: string) => {
    setPets(prev => prev.map(pet => 
      pet.id === petId 
        ? { 
            ...pet, 
            happiness: Math.min(100, pet.happiness + 20),
            energy: Math.min(100, pet.energy + 15),
            hunger: Math.max(0, pet.hunger - 25),
            lastFed: new Date()
          }
        : pet
    ));
    addPoints(5, 'Taking care of your pet');
  };

  const playWithPet = (petId: string) => {
    setPets(prev => prev.map(pet => 
      pet.id === petId 
        ? { 
            ...pet, 
            happiness: Math.min(100, pet.happiness + 15),
            energy: Math.max(0, pet.energy - 10),
            lastPlayed: new Date()
          }
        : pet
    ));
    addPoints(3, 'Playing with your pet');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">👤 My Profile</h1>
        <p className="text-muted-foreground">Customize your avatar and track your progress!</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="avatar">Avatar</TabsTrigger>
          <TabsTrigger value="pets">Pets</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="eco-card">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Avatar className="h-24 w-24 border-4 border-eco-leaf">
                  <AvatarFallback 
                    className="text-2xl"
                    style={{ backgroundColor: user.avatar.skinTone }}
                  >
                    {user.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-4">
                <Badge className="eco-badge">Level {user.level}</Badge>
                <Badge variant="outline">🔥 {user.streakDays} day streak</Badge>
                <Badge variant="secondary">{user.role}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-eco-leaf">{user.ecoPoints}</div>
                  <div className="text-sm text-muted-foreground">Eco-Points</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-eco-growth">{unlockedAchievements.length}</div>
                  <div className="text-sm text-muted-foreground">Achievements</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">{pets.length}</div>
                  <div className="text-sm text-muted-foreground">Pets</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="eco-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {unlockedAchievements.slice(0, 3).map(achievement => (
                    <div key={achievement.id} className="flex items-center gap-3 p-2 rounded-lg bg-eco-leaf-light">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{achievement.name}</div>
                        <div className="text-xs text-muted-foreground">{achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="eco-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Next Level Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Level {user.level}</span>
                    <span>Level {user.level + 1}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="nature-gradient h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(user.ecoPoints % 100)}%` }}
                    />
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    {100 - (user.ecoPoints % 100)} more points to next level
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="avatar" className="space-y-4">
          <Card className="eco-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Avatar Builder</span>
                <Button 
                  variant={editingAvatar ? "default" : "outline"}
                  onClick={() => setEditingAvatar(!editingAvatar)}
                >
                  {editingAvatar ? 'Done' : 'Edit'}
                </Button>
              </CardTitle>
              <CardDescription>Customize your human-like avatar to express your personality!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Avatar className="h-32 w-32 mx-auto border-4 border-eco-leaf">
                  <AvatarFallback 
                    className="text-4xl relative overflow-hidden"
                    style={{ 
                      backgroundColor: editingAvatar ? tempAvatar.skinTone : user.avatar.skinTone 
                    }}
                  >
                    {/* Simple human avatar representation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        {/* Face */}
                        <div 
                          className="w-20 h-24 rounded-full relative"
                          style={{ backgroundColor: editingAvatar ? tempAvatar.skinTone : user.avatar.skinTone }}
                        >
                          {/* Eyes */}
                          <div className="absolute top-6 left-3 w-2 h-2 rounded-full" 
                               style={{ backgroundColor: editingAvatar ? tempAvatar.eyeColor : user.avatar.eyeColor }} />
                          <div className="absolute top-6 right-3 w-2 h-2 rounded-full" 
                               style={{ backgroundColor: editingAvatar ? tempAvatar.eyeColor : user.avatar.eyeColor }} />
                          {/* Hair */}
                          <div 
                            className="absolute -top-2 left-1 right-1 h-8 rounded-t-full"
                            style={{ backgroundColor: editingAvatar ? tempAvatar.hairColor : user.avatar.hairColor }}
                          />
                          {/* Expression mouth */}
                          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-white/30 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </AvatarFallback>
                </Avatar>
                <div className="mt-2 text-sm text-muted-foreground">
                  {editingAvatar ? tempAvatar.expression : user.avatar.expression} • {editingAvatar ? tempAvatar.faceShape : user.avatar.faceShape} face
                </div>
              </div>

              {editingAvatar && (
                <AvatarBuilder 
                  avatar={tempAvatar}
                  onChange={setTempAvatar}
                />
              )}

              {editingAvatar && (
                <Button onClick={saveAvatar} className="w-full">
                  💾 Save Avatar (+10 points)
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pets" className="space-y-4">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold mb-2">Your Animal Companions</h2>
            <p className="text-muted-foreground">Take care of your pets to earn eco-points and build friendship!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onFeed={feedPet}
                onPlay={playWithPet}
              />
            ))}
          </div>

          {pets.length === 0 && (
            <Card className="eco-card">
              <CardContent className="text-center p-8">
                <div className="text-6xl mb-4">🐾</div>
                <h3 className="text-lg font-semibold mb-2">No pets yet!</h3>
                <p className="text-muted-foreground mb-4">
                  Visit the shop to adopt your first animal companion
                </p>
                <Button>Visit Shop</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);
              return (
                <Card 
                  key={achievement.id} 
                  className={`eco-card ${isUnlocked ? 'border-eco-leaf' : 'opacity-50'}`}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <h3 className="font-semibold mb-1">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                    {isUnlocked && (
                      <Badge className="eco-badge">
                        <Star className="h-3 w-3 mr-1" />
                        Unlocked!
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};