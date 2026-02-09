import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, ArrowRight, Zap, Crown, Gift, Loader2 } from 'lucide-react';
import { PlanTier } from '../types';
import { PLANS } from '../lib/plans';
import { useAuth } from '../context/AuthContext';

const PlanConfirmation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();

    const [loading, setLoading] = useState(false);
    const [paymentVerified, setPaymentVerified] = useState(false);

    const plan = (location.state as any)?.plan as PlanTier;
    const isNewUser = (location.state as any)?.isNewUser as boolean;

    useEffect(() => {
        // If no plan or user, redirect
        if (!plan || !currentUser) {
            navigate('/pricing');
            return;
        }

        // For paid plans, verify payment (in real app, this would check Razorpay)
        if (plan !== 'free') {
            // Simulate payment verification
            setTimeout(() => {
                setPaymentVerified(true);
            }, 1000);
        } else {
            setPaymentVerified(true);
        }
    }, [plan, currentUser, navigate]);

    const handleContinue = () => {
        navigate('/create');
    };

    const planConfig = PLANS[plan];

    const PlanIcon = plan === 'free' ? Gift : plan === 'pro' ? Zap : Crown;

    if (!paymentVerified) {
        return (
            <div className="min-h-screen bg-white font-['Poppins',sans-serif] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin mx-auto mb-4 text-zinc-900" />
                    <p className="text-xl font-black text-zinc-900">Verifying your plan...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-['Poppins',sans-serif] flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                {/* Success Animation */}
                <div className="text-center mb-12 animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
                        <Check size={48} strokeWidth={3} className="text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight text-zinc-900">
                        {isNewUser ? 'Welcome!' : 'Welcome Back!'}
                    </h1>
                    <p className="text-xl text-zinc-500 font-medium">
                        Your <span className="text-zinc-900 font-black capitalize">{plan}</span> plan is active
                    </p>
                </div>

                {/* Plan Details Card */}
                <div className="bg-white border-4 border-zinc-100 rounded-[56px] p-12 mb-8 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center gap-4 mb-8">
                        <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center ${plan === 'free' ? 'bg-zinc-100' :
                            plan === 'pro' ? 'bg-zinc-900' :
                                'bg-zinc-900'
                            }`}>
                            <PlanIcon size={32} className={plan === 'free' ? 'text-zinc-900' : 'text-white'} />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black capitalize tracking-tight text-zinc-900">{plan} Plan</h2>
                            <p className="text-zinc-500 font-bold">
                                {plan === 'free' ? 'Forever free' : `₹${planConfig.price / 100} per event`}
                            </p>
                        </div>
                    </div>

                    <div className="bg-zinc-50 rounded-[32px] p-8 mb-6 border border-zinc-200">
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">Your Benefits</h3>
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                                    <Check size={12} strokeWidth={4} className="text-white" />
                                </div>
                                <span className="text-zinc-800 font-bold text-sm">
                                    {planConfig.limits.maxGuests === -1 ? 'Unlimited' : `Up to ${planConfig.limits.maxGuests}`} guests
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                                    <Check size={12} strokeWidth={4} className="text-white" />
                                </div>
                                <span className="text-zinc-800 font-bold text-sm">
                                    {planConfig.limits.recordingDuration / 60} min recordings
                                </span>
                            </div>
                            {planConfig.limits.hasIntroVideo && (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                                        <Check size={12} strokeWidth={4} className="text-white" />
                                    </div>
                                    <span className="text-zinc-800 font-bold text-sm">Custom intro video</span>
                                </div>
                            )}
                            {planConfig.limits.hasDownloads && (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                                        <Check size={12} strokeWidth={4} className="text-white" />
                                    </div>
                                    <span className="text-zinc-800 font-bold text-sm">Download videos</span>
                                </div>
                            )}
                            {planConfig.limits.hasMergeAccess && (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                                        <Check size={12} strokeWidth={4} className="text-white" />
                                    </div>
                                    <span className="text-zinc-800 font-bold text-sm">Merge & export</span>
                                </div>
                            )}
                            {planConfig.limits.hasCustomBranding && (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                                        <Check size={12} strokeWidth={4} className="text-white" />
                                    </div>
                                    <span className="text-zinc-800 font-bold text-sm">Custom branding</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {plan !== 'premium' && (
                        <div className="bg-zinc-100 border-2 border-zinc-200 rounded-3xl p-5">
                            <p className="text-zinc-700 text-sm font-bold">
                                💡 <span className="font-black">Pro tip:</span> You can upgrade anytime to unlock more features for future events.
                            </p>
                        </div>
                    )}
                </div>

                {/* CTA */}
                <button
                    onClick={handleContinue}
                    className="w-full bg-zinc-900 hover:bg-black text-white py-6 rounded-3xl font-black text-xl transition-all flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02] animate-in slide-in-from-bottom-8 duration-700 delay-200"
                >
                    Create Your First Event
                    <ArrowRight size={24} />
                </button>

                <p className="text-center text-zinc-400 text-sm mt-6 font-medium">
                    Your plan is stored in your profile. You can create events anytime.
                </p>
            </div>
        </div>
    );
};

export default PlanConfirmation;
