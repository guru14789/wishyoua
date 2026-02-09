import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlanTier, UserProfile } from '../types';

interface User {
    uid: string;
    name: string;
    email: string;
    token: string;
    plan: PlanTier;
}

interface AuthContextType {
    currentUser: User | null;
    firebaseUser: any | null; // Mocked
    userProfile: UserProfile | null;
    loading: boolean;
    login: (user: Omit<User, 'uid' | 'plan'>) => Promise<void>;
    logout: () => void;
    refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<any | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Initial session check from localStorage
    useEffect(() => {
        const savedSession = localStorage.getItem('wishyoua_session');
        if (savedSession) {
            try {
                const session = JSON.parse(savedSession);
                setCurrentUser(session);
                // Mock firebase user for components that expect it
                setFirebaseUser({
                    uid: session.uid,
                    email: session.email,
                    displayName: session.name,
                    getIdToken: async () => session.token
                });

                // Try to get profile from local storage as well
                const profiles = JSON.parse(localStorage.getItem('wishyoua_profiles') || '{}');
                if (profiles[session.email]) {
                    setUserProfile(profiles[session.email]);
                }
            } catch (e) {
                console.error('Failed to parse saved session');
                localStorage.removeItem('wishyoua_session');
            }
        }
        setLoading(false);
    }, []);

    const login = async (user: Omit<User, 'uid' | 'plan'>) => {
        // Find or create profile
        const profiles = JSON.parse(localStorage.getItem('wishyoua_profiles') || '{}');
        let profile = profiles[user.email];

        if (!profile) {
            profile = {
                uid: 'mock_' + Math.random().toString(36).substr(2, 9),
                name: user.name,
                email: user.email,
                plan: 'free',
                planActivatedAt: new Date().toISOString()
            };
            profiles[user.email] = profile;
            localStorage.setItem('wishyoua_profiles', JSON.stringify(profiles));
        }

        const fullUser: User = {
            ...user,
            uid: profile.uid,
            plan: profile.plan
        };

        setCurrentUser(fullUser);
        setUserProfile(profile);
        setFirebaseUser({
            uid: profile.uid,
            email: profile.email,
            displayName: profile.name,
            getIdToken: async () => user.token
        });

        localStorage.setItem('wishyoua_session', JSON.stringify(fullUser));
    };

    const logout = () => {
        setCurrentUser(null);
        setUserProfile(null);
        setFirebaseUser(null);
        localStorage.removeItem('wishyoua_session');
    };

    const refreshUserProfile = async () => {
        if (currentUser?.email) {
            const profiles = JSON.parse(localStorage.getItem('wishyoua_profiles') || '{}');
            const profile = profiles[currentUser.email];
            if (profile) {
                setUserProfile(profile);
                const updatedUser = { ...currentUser, plan: profile.plan };
                setCurrentUser(updatedUser);
                localStorage.setItem('wishyoua_session', JSON.stringify(updatedUser));
            }
        }
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            firebaseUser,
            userProfile,
            loading,
            login,
            logout,
            refreshUserProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

