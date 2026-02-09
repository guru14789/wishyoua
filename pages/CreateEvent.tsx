import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Loader2,
    Upload,
    Type,
    Calendar,
    HelpCircle,
    Video,
    FileText,
    Check,
    ArrowRight,
    ArrowLeft,
    Plus,
    Copy,
    Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// Firebase imports removed for full frontend flow

const CreateEvent: React.FC = () => {
    const { currentUser, userProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [showForm, setShowForm] = useState(false);
    const [events, setEvents] = useState<any[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [checkingPayment, setCheckingPayment] = useState(true);

    const [formData, setFormData] = useState({
        eventName: '',
        occasionType: 'birthday',
        introType: 'text' as 'text' | 'video',
        introMessage: '',
        introVideo: null as File | null,
        customQuestion: 'What is your favorite memory with us?'
    });

    // Check payment status on mount
    React.useEffect(() => {
        const checkPaymentStatus = async () => {
            if (!currentUser) {
                navigate('/pricing');
                return;
            }

            // Using local profile from Context/LocalStorage instead of Firestore
            const profiles = JSON.parse(localStorage.getItem('wishyoua_profiles') || '{}');
            const localProfile = profiles[currentUser.email];

            if (!localProfile) {
                // If no profile found locally, check if we can trust the context one
                if (!userProfile) {
                    navigate('/pricing');
                    return;
                }
            }

            const activeProfile = localProfile || userProfile;
            const userPlan = activeProfile?.plan || 'free';

            // MOCK: Allow all plans for now without actual payment ID verification
            // In a real app, you'd check for paymentId here.

            setCheckingPayment(false);
        };

        checkPaymentStatus();
    }, [currentUser, userProfile, navigate]);

    React.useEffect(() => {
        const fetchEvents = async () => {
            if (!currentUser?.email || checkingPayment) return;
            try {
                // Read from LocalStorage
                const localEvents = JSON.parse(localStorage.getItem('wishyoua_events') || '[]');

                // Filter by current user and sort by date
                const filtered = localEvents
                    .filter((e: any) => e.createdBy === currentUser.email)
                    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((e: any) => ({
                        ...e,
                        // Compatibility helper for .toDate() calls
                        createdAt: { toDate: () => new Date(e.createdAt) }
                    }));

                setEvents(filtered);
            } catch (error) {
                console.error("Error fetching local events:", error);
            } finally {
                setLoadingEvents(false);
            }
        };

        fetchEvents();
    }, [currentUser, showForm, checkingPayment]);

    const occasions = [
        { id: 'birthday', label: 'Birthday' },
        { id: 'anniversary', label: 'Anniversary' },
        { id: 'wedding', label: 'Wedding' },
        { id: 'farewell', label: 'Farewell' },
        { id: 'custom', label: 'Custom' }
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, introVideo: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            let videoUrl = '';

            // MOCK: Video upload
            if (formData.introType === 'video' && formData.introVideo) {
                // In a real local mock, we can use URL.createObjectURL for the session
                // or just a placeholder for the flow
                videoUrl = URL.createObjectURL(formData.introVideo);
                console.log('Mocked video upload:', videoUrl);
            }

            const eventId = 'local_' + Math.random().toString(36).substr(2, 9);

            // Save to LocalStorage
            const localEvents = JSON.parse(localStorage.getItem('wishyoua_events') || '[]');
            const newEvent = {
                id: eventId,
                eventName: formData.eventName,
                occasionType: formData.occasionType,
                introType: formData.introType,
                introMessage: formData.introMessage,
                introVideoUrl: videoUrl,
                customQuestion: formData.customQuestion,
                createdBy: currentUser?.email || 'anonymous',
                createdAt: new Date().toISOString(), // Use string for local storage compatibility
            };

            localStorage.setItem('wishyoua_events', JSON.stringify([...localEvents, newEvent]));

            console.log("Mock event created with ID: ", eventId);
            navigate(`/share/${eventId}`);

        } catch (e) {
            console.error("Error creating local event: ", e);
            alert("Error saving event locally.");
        } finally {
            setLoading(false);
        }
    };

    // Show loading screen while checking payment
    if (checkingPayment) {
        return (
            <div className="min-h-screen bg-white font-['Poppins',sans-serif] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin mx-auto mb-4 text-zinc-900" />
                    <p className="text-xl font-black text-zinc-900">Verifying access...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-900">
            <nav className="p-6 md:p-8 flex justify-between items-center bg-white border-b border-zinc-100 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                    <div className="text-xl font-black tracking-tighter" onClick={() => navigate('/')}>wishyoua</div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 hidden md:block">
                        {showForm ? 'Creation Mode' : 'Dashboard'}
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-black text-white px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-lg"
                        >
                            <Plus size={16} /> Create Event
                        </button>
                    )}
                </div>
            </nav>

            <main className="flex-grow flex flex-col items-center justify-start pt-12 md:pt-20 px-6 pb-20">
                {!showForm ? (
                    // HISTORY VIEW
                    <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="mb-12">
                            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Your Events.</h1>
                            <p className="text-zinc-500 text-lg md:text-xl font-medium">Manage and share your memory vaults.</p>
                        </div>

                        {loadingEvents ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-zinc-300" size={40} /></div>
                        ) : events.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-[40px] border border-zinc-100 shadow-xl">
                                <div className="w-20 h-20 bg-zinc-100 rounded-full mx-auto flex items-center justify-center text-zinc-400 mb-6">
                                    <Calendar size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-zinc-900 mb-3">No events yet.</h3>
                                <p className="text-zinc-500 font-medium mb-8">Create your first event to start collecting memories.</p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-black/20"
                                >
                                    Create Event
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {events.map((event) => (
                                    <div key={event.id} className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 group">
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-zinc-200">
                                                {event.occasionType}
                                            </span>
                                            <button
                                                onClick={() => navigate(`/dashboard/${event.id}`)}
                                                className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-black hover:text-white transition-colors"
                                            >
                                                <ArrowRight size={18} />
                                            </button>
                                        </div>
                                        <h3 className="text-2xl font-black text-zinc-900 mb-2 leading-tight line-clamp-2">{event.eventName}</h3>
                                        <p className="text-zinc-400 text-sm font-medium mb-8 line-clamp-2">"{event.customQuestion}"</p>

                                        <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                                            <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                                                <Clock size={12} /> {event.createdAt?.toDate().toLocaleDateString()}
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigator.clipboard.writeText(`${window.location.origin}/invite/${event.id}`);
                                                    alert("Link copied!");
                                                }}
                                                className="text-zinc-400 hover:text-black transition-colors"
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    // CREATE FORM VIEW
                    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="mb-8">
                            <button onClick={() => setShowForm(false)} className="text-zinc-400 hover:text-black font-bold text-sm flex items-center gap-2 mb-6 transition-colors">
                                <ArrowLeft size={16} /> Back to History
                            </button>
                            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Create your Event.</h1>
                            <p className="text-zinc-500 text-lg md:text-xl font-medium">Design a private space to collect memories.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl space-y-10 border border-zinc-100 animate-in slide-in-from-bottom-12 duration-1000 delay-100 fade-in">

                            {/* Event Name */}
                            <div className="space-y-4">
                                <label className="text-sm font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                    <Type size={14} /> Event Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.eventName}
                                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                                    placeholder="e.g. Sarah's 30th Birthday"
                                    className="w-full text-2xl md:text-3xl font-bold border-b-2 border-zinc-100 py-4 focus:border-black focus:outline-none transition-colors bg-transparent placeholder-zinc-200"
                                />
                            </div>

                            {/* Occasion Type */}
                            <div className="space-y-4">
                                <label className="text-sm font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                    <Calendar size={14} /> Occasion
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {occasions.map((occ) => (
                                        <button
                                            key={occ.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, occasionType: occ.id })}
                                            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all border-2 ${formData.occasionType === occ.id ? 'bg-black text-white border-black scale-105 shadow-lg' : 'bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300'}`}
                                        >
                                            {occ.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Intro Content */}
                            <div className="space-y-6">
                                <label className="text-sm font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                    <Video size={14} /> Introduction
                                </label>

                                <div className="flex bg-zinc-100 p-1.5 rounded-2xl w-fit">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, introType: 'text' })}
                                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${formData.introType === 'text' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}
                                    >
                                        <FileText size={16} /> Text Message
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, introType: 'video' })}
                                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${formData.introType === 'video' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}
                                    >
                                        <Video size={16} /> Video Upload
                                    </button>
                                </div>

                                {formData.introType === 'text' ? (
                                    <textarea
                                        value={formData.introMessage}
                                        onChange={(e) => setFormData({ ...formData, introMessage: e.target.value })}
                                        placeholder="Write a welcoming message for your guests..."
                                        rows={4}
                                        className="w-full bg-zinc-50 rounded-3xl p-6 font-medium text-lg border-2 border-zinc-100 focus:border-black outline-none transition-all resize-none"
                                    />
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`w-full aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-zinc-50 group ${formData.introVideo ? 'border-green-500 bg-green-50' : 'border-zinc-200'}`}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="video/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        {formData.introVideo ? (
                                            <>
                                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform">
                                                    <Check size={32} />
                                                </div>
                                                <p className="font-bold text-green-700">{formData.introVideo.name}</p>
                                                <p className="text-zinc-400 text-xs mt-2 uppercase tracking-tight font-bold">Click to change</p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 mb-4 group-hover:bg-zinc-200 transition-colors">
                                                    <Upload size={24} />
                                                </div>
                                                <p className="font-bold text-zinc-600">Upload intro video</p>
                                                <p className="text-zinc-400 text-xs mt-2 uppercase tracking-widest">MP4, MOV up to 50MB</p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Custom Question */}
                            <div className="space-y-4">
                                <label className="text-sm font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                    <HelpCircle size={14} /> Custom Question
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.customQuestion}
                                        onChange={(e) => setFormData({ ...formData, customQuestion: e.target.value })}
                                        placeholder="e.g. What is your favorite memory?"
                                        className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-3xl py-5 px-6 font-bold text-lg text-zinc-900 outline-none focus:border-black transition-all"
                                    />
                                </div>
                                <p className="text-xs text-zinc-400 font-medium pl-4">This question will be asked to everyone you invite.</p>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-zinc-900 text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-zinc-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>Creating Event <Loader2 size={24} className="animate-spin" /></>
                                    ) : (
                                        <>Create & Continue <ArrowRight size={24} /></>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CreateEvent;
