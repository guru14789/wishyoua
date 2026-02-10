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
                // 1. Try Firestore first (Real data)
                if (!eventId.startsWith('local_') && !eventId.startsWith('draft_')) {
                    const docRef = doc(db, "events", eventId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setEvent({ id: docSnap.id, ...docSnap.data() });
                        setLoading(false);
                        return;
                    }
                }

                // 2. Fallback to LocalStorage (Mock data / Previous sessions)
                if (eventId.startsWith('draft_')) {
                    setEvent({
                        eventName: "Birthday Bash",
                        introType: "text",
                        introMessage: "Hey! Can't wait to see you.",
                    });
                } else {
                    const localEvents = JSON.parse(localStorage.getItem('wishyoua_events') || '[]');
                    const foundEvent = localEvents.find((e: any) => e.id === eventId);
                    if (foundEvent) {
                        setEvent(foundEvent);
                    } else {
                        console.warn("Event not found in Firestore or LocalStorage:", eventId);
                    }
                }
            } catch (e) {
                console.error("Guest layout init error:", e);
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
                <div className="absolute inset-0 w-full h-full bg-zinc-900 flex items-center justify-center">
                    <video
                        src={event.introVideoUrl}
                        autoPlay
                        muted
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                        onEnded={() => navigate(`/invite/${eventId}/about`)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"></div>
                    <div className="absolute bottom-12 left-0 w-full text-center px-6 pointer-events-none">
                        <h1 className="text-2xl md:text-4xl text-white font-black mb-2 drop-shadow-lg">{event.eventName}</h1>
                    </div>
                </div>
            ) : (
                <div className="max-w-xl p-6 md:p-8 text-center relative z-10 w-full">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white mx-auto mb-6 md:mb-8 animate-bounce duration-[2000ms]">
                        <MessageCircle size={28} className="md:size-[32px]" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 md:mb-8 tracking-tight leading-tight px-4">"{event.introMessage}"</h1>
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-1 w-32 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-white transition-all duration-1000 ease-linear" style={{ width: `${((5 - timeLeft) / 5) * 100}%` }}></div>
                        </div>
                        <p className="text-zinc-500 font-bold text-[10px] md:text-xs uppercase tracking-widest">Entering in {timeLeft}s</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuestIntro;
