import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { StopCircle, AlertCircle, Loader2 } from 'lucide-react';

const GuestRecord: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const questionPhase1 = location.state?.question || "What is your favorite memory?";
    const questionPhase2 = "Now share your wish";

    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [recordingState, setRecordingState] = useState<'idle' | 'countdown' | 'recording'>('idle');
    const [countdown, setCountdown] = useState(3);
    const [timer, setTimer] = useState(0);
    const [error, setError] = useState('');

    // Config
    const PHASE_SWITCH_TIME = 15; // Switch prompt after 15 seconds
    const MAX_DURATION = 120; // 2 minutes

    useEffect(() => {
        const startCamera = async () => {
            try {
                const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(s);
                if (videoRef.current) videoRef.current.srcObject = s;
            } catch (e) {
                setError("Camera access denied. Please allow permissions.");
            }
        };
        startCamera();

        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, []);

    // Countdown Logic
    useEffect(() => {
        if (recordingState === 'countdown') {
            if (countdown > 0) {
                const timeout = setTimeout(() => setCountdown(c => c - 1), 1000);
                return () => clearTimeout(timeout);
            } else {
                startRecording();
            }
        }
    }, [recordingState, countdown]);

    // Timer Logic & Auto Stop
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (recordingState === 'recording') {
            interval = setInterval(() => {
                setTimer(t => {
                    if (t >= MAX_DURATION) {
                        stopRecording();
                        return t;
                    }
                    return t + 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [recordingState]);

    const initiateRecording = () => {
        setRecordingState('countdown');
    };

    const startRecording = () => {
        if (!stream) return;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const localChunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) localChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(localChunks, { type: 'video/webm' });
            navigate(`/invite/${eventId}/review`, { state: { videoBlob: blob } });
        };

        mediaRecorder.start();
        setRecordingState('recording');
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden font-sans">
            {error ? (
                <div className="text-center text-white px-6">
                    <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
                    <h2 className="text-2xl font-bold mb-2">Camera Error</h2>
                    <p className="text-zinc-400 mb-8">{error}</p>
                    <button onClick={() => window.location.reload()} className="bg-white text-black px-6 py-3 rounded-full font-bold">Retry</button>
                    <button onClick={() => navigate(-1)} className="block mt-4 text-zinc-500 hover:text-white">Go Back</button>
                </div>
            ) : (
                <>
                    {/* Camera Feed */}
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
                    />

                    {/* Overlay: Countdown */}
                    {recordingState === 'countdown' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 animate-in fade-in">
                            <div className="text-[150px] font-black text-white drop-shadow-2xl animate-bounce">
                                {countdown > 0 ? countdown : 'GO!'}
                            </div>
                        </div>
                    )}

                    {/* Overlay: Prompts & Timer */}
                    <div className="absolute top-0 left-0 w-full p-8 bg-gradient-to-b from-black/80 to-transparent z-40 flex flex-col items-center transition-opacity duration-300">
                        {recordingState === 'recording' && (
                            <div className="bg-red-600/90 text-white px-4 py-1 rounded-full font-mono font-bold text-sm mb-4 animate-pulse">
                                REC {formatTime(timer)} / 2:00
                            </div>
                        )}

                        <h2 className="text-2xl md:text-3xl font-black text-white text-center leading-tight drop-shadow-lg transition-all duration-700 ease-in-out">
                            {recordingState === 'idle'
                                ? "Get Ready..."
                                : (timer < PHASE_SWITCH_TIME ? questionPhase1 : questionPhase2)
                            }
                        </h2>

                        {recordingState === 'recording' && timer >= PHASE_SWITCH_TIME && (
                            <p className="text-yellow-400 font-bold uppercase tracking-widest text-xs mt-2 animate-pulse">Bonus Question</p>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-12 w-full flex items-center justify-center z-50">
                        {recordingState === 'idle' ? (
                            <button
                                onClick={initiateRecording}
                                className="w-20 h-20 rounded-full border-[6px] border-white/30 flex items-center justify-center bg-red-600 hover:bg-red-700 hover:scale-105 transition-all shadow-xl"
                            >
                                <div className="w-8 h-8 bg-white rounded-full"></div>
                            </button>
                        ) : recordingState === 'recording' ? (
                            <button
                                onClick={stopRecording}
                                className="w-24 h-24 rounded-full border-[6px] border-white flex items-center justify-center bg-transparent backdrop-blur-md hover:bg-white/10 transition-all"
                            >
                                <div className="w-8 h-8 bg-red-600 rounded-sm"></div>
                            </button>
                        ) : null}
                    </div>
                </>
            )}
        </div>
    );
};

export default GuestRecord;
