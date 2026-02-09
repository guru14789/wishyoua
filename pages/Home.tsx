import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Mic,
    Volume2,
    Video,
    MessageCircle,
    X,
    ArrowRight,
    Plus,
    Send,
    Sparkles,
    Check,
    ArrowLeft,
    ShieldCheck,
    Zap,
    Lock,
    Mail,
    User,
    Key,
    AlertCircle,
    Loader2,
    LogOut
} from 'lucide-react';
import { FEATURES, BENTO_ITEMS, FAQS, TESTIMONIALS, PRICING_PLANS } from '../constants';
import { getStickyAdvice } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);

    // Auth Global State
    const { currentUser, login, logout } = useAuth();
    const navigate = useNavigate();

    // Signup State
    const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
    const [isSubmittingSignup, setIsSubmittingSignup] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);

    // Login State
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
    const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [lockoutTime, setLockoutTime] = useState<number | null>(null);

    const [aiMessage, setAiMessage] = useState('');
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [windowHeight, setWindowHeight] = useState(1000);
    const videoRef = useRef<HTMLVideoElement>(null);

    const narrativeTexts = [
        "Your memories. Their voices. One movie.",
        "Birthdays. Weddings. Farewells.",
        "Collect video wishes instantly.",
        "The modern guest book is here."
    ];

    const brandColors = [
        "hover:text-[#ff3b30]", // Red
        "hover:text-[#cc0000]", // Dark Red
        "hover:text-[#ff6101]", // Orange-Red
        "hover:text-[#ffc300]", // Yellow
        "hover:text-[#e63946]"  // Soft Red
    ];

    useEffect(() => {
        setWindowHeight(window.innerHeight);
        const handleScroll = () => setScrollY(window.scrollY);
        const handleResize = () => setWindowHeight(window.innerHeight);

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);

        const playVideo = async () => {
            if (videoRef.current) {
                try {
                    await videoRef.current.play();
                } catch (e) {
                    console.log("Auto-play blocked");
                }
            }
        };
        playVideo();

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0, rootMargin: '0px 0px -100px 0px' });

        document.querySelectorAll('.reveal-element').forEach(el => observer.observe(el));

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
        };
    }, []);

    // Lockout Timer
    useEffect(() => {
        if (lockoutTime && Date.now() > lockoutTime) {
            setLockoutTime(null);
            setLoginAttempts(0);
        }
    }, [lockoutTime]);

    const currentTextIndex = useMemo(() => {
        const progress = scrollY / windowHeight;
        if (progress < 1) return 0;
        if (progress < 2) return 1;
        if (progress < 3) return 2;
        return 3;
    }, [scrollY, windowHeight]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;
        setLoading(true);
        const response = await getStickyAdvice(userInput);
        setAiMessage(response);
        setLoading(false);
        setUserInput('');
    };

    const featureHeadingClass = "text-5xl md:text-8xl font-black text-black tracking-tighter leading-none transition-transform duration-700 hover:scale-105 cursor-default";

    const HoverText = ({ text, baseColor = "text-zinc-900" }: { text: string, baseColor?: string }) => (
        <>
            {text.split('').map((char, i) => {
                const hoverColorClass = brandColors[i % brandColors.length];
                return (
                    <span
                        key={i}
                        className={`inline-block transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) hover:-translate-y-4 hover:scale-110 ${baseColor} ${hoverColorClass}`}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                );
            })}
        </>
    );

    const openAuth = () => {
        if (currentUser) {
            navigate('/create');
            return;
        }
        navigate('/auth');
    };

    const handleLogout = () => {
        logout();
    };

    const switchToSignup = () => {
        setIsLoginOpen(false);
        setIsSignupOpen(true);
        resetAuthStates();
    };

    const switchToLogin = () => {
        setIsSignupOpen(false);
        setIsLoginOpen(true);
        resetAuthStates();
    };

    const resetAuthStates = () => {
        setSignupData({ name: '', email: '', password: '', confirmPassword: '' });
        setLoginData({ email: '', password: '' });
        setSignupErrors({});
        setLoginErrors({});
        setSignupSuccess(false);
        setIsSubmittingSignup(false);
        setIsSubmittingLogin(false);
    };

    // --- SIGNUP LOGIC ---
    const validateSignup = () => {
        const errors: Record<string, string> = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!signupData.name.trim()) errors.name = "Name is required";
        if (!signupData.email.trim()) { errors.email = "Email is required"; }
        else if (!emailRegex.test(signupData.email)) { errors.email = "Invalid format"; }
        if (!signupData.password) { errors.password = "Required"; }
        else if (signupData.password.length < 8) { errors.password = "Min. 8 chars"; }
        if (signupData.confirmPassword !== signupData.password) { errors.confirmPassword = "No match"; }
        return errors;
    };

    const isSignupValid = useMemo(() => {
        const errs = validateSignup();
        return Object.keys(errs).length === 0 && signupData.name && signupData.email && signupData.password;
    }, [signupData]);

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignupValid || isSubmittingSignup) return;
        setIsSubmittingSignup(true);
        setSignupErrors({});

        setTimeout(() => {
            const existingUsers = JSON.parse(localStorage.getItem('wishyoua_users') || '[]');
            if (existingUsers.some((u: any) => u.email === signupData.email)) {
                setSignupErrors({ email: "Email already registered" });
                setIsSubmittingSignup(false);
                return;
            }
            const newUser = { name: signupData.name, email: signupData.email, password: btoa(signupData.password) };
            localStorage.setItem('wishyoua_users', JSON.stringify([...existingUsers, newUser]));
            setSignupSuccess(true);
            setIsSubmittingSignup(false);
            setTimeout(() => switchToLogin(), 2000);
        }, 1200);
    };

    // --- LOGIN LOGIC ---
    const validateLogin = () => {
        const errors: Record<string, string> = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!loginData.email.trim()) errors.email = "Required";
        else if (!emailRegex.test(loginData.email)) errors.email = "Invalid format";
        if (!loginData.password) errors.password = "Required";
        // else if (loginData.password.length < 8) errors.password = "Invalid length";
        return errors;
    };

    const isLoginValid = useMemo(() => {
        const errs = validateLogin();
        return Object.keys(errs).length === 0 && !lockoutTime;
    }, [loginData, lockoutTime]);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoginValid || isSubmittingLogin || lockoutTime) return;

        setIsSubmittingLogin(true);
        setLoginErrors({});

        // Artificial network delay
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('wishyoua_users') || '[]');
            const foundUser = users.find((u: any) => u.email === loginData.email);

            // DEVELOPER OVERRIDE: Allow any login
            const displayName = foundUser ? foundUser.name : loginData.email.split('@')[0];

            // Success
            const sessionUser = { name: displayName, email: loginData.email, token: 'wa_' + Math.random().toString(36).substr(2) };
            // localStorage.setItem('wishyoua_session', JSON.stringify(sessionUser));
            login(sessionUser);

            setIsSubmittingLogin(false);
            setIsLoginOpen(false);
            // Navigate to Create Event page
            navigate('/create');
        }, 1200);
    };

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
        if (loginErrors.general || loginErrors[name]) setLoginErrors({});
    };

    const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignupData(prev => ({ ...prev, [name]: value }));
        if (signupErrors[name]) setSignupErrors(prev => {
            const n = { ...prev }; delete n[name]; return n;
        });
    };

    return (
        <div className={`relative ${(isPricingOpen || isLoginOpen || isSignupOpen) ? 'overflow-hidden h-screen' : ''}`}>

            {/* 1. HERO */}
            <section className="relative h-[400vh] w-full z-0 bg-black">
                <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 p-4">
                        <div className="inner-screen h-full w-full relative overflow-hidden rounded-3xl">
                            {/* Video Background */}
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                poster="https://framerusercontent.com/images/g6c4E6LAWGNMZSHbPzHynM7JzY.jpg"
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{ filter: 'brightness(0.7)' }}
                            >
                                {/* Fallback for local video */}
                                <source src="/videos/background.mp4" type="video/mp4" />
                            </video>

                            {/* Gradient Overlays for better text readability */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>
                            <div className="absolute inset-0 bg-black/20"></div>

                            <nav className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-30">
                                <div className="text-white/80 font-bold hidden md:flex gap-8">
                                    <button onClick={() => setIsPricingOpen(true)} className="hover:text-white transition-colors duration-300">Pricing</button>
                                    <a href="#faq" className="hover:text-white transition-colors duration-300">FAQs</a>
                                </div>
                                <div className="text-3xl font-black text-white tracking-tighter cursor-pointer" onClick={() => window.scrollTo(0, 0)}>wishyoua</div>

                                <div className="flex items-center gap-4">
                                    {currentUser ? (
                                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl pl-5 pr-2 py-1.5 rounded-full border border-white/10">
                                            <button
                                                onClick={() => navigate('/create')}
                                                className="text-white font-black text-xs uppercase tracking-widest hover:opacity-80 transition-opacity text-left"
                                                title="Go to Dashboard"
                                            >
                                                {currentUser.name}
                                            </button>
                                            <button onClick={handleLogout} className="p-2.5 bg-white text-black rounded-full hover:scale-110 transition-transform">
                                                <LogOut size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={openAuth}
                                            className="bg-white text-black px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all duration-300 shadow-xl group/btn"
                                        >
                                            Login / Signup <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    )}
                                </div>
                            </nav>

                            <div className="absolute inset-0 z-10 w-full flex items-center justify-center pointer-events-none">
                                <div className="relative w-full max-w-5xl h-64 text-center">
                                    {narrativeTexts.map((text, idx) => (
                                        <h1 key={idx} className="scrolly-text text-4xl md:text-8xl font-black text-white leading-tight tracking-tight px-6 drop-shadow-2xl"
                                            style={{ opacity: currentTextIndex === idx ? 1 : 0, transform: `translate(-50%, -50%) translateY(${currentTextIndex === idx ? 0 : (currentTextIndex > idx ? -60 : 60)}px)` }}>
                                            {text}
                                        </h1>
                                    ))}
                                </div>
                            </div>

                            <div className="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-4 transition-all duration-1000"
                                style={{ opacity: scrollY > windowHeight * 3.5 ? 0 : 1, transform: `translateY(${scrollY > windowHeight * 3.5 ? 40 : 0}px)` }}>

                                <button className="w-14 h-14 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center hover:scale-110 transition-all">
                                    <Mic size={22} />
                                </button>

                                {[Volume2, Video].map((Icon, i) => (
                                    <button key={i} className="w-14 h-14 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110">
                                        <Icon size={22} />
                                    </button>
                                ))}

                                <button onClick={() => setIsChatOpen(true)} className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:scale-110 transition-all">
                                    <MessageCircle size={22} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LOGIN OVERLAY */}
            {isLoginOpen && (
                <div className="fixed inset-0 z-[120] bg-white flex flex-col items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-24 duration-700">
                    <button onClick={() => setIsLoginOpen(false)} className="absolute top-12 left-12 text-zinc-900 font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:gap-5 transition-all group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Return
                    </button>

                    <div className="w-full max-w-[440px] flex flex-col">
                        <div className="mb-12 text-center">
                            <div className="inline-flex w-16 h-16 bg-zinc-900 text-white rounded-[24px] items-center justify-center mb-8 shadow-xl">
                                <Lock size={28} />
                            </div>
                            <h2 className="text-5xl font-black text-zinc-900 tracking-tighter mb-4">Welcome back.</h2>
                            <p className="text-zinc-500 font-medium">Login to manage your events and videos.</p>
                        </div>

                        {loginErrors.general && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 flex items-center gap-3 border border-red-100 animate-in zoom-in duration-300">
                                <AlertCircle size={18} className="shrink-0" />
                                <p className="text-[13px] font-bold">{loginErrors.general}</p>
                            </div>
                        )}

                        <form onSubmit={handleLoginSubmit} className="space-y-4 mb-8">
                            <div className="space-y-1">
                                <div className={`relative group ${loginErrors.email ? 'ring-2 ring-red-400 rounded-[28px]' : ''}`}>
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        value={loginData.email}
                                        onChange={handleLoginChange}
                                        placeholder="Registered Email"
                                        className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-[28px] py-5 pl-14 pr-6 font-bold text-zinc-900 outline-none focus:border-red-500 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className={`relative group ${loginErrors.password ? 'ring-2 ring-red-400 rounded-[28px]' : ''}`}>
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition-colors">
                                        <Key size={20} />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        value={loginData.password}
                                        onChange={handleLoginChange}
                                        placeholder="Password"
                                        className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-[28px] py-5 pl-14 pr-6 font-bold text-zinc-900 outline-none focus:border-red-500 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!isLoginValid || isSubmittingLogin}
                                className="w-full bg-zinc-900 text-white py-6 rounded-[28px] font-black text-lg shadow-2xl shadow-zinc-900/20 hover:bg-black transition-all transform active:scale-[0.98] disabled:bg-zinc-100 disabled:text-zinc-400 disabled:shadow-none flex items-center justify-center gap-3 mt-6"
                            >
                                {isSubmittingLogin ? 'Accessing...' : 'Access Account'}
                                {isSubmittingLogin ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                            </button>
                        </form>

                        <p className="text-center text-zinc-400 font-bold text-sm">
                            New to wishyoua? <button onClick={switchToSignup} className="text-zinc-900 font-black hover:underline underline-offset-4">Create account</button>
                        </p>
                    </div>
                </div>
            )}

            {/* SIGNUP OVERLAY */}
            {isSignupOpen && (
                <div className="fixed inset-0 z-[120] bg-white flex flex-col items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-24 duration-700 overflow-y-auto">
                    <button onClick={() => setIsSignupOpen(false)} className="absolute top-12 left-12 text-zinc-900 font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:gap-5 transition-all group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Return
                    </button>

                    <div className="w-full max-w-[440px] flex flex-col py-20">
                        <div className="mb-12 text-center">
                            <div className={`inline-flex w-16 h-16 ${signupSuccess ? 'bg-green-500' : 'bg-red-600'} text-white rounded-[24px] items-center justify-center mb-8 shadow-xl transition-colors duration-500`}>
                                {signupSuccess ? <Check size={28} /> : <Zap size={28} />}
                            </div>
                            <h2 className="text-5xl font-black text-zinc-900 tracking-tighter mb-4">{signupSuccess ? 'Account Created.' : 'Join wishyoua.'}</h2>
                            <p className="text-zinc-500 font-medium">{signupSuccess ? 'Redirecting to login...' : 'Start collecting video wishes today.'}</p>
                        </div>

                        {!signupSuccess && (
                            <form onSubmit={handleSignupSubmit} className="space-y-4 mb-8">
                                <div className="space-y-1">
                                    <div className={`relative group ${signupErrors.name ? 'ring-2 ring-red-400 rounded-[28px]' : ''}`}>
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition-colors"><User size={20} /></div>
                                        <input name="name" type="text" value={signupData.name} onChange={handleSignupChange} placeholder="Your Name" className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-[28px] py-5 pl-14 pr-6 font-bold text-zinc-900 outline-none focus:border-red-500 transition-all" />
                                    </div>
                                    {signupErrors.name && <p className="text-[11px] text-red-500 font-black uppercase tracking-widest ml-6 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {signupErrors.name}</p>}
                                </div>
                                <div className="space-y-1">
                                    <div className={`relative group ${signupErrors.email ? 'ring-2 ring-red-400 rounded-[28px]' : ''}`}>
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition-colors"><Mail size={20} /></div>
                                        <input name="email" type="email" value={signupData.email} onChange={handleSignupChange} placeholder="Email address" className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-[28px] py-5 pl-14 pr-6 font-bold text-zinc-900 outline-none focus:border-red-500 transition-all" />
                                    </div>
                                    {signupErrors.email && <p className="text-[11px] text-red-500 font-black uppercase tracking-widest ml-6 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {signupErrors.email}</p>}
                                </div>
                                <div className="space-y-1">
                                    <div className={`relative group ${signupErrors.password ? 'ring-2 ring-red-400 rounded-[28px]' : ''}`}>
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition-colors"><Key size={20} /></div>
                                        <input name="password" type="password" value={signupData.password} onChange={handleSignupChange} placeholder="Password (min. 8 chars)" className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-[28px] py-5 pl-14 pr-6 font-bold text-zinc-900 outline-none focus:border-red-500 transition-all" />
                                    </div>
                                    {signupErrors.password && <p className="text-[11px] text-red-500 font-black uppercase tracking-widest ml-6 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {signupErrors.password}</p>}
                                </div>
                                <div className="space-y-1">
                                    <div className={`relative group ${signupErrors.confirmPassword ? 'ring-2 ring-red-400 rounded-[28px]' : ''}`}>
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition-colors"><ShieldCheck size={20} /></div>
                                        <input name="confirmPassword" type="password" value={signupData.confirmPassword} onChange={handleSignupChange} placeholder="Confirm password" className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-[28px] py-5 pl-14 pr-6 font-bold text-zinc-900 outline-none focus:border-red-500 transition-all" />
                                    </div>
                                    {signupErrors.confirmPassword && <p className="text-[11px] text-red-500 font-black uppercase tracking-widest ml-6 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {signupErrors.confirmPassword}</p>}
                                </div>

                                <button type="submit" disabled={!isSignupValid || isSubmittingSignup} className="w-full bg-red-600 text-white py-6 rounded-[28px] font-black text-lg shadow-2xl shadow-red-600/20 hover:bg-red-700 transition-all disabled:bg-zinc-100 disabled:text-zinc-400 flex items-center justify-center gap-3 mt-4">
                                    {isSubmittingSignup ? 'Creating Account...' : 'Get Started'}
                                    {isSubmittingSignup ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                                </button>
                            </form>
                        )}

                        {!signupSuccess && (
                            <p className="text-center text-zinc-400 font-bold text-sm">
                                Already have an account? <button onClick={switchToLogin} className="text-zinc-900 font-black hover:underline">Log in</button>
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* OTHER SECTIONS (Bento, Features, etc.) - HIDDEN WHEN OVERLAYS OPEN */}
            {!isLoginOpen && !isSignupOpen && (
                <>
                    {/* FEATURES SECTION */}
                    <section id="features" className="folder-section z-10 pb-[800px]" style={{ zIndex: 10 }}>
                        <div className="max-w-7xl mx-auto flex flex-col items-center py-40 px-6">
                            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-10 mb-32 reveal-element">
                                <h2 className={featureHeadingClass}>Create</h2>
                                <div className="relative group hover:scale-110 transition-transform duration-500">
                                    <div className={`${FEATURES[0].imageClass} overflow-hidden shadow-2xl`}>
                                        <img src={FEATURES[0].image} className="w-full h-full object-cover" loading="lazy" alt="Create" />
                                    </div>
                                </div>
                                <h2 className={featureHeadingClass}>Invite</h2>
                                <div className="relative group hover:scale-110 transition-transform duration-500">
                                    <div className={`${FEATURES[1].imageClass} overflow-hidden shadow-2xl`}>
                                        <img src={FEATURES[1].image} className="w-full h-full object-cover" loading="lazy" alt="Invite" />
                                    </div>
                                </div>
                                <h2 className={featureHeadingClass}>Compile</h2>
                                <div className="relative group hover:scale-110 transition-transform duration-500">
                                    <div className={`${FEATURES[2].imageClass} overflow-hidden shadow-2xl`}>
                                        <img src={FEATURES[2].image} className="w-full h-full object-cover" loading="lazy" alt="Compile" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* BENTO SECTION */}
                    <section id="bento" className="folder-section dark pb-20" style={{ zIndex: 20 }}>
                        <div className="py-20 px-8 max-w-7xl mx-auto relative z-10">
                            <div className="mb-12 text-center reveal-element">
                                <h2 className="text-5xl md:text-7xl font-black mb-6 text-white tracking-tight text-center">Everything you need.</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {BENTO_ITEMS.map((item, i) => (
                                    <div key={i} className="bento-card p-0 flex flex-col h-[420px] overflow-hidden group shadow-2xl reveal-element">
                                        <div className="p-8">
                                            <h3 className="text-white text-2xl font-black mb-3">{item.title}</h3>
                                            <p className="text-zinc-400 leading-relaxed font-medium text-sm">{item.description}</p>
                                        </div>
                                        <div className="flex-1 px-6 overflow-hidden min-h-[180px]">
                                            <img src={item.image} className="w-full h-full object-cover rounded-t-2xl transition-transform duration-1000 group-hover:scale-105" loading="lazy" alt={item.title} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>


                    {/* FAQ SECTION */}
                    <section id="faq" className="folder-section pb-32" style={{ zIndex: 30 }}>
                        <div className="py-20 px-8 max-w-4xl mx-auto">
                            <div className="text-center mb-16 reveal-element">
                                <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4 text-zinc-900">Common Questions</h2>
                            </div>
                            <div className="space-y-6">
                                {FAQS.map((faq, i) => (
                                    <div key={i} className="bg-zinc-50 rounded-[32px] border border-zinc-200 shadow-sm p-8 reveal-element">
                                        <h3 className="text-xl font-black text-zinc-900 mb-4">{faq.question}</h3>
                                        <p className="text-zinc-500 text-base font-medium leading-relaxed">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* DOWNLOAD SECTION */}
                    <section id="download" className="folder-section dark bg-black flex flex-col items-center justify-center min-h-screen" style={{ zIndex: 40 }}>
                        <div className="max-w-7xl mx-auto px-8 w-full py-32">
                            <div className="flex flex-col items-center mb-32 reveal-element">
                                <div className="flex items-center gap-6 mb-12 flex-wrap justify-center">
                                    <h2 className="text-6xl md:text-9xl font-black tracking-tighter"><HoverText text="Start" baseColor="text-white" /></h2>
                                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center p-4 shadow-2xl hover:scale-125 transition-all cursor-pointer" onClick={openAuth}>
                                        <Plus size={40} className="text-black" />
                                    </div>
                                    <h2 className="text-6xl md:text-9xl font-black tracking-tighter"><HoverText text="wishyoua" baseColor="text-white" /></h2>
                                </div>
                            </div>
                            <div className="w-full pt-12 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-8 text-white font-bold uppercase tracking-widest text-[10px]">
                                <p>© 2026 WISHYOUA CORP. POWERED BY SMART VIDEO ENGINE.</p>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* PRICING OVERLAY */}
            {isPricingOpen && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-start overflow-y-auto animate-in fade-in slide-in-from-bottom-24 duration-700">
                    <div className="sticky top-0 w-full p-12 flex justify-between items-center z-50 bg-gradient-to-b from-white to-transparent">
                        <button onClick={() => setIsPricingOpen(false)} className="text-zinc-900 font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:gap-5 transition-all group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Return
                        </button>
                        <div className="text-zinc-900 font-black tracking-tighter text-xl cursor-pointer" onClick={() => setIsPricingOpen(false)}>wishyoua</div>
                        <div className="w-16"></div>
                    </div>

                    <div className="max-w-7xl w-full px-8 pb-32 pt-10 flex flex-col items-center">
                        <div className="text-center mb-24 max-w-4xl">
                            <h2 className="text-4xl md:text-7xl font-black text-zinc-900 tracking-tighter mb-8 leading-[0.9]">Simple, transparent <br /> <span className="text-black">pricing</span></h2>
                            <p className="text-zinc-500 text-xl font-medium max-w-xl mx-auto">Free for casual events. Affordable power for life's biggest celebrations.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch">
                            {PRICING_PLANS.map((plan, i) => (
                                <div key={i} className={`relative p-12 rounded-[56px] transition-all duration-700 group flex flex-col bg-white text-zinc-950 shadow-xl border-4 ${plan.highlight ? 'border-red-600 scale-105 z-10' : 'border-zinc-100'}`}>
                                    <h3 className="text-4xl font-black mb-4 tracking-tight text-zinc-900">{plan.name}</h3>
                                    <div className="mb-14 flex items-baseline gap-2">
                                        <span className="text-7xl font-black tracking-tighter text-zinc-900">${plan.price}</span>
                                        <span className="font-bold text-zinc-400">/mo</span>
                                    </div>
                                    <div className="space-y-6 mb-16 flex-grow">
                                        {plan.features.map((feat, j) => (
                                            <div key={j} className="flex items-center gap-4">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? 'bg-red-600 text-white' : 'bg-zinc-100 text-zinc-500'}`}><Check size={12} strokeWidth={4} /></div>
                                                <span className="font-bold text-[13px] tracking-tight text-zinc-800">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => {
                                        const planTier = plan.name === 'Starter' ? 'free' : plan.name === 'Celebration' ? 'pro' : 'premium';
                                        navigate('/auth', { state: { selectedPlan: planTier } });
                                    }} className={`w-full py-6 rounded-3xl font-black text-lg transition-all transform active:scale-95 flex items-center justify-center gap-3 ${plan.highlight ? 'bg-red-600 text-white' : 'bg-zinc-900 text-white'}`}>
                                        {plan.buttonText} <ArrowRight size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* AI Assistant Modal */}
            {isChatOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white rounded-[44px] w-full max-w-[420px] p-10 shadow-2xl relative animate-in slide-in-from-bottom-12 duration-700">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-600 rounded-[18px] flex items-center justify-center text-white"><Sparkles size={24} /></div>
                                <div><h4 className="font-black text-xl text-zinc-900">wishyoua AI</h4></div>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400"><X size={20} /></button>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto mb-8 space-y-5 pr-2 custom-scrollbar">
                            <div className="bg-zinc-100 p-5 rounded-[28px] text-zinc-800 font-medium">Welcome! Ask me anything about wishyoua.</div>
                            {aiMessage && <div className="bg-red-600 text-white p-5 rounded-[28px] font-medium shadow-lg">{aiMessage}</div>}
                            {loading && <div className="text-[10px] text-zinc-400 font-black animate-pulse uppercase tracking-widest">Neural processing...</div>}
                        </div>
                        <form onSubmit={handleSend} className="relative">
                            <input autoFocus type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Ask privately..." className="w-full bg-zinc-100 border-none rounded-[24px] py-5 px-6 font-bold text-zinc-900 focus:ring-2 focus:ring-red-400 outline-none" />
                            <button type="submit" disabled={loading} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white p-3.5 rounded-2xl disabled:opacity-50"><Send size={18} /></button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
