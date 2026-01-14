
export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'sports' | 'wellness' | 'kids' | 'spa';
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  specialization: string;
  image: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  isPopular?: boolean;
}

export interface ScheduleItem {
  id: string;
  time: string;
  activity: string;
  trainer: string;
  room: string;
  category: string;
}

export interface FeedbackState {
  isOpen: boolean;
  subject?: string;
}
