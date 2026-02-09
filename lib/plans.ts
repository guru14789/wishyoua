import { Plan, PlanTier, PlanLimits } from '../types';

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
    free: {
        maxGuests: 10,
        recordingDuration: 60, // 1 minute
        hasIntroVideo: false,
        hasDownloads: false,
        hasMergeAccess: false,
        hasCustomBranding: false,
    },
    pro: {
        maxGuests: 50,
        recordingDuration: 120, // 2 minutes
        hasIntroVideo: true,
        hasDownloads: true,
        hasMergeAccess: false,
        hasCustomBranding: false,
    },
    premium: {
        maxGuests: -1, // unlimited
        recordingDuration: 300, // 5 minutes
        hasIntroVideo: true,
        hasDownloads: true,
        hasMergeAccess: true,
        hasCustomBranding: true,
    },
};

export const PLANS: Record<PlanTier, Plan> = {
    free: {
        tier: 'free',
        name: 'Free',
        price: 0,
        limits: PLAN_LIMITS.free,
    },
    pro: {
        tier: 'pro',
        name: 'Pro',
        price: 99900, // ₹999
        limits: PLAN_LIMITS.pro,
    },
    premium: {
        tier: 'premium',
        name: 'Premium',
        price: 299900, // ₹2999
        limits: PLAN_LIMITS.premium,
    },
};

export const getPlanByTier = (tier: PlanTier): Plan => {
    return PLANS[tier];
};

export const canCreateEvent = (userPlan: PlanTier | null): boolean => {
    return userPlan !== null;
};

export const canUpgradeEvent = (eventPlan: PlanTier, userPlan: PlanTier): boolean => {
    const tierOrder: PlanTier[] = ['free', 'pro', 'premium'];
    const eventIndex = tierOrder.indexOf(eventPlan);
    const userIndex = tierOrder.indexOf(userPlan);
    return userIndex > eventIndex;
};
