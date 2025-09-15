import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FloatingNature } from './FloatingNature';
import { 
  Home, 
  Sprout, 
  User, 
  ShoppingBag, 
  Target, 
  Calendar,
  BarChart3,
  Users,
  Settings
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentUser?: {
    name: string;
    avatar?: string;
    ecoPoints: number;
    level: number;
  };
}

export const Layout = ({ children, currentUser }: LayoutProps) => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Gardens', href: '/gardens', icon: Sprout },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Shop', href: '/shop', icon: ShoppingBag },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Habits', href: '/habits', icon: Calendar },
    { name: 'Impact', href: '/impact', icon: BarChart3 },
    { name: 'Community', href: '/community', icon: Users },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen">
      <FloatingNature />
      
      {/* Header */}
      <header className="relative z-20 nature-gradient">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-foreground">
                🌍 EcoLogic
              </h1>
            </div>
            
            {currentUser && (
              <div className="flex items-center gap-4">
                <div className="eco-badge">
                  <span>🌱 {currentUser.ecoPoints}</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-primary-foreground">
                  <span className="text-sm">Level {currentUser.level}</span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback className="bg-primary-glow text-primary-foreground">
                      {currentUser.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/profile">
                    Profile
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="relative z-20 bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-eco-leaf text-primary-foreground'
                      : 'text-muted-foreground hover:bg-eco-leaf-light hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};