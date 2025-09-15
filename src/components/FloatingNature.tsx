import { useEffect, useState } from 'react';
import leafIcon from '@/assets/leaf-icon.png';
import flowerIcon from '@/assets/flower-icon.png';

interface FloatingElement {
  id: number;
  type: 'leaf' | 'flower';
  left: number;
  delay: number;
}

export const FloatingNature = () => {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const generateElements = () => {
      const newElements: FloatingElement[] = [];
      
      // Generate leaves
      for (let i = 0; i < 4; i++) {
        newElements.push({
          id: i,
          type: 'leaf',
          left: Math.random() * 90 + 5, // 5% to 95%
          delay: i * 3 // 0s, 3s, 6s, 9s
        });
      }
      
      // Generate flowers
      for (let i = 0; i < 3; i++) {
        newElements.push({
          id: i + 10,
          type: 'flower',
          left: Math.random() * 90 + 5,
          delay: (i + 1) * 4 + 2 // 6s, 10s, 14s
        });
      }
      
      setElements(newElements);
    };

    generateElements();
    
    // Regenerate elements periodically for variety
    const interval = setInterval(generateElements, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      {elements.map((element) => (
        <div
          key={element.id}
          className={`floating-${element.type} absolute`}
          style={{
            left: `${element.left}%`,
            animationDelay: `${element.delay}s`,
            backgroundImage: `url(${element.type === 'leaf' ? leafIcon : flowerIcon})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        />
      ))}
    </div>
  );
};