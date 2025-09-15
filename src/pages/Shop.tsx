import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShopItem } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEcoPoints } from '@/hooks/useEcoPoints';
import { ShoppingBag, Star, Sparkles, Crown, Gem } from 'lucide-react';
import { toast } from 'sonner';

const SHOP_ITEMS: ShopItem[] = [
  // Seeds
  {
    id: 'sunflower-seed',
    name: 'Sunflower Seeds',
    description: 'Bright and cheerful sunflowers that grow tall and proud',
    category: 'seeds',
    price: 15,
    image: '🌻',
    isOwned: false,
    rarity: 'common'
  },
  {
    id: 'rose-seed',
    name: 'Rose Seeds',
    description: 'Beautiful roses that attract beneficial insects',
    category: 'seeds',
    price: 25,
    image: '🌹',
    isOwned: false,
    rarity: 'rare'
  },
  {
    id: 'rainbow-flower-seed',
    name: 'Rainbow Flower Seeds',
    description: 'Magical flowers that change colors with the seasons',
    category: 'seeds',
    price: 100,
    image: '🌈',
    isOwned: false,
    rarity: 'legendary'
  },

  // Tools
  {
    id: 'watering-can',
    name: 'Golden Watering Can',
    description: 'Waters plants more efficiently (+50% water boost)',
    category: 'tools',
    price: 50,
    image: '🚿',
    isOwned: false,
    rarity: 'epic'
  },
  {
    id: 'fertilizer',
    name: 'Organic Fertilizer',
    description: 'Speeds up plant growth by 25%',
    category: 'tools',
    price: 30,
    image: '🧪',
    isOwned: false,
    rarity: 'rare'
  },
  {
    id: 'solar-panel',
    name: 'Mini Solar Panel',
    description: 'Provides unlimited sunlight to your plants',
    category: 'tools',
    price: 150,
    image: '☀️',
    isOwned: false,
    rarity: 'legendary'
  },

  // Decorations
  {
    id: 'garden-gnome',
    name: 'Eco Garden Gnome',
    description: 'A friendly guardian for your garden',
    category: 'decorations',
    price: 40,
    image: '🧙‍♂️',
    isOwned: false,
    rarity: 'common'
  },
  {
    id: 'butterfly-house',
    name: 'Butterfly House',
    description: 'Attracts beautiful butterflies to your garden',
    category: 'decorations',
    price: 60,
    image: '🦋',
    isOwned: false,
    rarity: 'rare'
  },
  {
    id: 'rainbow-arch',
    name: 'Rainbow Garden Arch',
    description: 'A magical archway that brings luck to your plants',
    category: 'decorations',
    price: 200,
    image: '🌈',
    isOwned: false,
    rarity: 'legendary'
  },

  // Pet Items
  {
    id: 'pet-food',
    name: 'Organic Pet Food',
    description: 'Nutritious food that makes pets happy and energetic',
    category: 'pet-items',
    price: 10,
    image: '🍃',
    isOwned: false,
    rarity: 'common'
  },
  {
    id: 'pet-toy',
    name: 'Eco-Friendly Pet Toy',
    description: 'A fun toy made from recycled materials',
    category: 'pet-items',
    price: 20,
    image: '🎾',
    isOwned: false,
    rarity: 'common'
  },

  // Avatar Items
  {
    id: 'eco-hat',
    name: 'Eco Warrior Hat',
    description: 'Show off your environmental dedication',
    category: 'avatar-items',
    price: 35,
    image: '🎩',
    isOwned: false,
    rarity: 'rare'
  },
  {
    id: 'leaf-crown',
    name: 'Crown of Leaves',
    description: 'A majestic crown made of golden leaves',
    category: 'avatar-items',
    price: 80,
    image: '👑',
    isOwned: false,
    rarity: 'epic'
  }
];

const RARITY_COLORS = {
  common: 'text-gray-600',
  rare: 'text-blue-600',
  epic: 'text-purple-600',
  legendary: 'text-yellow-600'
};

const RARITY_ICONS = {
  common: <Star className="h-4 w-4" />,
  rare: <Sparkles className="h-4 w-4" />,
  epic: <Crown className="h-4 w-4" />,
  legendary: <Gem className="h-4 w-4" />
};

export const Shop = () => {
  const [ownedItems, setOwnedItems] = useLocalStorage<string[]>('eco-shop-items', []);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { ecoPoints, spendPoints } = useEcoPoints(300);

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'seeds', name: 'Seeds' },
    { id: 'tools', name: 'Tools' },
    { id: 'decorations', name: 'Decorations' },
    { id: 'pet-items', name: 'Pet Items' },
    { id: 'avatar-items', name: 'Avatar Items' }
  ];

  const filteredItems = SHOP_ITEMS.map(item => ({
    ...item,
    isOwned: ownedItems.includes(item.id)
  })).filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const purchaseItem = (item: ShopItem) => {
    if (ownedItems.includes(item.id)) {
      toast.error('You already own this item!');
      return;
    }

    if (spendPoints(item.price, item.name)) {
      setOwnedItems(prev => [...prev, item.id]);
      toast.success(`🎉 ${item.name} purchased!`, {
        description: 'Check your inventory to use it!'
      });
    }
  };

  const ownedCount = ownedItems.length;
  const totalSpent = ownedItems.reduce((total, itemId) => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    return total + (item?.price || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">🛒 Eco Shop</h1>
        <p className="text-muted-foreground">Spend your eco-points on amazing items for your garden and avatar!</p>
      </div>

      {/* Shop Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="eco-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{ecoPoints}</div>
            <div className="text-sm text-muted-foreground">Available Points</div>
          </CardContent>
        </Card>
        <Card className="eco-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-eco-growth">{ownedCount}</div>
            <div className="text-sm text-muted-foreground">Items Owned</div>
          </CardContent>
        </Card>
        <Card className="eco-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-eco-leaf">{totalSpent}</div>
            <div className="text-sm text-muted-foreground">Points Spent</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <Card 
                key={item.id} 
                className={`eco-card ${item.isOwned ? 'border-eco-growth' : ''}`}
              >
                <CardHeader className="text-center pb-2">
                  <div className="text-4xl mb-2">{item.image}</div>
                  <CardTitle className="text-lg flex items-center justify-center gap-2">
                    {item.name}
                    {item.isOwned && (
                      <Badge className="eco-badge text-xs">
                        ✓ Owned
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <Badge 
                      variant="outline" 
                      className={`${RARITY_COLORS[item.rarity]} flex items-center gap-1`}
                    >
                      {RARITY_ICONS[item.rarity]}
                      {item.rarity}
                    </Badge>
                    <div className="text-lg font-bold text-primary">
                      {item.price} 🌱
                    </div>
                  </div>

                  <Button 
                    onClick={() => purchaseItem(item)}
                    disabled={item.isOwned || ecoPoints < item.price}
                    className="w-full"
                    variant={item.isOwned ? "secondary" : "default"}
                  >
                    {item.isOwned ? (
                      <>✓ Owned</>
                    ) : ecoPoints < item.price ? (
                      <>💸 Not enough points</>
                    ) : (
                      <>🛒 Buy Now</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredItems.length === 0 && (
        <Card className="eco-card text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold mb-2">No Items Found</h3>
          <p className="text-muted-foreground">
            Try selecting a different category to see more items.
          </p>
        </Card>
      )}

      {/* Featured Items */}
      <Card className="eco-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gem className="h-5 w-5 text-yellow-500" />
            Featured Legendary Items
          </CardTitle>
          <CardDescription>Rare and powerful items for dedicated eco-warriors!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SHOP_ITEMS.filter(item => item.rarity === 'legendary').map((item) => (
              <div key={item.id} className="text-center p-4 rounded-lg soft-gradient">
                <div className="text-3xl mb-2">{item.image}</div>
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="text-xs text-muted-foreground mb-2">{item.description}</div>
                <Badge className="eco-badge">
                  <Gem className="h-3 w-3 mr-1" />
                  {item.price} Points
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};