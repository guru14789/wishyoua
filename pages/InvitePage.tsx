import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2, MessageCircle, ArrowRight, SkipForward } from 'lucide-react';

const InvitePage: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [viewState, setViewState] = useState<'intro' | 'question'>('intro');
    const [timeLeft, setTimeLeft] = useState(5);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!eventId) return;
            try {
                // Check if it's a draft ID
                if (eventId.startsWith('draft_')) {
                    setEvent({
                        eventName: "Birthday Bash",
                        introType: "text",
                        introMessage: "Hey! Can't wait to see you.",
                        customQuestion: "What's your favorite memory?"
                    });
                    setLoading(false);
                    return;
                }

                const docRef = doc(db, "events", eventId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setEvent(docSnap.data());
                } else {
                    console.log("No such event!");
                }
            } catch (e) {
                console.error("Error fetching event:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    // Timer Logic for Text Intro
    useEffect(() => {
        if (!loading && event && viewState === 'intro' && event.introType === 'text') {
            const interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setViewState('question');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            timerRef.current = interval;

            return () => clearInterval(interval);
        }
    }, [loading, event, viewState]);

    const handleSkip = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setViewState('question');
    };

    if (loading) {
        return <div className="h-screen w-full flex items-center justify-center bg-black text-white"><Loader2 className="animate-spin" size={40} /></div>;
    }

    if (!event) {
        return <div className="h-screen flex items-center justify-center font-black text-2xl">Event not found.</div>;
    }

    if (viewState === 'intro') {
        return (
            <div className="h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden animate-in fade-in duration-700">

                {/* Skip Button */}
                <button
                    onClick={handleSkip}
                    className="absolute top-8 right-8 z-50 text-white/50 hover:text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                    Skip Intro <SkipForward size={14} />
                </button>

                {event.introType === 'video' && event.introVideoUrl ? (
                    <div className="absolute inset-0 w-full h-full bg-zinc-900">
                        <video
                            src={event.introVideoUrl}
                            autoPlay
                            muted={false} // Ideally false, but browsers might block unmuted autoplay. User interaction triggers often required for sound.
                            playsInline
                            className="w-full h-full object-cover"
                            onEnded={() => setViewState('question')}
                        />
                        {/* Overlay gradient for text legibility if needed */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"></div>

                        <div className="absolute bottom-12 left-0 w-full text-center px-6">
                            <h1 className="text-3xl text-white font-black mb-2 drop-shadow-lg">{event.eventName}</h1>
                            <p className="text-white/80 font-medium text-sm">Watch the intro...</p>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-xl p-8 text-center relative z-10">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white mx-auto mb-8 animate-bounce duration-[2000ms]">
                            <MessageCircle size={32} />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight leading-tight">
                            "{event.introMessage}"
                        </h1>
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-1 w-32 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white transition-all duration-1000 ease-linear"
                                    style={{ width: `${((5 - timeLeft) / 5) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Entering in {timeLeft}s</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Question State
    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col font-sans animate-in slide-in-from-bottom-24 duration-700 fade-in">
            <main className="flex-grow flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden">
                    <div className="h-32 bg-zinc-900 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-blue-600/20 mix-blend-overlay"></div>
                        <h1 className="text-2xl text-white font-black z-10 relative px-6 text-center">{event.eventName}</h1>
                    </div>

                    <div className="p-10 text-center">
                        <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-6">Your Question</p>
                        <h3 className="text-3xl md:text-4xl font-black text-zinc-900 mb-12 leading-tight">{event.customQuestion}</h3>

                        <button className="w-full py-6 bg-black text-white rounded-3xl font-black text-xl shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group">
                            Record Answer <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:translate-x-1 transition-transform"><ArrowRight size={16} /></div>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InvitePage;
