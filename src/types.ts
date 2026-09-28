export type TabType = 'home' | 'explore' | 'map' | 'adventures' | 'groups' | 'journal' | 'me-profile';

export interface Discovery {
  id: string;
  title: string;
  category: string;
  categoryKey: 'heritage' | 'food' | 'architecture' | 'secret';
  zone: string;
  distance: string;
  duration: string;
  provenance: string;
  imageUrl: string;
  description: string;
  fullStory: string;
  openHours: string;
  xp: number;
  curator?: string;
  imagePrompt?: string;
  coordinates?: { lat?: number; lng?: number; top?: string | number; left?: string | number };
}

export interface NeighbourhoodZone {
  name: string;
  spotsCount: number;
  tagline: string;
  icon: string;
}

export type Neighbourhood = NeighbourhoodZone;

export interface Quest {
  id: string;
  title: string;
  zone: string;
  xp?: number;
  completed: boolean;
  totalStops?: number;
  completedStops?: number;
  nextStop?: string;
  rewardXp?: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  xp: number;
  streak: number;
  username?: string;
  handle?: string;
  level?: string | number;
  levelTitle?: string;
  currentXp?: number;
  maxXp?: number;
  streakDays?: number;
  totalXpEarned?: number;
  mappedCount?: number;
  questsCompleted?: number;
  badgesEarned?: number;
  bio?: string;
  avatarUrl?: string;
}
