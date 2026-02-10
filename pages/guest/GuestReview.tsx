import React, { useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '../../lib/firebase';
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

    const videoUrl = React.useMemo(() => window.URL.createObjectURL(videoBlob), [videoBlob]);

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

        try {
            // Get guest info from storage
            const guestInfo = JSON.parse(localStorage.getItem(`guest_${eventId}`) || '{}');
            const guestName = guestInfo.name || 'Anonymous';
            const relationship = guestInfo.relationship || 'Guest';

            // 1. Upload to Firebase Storage
            const timestamp = Date.now();
            const fileName = `${guestName.replace(/\s+/g, '_')}_${timestamp}.webm`;
            const storageRef = ref(storage, `submissions/${eventId}/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, videoBlob);

            let finalVideoUrl = '';
            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgress(Math.round(prog));
                    },
                    (error) => reject(error),
                    async () => {
                        finalVideoUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(finalVideoUrl);
                    }
                );
            });

            // 2. Save to Firestore
            const submissionData = {
                eventId,
                guestName,
                relationship,
                videoUrl: finalVideoUrl,
                status: 'completed',
                createdAt: new Date().toISOString()
            };

            await addDoc(collection(db, "submissions"), submissionData);

            // 3. Update LocalStorage (Fallback/UI)
            const allSubmissions = JSON.parse(localStorage.getItem('wishyoua_submissions') || '[]');
            localStorage.setItem('wishyoua_submissions', JSON.stringify([...allSubmissions, { ...submissionData, id: 'temp_' + timestamp }]));

            console.log("Submission saved to Firestore and LocalStorage");
            navigate(`/invite/${eventId}/notify`);

        } catch (error) {
            console.error("Submission error:", error);
            setUploadStatus('error');
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
                    <div className="w-full max-w-[256px] h-2 bg-zinc-800 rounded-full mb-6 md:mb-8 overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black mb-2">{Math.round(progress)}%</h2>
                    <p className="text-zinc-400 font-medium text-sm md:text-base">Uploading your memory...</p>
                    <p className="text-zinc-600 text-xs md:text-sm mt-4">Please don't close this window.</p>
                </div>
            )}

            {uploadStatus === 'error' && (
                <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-white p-6 text-center animate-in fade-in">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-4 md:mb-6">
                        <Upload size={32} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-black mb-2">Upload Failed</h2>
                    <p className="text-zinc-400 mb-6 md:mb-8 max-w-[80vw] mx-auto text-sm md:text-base">Something went wrong. Don't worry, your video is safe.</p>
                    <div className="flex gap-3 md:gap-4">
                        <button
                            onClick={() => setUploadStatus('idle')}
                            className="bg-zinc-800 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-full font-bold text-sm md:text-base"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="bg-white text-black px-5 md:px-6 py-2.5 md:py-3 rounded-full font-bold text-sm md:text-base"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            <div className="absolute bottom-8 md:bottom-12 w-full px-6 flex items-center justify-between gap-3 md:gap-4 max-w-md mx-auto">
                <button
                    onClick={handleRetake}
                    disabled={uploadStatus === 'uploading'}
                    className="flex-1 bg-white/10 backdrop-blur-md text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors disabled:opacity-50 text-sm md:text-base"
                >
                    <RefreshCw size={18} className="md:size-[20px]" /> Retake
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={uploadStatus === 'uploading'}
                    className="flex-1 bg-white text-black py-3 md:py-4 rounded-xl md:rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50 text-sm md:text-base"
                >
                    <Upload size={18} className="md:size-[20px]" /> Submit
                </button>
            </div>
        </div>
    );
};

export default GuestReview;
