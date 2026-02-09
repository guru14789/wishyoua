import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Loader2, MessageCircle, SkipForward } from 'lucide-react';

const GuestIntro: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(5);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const initGuest = async () => {
            if (!eventId) return;
            try {
                // Mock guest auth
                await new Promise(resolve => setTimeout(resolve, 100));

                if (eventId.startsWith('draft_')) {
                    setEvent({
                        eventName: "Birthday Bash",
                        introType: "text",
                        introMessage: "Hey! Can't wait to see you.",
                    });
                    setLoading(false);
                    return;
                }

                // Read from LocalStorage
                const localEvents = JSON.parse(localStorage.getItem('wishyoua_events') || '[]');
                const foundEvent = localEvents.find((e: any) => e.id === eventId);

                if (foundEvent) {
                    setEvent(foundEvent);
                } else {
                    console.warn("Event not found in local storage:", eventId);
                }
            } catch (e) {
                console.error("Local guest init error:", e);
            } finally {
                setLoading(false);
            }
        };
        initGuest();
    }, [eventId]);

    useEffect(() => {
        if (!loading && event && event.introType === 'text') {
            const interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        navigate(`/invite/${eventId}/about`);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            timerRef.current = interval;
            return () => clearInterval(interval);
        }
    }, [loading, event, eventId, navigate]);

    const handleSkip = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        navigate(`/invite/${eventId}/about`);
    };

    if (loading) return <div className="h-screen w-full flex items-center justify-center bg-black text-white"><Loader2 className="animate-spin" /></div>;
    if (!event) return <div className="h-screen flex items-center justify-center font-black">Event not found.</div>;

    return (
        <div className="h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden animate-in fade-in duration-700">
            <button onClick={handleSkip} className="absolute top-8 right-8 z-50 text-white/50 hover:text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors">
                Skip Intro <SkipForward size={14} />
            </button>

            {event.introType === 'video' && event.introVideoUrl ? (
                <div className="absolute inset-0 w-full h-full bg-zinc-900">
                    <video
                        src={event.introVideoUrl}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                        onEnded={() => navigate(`/invite/${eventId}/about`)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"></div>
                    <div className="absolute bottom-12 left-0 w-full text-center px-6">
                        <h1 className="text-3xl text-white font-black mb-2 drop-shadow-lg">{event.eventName}</h1>
                    </div>
                </div>
            ) : (
                <div className="max-w-xl p-8 text-center relative z-10">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white mx-auto mb-8 animate-bounce duration-[2000ms]">
                        <MessageCircle size={32} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight leading-tight">"{event.introMessage}"</h1>
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-1 w-32 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-white transition-all duration-1000 ease-linear" style={{ width: `${((5 - timeLeft) / 5) * 100}%` }}></div>
                        </div>
                        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Entering in {timeLeft}s</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuestIntro;
