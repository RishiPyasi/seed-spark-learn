import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useEcoPoints = (initialPoints: number = 100) => {
  const [ecoPoints, setEcoPoints] = useState(initialPoints);
  const [totalEarned, setTotalEarned] = useState(initialPoints);

  const addPoints = useCallback((points: number, reason?: string) => {
    setEcoPoints(prev => prev + points);
    setTotalEarned(prev => prev + points);
    
    toast.success(`🌱 +${points} Eco-Points earned!`, {
      description: reason || 'Great job helping the environment!'
    });
  }, []);

  const spendPoints = useCallback((points: number, item?: string): boolean => {
    if (ecoPoints >= points) {
      setEcoPoints(prev => prev - points);
      
      toast.success(`💚 ${points} Eco-Points spent!`, {
        description: item ? `Purchased: ${item}` : 'Purchase successful!'
      });
      
      return true;
    } else {
      toast.error('Not enough Eco-Points!', {
        description: `You need ${points - ecoPoints} more points.`
      });
      return false;
    }
  }, [ecoPoints]);

  const canAfford = useCallback((cost: number) => {
    return ecoPoints >= cost;
  }, [ecoPoints]);

  return {
    ecoPoints,
    totalEarned,
    addPoints,
    spendPoints,
    canAfford
  };
};