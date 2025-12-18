import React from 'react';
import { ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-900/50 py-6 px-4 lg:px-8 mt-auto backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <p>&copy; {new Date().getFullYear()} HQAIM Creative Suite. All rights reserved.</p>
          <div className="hidden md:block w-1 h-1 bg-slate-700 rounded-full"></div>
          <p className="text-xs hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</p>
          <p className="text-xs hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</p>
        </div>
        
        <div className="flex items-center gap-1.5">
          <span>Powered by</span>
          <a 
            href="https://www.hqaim.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-semibold text-slate-300 hover:text-indigo-400 transition-colors flex items-center gap-1 group"
          >
            HQAIM
            <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;