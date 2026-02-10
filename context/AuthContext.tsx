import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    User as FirebaseUser,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
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
    firebaseUser: FirebaseUser | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUserProfile: () => Promise<void>;
    login: (user: any) => Promise<void>; // Deprecated but kept for compatibility potential
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setFirebaseUser(user);
            if (user) {
                try {
                    // Get token
                    const token = await user.getIdToken();

                    // Get Profile from Firestore
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);

                    let profile: UserProfile;

                    if (docSnap.exists()) {
                        profile = docSnap.data() as UserProfile;

                        // If plan is missing in Firestore but user exists, default to free
                        if (!profile.plan) profile.plan = 'free';

                    } else {
                        // Create basic profile if not exists (e.g. first google login)
                        profile = {
                            uid: user.uid,
                            name: user.displayName || 'User',
                            email: user.email || '',
                            plan: 'free',
                            planActivatedAt: new Date().toISOString()
                        };
                        await setDoc(docRef, profile);
                    }

                    setUserProfile(profile);
                    setCurrentUser({
                        uid: user.uid,
                        name: profile.name || user.displayName || 'User',
                        email: user.email || '',
                        token,
                        plan: profile.plan
                    });
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    // Fallback
                    setCurrentUser(null);
                }
            } else {
                setCurrentUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            // onAuthStateChanged handles the rest
        } catch (error) {
            console.error("Google Sign In Error:", error);
            throw error;
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Email Sign In Error:", error);
            throw error;
        }
    };

    const signUpWithEmail = async (email: string, password: string, name: string) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            // Update profile with name
            await updateProfile(result.user, {
                displayName: name
            });

            // Create Firestore document immediately with name
            const profile: UserProfile = {
                uid: result.user.uid,
                name: name,
                email: email,
                plan: 'free',
                planActivatedAt: new Date().toISOString()
            };
            await setDoc(doc(db, "users", result.user.uid), profile);

        } catch (error) {
            console.error("Sign Up Error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    const refreshUserProfile = async () => {
        if (auth.currentUser) {
            const docRef = doc(db, "users", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const profile = docSnap.data() as UserProfile;
                setUserProfile(profile);
                setCurrentUser(prev => prev ? ({ ...prev, plan: profile.plan }) : null);
            }
        }
    };

    // Compatibility stub for existing 'login' calls if any remain, or just alias it
    const login = async (user: any) => {
        console.warn("Deprecated 'login' called. Use signInWithEmail or signInWithGoogle.");
        // Does nothing now, as we rely on Firebase Auth state
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            firebaseUser,
            userProfile,
            loading,
            signInWithGoogle,
            signInWithEmail,
            signUpWithEmail,
            logout,
            refreshUserProfile,
            login
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

