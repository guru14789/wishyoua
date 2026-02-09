
import React from 'react';
import { TESTIMONIALS } from '../constants';
import { Star } from 'lucide-react';

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1">
            <span className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 inline-block border border-gray-200">
              What Our Clients Say
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Trusted by Many, <br /> Loved by All
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              Our clients’ success stories reflect our commitment to excellence. See how we’ve helped them find their dream homes.
            </p>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 hover:border-gray-200 transition-all">
                <div className="flex gap-1 mb-6">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} size={18} fill="currentColor" className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-xl italic text-gray-700 leading-relaxed mb-8">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-4">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-gray-500 text-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
