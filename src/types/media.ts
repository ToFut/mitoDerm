export interface MediaItem {
  id: string;
  name: string;
  description?: string;
  type: string;
  url: string;
  size?: number;
  category?: string;
  tags: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  // Additional properties for education content
  thumbnail?: string;
  duration?: number;
  views?: number;
  premium?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  language?: string;
  author?: string;
  rating?: number;
}

export interface UserProgress {
  completedVideos: number;
  totalVideos: number;
  streak: number;
  level: number;
  xp: number;
  certifications: string[];
  purchasedProducts: string[];
  premiumAccess: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
  unlocked: boolean;
  count?: number;
}