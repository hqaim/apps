import React from 'react';

interface AdUnitProps {
  type: 'banner' | 'sidebar' | 'rectangle';
  className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ type, className = '' }) => {
  // Dimensions based on standard IAB formats
  const dimensions = {
    banner: 'h-24 w-full max-w-[728px]', // Leaderboard
    sidebar: 'h-[600px] w-full max-w-[300px]', // Skyscraper
    rectangle: 'h-[250px] w-[300px]', // Medium Rectangle
  };

  return (
    <div className={`relative bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden flex flex-col items-center justify-center group ${dimensions[type]} ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'repeating-linear-gradient(45deg, #1e293b 0, #1e293b 10px, #0f172a 10px, #0f172a 20px)'}}></div>
      
      {/* Ad Label */}
      <div className="absolute top-0 right-0 bg-slate-800 text-[9px] text-slate-500 px-1.5 py-0.5 rounded-bl">
        Sponsored
      </div>

      {/* Placeholder Content (Simulating an Ad Network) */}
      <div className="z-10 text-center p-4">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-widest block mb-1">
          Ad Space
        </span>
        <span className="text-[10px] text-slate-700">
          Upgrade to Pro to remove ads
        </span>
      </div>
      
      {/* Hover Effect for visual polish */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-slate-800 transition-colors pointer-events-none rounded-lg"></div>
    </div>
  );
};

export default AdUnit;