
import React from 'react';
import { PROPERTIES } from '../constants';
import { Bed, Bath, Maximize, MapPin } from 'lucide-react';

const PropertyList: React.FC = () => {
  return (
    <section id="property" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <span className="bg-gray-200 text-gray-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 inline-block">
            Featured Properties
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Discover homes tailored to <br /> your lifestyle and needs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROPERTIES.map((property) => (
            <div key={property.id} className="bg-white rounded-[40px] overflow-hidden border border-gray-100 hover:border-gray-200 transition-all hover:shadow-xl group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-gray-800 shadow-sm">
                  {property.category}
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-3">
                  <MapPin size={14} className="text-gray-400" />
                  {property.location}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-black transition-colors">
                  {property.name}
                </h3>
                
                <div className="flex items-center gap-6 mb-8 text-gray-500">
                  <div className="flex items-center gap-2">
                    <Bed size={18} />
                    <span className="font-medium">{property.beds}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath size={18} />
                    <span className="font-medium">{property.baths}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize size={18} />
                    <span className="font-medium">{property.sqft} sq.ft</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <div className="text-3xl font-bold text-gray-900">
                    <span className="text-xl font-medium text-gray-500 mr-1">$</span>
                    {property.price}
                  </div>
                  <button className="p-3 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-all text-gray-900">
                    <Maximize size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyList;
