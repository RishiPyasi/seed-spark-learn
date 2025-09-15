import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plant } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEcoPoints } from '@/hooks/useEcoPoints';
import { Droplets, Sun, Sprout, Star } from 'lucide-react';
import { toast } from 'sonner';

const PLANT_SPECIES = [
  { name: 'Sunflower', growthTime: 7, waterNeeds: 'high', ecoPoints: 15 },
  { name: 'Tomato', growthTime: 10, waterNeeds: 'medium', ecoPoints: 20 },
  { name: 'Basil', growthTime: 5, waterNeeds: 'low', ecoPoints: 10 },
  { name: 'Lavender', growthTime: 14, waterNeeds: 'low', ecoPoints: 25 },
  { name: 'Mint', growthTime: 6, waterNeeds: 'medium', ecoPoints: 12 }
];

const GROWTH_STAGES = [
  { name: 'Seed', emoji: '🌰', description: 'Just planted' },
  { name: 'Sprout', emoji: '🌱', description: 'First leaves appearing' },
  { name: 'Seedling', emoji: '🌿', description: 'Growing strong' },
  { name: 'Young Plant', emoji: '🪴', description: 'Developing well' },
  { name: 'Mature', emoji: '🌻', description: 'Nearly ready' },
  { name: 'Full Grown', emoji: '🌳', description: 'Beautiful and complete!' }
];

export const Gardens = () => {
  const [plants, setPlantsStorage] = useLocalStorage<Plant[]>('eco-plants', []);
  const [selectedSpecies, setSelectedSpecies] = useState(PLANT_SPECIES[0]);
  const { ecoPoints, addPoints, spendPoints } = useEcoPoints(150);

  const plantSeed = () => {
    const cost = 10;
    if (!spendPoints(cost, `${selectedSpecies.name} seed`)) return;

    const newPlant: Plant = {
      id: Date.now().toString(),
      name: `My ${selectedSpecies.name}`,
      species: selectedSpecies.name,
      growthStage: 0,
      waterLevel: 50,
      sunlightLevel: 70,
      plantedAt: new Date(),
      lastWatered: new Date(),
      ecoPointsGenerated: 0,
      isAlive: true
    };

    setPlantsStorage(prev => [...prev, newPlant]);
    toast.success(`🌱 ${selectedSpecies.name} planted!`, {
      description: 'Remember to water it regularly!'
    });
  };

  const waterPlant = (plantId: string) => {
    setPlantsStorage(prev => prev.map(plant => {
      if (plant.id === plantId && plant.isAlive) {
        const newWaterLevel = Math.min(100, plant.waterLevel + 30);
        const pointsEarned = 5;
        addPoints(pointsEarned, 'Watering plants');
        
        return {
          ...plant,
          waterLevel: newWaterLevel,
          lastWatered: new Date(),
          ecoPointsGenerated: plant.ecoPointsGenerated + pointsEarned
        };
      }
      return plant;
    }));
  };

  const giveSunlight = (plantId: string) => {
    setPlantsStorage(prev => prev.map(plant => {
      if (plant.id === plantId && plant.isAlive) {
        const newSunlightLevel = Math.min(100, plant.sunlightLevel + 25);
        const pointsEarned = 3;
        addPoints(pointsEarned, 'Providing sunlight');
        
        return {
          ...plant,
          sunlightLevel: newSunlightLevel,
          ecoPointsGenerated: plant.ecoPointsGenerated + pointsEarned
        };
      }
      return plant;
    }));
  };

  // Plant growth simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlantsStorage(prev => prev.map(plant => {
        if (!plant.isAlive) return plant;

        const now = new Date();
        const hoursSincePlanted = (now.getTime() - plant.plantedAt.getTime()) / (1000 * 60 * 60);
        const hoursSinceWatered = (now.getTime() - plant.lastWatered.getTime()) / (1000 * 60 * 60);
        
        // Decrease water and sunlight over time
        const newWaterLevel = Math.max(0, plant.waterLevel - 2);
        const newSunlightLevel = Math.max(20, plant.sunlightLevel - 1);
        
        // Growth calculation based on care
        const species = PLANT_SPECIES.find(s => s.name === plant.species);
        const requiredHours = (species?.growthTime || 7) * 24;
        let growthProgress = (hoursSincePlanted / requiredHours) * 5;
        
        // Growth bonus for good care
        if (plant.waterLevel > 60 && plant.sunlightLevel > 60) {
          growthProgress *= 1.2;
        }
        
        // Growth penalty for poor care
        if (plant.waterLevel < 20 || plant.sunlightLevel < 30) {
          growthProgress *= 0.5;
        }
        
        const newGrowthStage = Math.min(5, Math.floor(growthProgress));
        
        // Plant death conditions
        const isAlive = plant.waterLevel > 0 && hoursSinceWatered < 48;
        
        return {
          ...plant,
          waterLevel: newWaterLevel,
          sunlightLevel: newSunlightLevel,
          growthStage: newGrowthStage,
          isAlive
        };
      }));
    }, 10000); // Update every 10 seconds for demo purposes

    return () => clearInterval(interval);
  }, [setPlantsStorage]);

  const alivePlants = plants.filter(p => p.isAlive);
  const totalEcoPoints = plants.reduce((sum, p) => sum + p.ecoPointsGenerated, 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">🌱 My Gardens</h1>
        <p className="text-muted-foreground">Grow plants, earn eco-points, and learn about nature!</p>
      </div>

      {/* Garden Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="eco-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-eco-leaf">{alivePlants.length}</div>
            <div className="text-sm text-muted-foreground">Living Plants</div>
          </CardContent>
        </Card>
        <Card className="eco-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-eco-growth">{totalEcoPoints}</div>
            <div className="text-sm text-muted-foreground">Points from Gardens</div>
          </CardContent>
        </Card>
        <Card className="eco-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{ecoPoints}</div>
            <div className="text-sm text-muted-foreground">Available Points</div>
          </CardContent>
        </Card>
      </div>

      {/* Plant New Seed */}
      <Card className="eco-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-eco-leaf" />
            Plant New Seeds
          </CardTitle>
          <CardDescription>Choose a plant species to grow in your garden</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {PLANT_SPECIES.map((species) => (
              <Button
                key={species.name}
                variant={selectedSpecies.name === species.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSpecies(species)}
                className="flex flex-col h-auto p-3"
              >
                <span className="text-lg mb-1">🌱</span>
                <span className="text-xs">{species.name}</span>
                <span className="text-xs text-muted-foreground">{species.ecoPoints}pts</span>
              </Button>
            ))}
          </div>
          <Button onClick={plantSeed} className="w-full" disabled={ecoPoints < 10}>
            🌰 Plant {selectedSpecies.name} (10 points)
          </Button>
        </CardContent>
      </Card>

      {/* Current Plants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plants.map((plant) => {
          const stage = GROWTH_STAGES[plant.growthStage];
          const species = PLANT_SPECIES.find(s => s.name === plant.species);
          
          return (
            <Card key={plant.id} className={`plant-container ${!plant.isAlive ? 'opacity-50' : ''}`}>
              <CardHeader className="text-center pb-2">
                <div className="text-4xl mb-2 growth-animation">{stage.emoji}</div>
                <CardTitle className="text-lg">{plant.name}</CardTitle>
                <CardDescription>{stage.description}</CardDescription>
                {plant.isAlive && plant.growthStage === 5 && (
                  <Badge className="eco-badge mx-auto">
                    <Star className="h-3 w-3 mr-1" />
                    Fully Grown!
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      Water
                    </span>
                    <span>{plant.waterLevel}%</span>
                  </div>
                  <Progress value={plant.waterLevel} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      Sunlight
                    </span>
                    <span>{plant.sunlightLevel}%</span>
                  </div>
                  <Progress value={plant.sunlightLevel} className="h-2" />
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  Eco-points earned: {plant.ecoPointsGenerated}
                </div>

                {plant.isAlive && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => waterPlant(plant.id)}
                      disabled={plant.waterLevel >= 90}
                      className="flex-1"
                    >
                      💧 Water
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => giveSunlight(plant.id)}
                      disabled={plant.sunlightLevel >= 90}
                      className="flex-1"
                    >
                      ☀️ Sun
                    </Button>
                  </div>
                )}

                {!plant.isAlive && (
                  <div className="text-center text-red-500 text-sm">
                    💀 Plant died from lack of care
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {plants.length === 0 && (
        <Card className="eco-card text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold mb-2">Start Your Garden!</h3>
          <p className="text-muted-foreground mb-4">
            Plant your first seed and watch it grow with care and attention.
          </p>
          <Button onClick={plantSeed} disabled={ecoPoints < 10}>
            🌰 Plant Your First Seed
          </Button>
        </Card>
      )}
    </div>
  );
};