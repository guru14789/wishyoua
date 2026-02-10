import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, User, Heart } from 'lucide-react';

const GuestAbout: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [relationship, setRelationship] = useState('');

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && relationship) {
            localStorage.setItem(`guest_${eventId}`, JSON.stringify({ name, relationship }));
            navigate(`/invite/${eventId}/question`);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 md:p-6 font-sans">
            <div className="w-full max-w-md bg-white p-6 md:p-12 rounded-[32px] md:rounded-[40px] shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-8 md:mb-10">
                    <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-2">First, a little about you.</h2>
                    <p className="text-zinc-500 font-medium text-sm md:text-base">So we know who this memory is from.</p>
                </div>

                <form onSubmit={handleNext} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400 pl-4">Your Name</label>
                        <div className="relative">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                            <input
                                autoFocus
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Jane Doe"
                                className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-3xl py-4 pl-14 pr-6 font-bold text-lg outline-none focus:border-black transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400 pl-4">Relationship</label>
                        <div className="relative">
                            <Heart className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                            <input
                                type="text"
                                required
                                value={relationship}
                                onChange={(e) => setRelationship(e.target.value)}
                                placeholder="e.g. Best Friend"
                                className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-3xl py-4 pl-14 pr-6 font-bold text-lg outline-none focus:border-black transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!name || !relationship}
                        className="w-full bg-black text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        Continue <ArrowRight size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GuestAbout;
