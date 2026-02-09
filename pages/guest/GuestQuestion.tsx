import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Loader2, Video, ArrowRight, RefreshCw } from 'lucide-react';

const GuestQuestion: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const [question, setQuestion] = useState('');
    const [eventName, setEventName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!eventId) return;
            try {
                if (eventId.startsWith('draft_')) {
                    setQuestion("What is your favorite memory?");
                    setEventName("Birthday Bash");
                    setLoading(false);
                    return;
                }
                const docRef = doc(db, "events", eventId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setQuestion(docSnap.data().customQuestion);
                    setEventName(docSnap.data().eventName);
                }
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        fetchEvent();
    }, [eventId]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-6 text-white font-sans text-center">
            <div className="max-w-xl w-full animate-in zoom-in duration-500">
                <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-6">{eventName}</p>
                <h1 className="text-4xl md:text-6xl font-black mb-12 leading-tight">"{question}"</h1>

                <div className="bg-zinc-800/50 p-8 rounded-[40px] border border-zinc-700/50 backdrop-blur-sm">
                    <p className="text-zinc-400 font-medium mb-8">You have up to 2 minutes to record your answer.</p>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => {
                                const alts = [
                                    "What is your favorite memory with us?",
                                    "What is your wish for the future?",
                                    "Share a funny story!",
                                    "Just say hello!",
                                    "What advice would you give us?"
                                ];
                                const random = alts[Math.floor(Math.random() * alts.length)];
                                setQuestion(random);
                            }}
                            className="w-full bg-zinc-800 text-white py-4 rounded-3xl font-bold text-lg hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={20} /> Change Question
                        </button>
                        <button
                            onClick={() => navigate(`/invite/${eventId}/record`, { state: { question } })}
                            className="w-full bg-red-600 text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-red-600/30 hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
                        >
                            <Video size={24} /> I'm Ready to Record
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestQuestion;
