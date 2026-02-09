
import React from 'react';
import { Facebook, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl">
                    <span className="text-black font-black text-2xl">V</span>
                </div>
                <span className="text-3xl font-bold tracking-tight">VistaHaven</span>
            </div>
            <p className="text-gray-500 max-w-sm text-lg leading-relaxed">
              We provide tailored real estate solutions, guiding you through every step with personalized experiences.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-8">Contact Info</h4>
            <ul className="space-y-4 text-gray-500">
              <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                <Phone size={18} /> +1-800-555-1234
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                <Mail size={18} /> info@vistahaven.com
              </li>
              <li className="flex items-start gap-3 hover:text-white transition-colors cursor-pointer">
                <MapPin size={18} className="shrink-0 mt-1" />
                <span>123 Serenity Boulevard, Greenwood Heights, NY 11222</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-8">Social Media</h4>
            <div className="flex gap-4">
              {[
                { icon: <Facebook size={20} />, link: '#' },
                { icon: <Linkedin size={20} />, link: '#' },
                { icon: <Youtube size={20} />, link: '#' }
              ].map((s, i) => (
                <a key={i} href={s.link} className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <p>© Copyright 2025. All Rights Reserved by VistaHaven Team.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
