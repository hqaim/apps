import React, { useState } from 'react';
import { ToolId, User } from '../types';
import { TOOLS, APP_NAME } from '../constants';
import { LayoutDashboard, Hexagon, PlayCircle, Plus } from 'lucide-react';
import AdUnit from './AdUnit';

interface SidebarProps {
  activeTool: ToolId;
  onNavigate: (toolId: ToolId) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
  user: User | null;
  onWatchAd: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTool, 
  onNavigate, 
  isMobileOpen, 
  setIsMobileOpen,
  user,
  onWatchAd
}) => {
  const [isWatchingAd, setIsWatchingAd] = useState(false);

  const handleAdClick = () => {
    setIsWatchingAd(true);
    // Simulate ad duration
    setTimeout(() => {
      onWatchAd();
      setIsWatchingAd(false);
    }, 2000);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-slate-900/95 border-r border-slate-800
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col h-full
        `}
      >
        {/* Header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 shrink-0">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <Hexagon className="w-6 h-6 text-white fill-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent leading-none">
              {APP_NAME}
            </h1>
            <span className="text-[10px] text-indigo-400 font-medium tracking-wider">FREE EDITION</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
          <button
            onClick={() => {
              onNavigate(ToolId.DASHBOARD);
              setIsMobileOpen(false);
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${activeTool === ToolId.DASHBOARD 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-sm' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
            `}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <div className="my-4 border-t border-slate-800/50 mx-2"></div>
          <div className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Creative Suite
          </div>

          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                onNavigate(tool.id);
                setIsMobileOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${activeTool === tool.id 
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
              `}
            >
              <span className={`transition-colors duration-200 ${activeTool === tool.id ? tool.color : 'group-hover:text-slate-300 text-slate-500'}`}>
                {tool.icon}
              </span>
              <span className="font-medium">{tool.name}</span>
            </button>
          ))}

          {/* Sidebar Ad Placement */}
          <div className="mt-8 px-2">
            <AdUnit type="rectangle" className="mx-auto w-full !h-[200px]" />
          </div>
        </nav>

        {/* User / Credits Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <div className="bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm border border-slate-700/50">
            <div className="flex justify-between items-end mb-2">
               <div>
                 <p className="text-xs text-slate-400 font-medium">Available Credits</p>
                 <span className="text-2xl font-bold text-white">{user ? user.credits : 0}</span>
               </div>
               <button 
                 onClick={handleAdClick}
                 disabled={isWatchingAd}
                 className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1 transition-colors disabled:opacity-50"
               >
                 {isWatchingAd ? 'Watching...' : <><PlayCircle className="w-3 h-3" /> Earn +50</>}
               </button>
            </div>
            
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden mb-2">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((user?.credits || 0) / 5, 100)}%` }} // Assuming 500 is max "free" visual cap
              ></div>
            </div>
            <p className="text-[10px] text-center text-slate-500">
              Generate more to level up
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;