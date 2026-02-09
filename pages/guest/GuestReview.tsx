import React, { useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
// Firebase imports removed for full frontend flow
import { Loader2, Check, RefreshCw, Upload, Play, Pause } from 'lucide-react';

const GuestReview: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const videoBlob = location.state?.videoBlob as Blob;
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
    const [progress, setProgress] = useState(0);
    const [playing, setPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // If no video, redirect back to record
    if (!videoBlob) {
        navigate(`/invite/${eventId}/record`);
        return null;
    }

    const videoUrl = window.URL.createObjectURL(videoBlob);

    const togglePlay = () => {
        if (videoRef.current) {
            if (playing) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setPlaying(!playing);
        }
    };

    const handleRetake = () => {
        navigate(`/invite/${eventId}/question`);
    };

    const handleSubmit = async () => {
        setUploadStatus('uploading');
        setProgress(0);

        // Simulate upload progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);

        try {
            // Get guest info from storage
            const guestInfo = JSON.parse(localStorage.getItem(`guest_${eventId}`) || '{}');
            const guestName = guestInfo.name || 'Anonymous';
            const relationship = guestInfo.relationship || 'Guest';

            // Wait for mock progress
            await new Promise(resolve => setTimeout(resolve, 2500));

            // Mock Submission Data using the local object URL
            const newSubmission = {
                id: 'sub_' + Math.random().toString(36).substr(2, 9),
                eventId,
                guestName,
                relationship,
                videoUrl: videoUrl, // Use the local object URL
                status: 'completed',
                createdAt: new Date().toISOString()
            };

            // Save to LocalStorage
            const allSubmissions = JSON.parse(localStorage.getItem('wishyoua_submissions') || '[]');
            localStorage.setItem('wishyoua_submissions', JSON.stringify([...allSubmissions, newSubmission]));

            console.log("Mock submission saved:", newSubmission);
            navigate(`/invite/${eventId}/notify`);

        } catch (error) {
            console.error("Local submission error:", error);
            setUploadStatus('error');
        } finally {
            clearInterval(interval);
        }
    };

    return (
        <div className="h-screen bg-black flex flex-col items-center justify-center relative font-sans">
            <video
                ref={videoRef}
                src={videoUrl}
                className="absolute inset-0 w-full h-full object-cover"
                onEnded={() => setPlaying(false)}
                playsInline
                onClick={togglePlay}
            />

            {!playing && uploadStatus !== 'uploading' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                        <Play size={40} className="ml-2" />
                    </div>
                </div>
            )}

            {uploadStatus === 'uploading' && (
                <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-white p-6 text-center animate-in fade-in">
                    <div className="w-64 h-2 bg-zinc-800 rounded-full mb-8 overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <h2 className="text-3xl font-black mb-2">{Math.round(progress)}%</h2>
                    <p className="text-zinc-400 font-medium">Uploading your memory...</p>
                    <p className="text-zinc-600 text-sm mt-4">Please don't close this window.</p>
                </div>
            )}

            {uploadStatus === 'error' && (
                <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-white p-6 text-center animate-in fade-in">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-6">
                        <Upload size={32} />
                    </div>
                    <h2 className="text-2xl font-black mb-2">Upload Failed</h2>
                    <p className="text-zinc-400 mb-8 max-w-xs mx-auto">Something went wrong. Don't worry, your video is safe.</p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setUploadStatus('idle')}
                            className="bg-zinc-800 text-white px-6 py-3 rounded-full font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="bg-white text-black px-6 py-3 rounded-full font-bold"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            <div className="absolute bottom-12 w-full px-6 flex items-center justify-between gap-4 max-w-md mx-auto">
                <button
                    onClick={handleRetake}
                    disabled={uploadStatus === 'uploading'}
                    className="flex-1 bg-white/10 backdrop-blur-md text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={20} /> Retake
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={uploadStatus === 'uploading'}
                    className="flex-1 bg-white text-black py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50"
                >
                    <Upload size={20} /> Submit
                </button>
            </div>
        </div>
    );
};

export default GuestReview;
