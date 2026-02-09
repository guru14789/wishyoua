
import React from 'react';
import { Home, Leaf, MapPin, BarChart3, Calculator, BadgeCheck } from 'lucide-react';

const Services: React.FC = () => {
  const mainServices = [
    {
      id: '01',
      title: 'Luxury Residences',
      description: 'Experience unparalleled elegance in our luxury residences, featuring exquisite design and premium amenities.',
      icon: <Home className="text-gray-800" />,
      image: 'https://framerusercontent.com/images/yzpRxn2HI5TBopZVeE1K1WuVA.jpg'
    },
    {
      id: '02',
      title: 'Eco Green Buildings',
      description: 'Discover sustainable living in our eco-friendly properties, designed to minimize environmental impact.',
      icon: <Leaf className="text-gray-800" />,
      image: 'https://framerusercontent.com/images/LJMyvITSYFBGctUUSfHSRfjsZ0.jpg'
    }
  ];

  const gridServices = [
    { title: 'Property Sales', desc: 'Expertly promoting and selling your property.', icon: <Calculator size={20} /> },
    { title: 'Buyer Representation', desc: 'Guiding you through the home-buying process.', icon: <BadgeCheck size={20} /> },
    { title: 'Rental Management', desc: 'Managing tenant relations and maintenance.', icon: <MapPin size={20} /> },
    { title: 'Investment Consulting', desc: 'Strategic advice for real estate opportunities.', icon: <BarChart3 size={20} /> }
  ];

  return (
    <section id="feature-service" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-gray-200">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Real Estate Solutions
          </h2>
          <p className="text-gray-500 max-w-2xl text-lg">
            Our comprehensive services encompass luxury property sales, sustainable green building investments, and premium vacation rentals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {mainServices.map((service) => (
            <div key={service.id} className="relative group overflow-hidden rounded-[32px] aspect-[4/5] md:aspect-[16/10]">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                 <div className="flex items-center gap-4 mb-3">
                   <div className="bg-white p-3 rounded-2xl">
                     {service.icon}
                   </div>
                   <h3 className="text-2xl font-bold">{service.title}</h3>
                 </div>
                 <p className="text-white/80 text-lg leading-relaxed">{service.description}</p>
              </div>
              <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-white font-bold border border-white/30">
                {service.id}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gridServices.map((s, i) => (
            <div key={i} className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 hover:border-gray-300 hover:bg-white transition-all duration-300">
               <div className="w-12 h-12 bg-white flex items-center justify-center rounded-2xl mb-6 shadow-sm">
                 {s.icon}
               </div>
               <h4 className="text-xl font-bold mb-3">{s.title}</h4>
               <p className="text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
