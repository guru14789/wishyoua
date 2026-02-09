import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { PlanTier, UserProfile } from '../types';
import { ArrowRight, Loader2, Mail, Lock, User as UserIcon, ArrowLeft, Sparkles, Video, Heart } from 'lucide-react';

const Auth: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, currentUser, loading: authLoading } = useAuth();

    const [mode, setMode] = useState<'login' | 'signup'>('signup');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Get selected plan from location state, default to 'free' if not provided
    const selectedPlan = (location.state as any)?.selectedPlan as PlanTier || 'free';
    const fromPricing = !!(location.state as any)?.selectedPlan;

    // Redirect if already logged in
    React.useEffect(() => {
        if (currentUser && !authLoading) {
            // Update plan if coming from pricing and plan is different
            if (fromPricing && currentUser.plan !== selectedPlan) {
                const profiles = JSON.parse(localStorage.getItem('wishyoua_profiles') || '{}');
                if (profiles[currentUser.email]) {
                    profiles[currentUser.email].plan = selectedPlan;
                    localStorage.setItem('wishyoua_profiles', JSON.stringify(profiles));
                    // The login/refreshUserProfile call in context will handle updates
                    // For now, simple redirect is enough as CreateEvent will see the new plan in local storage
                }
            }
            navigate('/create');
        }
    }, [currentUser, authLoading, navigate, fromPricing, selectedPlan]);

    // Handle redirect result on mount (MOCKED away)
    React.useEffect(() => {
        // No-op for now as we use local storage auth
    }, []);

    const processUserSignIn = async (user: any) => {
        setLoading(true);
        try {
            // Find or create profile in local storage
            const profiles = JSON.parse(localStorage.getItem('wishyoua_profiles') || '{}');
            let profile = profiles[user.email];

            if (!profile) {
                profile = {
                    uid: user.uid || 'mock_' + Math.random().toString(36).substr(2, 9),
                    name: user.displayName || 'User',
                    email: user.email,
                    plan: selectedPlan,
                    planActivatedAt: new Date().toISOString(),
                };
                profiles[user.email] = profile;
                localStorage.setItem('wishyoua_profiles', JSON.stringify(profiles));
            }

            // Login to context
            await login({
                name: profile.name,
                email: profile.email,
                token: 'mock_token_' + Math.random().toString(36).substr(2),
            });

            navigate('/create');
        } catch (err: any) {
            console.error('Error processing sign-in:', err);
            setError('Failed to process sign-in profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate network delay
        setTimeout(async () => {
            try {
                const profiles = JSON.parse(localStorage.getItem('wishyoua_profiles') || '{}');
                if (profiles[email]) {
                    setError('This email is already registered. Please login instead.');
                    setLoading(false);
                    return;
                }

                const newProfile: UserProfile = {
                    uid: 'mock_' + Math.random().toString(36).substr(2, 9),
                    name,
                    email,
                    plan: selectedPlan,
                    planActivatedAt: new Date().toISOString(),
                };

                profiles[email] = newProfile;
                localStorage.setItem('wishyoua_profiles', JSON.stringify(profiles));

                await login({
                    name,
                    email,
                    token: 'mock_token_' + Math.random().toString(36).substr(2),
                });

                navigate('/create');
            } catch (err: any) {
                setError(err.message || 'Failed to create account');
            } finally {
                setLoading(false);
            }
        }, 1000);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate network delay
        setTimeout(async () => {
            try {
                const profiles = JSON.parse(localStorage.getItem('wishyoua_profiles') || '{}');
                const profile = profiles[email];

                if (!profile) {
                    setError('No account found with this email.');
                    setLoading(false);
                    return;
                }

                // In a real mock, you'd check password here, but for "now" we'll just allow it
                await login({
                    name: profile.name,
                    email: profile.email,
                    token: 'mock_token_' + Math.random().toString(36).substr(2),
                });

                navigate('/create');
            } catch (err: any) {
                setError(err.message || 'Failed to login');
            } finally {
                setLoading(false);
            }
        }, 1000);
    };


    const handleGoogleSignIn = async (e: React.MouseEvent) => {
        setError('');
        setLoading(true);
        (e.currentTarget as HTMLButtonElement).blur();

        // Mock Google Sign In
        setTimeout(() => {
            processUserSignIn({
                uid: 'google_mock_' + Math.random().toString(36).substr(2, 9),
                email: 'google_user@example.com',
                displayName: 'Google Guest'
            });
        }, 1200);
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
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Back button */}
                    <div className="mb-8">
                        {fromPricing && (
                            <button
                                onClick={() => navigate('/pricing')}
                                className="text-zinc-900 font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:gap-5 transition-all group"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Change Plan
                            </button>
                        )}
                        {!fromPricing && (
                            <button
                                onClick={() => navigate('/')}
                                className="text-zinc-900 font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:gap-5 transition-all group"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Home
                            </button>
                        )}
                    </div>

                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8">
                        <button
                            onClick={() => navigate('/')}
                            className="text-zinc-900 text-2xl font-black tracking-tighter"
                        >
                            wishyoua
                        </button>
                    </div>

                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight text-zinc-900">
                            {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
                        </h1>
                        {fromPricing && (
                            <p className="text-zinc-500 font-medium text-lg">
                                Selected plan: <span className="text-red-600 font-black capitalize">{selectedPlan}</span>
                            </p>
                        )}
                        {!fromPricing && (
                            <p className="text-zinc-500 font-medium text-lg">
                                Start with our <span className="text-zinc-900 font-black">Free</span> plan • <button onClick={() => navigate('/pricing')} className="text-red-600 font-black hover:underline">View Plans</button>
                            </p>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-4 mb-6">
                            <p className="text-red-600 text-sm font-bold">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={mode === 'signup' ? handleSignup : handleLogin} className="space-y-5">
                        {mode === 'signup' && (
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <UserIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        required
                                        className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-2xl py-4 pl-12 pr-4 text-zinc-900 font-bold placeholder-zinc-400 focus:border-zinc-900 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                                Email
                            </label>
                            <div className="relative">
                                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-2xl py-4 pl-12 pr-4 text-zinc-900 font-bold placeholder-zinc-400 focus:border-zinc-900 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-2xl py-4 pl-12 pr-4 text-zinc-900 font-bold placeholder-zinc-400 focus:border-zinc-900 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-300 text-white py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-600/20 disabled:shadow-none mt-6"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {mode === 'signup' ? 'Create Account' : 'Login'}
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-zinc-200"></div>
                            <span className="text-zinc-400 text-sm font-bold">OR</span>
                            <div className="flex-1 h-px bg-zinc-200"></div>
                        </div>

                        {/* Google Sign-In Button */}
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full bg-white hover:bg-zinc-50 disabled:bg-zinc-100 border-2 border-zinc-200 text-zinc-900 py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle mode */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => {
                                setMode(mode === 'signup' ? 'login' : 'signup');
                                setError('');
                            }}
                            className="text-zinc-500 hover:text-zinc-900 font-bold transition-colors"
                        >
                            {mode === 'signup' ? 'Already have an account? Login' : "Don't have an account? Sign up"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
