
import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black flex items-center justify-center rounded-lg">
                <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">VistaHaven</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#hero" className="text-gray-600 hover:text-black font-medium transition-colors">Home</a>
            <a href="#feature-service" className="text-gray-600 hover:text-black font-medium transition-colors">Services</a>
            <a href="#property" className="text-gray-600 hover:text-black font-medium transition-colors">Properties</a>
            <a href="#about" className="text-gray-600 hover:text-black font-medium transition-colors">About</a>
            <a href="#contact" className="bg-black text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2 hover:bg-gray-800 transition-all">
              Contact Us Now
              <div className="bg-white p-1 rounded-full text-black">
                <ArrowUpRight size={14} />
              </div>
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <a href="#hero" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-gray-700">Home</a>
            <a href="#feature-service" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-gray-700">Services</a>
            <a href="#property" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-gray-700">Properties</a>
            <a href="#about" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-gray-700">About</a>
            <a href="#contact" onClick={() => setIsOpen(false)} className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium w-full text-center">
              Contact Us Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
