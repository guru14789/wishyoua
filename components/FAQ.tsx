
import React, { useState } from 'react';
import { FAQS } from '../constants';
import { Plus, Minus } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1">
             <span className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 inline-block border border-gray-200">
                Help Center
              </span>
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Frequently asked <br /> questions
              </h2>
          </div>

          <div className="lg:col-span-2 divide-y divide-gray-100">
            {FAQS.map((faq, i) => (
              <div key={i} className="py-6">
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className={`text-xl font-bold transition-colors ${openIndex === i ? 'text-black' : 'text-gray-700'}`}>
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-full border transition-all ${openIndex === i ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200'}`}>
                    {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>
                {openIndex === i && (
                  <div className="mt-4 text-gray-500 text-lg leading-relaxed animate-in fade-in duration-300">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
