import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { PlanTier } from '../types';
import { ArrowLeft, Loader2 } from 'lucide-react';

const Auth: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        signInWithGoogle,
        currentUser,
        loading: authLoading,
        refreshUserProfile
    } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Get selected plan from location state, default to 'free' if not provided
    const selectedPlan = (location.state as any)?.selectedPlan as PlanTier || 'free';
    const fromPricing = !!(location.state as any)?.selectedPlan;

    // Redirect if already logged in and handle plan update
    React.useEffect(() => {
        const checkAndRedirect = async () => {
            if (currentUser && !authLoading) {
                // Update plan if coming from pricing and plan is different from current
                if (fromPricing && currentUser.plan !== selectedPlan) {
                    try {
                        const userRef = doc(db, 'users', currentUser.uid);
                        await updateDoc(userRef, {
                            plan: selectedPlan
                        });
                        // Refresh context to reflect new plan
                        await refreshUserProfile();
                    } catch (e) {
                        console.error("Error updating plan:", e);
                    }
                }
                navigate('/create');
            }
        };

        checkAndRedirect();
    }, [currentUser, authLoading, navigate, fromPricing, selectedPlan, refreshUserProfile]);

    const getErrorMessage = (errCode: string) => {
        switch (errCode) {
            case 'auth/popup-closed-by-user': return 'Sign in cancelled.';
            case 'auth/popup-blocked': return 'Popup blocked. Please allow popups for this site.';
            default: return 'Authentication failed. Please try again.';
        }
    };

    const handleGoogleSignIn = async (e: React.MouseEvent) => {
        setError('');
        setLoading(true);
        (e.currentTarget as HTMLButtonElement).blur();

        try {
            await signInWithGoogle();
        } catch (err: any) {
            console.error(err);
            setError(getErrorMessage(err.code));
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-['Poppins',sans-serif] flex">
            {/* LEFT SIDE - Branding/Visual */}
            <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
                {/* Video Background */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: 'brightness(0.5)' }}
                >
                    <source src="/videos/background.mp4" type="video/mp4" />
                </video>

                {/* Animated Background Gradient Overlay */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-900/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-800/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center p-16 w-full text-center">
                    {/* Logo at top */}
                    <div className="absolute top-12 left-12">
                        <button
                            onClick={() => navigate('/')}
                            className="text-white text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity"
                        >
                            wishyoua
                        </button>
                    </div>

                    {/* Main Content - Centered */}
                    <div className="max-w-lg space-y-16">
                        {/* Large Quote/Message */}
                        <div className="space-y-6">
                            <div className="text-8xl font-black text-white/10 leading-none">"</div>
                            <h2 className="text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
                                Every moment<br />
                                deserves to be<br />
                                <span className="text-blue-400">remembered</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-blue-900/30">
                            <div>
                                <div className="text-3xl font-black text-white mb-1">10K+</div>
                                <div className="text-zinc-500 text-sm font-bold uppercase tracking-wider">Events</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-blue-400 mb-1">50K+</div>
                                <div className="text-zinc-500 text-sm font-bold uppercase tracking-wider">Videos</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-white mb-1">4.9★</div>
                                <div className="text-zinc-500 text-sm font-bold uppercase tracking-wider">Rating</div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-12 text-zinc-600 text-xs">
                        © 2026 wishyoua • Making memories magical
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 lg:p-12">
                <div className="w-full max-w-md animate-in slide-in-from-bottom-8 duration-700">
                    {/* Back button */}
                    <div className="mb-6 md:mb-8">
                        {fromPricing && (
                            <button
                                onClick={() => navigate('/pricing')}
                                className="text-zinc-900 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 md:gap-3 hover:gap-5 transition-all group"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Change Plan
                            </button>
                        )}
                        {!fromPricing && (
                            <button
                                onClick={() => navigate('/')}
                                className="text-zinc-900 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 md:gap-3 hover:gap-5 transition-all group"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Home
                            </button>
                        )}
                    </div>

                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 md:mb-10 text-center md:text-left">
                        <button
                            onClick={() => navigate('/')}
                            className="text-zinc-900 text-3xl font-black tracking-tighter"
                        >
                            wishyoua
                        </button>
                    </div>

                    {/* Header */}
                    <div className="mb-8 md:mb-10 text-center md:text-left">
                        <h1 className="text-3xl md:text-5xl font-black mb-2 md:mb-3 tracking-tight text-zinc-900">
                            Welcome
                        </h1>
                        {fromPricing && (
                            <p className="text-zinc-500 font-medium text-sm md:text-lg">
                                Selected plan: <span className="text-red-600 font-black capitalize">{selectedPlan}</span>
                            </p>
                        )}
                        {!fromPricing && (
                            <p className="text-zinc-500 font-medium text-sm md:text-lg">
                                Sign in to create your first event
                            </p>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-2xl md:rounded-3xl p-4 mb-6 animate-in shake">
                            <p className="text-red-600 text-xs md:text-sm font-bold">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <div className="space-y-4 md:space-y-5">

                        {/* Google Sign-In Button */}
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            type="button"
                            className="w-full bg-black hover:bg-zinc-800 text-white disabled:bg-zinc-700 py-5 md:py-6 rounded-2xl md:rounded-3xl font-black text-lg md:text-xl transition-all flex items-center justify-center gap-3 md:gap-4 disabled:opacity-50 shadow-2xl shadow-zinc-900/20 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={24} className="animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[20px] md:size-[24px]">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </button>

                        <p className="text-center text-xs text-zinc-400 font-medium px-4">
                            By clicking continue, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
