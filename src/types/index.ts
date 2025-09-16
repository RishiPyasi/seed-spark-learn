// Core types for EcoLogic platform

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: Avatar;
  role: UserRole;
  ecoPoints: number;
  level: number;
  streakDays: number;
  language: string;
  joinedAt: Date;
}

export type UserRole = 'student' | 'teacher' | 'admin';

export interface Avatar {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  eyeShape: string;
  faceShape: string;
  outfit: string;
  accessories: string[];
  facialHair: string;
  expression: string;
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  growthStage: number; // 0-5 (seed to full grown)
  waterLevel: number; // 0-100
  sunlightLevel: number; // 0-100
  plantedAt: Date;
  lastWatered: Date;
  ecoPointsGenerated: number;
  isAlive: boolean;
}

export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'horse' | 'duck' | 'cow' | 'rabbit';
  level: number;
  happiness: number; // 0-100
  energy: number; // 0-100
  hunger: number; // 0-100
  ecoPointsContributed: number;
  lastFed: Date;
  lastPlayed: Date;
  skills: string[];
  personality: 'playful' | 'calm' | 'energetic' | 'gentle';
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: 'seeds' | 'tools' | 'decorations' | 'pet-items' | 'avatar-items';
  price: number;
  image: string;
  isOwned: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  target: number;
  current: number;
  ecoPointsReward: number;
  deadline?: Date;
  isCompleted: boolean;
  category: 'water-saving' | 'energy-saving' | 'recycling' | 'learning' | 'social';
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  ecoPointsPerDay: number;
  completedDates: string[]; // ISO date strings
  streak: number;
  category: 'water' | 'energy' | 'transport' | 'waste' | 'learning';
}

export interface ImpactData {
  co2Saved: number; // in kg
  waterSaved: number; // in liters
  energySaved: number; // in kWh
  wasteReduced: number; // in kg
  treesPlanted: number;
}

export interface ClassDiscussion {
  id: string;
  classId: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  replies: DiscussionReply[];
  isActive: boolean;
}

export interface DiscussionReply {
  id: string;
  userId: string;
  message: string;
  createdAt: Date;
  likes: number;
  isVerified?: boolean;
}

export interface PhotoSubmission {
  id: string;
  userId: string;
  goalId: string;
  image: string;
  description: string;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  verifiedBy?: string;
  verificationNotes?: string;
  ecoPointsAwarded?: number;
}

export interface SpinWheelReward {
  id: string;
  type: 'eco-points' | 'item' | 'pet-food' | 'avatar-item';
  value: number | string;
  rarity: 'common' | 'rare' | 'epic';
  weight: number; // probability weight
}