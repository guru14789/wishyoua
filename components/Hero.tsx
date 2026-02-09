
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="relative w-full max-w-5xl h-[500px] md:h-[600px] rounded-[40px] overflow-hidden group shadow-2xl mb-12">
          <img 
            src="https://framerusercontent.com/images/rQXeeWMbrXXzxko63WI4Z1ZVIk.jpg" 
            alt="Luxury Home" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-500"></div>
          
          <div className="absolute inset-0 flex flex-col justify-center items-center px-6">
            <h1 className="text-4xl md:text-7xl font-bold text-white leading-tight mb-6">
              Find Your Perfect <br /> Home Today
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-10 font-light">
              We provide tailored real estate solutions, guiding you through every step with personalized experiences that meet your unique needs and aspirations.
            </p>
            <a href="#property" className="bg-white text-black px-8 py-4 rounded-full font-semibold flex items-center gap-3 hover:bg-gray-100 transition-all shadow-xl hover:-translate-y-1">
              Explore Properties
              <div className="bg-black p-1 rounded-full text-white">
                <ArrowUpRight size={18} />
              </div>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {[
            { label: 'Projects Complete', value: '200+', prefix: '' },
            { label: 'Happy Clients', value: '70+', prefix: '' },
            { label: 'Project Value', value: '10M+', prefix: '$' }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-gray-200 transition-all">
              <span className="text-4xl font-bold text-gray-900 mb-1">{stat.prefix}{stat.value}</span>
              <span className="text-gray-500 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
