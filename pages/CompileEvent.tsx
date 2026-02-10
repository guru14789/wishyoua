import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ArrowLeft, Film, CheckCircle, Smartphone, Mail, Settings, Play, Download, Loader2 } from 'lucide-react';

const CompileEvent: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const [eventName, setEventName] = useState('');
    const [compiling, setCompiling] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    const [notifyEmail, setNotifyEmail] = useState(true);
    const [notifyPhone, setNotifyPhone] = useState(false);
    const [downloading, setDownloading] = useState(false);

    // Fetch Event & Submissions
    useEffect(() => {
        const fetchData = async () => {
            if (!eventId) return;
            try {
                // 1. Fetch Event Info
                let eventData: any = null;
                if (eventId.startsWith('local_')) {
                    const localEvents = JSON.parse(localStorage.getItem('wishyoua_events') || '[]');
                    eventData = localEvents.find((e: any) => e.id === eventId);
                } else if (!eventId.startsWith('draft_')) {
                    const docRef = doc(db, "events", eventId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        eventData = { id: docSnap.id, ...docSnap.data() };
                    }
                } else {
                    setEventName("Local Draft Event");
                    setSubmissions([
                        "https://framerusercontent.com/assets/f7C7xL8Nl8X9u0k9X4.mp4",
                        "https://www.w3schools.com/html/mov_bbb.mp4"
                    ]);
                    return;
                }

                if (eventData) {
                    setEventName(eventData.eventName);
                    if (eventData.isCompiled) {
                        setIsComplete(true);
                    }

                    // 2. Fetch Submissions
                    if (eventId.startsWith('local_')) {
                        const allSubmissions = JSON.parse(localStorage.getItem('wishyoua_submissions') || '[]');
                        const subsUrls = allSubmissions
                            .filter((s: any) => s.eventId === eventId && s.status === 'completed' && s.videoUrl)
                            .map((s: any) => s.videoUrl);
                        setSubmissions(subsUrls);
                    } else {
                        const q = query(collection(db, "submissions"), where("eventId", "==", eventId));
                        const querySnapshot = await getDocs(q);
                        const subsUrls: string[] = [];
                        querySnapshot.forEach((doc) => {
                            const data = doc.data();
                            if (data.status === 'completed' && data.videoUrl) {
                                subsUrls.push(data.videoUrl);
                            }
                        });
                        setSubmissions(subsUrls);
                    }
                }
            } catch (e) {
                console.error("Compile fetch error:", e);
            }
        };
        fetchData();
    }, [eventId]);

    const handleCompile = async () => {
        if (submissions.length === 0) {
            alert("No collected videos to merge! Wait for guests to submit.");
            return;
        }
        setCompiling(true);

        // Update LocalStorage to mark as compiled
        if (!eventId?.startsWith('draft_')) {
            try {
                const localEvents = JSON.parse(localStorage.getItem('wishyoua_events') || '[]');
                const updatedEvents = localEvents.map((e: any) =>
                    e.id === eventId ? { ...e, isCompiled: true } : e
                );
                localStorage.setItem('wishyoua_events', JSON.stringify(updatedEvents));
            } catch (e) {
                console.error("Error saving local compile state", e);
            }
        }

        // Simulate compilation
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 5;
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                setIsComplete(true);
                setCompiling(false);
            }
            setProgress(p);
        }, 300);
    };

    const forceDownload = async (url: string, filename: string) => {
        setDownloading(true);
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const videoBlobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = videoBlobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(videoBlobUrl);
        } catch (error) {
            console.error("Download failed", error);
            window.open(url, '_blank');
        } finally {
            setDownloading(false);
        }
    };

    const handleVideoEnd = () => {
        // Play next video in sequence
        if (currentVideoIndex < submissions.length - 1) {
            setCurrentVideoIndex(prev => prev + 1);
        } else {
            // Loop back to start or stop? Let's stop.
            // setCurrentVideoIndex(0); 
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
            {/* ... nav ... */}
            <nav className="p-4 md:p-6 lg:p-8 flex items-center gap-3 md:gap-4 bg-white border-b border-zinc-100 sticky top-0 z-50">
                <button onClick={() => navigate(-1)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors">
                    <ArrowLeft size={16} className="md:size-[18px]" />
                </button>
                <div>
                    <h1 className="text-lg md:text-xl font-black tracking-tight">Compile Video</h1>
                    <p className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-widest">{eventName}</p>
                </div>
            </nav>

            <main className="max-w-2xl mx-auto p-4 md:p-8 lg:p-12">
                {!isComplete ? (
                    // ... existing start screen ...
                    <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] shadow-xl border border-zinc-100">
                        {/* ... icons/text ... */}
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
                            <Film size={24} className="md:size-[32px]" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-center mb-3 md:mb-4">Ready to Create Movie?</h2>
                        <p className="text-zinc-500 text-center mb-8 md:mb-10 font-medium text-sm md:text-base">
                            We will intelligently merge {submissions.length} guest submissions, add transitions, and sync it to background music.
                        </p>

                        {!compiling ? (
                            <div className="space-y-4 md:space-y-6">
                                {/* ... settings ... */}
                                <div className="bg-zinc-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-zinc-100">
                                    <h3 className="font-bold mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base"><Settings size={16} className="md:size-[18px]" /> Notification Settings</h3>
                                    <div className="space-y-2 md:space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${notifyEmail ? 'bg-black border-black text-white' : 'border-zinc-300'}`}>
                                                {notifyEmail && <CheckCircle size={12} className="md:size-[14px]" />}
                                            </div>
                                            <input type="checkbox" className="hidden" checked={notifyEmail} onChange={() => setNotifyEmail(!notifyEmail)} />
                                            <span className="font-medium text-sm md:text-base">Email me when ready</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${notifyPhone ? 'bg-black border-black text-white' : 'border-zinc-300'}`}>
                                                {notifyPhone && <CheckCircle size={12} className="md:size-[14px]" />}
                                            </div>
                                            <input type="checkbox" className="hidden" checked={notifyPhone} onChange={() => setNotifyPhone(!notifyPhone)} />
                                            <span className="font-medium text-sm md:text-base">Text me when ready</span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCompile}
                                    disabled={submissions.length === 0}
                                    className="w-full bg-black text-white py-4 md:py-5 rounded-2xl md:rounded-3xl font-black text-lg md:text-xl shadow-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submissions.length === 0 ? 'No Videos Yet' : 'Start Compilation'}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-6 md:py-8">
                                <div className="w-full bg-zinc-100 rounded-full h-3 md:h-4 mb-3 md:mb-4 overflow-hidden">
                                    <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                </div>
                                <p className="font-bold text-zinc-400 uppercase tracking-widest text-xs md:text-sm">Processing... {Math.round(progress)}%</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] shadow-xl border border-zinc-100 text-center animate-in zoom-in duration-500">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-2xl shadow-green-500/30">
                            <CheckCircle size={40} className="md:size-[48px]" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black mb-3 md:mb-4">It's Ready!</h2>
                        <p className="text-zinc-500 mb-6 md:mb-8 font-medium text-sm md:text-base">Your compiled video has been generated successfully.</p>

                        <div className="aspect-video bg-black rounded-2xl md:rounded-3xl mb-6 md:mb-8 flex items-center justify-center text-white overflow-hidden shadow-2xl relative group">
                            {submissions.length > 0 ? (
                                <video
                                    key={submissions[currentVideoIndex]}
                                    src={submissions[currentVideoIndex]}
                                    controls
                                    autoPlay
                                    onEnded={handleVideoEnd}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <p>No videos found.</p>
                            )}
                            {submissions.length > 1 && (
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 md:px-3 rounded-full text-[10px] md:text-xs font-bold text-white">
                                    Clip {currentVideoIndex + 1} / {submissions.length}
                                </div>
                            )}
                        </div>

                        <p className="text-[10px] md:text-xs text-zinc-400 mb-4 md:mb-6 max-w-sm mx-auto">
                            * Note: For this demo, we are previewing your clips sequentially.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                            <button
                                onClick={() => window.open(submissions[0], "_blank")}
                                className="flex-1 bg-zinc-100 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                            >
                                <Play size={18} className="md:size-[20px]" /> Preview All
                            </button>
                            <button
                                onClick={() => forceDownload(submissions[0], `Wishyoua_Event_${eventId}.mp4`)}
                                disabled={downloading}
                                className="flex-1 bg-black text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 text-sm md:text-base"
                            >
                                {downloading ? <Loader2 className="animate-spin" /> : <Download size={18} className="md:size-[20px]" />} Download
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CompileEvent;
