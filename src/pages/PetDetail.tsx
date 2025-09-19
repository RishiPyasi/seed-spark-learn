import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEcoPoints } from '@/hooks/useEcoPoints';
import { Heart, Zap, ShoppingCart, Star, Crown } from 'lucide-react';
import { toast } from 'sonner';
import petDogImage from '@/assets/pet-dog.png';
import petCatImage from '@/assets/pet-cat.png';
import petPlantImage from '@/assets/pet-plant.png';
import petDuckImage from '@/assets/pet-duck.png';
import petHorseImage from '@/assets/pet-horse.png';
import petTurtleImage from '@/assets/pet-turtle.png';
import petFishImage from '@/assets/pet-fish.png';
import petHamsterImage from '@/assets/pet-hamster.png';

interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'horse' | 'duck' | 'turtle' | 'fish' | 'hamster' | 'plant';
  level: number;
  happiness: number;
  energy: number;
  hunger: number;
  ecoPointsContributed: number;
  lastFed: Date;
  lastPlayed: Date;
  skills: string[];
  personality: 'playful' | 'calm' | 'energetic' | 'gentle' | 'wise' | 'peaceful';
}

const PET_TYPES = {
  dog: { 
    name: 'Dog', 
    emoji: '🐕', 
    image: petDogImage,
    skills: ['Loyalty', 'Energy Boost', 'Companionship'], 
    personality: 'playful' as const,
    description: 'A loyal companion that boosts your energy and motivation!'
  },
  cat: { 
    name: 'Cat', 
    emoji: '🐱', 
    image: petCatImage,
    skills: ['Curiosity', 'Calm Mind', 'Independence'], 
    personality: 'calm' as const,
    description: 'A wise friend that helps you stay focused and peaceful.'
  },
  horse: { 
    name: 'Horse', 
    emoji: '🐴', 
    image: petHorseImage,
    skills: ['Strength', 'Endurance', 'Freedom'], 
    personality: 'gentle' as const,
    description: 'A majestic companion that gives you strength and freedom.'
  },
  duck: { 
    name: 'Duck', 
    emoji: '🦆', 
    image: petDuckImage,
    skills: ['Swimming', 'Adaptability', 'Joy'], 
    personality: 'energetic' as const,
    description: 'A joyful friend that adapts to any situation!'
  },
  turtle: { 
    name: 'Turtle', 
    emoji: '🐢', 
    image: petTurtleImage,
    skills: ['Wisdom', 'Patience', 'Longevity'], 
    personality: 'wise' as const,
    description: 'A wise old friend who teaches patience and environmental awareness.'
  },
  fish: { 
    name: 'Fish', 
    emoji: '🐠', 
    image: petFishImage,
    skills: ['Water Wisdom', 'Serenity', 'Flow'], 
    personality: 'peaceful' as const,
    description: 'A peaceful aquatic friend that promotes water conservation.'
  },
  hamster: { 
    name: 'Hamster', 
    emoji: '🐹', 
    image: petHamsterImage,
    skills: ['Energy', 'Resourcefulness', 'Storage'], 
    personality: 'energetic' as const,
    description: 'An energetic little friend who teaches about resource conservation.'
  },
  plant: { 
    name: 'Plant', 
    emoji: '🌱', 
    image: petPlantImage,
    skills: ['Air Purification', 'Growth Mindset', 'Patience'], 
    personality: 'peaceful' as const,
    description: 'A growing companion that purifies your environment.'
  }
};

const AVAILABLE_PETS = Object.keys(PET_TYPES);

export const PetDetail = () => {
  const [pets, setPets] = useLocalStorage<Pet[]>('eco-pets', []);
  const [selectedPetType, setSelectedPetType] = useState<string>('dog');
  const [newPetName, setNewPetName] = useState('');
  const { addPoints } = useEcoPoints();

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
    toast.success('🍖 Pet fed! +5 eco-points');
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
    toast.success('🎾 Great playtime! +3 eco-points');
  };

  const adoptPet = () => {
    if (!newPetName.trim()) {
      toast.error('Please enter a name for your pet!');
      return;
    }

    const newPet: Pet = {
      id: Date.now().toString(),
      name: newPetName,
      type: selectedPetType as 'dog' | 'cat' | 'horse' | 'duck' | 'turtle' | 'fish' | 'hamster' | 'plant',
      level: 1,
      happiness: 50,
      energy: 100,
      hunger: 50,
      ecoPointsContributed: 0,
      lastFed: new Date(),
      lastPlayed: new Date(),
      skills: PET_TYPES[selectedPetType as keyof typeof PET_TYPES].skills,
      personality: PET_TYPES[selectedPetType as keyof typeof PET_TYPES].personality
    };

    setPets(prev => [...prev, newPet]);
    setNewPetName('');
    addPoints(20, `Adopted new pet: ${newPetName}`);
    toast.success(`🎉 Welcome ${newPetName}! +20 eco-points`);
  };

  const getPetStatusColor = (value: number) => {
    if (value >= 80) return 'text-green-500';
    if (value >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPetMood = (pet: Pet) => {
    const avgStatus = (pet.happiness + pet.energy + (100 - pet.hunger)) / 3;
    if (avgStatus >= 80) return { emoji: '😊', text: 'Very Happy' };
    if (avgStatus >= 60) return { emoji: '😌', text: 'Content' };
    if (avgStatus >= 40) return { emoji: '😐', text: 'Neutral' };
    if (avgStatus >= 20) return { emoji: '😔', text: 'Sad' };
    return { emoji: '😢', text: 'Unhappy' };
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">🐾 Virtual Pets</h1>
        <p className="text-muted-foreground">Care for your eco-companions and earn rewards!</p>
      </div>

      {/* My Pets */}
      {pets.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            My Pets ({pets.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pets.map((pet) => {
              const petInfo = PET_TYPES[pet.type as keyof typeof PET_TYPES];
              const mood = getPetMood(pet);
              
              return (
                <Card key={pet.id} className="eco-card">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-2">
                      <img 
                        src={petInfo.image} 
                        alt={pet.name}
                        className="w-20 h-20 mx-auto animate-bounce-soft"
                      />
                    </div>
                    <CardTitle className="flex items-center justify-center gap-2">
                      {pet.name}
                      <Badge variant="outline">Lvl {pet.level}</Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center justify-center gap-2">
                      {mood.emoji} {mood.text}
                      <Badge className="eco-badge text-xs">{petInfo.name}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Pet Stats */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Happiness</span>
                          <span className={getPetStatusColor(pet.happiness)}>{pet.happiness}%</span>
                        </div>
                        <Progress value={pet.happiness} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Energy</span>
                          <span className={getPetStatusColor(pet.energy)}>{pet.energy}%</span>
                        </div>
                        <Progress value={pet.energy} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Hunger</span>
                          <span className={getPetStatusColor(100 - pet.hunger)}>{pet.hunger}%</span>
                        </div>
                        <Progress value={pet.hunger} className="h-2" />
                      </div>
                    </div>

                    {/* Pet Skills */}
                    <div>
                      <p className="text-sm font-medium mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {pet.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => feedPet(pet.id)}
                        disabled={pet.hunger < 20}
                      >
                        🍖 Feed
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => playWithPet(pet.id)}
                        disabled={pet.energy < 20}
                      >
                        🎾 Play
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Adopt New Pet */}
      <Card className="eco-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Adopt a New Pet
          </CardTitle>
          <CardDescription>Choose your next eco-companion!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pet Type Selection */}
          <div>
            <p className="font-medium mb-3">Choose Pet Type:</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {AVAILABLE_PETS.map((petType) => {
                const petInfo = PET_TYPES[petType as keyof typeof PET_TYPES];
                return (
                  <button
                    key={petType}
                    onClick={() => setSelectedPetType(petType)}
                    className={`p-4 rounded-lg border transition-all text-center ${
                      selectedPetType === petType 
                        ? 'border-eco-leaf bg-eco-leaf/10 scale-105' 
                        : 'border-border hover:border-eco-leaf hover:scale-102'
                    }`}
                  >
                    <img 
                      src={petInfo.image} 
                      alt={petInfo.name}
                      className="w-12 h-12 mx-auto mb-2"
                    />
                    <p className="font-medium text-sm">{petInfo.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Pet Preview */}
          <Card className="border-eco-leaf/30 bg-eco-leaf/5">
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <img 
                  src={PET_TYPES[selectedPetType as keyof typeof PET_TYPES].image} 
                  alt={PET_TYPES[selectedPetType as keyof typeof PET_TYPES].name}
                  className="w-16 h-16 mx-auto mb-2"
                />
                <h4 className="font-semibold">{PET_TYPES[selectedPetType as keyof typeof PET_TYPES].name}</h4>
                <p className="text-sm text-muted-foreground">
                  {PET_TYPES[selectedPetType as keyof typeof PET_TYPES].description}
                </p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {PET_TYPES[selectedPetType as keyof typeof PET_TYPES].skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Name your pet:</p>
                  <input
                    type="text"
                    value={newPetName}
                    onChange={(e) => setNewPetName(e.target.value)}
                    placeholder="Enter pet name..."
                    className="w-full px-3 py-2 rounded-lg border border-border focus:border-eco-leaf focus:outline-none"
                  />
                </div>
                
                <Button onClick={adoptPet} className="w-full" disabled={!newPetName.trim()}>
                  <Heart className="w-4 h-4 mr-2" />
                  Adopt {newPetName || 'Pet'} (+20 points)
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {pets.length === 0 && (
        <Card className="eco-card text-center py-12">
          <div className="text-6xl mb-4">🐾</div>
          <h3 className="text-xl font-semibold mb-2">No pets yet!</h3>
          <p className="text-muted-foreground mb-4">
            Adopt your first eco-companion and start your journey together!
          </p>
        </Card>
      )}
    </div>
  );
};