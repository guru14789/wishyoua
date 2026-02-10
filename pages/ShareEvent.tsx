import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Check, Share2, ArrowRight } from 'lucide-react';

const ShareEvent: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const inviteLink = `${window.location.origin}/invite/${eventId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-6 text-white font-sans">
            <div className="w-full max-w-lg bg-zinc-800 p-10 rounded-[44px] shadow-2xl animate-in zoom-in duration-500 border border-zinc-700">
                <div className="text-center mb-8 md:mb-10">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500 rounded-2xl md:rounded-3xl mx-auto flex items-center justify-center text-white mb-4 md:mb-6 shadow-xl shadow-green-500/20">
                        <Check size={32} className="md:size-[40px]" strokeWidth={3} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black mb-2 md:mb-3 tracking-tight">Event Ready.</h1>
                    <p className="text-zinc-400 font-medium text-base md:text-lg">Your private vault is created. Share the key below.</p>
                </div>

                <div className="bg-black/50 p-4 md:p-6 rounded-2xl md:rounded-3xl mb-6 md:mb-8 border border-zinc-700">
                    <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-500 mb-2 md:mb-3 block">Private Invite Link</label>
                    <div className="flex items-center gap-2 md:gap-3">
                        <input
                            readOnly
                            value={inviteLink}
                            className="w-full bg-transparent text-white font-bold text-base md:text-lg outline-none truncate"
                        />
                        <button onClick={handleCopy} className="p-2 md:p-3 bg-zinc-700 rounded-lg md:rounded-xl hover:bg-zinc-600 transition-colors shrink-0">
                            {copied ? <Check size={16} className="text-green-500 md:size-[20px]" /> : <Copy size={16} className="md:size-[20px]" />}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <button onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: 'Join my Wishyoua Event',
                                text: 'I created a private event for us. Click to join!',
                                url: inviteLink,
                            });
                        } else {
                            handleCopy();
                        }
                    }} className="bg-white text-black py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                        <Share2 size={18} className="md:size-[20px]" /> Share
                    </button>
                    <button onClick={() => navigate(`/dashboard/${eventId}`)} className="bg-zinc-700 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-zinc-600 transition-colors">
                        View Event
                    </button>
                </div>

                <button onClick={() => navigate('/create')} className="w-full mt-12 text-zinc-500 font-bold text-sm hover:text-white transition-colors">
                    + Create another event
                </button>
            </div>
        </div>
    );
};

export default ShareEvent;
