
import React from 'react';
import { Target, Lightbulb } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div>
              <span className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 inline-block border border-gray-200">
                Who We Are
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                Redefining Excellence <br /> in Real Estate
              </h2>
            </div>
            <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
              We specialize in luxury properties, sustainable homes, and vacation rentals — driven by a passion for exceptional living and a commitment to quality, innovation, and client satisfaction.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 rounded-3xl">
                <div className="text-3xl font-bold text-gray-900 mb-1">200+</div>
                <div className="text-gray-500 text-sm">Projects Complete</div>
              </div>
              <div className="p-6 bg-gray-50 rounded-3xl">
                <div className="text-3xl font-bold text-gray-900 mb-1">90%</div>
                <div className="text-gray-500 text-sm">Client Retention Rate</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[40px] overflow-hidden shadow-2xl h-[500px]">
              <img 
                src="https://framerusercontent.com/images/RLD7TAwuETk2t51mW9hcW3YZu68.jpg" 
                alt="Modern Office" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute -bottom-10 -left-10 right-0 p-8 space-y-4">
              <div className="bg-white p-6 rounded-3xl shadow-xl flex gap-6 items-start">
                <div className="bg-black p-3 rounded-2xl text-white shrink-0">
                  <Lightbulb size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Our Vision</h4>
                  <p className="text-gray-500 text-sm">To be a leader in the real estate market, offering unparalleled services in luxury and sustainability.</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-xl flex gap-6 items-start translate-x-12">
                <div className="bg-black p-3 rounded-2xl text-white shrink-0">
                  <Target size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Our Mission</h4>
                  <p className="text-gray-500 text-sm">To create exceptional living experiences through innovation and personalized service.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
