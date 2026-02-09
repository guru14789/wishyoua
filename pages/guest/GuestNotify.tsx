import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bell, Check, ArrowRight, Smartphone, Mail } from 'lucide-react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const GuestNotify: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (eventId && !eventId.startsWith('draft_')) {
                const eventRef = doc(db, "events", eventId);
                await updateDoc(eventRef, {
                    interestedGuests: arrayUnion({ email, phone, date: new Date().toISOString() })
                });
            }
            // Navigate to final done screen
            navigate(`/invite/${eventId}/done`);
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-[40px] shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Bell size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-zinc-900 mb-2">Want to see the final video?</h2>
                    <p className="text-zinc-500 font-medium">We'll notify you when the organizer merges all the clips into a movie.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400 pl-4">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-3xl py-4 pl-14 pr-6 font-bold text-lg outline-none focus:border-black transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400 pl-4">Phone Number (Optional)</label>
                        <div className="relative">
                            <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="(555) 123-4567"
                                className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-3xl py-4 pl-14 pr-6 font-bold text-lg outline-none focus:border-black transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || (!email && !phone)}
                        className="w-full bg-black text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Notify Me'} <ArrowRight size={20} />
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(`/invite/${eventId}/done`)}
                        className="w-full text-zinc-400 font-bold text-sm uppercase tracking-widest hover:text-black transition-colors"
                    >
                        No thanks, I'm done
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GuestNotify;
