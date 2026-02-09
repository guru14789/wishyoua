import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Firebase imports removed for full frontend flow
import { Plus, Copy, Share2, Video, Calendar, MapPin, Users, ChartBar, Play, Download, ArrowLeft, Trash2, Loader2, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Submission {
    id: string;
    guestName: string;
    relationship: string;
    videoUrl: string;
    createdAt: any;
    status: 'pending' | 'completed' | 'failed';
}

const Dashboard: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [eventName, setEventName] = useState('');
    const [loading, setLoading] = useState(true);
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);
    const [isCompiled, setIsCompiled] = useState(false);

    // Mock Plan - In real app, fetch from User Context
    const userPlan = 'free'; // Change to 'pro' to unlock downloads

    // Fetch Event Details and Submissions (Mocked)
    useEffect(() => {
        if (!eventId) return;
        setLoading(true);

        const fetchData = async () => {
            try {
                // 1. Fetch Event Info from LocalStorage
                const localEvents = JSON.parse(localStorage.getItem('wishyoua_events') || '[]');
                const foundEvent = localEvents.find((e: any) => e.id === eventId);

                if (foundEvent) {
                    setEventName(foundEvent.eventName);
                    if (foundEvent.isCompiled === true) {
                        setIsCompiled(true);
                    }
                } else if (!eventId.startsWith('draft_')) {
                    setEventName("Local Event");
                }

                // 2. Fetch Submissions from LocalStorage
                if (eventId.startsWith('draft_')) {
                    setSubmissions([
                        { id: '1', guestName: 'Alice Johnson', relationship: 'Best Friend', videoUrl: 'https://framerusercontent.com/assets/f7C7xL8Nl8X9u0k9X4.mp4', createdAt: { toDate: () => new Date() }, status: 'completed' },
                        { id: '2', guestName: 'Bob Smith', relationship: 'Cousin', videoUrl: '', createdAt: { toDate: () => new Date() }, status: 'pending' },
                    ]);
                } else {
                    const allSubmissions = JSON.parse(localStorage.getItem('wishyoua_submissions') || '[]');
                    const filtered = allSubmissions
                        .filter((s: any) => s.eventId === eventId)
                        .map((s: any) => ({
                            ...s,
                            createdAt: { toDate: () => new Date(s.createdAt) }
                        }));
                    setSubmissions(filtered);
                }
            } catch (e) {
                console.error("Error fetching local data:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Mock real-time: In a more complex mock, we'd add a storage event listener
    }, [eventId]);

    const handleDelete = async (submissionId: string) => {
        if (!confirm("Are you sure you want to delete this memory? This cannot be undone.")) return;

        // Optimistic UI
        setSubmissions(prev => prev.filter(s => s.id !== submissionId));

        if (!eventId?.startsWith('draft_')) {
            try {
                const allSubmissions = JSON.parse(localStorage.getItem('wishyoua_submissions') || '[]');
                const filtered = allSubmissions.filter((s: any) => s.id !== submissionId);
                localStorage.setItem('wishyoua_submissions', JSON.stringify(filtered));
            } catch (e) {
                console.error("Error deleting local submission:", e);
            }
        }
    };

    const handleDownload = async (url: string, filename: string) => {
        if (userPlan === 'free') {
            alert("Upgrade to Pro to download high-quality memories.");
            return;
        }

        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `Wishyoua_${filename}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error("Download failed:", e);
            window.open(url, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-900">
            <nav className="p-6 md:p-8 flex justify-between items-center bg-white border-b border-zinc-100 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/create')} className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex flex-col">
                        <div className="text-xl font-black tracking-tighter cursor-pointer" onClick={() => navigate('/')}>wishyoua</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Owner Dashboard</div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="font-bold text-sm">{eventName}</span>
                        <span className="text-xs text-zinc-400 font-medium">ID: {eventId?.slice(0, 8)}...</span>
                    </div>
                </div>
            </nav>

            <main className="flex-grow p-6 md:p-12 max-w-7xl mx-auto w-full">

                <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Event Submissions</h1>
                        <p className="text-zinc-500 text-lg font-medium">Manage the videos collected from your guests.</p>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-zinc-100">
                        <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider mr-2">Total Memories</span>
                        <span className="text-2xl font-black text-black">{submissions.length}</span>
                    </div>
                </div>

                {submissions.length > 0 && (
                    <div className="mb-8 flex justify-end">
                        <button
                            onClick={() => navigate(`/compile/${eventId}`)}
                            className={`px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] transition-transform flex items-center gap-2 ${isCompiled ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-black text-white shadow-black/20'}`}
                        >
                            {isCompiled ? <Play size={20} fill="currentColor" /> : <Video size={20} />}
                            {isCompiled ? 'View Movie' : 'Merge & Export'}
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-40">
                        <Loader2 className="animate-spin text-zinc-300" size={48} />
                    </div>
                ) : submissions.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[40px] border border-zinc-100 shadow-xl border-dashed">
                        <div className="w-20 h-20 bg-zinc-50 rounded-full mx-auto flex items-center justify-center text-zinc-300 mb-6">
                            <Video size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-zinc-900 mb-3">No submissions yet.</h3>
                        <p className="text-zinc-500 font-medium mb-8">Share your invite link to start collecting videos.</p>
                        <button
                            onClick={() => navigate(`/share/${eventId}`)}
                            className="bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-black/20"
                        >
                            Get Invite Link
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {submissions.map((sub) => (
                            <div key={sub.id} className="bg-white rounded-[32px] overflow-hidden shadow-lg border border-zinc-100 group hover:shadow-2xl transition-all duration-300">
                                {/* Video Thumbnail / Player */}
                                <div className="aspect-[9/16] bg-black relative group/video cursor-pointer">
                                    {sub.status === 'pending' || !sub.videoUrl ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
                                            <Video size={32} className="mb-2 opacity-50" />
                                            <p className="text-xs font-bold uppercase tracking-widest">Processing...</p>
                                        </div>
                                    ) : playingVideo === sub.id ? (
                                        <video
                                            src={sub.videoUrl}
                                            controls
                                            autoPlay
                                            className="w-full h-full object-cover"
                                            onEnded={() => setPlayingVideo(null)}
                                        />
                                    ) : (
                                        <>
                                            <video src={sub.videoUrl} className="w-full h-full object-cover opacity-80 group-hover/video:opacity-40 transition-opacity" />
                                            <div
                                                onClick={() => setPlayingVideo(sub.id)}
                                                className="absolute inset-0 flex items-center justify-center"
                                            >
                                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover/video:scale-110 transition-transform">
                                                    <Play size={24} fill="white" />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Status Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md ${sub.status === 'completed' ? 'bg-green-500/80 text-white' : 'bg-yellow-500/80 text-white'}`}>
                                            {sub.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-black text-zinc-900 leading-tight mb-1">{sub.guestName}</h3>
                                            <p className="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-1">
                                                <Heart size={10} fill="currentColor" /> {sub.relationship}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            {sub.videoUrl && (
                                                <button
                                                    onClick={() => handleDownload(sub.videoUrl, sub.guestName)}
                                                    className="p-2 bg-zinc-100 rounded-xl hover:bg-zinc-200 transition-colors text-zinc-600"
                                                    title="Download Video"
                                                >
                                                    <Download size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(sub.id)}
                                                className="p-2 bg-red-50 rounded-xl hover:bg-red-100 transition-colors text-red-500"
                                                title="Delete Submission"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-zinc-100 flex justify-between items-center text-zinc-400 text-xs font-bold uppercase tracking-wider">
                                        <span>{new Date().toLocaleDateString()}</span> {/* Ideally use sub.createdAt */}
                                        <span>MP4</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
