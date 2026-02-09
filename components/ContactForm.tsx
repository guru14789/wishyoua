import React, { useState } from 'react';
import { Send, Bot, Sparkles } from 'lucide-react';
import { getPropertyAdvice } from '../services/geminiService';

const ContactForm: React.FC = () => {
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAiConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setLoading(true);
    const advice = await getPropertyAdvice(aiQuery);
    setAiResponse(advice);
    setLoading(false);
  };

  return (
    <section id="contact" className="py-24 bg-gray-900 text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img src="https://framerusercontent.com/images/MNaTdWhKQ4PCxwtMgQRe9ROUJo.jpg" alt="bg" className="w-full h-full object-cover" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-white/20">
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Let’s Make Your Property <br /> Journey Effortless
          </h2>
          <p className="text-white/60 max-w-2xl text-lg leading-relaxed">
            Have questions or ready to take the next step? Whether you’re looking to buy, rent, or invest, our team is here to guide you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Traditional Form */}
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border border-white/10">
            <h3 className="text-2xl font-bold mb-8">Inquiry Form</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input type="text" placeholder="First Name" className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:border-white transition-all w-full" />
                <input type="text" placeholder="Last Name" className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:border-white transition-all w-full" />
              </div>
              <input type="email" placeholder="Email Address" className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:border-white transition-all w-full" />
              <textarea placeholder="How can we help you?" rows={4} className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:border-white transition-all w-full resize-none"></textarea>
              <button type="submit" className="w-full bg-white text-black py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-200 transition-all shadow-xl">
                Book a Call
                <Send size={20} />
              </button>
            </form>
          </div>

          {/* AI Assistant */}
          <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-xl p-8 rounded-[40px] border border-white/10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-red-600 p-3 rounded-2xl">
                <Bot size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">VistaHaven AI</h3>
                <p className="text-white/60 text-sm">Powered by Gemini Pro</p>
              </div>
            </div>

            <form onSubmit={handleAiConsult} className="space-y-6">
              <p className="text-white/80 leading-relaxed font-light italic">
                Ask me anything about market trends, luxury investments, or property types.
              </p>
              <input 
                type="text" 
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="e.g. Why should I invest in LA real estate right now?" 
                className="bg-black/20 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:border-red-400 transition-all w-full" 
              />
              <button 
                disabled={loading}
                className="w-full bg-red-600 text-white py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-red-500 transition-all disabled:opacity-50"
              >
                {loading ? "Thinking..." : "Get Expert Advice"}
                <Sparkles size={18} />
              </button>
            </form>

            {aiResponse && (
              <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-red-400/30 text-white/90 leading-relaxed text-sm animate-in fade-in zoom-in duration-500">
                {aiResponse}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;