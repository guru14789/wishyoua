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
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-green-500 rounded-3xl mx-auto flex items-center justify-center text-white mb-6 shadow-xl shadow-green-500/20">
                        <Check size={40} strokeWidth={3} />
                    </div>
                    <h1 className="text-4xl font-black mb-3 tracking-tight">Event Ready.</h1>
                    <p className="text-zinc-400 font-medium text-lg">Your private vault is created. Share the key below.</p>
                </div>

                <div className="bg-black/50 p-6 rounded-3xl mb-8 border border-zinc-700">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-3 block">Private Invite Link</label>
                    <div className="flex items-center gap-3">
                        <input
                            readOnly
                            value={inviteLink}
                            className="w-full bg-transparent text-white font-bold text-lg outline-none truncate"
                        />
                        <button onClick={handleCopy} className="p-3 bg-zinc-700 rounded-xl hover:bg-zinc-600 transition-colors shrink-0">
                            {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                    }} className="bg-white text-black py-4 rounded-2xl font-black text-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                        <Share2 size={20} /> Share
                    </button>
                    <button onClick={() => navigate(`/dashboard/${eventId}`)} className="bg-zinc-700 text-white py-4 rounded-2xl font-bold text-lg hover:bg-zinc-600 transition-colors">
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
