import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SpinWheelReward } from '@/types';
import { useEcoPoints } from '@/hooks/useEcoPoints';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

const WHEEL_REWARDS: SpinWheelReward[] = [
  { id: '1', type: 'eco-points', value: 50, rarity: 'common', weight: 30 },
  { id: '2', type: 'eco-points', value: 100, rarity: 'common', weight: 20 },
  { id: '3', type: 'eco-points', value: 200, rarity: 'rare', weight: 15 },
  { id: '4', type: 'item', value: 'Lucky Leaf Charm', rarity: 'rare', weight: 10 },
  { id: '5', type: 'pet-food', value: 'Premium Pet Food', rarity: 'common', weight: 15 },
  { id: '6', type: 'eco-points', value: 500, rarity: 'epic', weight: 5 },
  { id: '7', type: 'avatar-item', value: 'Eco Hero Cape', rarity: 'epic', weight: 3 },
  { id: '8', type: 'eco-points', value: 25, rarity: 'common', weight: 2 },
];

interface SpinWheelProps {
  onReward: (reward: SpinWheelReward) => void;
}

export const SpinWheel = ({ onReward }: SpinWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastSpin] = useLocalStorage('last-spin', '');
  const [monthlySpins, setMonthlySpins] = useLocalStorage('monthly-spins', 0);
  const { addPoints } = useEcoPoints();

  const canSpin = () => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
    const lastSpinMonth = lastSpin ? `${new Date(lastSpin).getFullYear()}-${new Date(lastSpin).getMonth()}` : '';
    
    // Reset spins if new month
    if (currentMonth !== lastSpinMonth) {
      setMonthlySpins(0);
      return true;
    }
    
    return monthlySpins < 3; // 3 spins per month
  };

  const getRandomReward = (): SpinWheelReward => {
    const totalWeight = WHEEL_REWARDS.reduce((sum, reward) => sum + reward.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const reward of WHEEL_REWARDS) {
      random -= reward.weight;
      if (random <= 0) return reward;
    }
    
    return WHEEL_REWARDS[0];
  };

  const spin = async () => {
    if (!canSpin() || isSpinning) return;
    
    setIsSpinning(true);
    
    // Simulate spin animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reward = getRandomReward();
    
    // Update spin count and last spin date
    setMonthlySpins(prev => prev + 1);
    localStorage.setItem('last-spin', new Date().toISOString());
    
    // Give reward
    if (reward.type === 'eco-points') {
      addPoints(Number(reward.value), `Spin wheel reward`);
    }
    
    onReward(reward);
    setIsSpinning(false);
    
    const rarityEmoji = {
      common: '🎁',
      rare: '✨',
      epic: '🌟'
    }[reward.rarity];
    
    toast.success(`${rarityEmoji} You won: ${reward.value}!`, {
      description: `Rarity: ${reward.rarity}`
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const spinsLeft = canSpin() ? 3 - monthlySpins : 0;

  return (
    <Card className="eco-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            🎰 Lucky Spin
          </span>
          <Badge variant={spinsLeft > 0 ? "default" : "outline"}>
            {spinsLeft} spins left
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Wheel Visual */}
        <div className="relative mx-auto w-48 h-48">
          <div className={`w-full h-full rounded-full border-8 border-eco-leaf transition-transform duration-2000 ${
            isSpinning ? 'animate-spin' : ''
          }`} style={{
            background: `conic-gradient(
              #22c55e 0deg 45deg,
              #3b82f6 45deg 90deg,
              #f59e0b 90deg 135deg,
              #ef4444 135deg 180deg,
              #8b5cf6 180deg 225deg,
              #06b6d4 225deg 270deg,
              #10b981 270deg 315deg,
              #f97316 315deg 360deg
            )`
          }}>
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-eco-leaf" />
            
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 w-0 h-0 transform -translate-x-1/2 -translate-y-1">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white" />
            </div>
          </div>
        </div>

        {/* Spin Button */}
        <div className="text-center">
          <Button 
            onClick={spin} 
            disabled={!canSpin() || isSpinning}
            className="px-8 py-3 text-lg"
          >
            {isSpinning ? '🌀 Spinning...' : '🎰 Spin Now!'}
          </Button>
          
          {!canSpin() && monthlySpins >= 3 && (
            <p className="text-sm text-muted-foreground mt-2">
              Come back next month for more spins!
            </p>
          )}
        </div>

        {/* Possible Rewards */}
        <div>
          <h4 className="font-semibold mb-3">Possible Rewards:</h4>
          <div className="grid grid-cols-1 gap-2">
            {WHEEL_REWARDS.map((reward) => (
              <div key={reward.id} className="flex items-center justify-between p-2 rounded border border-border">
                <span className="text-sm">{reward.value}</span>
                <Badge variant="outline" className={getRarityColor(reward.rarity)}>
                  {reward.rarity}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
          <h5 className="font-semibold mb-1">Spin Rules:</h5>
          <ul className="space-y-1">
            <li>• 3 free spins per month</li>
            <li>• Earn bonus spins with monthly streaks</li>
            <li>• Higher streaks = better rewards</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};