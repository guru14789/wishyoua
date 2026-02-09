
import React from 'react';
import { AGENTS } from '../constants';

const Agents: React.FC = () => {
  return (
    <section id="agents" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-16">
          <span className="bg-gray-200 text-gray-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 inline-block">
            Meet Our Experts
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Personalized Guidance, Proven Expertise
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {AGENTS.map((agent, i) => (
            <div key={i} className="group flex flex-col">
              <div className="relative aspect-square rounded-[32px] overflow-hidden mb-6 shadow-md">
                <img 
                  src={agent.image} 
                  alt={agent.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{agent.name}</h3>
              <p className="text-gray-500 text-sm font-medium">{agent.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Agents;
