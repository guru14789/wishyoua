import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { PlanTier } from '../types';

const Pricing: React.FC = () => {
    const navigate = useNavigate();

    const handleSelectPlan = (tier: PlanTier) => {
        navigate('/auth', { state: { selectedPlan: tier } });
    };

    const PRICING_PLANS = [
        {
            name: 'Starter',
            price: 0,
            highlight: false,
            features: [
                'Up to 10 Video Wishes',
                '720p Video Export',
                'Standard Email Support',
                '1 Month Storage',
            ],
            buttonText: 'Start for free',
        },
        {
            name: 'Celebration',
            price: 19,
            highlight: true,
            features: [
                'Unlimited Video Wishes',
                '4K Video Export',
                'Remove Watermark',
                'Forever Storage',
            ],
            buttonText: 'Go Premium',
        },
        {
            name: 'Event Pro',
            price: 49,
            highlight: false,
            features: [
                'Manage Multiple Events',
                'Custom Branding',
                'Priority Processing',
                'Dedicated Account Manager',
            ],
            buttonText: 'Contact Sales',
        },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-start overflow-y-auto font-['Poppins',sans-serif]">
            <div className="sticky top-0 w-full p-6 md:p-12 flex justify-between items-center z-50 bg-gradient-to-b from-white to-transparent">
                <button onClick={() => navigate('/')} className="text-zinc-900 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 md:gap-3 hover:gap-5 transition-all group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> <span className="hidden sm:inline">Return</span>
                </button>
                <div className="text-zinc-900 font-black tracking-tighter text-xl cursor-pointer" onClick={() => navigate('/')}>wishyoua</div>
                <div className="w-16"></div>
            </div>

            <div className="max-w-7xl w-full px-6 md:px-8 pb-32 pt-10 flex flex-col items-center">
                <div className="text-center mb-16 md:mb-24 max-w-4xl">
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-zinc-900 tracking-tighter mb-6 md:mb-8 leading-[0.9]">Simple, transparent <br /> <span className="text-black">pricing</span></h2>
                    <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-xl mx-auto">Free for casual events. Affordable power for life's biggest celebrations.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch">
                    {PRICING_PLANS.map((plan, i) => (
                        <div key={i} className={`relative p-8 md:p-12 rounded-[40px] md:rounded-[56px] transition-all duration-700 group flex flex-col bg-white text-zinc-950 shadow-xl border-4 ${plan.highlight ? 'border-red-600 md:scale-105 z-10' : 'border-zinc-100'}`}>
                            <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-zinc-900">{plan.name}</h3>
                            <div className="mb-10 md:mb-14 flex items-baseline gap-2">
                                <span className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900">${plan.price}</span>
                                <span className="font-bold text-zinc-400">/mo</span>
                            </div>
                            <div className="space-y-6 mb-12 md:mb-16 flex-grow">
                                {plan.features.map((feat, j) => (
                                    <div key={j} className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? 'bg-red-600 text-white' : 'bg-zinc-100 text-zinc-500'}`}><Check size={12} strokeWidth={4} /></div>
                                        <span className="font-bold text-[13px] tracking-tight text-zinc-800">{feat}</span>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => {
                                const planTier = plan.name === 'Starter' ? 'free' : plan.name === 'Celebration' ? 'pro' : 'premium';
                                handleSelectPlan(planTier as PlanTier);
                            }} className={`w-full py-5 md:py-6 rounded-3xl font-black text-lg transition-all transform active:scale-95 flex items-center justify-center gap-3 ${plan.highlight ? 'bg-red-600 text-white' : 'bg-zinc-900 text-white'}`}>
                                {plan.buttonText} <ArrowRight size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Pricing;
