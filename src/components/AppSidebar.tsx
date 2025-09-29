import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useEcoPoints } from "@/hooks/useEcoPoints";
import {
  User, Zap, Target, Crown, Award, Heart, Sprout,
  BookOpen, Trophy, ShoppingBag, FileText, MessageCircle,
  Calculator, Thermometer, Gamepad2, Calendar, Leaf, Clock,
  Users, School, TrendingUp, Star
} from "lucide-react";
import petDogImage from '@/assets/pet-dog.png';

const navigationItems = [
  // Quick Actions
  {
    group: "Quick Actions",
    items: [
      { name: 'Challenges', icon: Target, href: '/challenges' },
      { name: 'Quizzes', icon: BookOpen, href: '/quiz' },
      { name: 'Shop', icon: ShoppingBag, href: '/shop' },
      { name: 'Journal', icon: FileText, href: '/journal' },
      { name: 'Discussion', icon: MessageCircle, href: '/discussion', special: true },
      { name: 'Habits', icon: Target, href: '/habits' },
      { name: 'Lessons', icon: BookOpen, href: '/lessons' },
      { name: 'Impact Calculator', icon: Calculator, href: '/impact', special: true },
      { name: 'Heatmap', icon: Thermometer, href: '/habits' },
      { name: 'Meditation', icon: Leaf, href: '/meditation' },
      { name: 'Pomodoro', icon: Clock, href: '/pomodoro' },
      { name: 'Spin Wheel', icon: Gamepad2, href: '/spin', special: true },
      { name: 'Events', icon: Calendar, href: '/events', special: true },
    ]
  },
  // Other sections
  {
    group: "Community",
    items: [
      { name: 'Leaderboard', icon: Trophy, href: '/leaderboard', special: true },
    ]
  },
  {
    group: "Teacher Tools",
    items: [
      { name: 'Teacher Login', icon: School, href: '/teacher-auth' },
      { name: 'Teacher Dashboard', icon: TrendingUp, href: '/teacher-dashboard' },
    ]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const [user] = useLocalStorage('eco-user', {
    name: 'Eco Explorer',
    ecoPoints: 250,
    level: 3,
    streakDays: 12,
    rank: 7
  });

  const { ecoPoints } = useEcoPoints(user.ecoPoints);

  const isActive = (path: string) => currentPath === path;

  const getNavClasses = (href: string, special?: boolean) => {
    const baseClasses = "w-full justify-start gap-3 text-left";
    if (isActive(href)) {
      return `${baseClasses} bg-muted text-primary font-medium border-l-2 border-primary`;
    }
    if (special) {
      return `${baseClasses} opacity-60 hover:opacity-80`;
    }
    return `${baseClasses} hover:bg-muted/50`;
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-80"} collapsible="icon">
      <SidebarTrigger className="m-2" />
      
      <SidebarContent className="px-2">
        {/* User Profile Section */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="" />
              <AvatarFallback className="bg-eco-leaf text-white">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{user.name}</h3>
                <p className="text-xs text-muted-foreground">Level {user.level}</p>
              </div>
            )}
          </div>

          {!collapsed && (
            <div className="space-y-3">
              {/* Eco Points */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-eco-growth" />
                  <span className="text-sm font-medium">Eco Points</span>
                </div>
                <Badge className="eco-badge">{ecoPoints}</Badge>
              </div>

              {/* Streak */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-eco-leaf" />
                  <span className="text-sm font-medium">Streak</span>
                </div>
                <Badge className="eco-badge">🔥 {user.streakDays}</Badge>
              </div>

              {/* Rank */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-eco-earth" />
                  <span className="text-sm font-medium">Rank</span>
                </div>
                <Badge className="eco-badge">#{user.rank}</Badge>
              </div>

              {/* Quick User Actions */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <NavLink
                  to="/profile"
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Award className="w-4 h-4 text-eco-earth" />
                  <span className="text-xs">Badges</span>
                </NavLink>
                
                <NavLink
                  to="/pets"
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-xs">Pet</span>
                </NavLink>

                <NavLink
                  to="/gardens"
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Sprout className="w-4 h-4 text-eco-growth" />
                  <span className="text-xs">Garden</span>
                </NavLink>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Groups */}
        {navigationItems.map((section) => (
          <SidebarGroup key={section.group}>
            {!collapsed && (
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.group}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.href}
                        className={getNavClasses(item.href, item.special)}
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        {!collapsed && (
                          <span className="text-sm">
                            {item.name}
                            {item.special && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Soon
                              </Badge>
                            )}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Pet Preview (Bottom) */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t">
            <div className="text-center">
              <img 
                src={petDogImage} 
                alt="Your Pet"
                className="w-12 h-12 mx-auto mb-2 animate-bounce-soft"
              />
              <p className="text-xs text-muted-foreground">Your pet Buddy</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Hunger</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-1" />
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
