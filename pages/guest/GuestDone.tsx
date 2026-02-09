import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Check, Heart } from 'lucide-react';
import Confetti from 'react-dom-confetti';


const GuestDone: React.FC = () => {
    const [confetti, setConfetti] = useState(false);

    useEffect(() => {
        setTimeout(() => setConfetti(true), 500);
    }, []);

    const config = {
        angle: 90,
        spread: 360,
        startVelocity: 40,
        elementCount: 70,
        dragFriction: 0.12,
        duration: 3000,
        stagger: 3,
        width: "10px",
        height: "10px",
        perspective: "500px",
        colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white text-center font-sans">
            <div className="absolute left-1/2 top-1/2">
                <Confetti active={confetti} config={config} />
            </div>

            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-8 shadow-2xl shadow-green-500/30 animate-in zoom-in duration-500">
                <Check size={48} strokeWidth={4} />
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 animate-in slide-in-from-bottom-8 duration-700">Thank You!</h1>
            <p className="text-zinc-400 text-lg font-medium max-w-md mb-12 animate-in slide-in-from-bottom-8 duration-700 delay-100">
                Your memory has been securely encrypted and added to the vault. The organizer will be notified.
            </p>

            <div className="animate-in slide-in-from-bottom-8 duration-700 delay-200">
                <button
                    onClick={() => window.location.href = '/'}
                    className="text-zinc-500 hover:text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2 transition-colors mx-auto"
                >
                    Create your own Event <Heart size={14} />
                </button>
            </div>
        </div>
    );
};

export default GuestDone;
