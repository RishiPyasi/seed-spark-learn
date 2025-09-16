import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Pet } from '@/types';
import { Heart, Zap, UtensilsCrossed, Play } from 'lucide-react';
import petDogImage from '@/assets/pet-dog.png';
import petCatImage from '@/assets/pet-cat.png';
import petHorseImage from '@/assets/pet-horse.png';
import petDuckImage from '@/assets/pet-duck.png';

interface PetCardProps {
  pet: Pet;
  onFeed: (petId: string) => void;
  onPlay: (petId: string) => void;
}

const PET_IMAGES = {
  dog: petDogImage,
  cat: petCatImage,
  horse: petHorseImage,
  duck: petDuckImage,
  cow: petDogImage, // fallback
  rabbit: petCatImage // fallback
};

const PET_TYPES = {
  dog: { name: 'Dog', emoji: '🐕' },
  cat: { name: 'Cat', emoji: '🐱' },
  horse: { name: 'Horse', emoji: '🐴' },
  duck: { name: 'Duck', emoji: '🦆' },
  cow: { name: 'Cow', emoji: '🐄' },
  rabbit: { name: 'Rabbit', emoji: '🐰' }
};

export const PetCard = ({ pet, onFeed, onPlay }: PetCardProps) => {
  const petType = PET_TYPES[pet.type];
  const petImage = PET_IMAGES[pet.type];

  return (
    <Card className="plant-container overflow-hidden">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-3 relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-eco-leaf/20 to-eco-growth/20 flex items-center justify-center border-2 border-eco-leaf/30">
            <img 
              src={petImage} 
              alt={pet.name}
              className="w-16 h-16 object-contain animate-bounce-soft"
            />
          </div>
          <div className="absolute -top-1 -right-1 text-lg">
            {petType.emoji}
          </div>
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          {pet.name}
          <Badge variant="outline" className="text-xs">
            Level {pet.level}
          </Badge>
        </CardTitle>
        <CardDescription className="capitalize">
          {pet.personality} {petType.name} • {pet.skills.join(', ')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-red-500" />
                Happiness
              </span>
              <span className="font-medium">{pet.happiness}%</span>
            </div>
            <Progress value={pet.happiness} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-yellow-500" />
                Energy
              </span>
              <span className="font-medium">{pet.energy}%</span>
            </div>
            <Progress value={pet.energy} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1">
                <UtensilsCrossed className="h-4 w-4 text-orange-500" />
                Hunger
              </span>
              <span className="font-medium">{100 - pet.hunger}%</span>
            </div>
            <Progress value={100 - pet.hunger} className="h-2" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button 
            onClick={() => onFeed(pet.id)}
            disabled={pet.hunger <= 10}
            size="sm"
            className="flex items-center gap-1"
          >
            <UtensilsCrossed className="h-3 w-3" />
            Feed
          </Button>
          <Button 
            onClick={() => onPlay(pet.id)}
            disabled={pet.energy <= 10}
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
          >
            <Play className="h-3 w-3" />
            Play
          </Button>
        </div>

        {/* Last Activity */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Last fed: {new Date(pet.lastFed).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};