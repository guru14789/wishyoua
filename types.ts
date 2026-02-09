// Plan Types
export type PlanTier = 'free' | 'pro' | 'premium';

export interface PlanLimits {
  maxGuests: number;
  recordingDuration: number; // in seconds
  hasIntroVideo: boolean;
  hasDownloads: boolean;
  hasMergeAccess: boolean;
  hasCustomBranding: boolean;
}

export interface Plan {
  tier: PlanTier;
  name: string;
  price: number; // in cents
  limits: PlanLimits;
}

// User Types
export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  plan: PlanTier;
  planActivatedAt: string;
  paymentId?: string;
  razorpaySubscriptionId?: string;
}

// Event Types
export interface EventPlanSnapshot {
  tier: PlanTier;
  limits: PlanLimits;
  snapshotAt: string;
}

export interface Event {
  id: string;
  organizerId: string;
  eventName: string;
  customQuestion: string;
  introType: 'text' | 'video';
  introMessage?: string;
  introVideoUrl?: string;
  plan: EventPlanSnapshot;
  createdAt: string;
  guestCount: number;
}

// Guest Submission Types
export interface GuestSubmission {
  id: string;
  eventId: string;
  guestName: string;
  guestEmail?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  createdAt: string;
  status: 'uploading' | 'ready' | 'failed';
}
