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
import petPlantImage from '@/assets/pet-plant.png';

const AVATAR_OPTIONS = {
  skinTones: ['#F5DEB3', '#DEB887', '#D2B48C', '#CD853F', '#8B4513', '#654321'],
  hairStyles: ['short', 'long', 'curly', 'braids', 'bald', 'ponytail'],
  hairColors: ['#8B4513', '#000000', '#FFD700', '#FF4500', '#4B0082', '#008000'],
  eyeColors: ['#8B4513', '#000000', '#0000FF', '#008000', '#808080', '#FFA500'],
  outfits: ['casual', 'formal', 'eco-warrior', 'scientist', 'gardener', 'explorer'],
  accessories: ['glasses', 'hat', 'earrings', 'necklace', 'backpack', 'watch']
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
      outfit: 'eco-warrior',
      accessories: []
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
      name: 'Sprouty',
      type: 'plant',
      level: 2,
      happiness: 85,
      energy: 70,
      ecoPointsContributed: user.ecoPoints,
      lastFed: new Date(),
      skills: ['Growth Boost', 'Wisdom Share']
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
            lastFed: new Date()
          }
        : pet
    ));
    addPoints(5, 'Taking care of your pet');
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
              <CardDescription>Customize your avatar to express your eco-personality!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Avatar className="h-32 w-32 mx-auto border-4 border-eco-leaf">
                  <AvatarFallback 
                    className="text-4xl"
                    style={{ 
                      backgroundColor: editingAvatar ? tempAvatar.skinTone : user.avatar.skinTone 
                    }}
                  >
                    {user.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {editingAvatar && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Skin Tone</h4>
                    <div className="flex gap-2 flex-wrap">
                      {AVATAR_OPTIONS.skinTones.map((tone, index) => (
                        <button
                          key={index}
                          className={`w-8 h-8 rounded-full border-2 ${
                            tempAvatar.skinTone === tone ? 'border-eco-leaf' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: tone }}
                          onClick={() => setTempAvatar(prev => ({ ...prev, skinTone: tone }))}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Hair Style</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {AVATAR_OPTIONS.hairStyles.map((style) => (
                        <Button
                          key={style}
                          size="sm"
                          variant={tempAvatar.hairStyle === style ? "default" : "outline"}
                          onClick={() => setTempAvatar(prev => ({ ...prev, hairStyle: style }))}
                        >
                          {style}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Outfit</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {AVATAR_OPTIONS.outfits.map((outfit) => (
                        <Button
                          key={outfit}
                          size="sm"
                          variant={tempAvatar.outfit === outfit ? "default" : "outline"}
                          onClick={() => setTempAvatar(prev => ({ ...prev, outfit }))}
                        >
                          {outfit}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button onClick={saveAvatar} className="w-full">
                    💾 Save Avatar (+10 points)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pets" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pets.map((pet) => (
              <Card key={pet.id} className="plant-container">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-2">
                    <img 
                      src={petPlantImage} 
                      alt={pet.name}
                      className="w-20 h-20 object-contain animate-bounce-soft"
                    />
                  </div>
                  <CardTitle className="flex items-center justify-center gap-2">
                    {pet.name}
                    <Badge variant="outline">Level {pet.level}</Badge>
                  </CardTitle>
                  <CardDescription>Your loyal eco-companion</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        Happiness
                      </span>
                      <span>{pet.happiness}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all"
                        style={{ width: `${pet.happiness}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Energy</span>
                      <span>{pet.energy}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="nature-gradient h-2 rounded-full transition-all"
                        style={{ width: `${pet.energy}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">
                      Skills: {pet.skills.join(', ')}
                    </div>
                    <Button 
                      onClick={() => feedPet(pet.id)}
                      disabled={pet.happiness >= 90}
                      size="sm"
                    >
                      🍃 Feed Pet (+5 points)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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