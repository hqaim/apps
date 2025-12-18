import React from 'react';
import { TOOLS } from '../constants';
import { ToolId } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';
import AdUnit from './AdUnit';

interface DashboardProps {
  onNavigate: (toolId: ToolId) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Top Ad Placement */}
      <div className="w-full flex justify-center">
        <AdUnit type="banner" />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 border border-slate-800 p-8 md:p-12">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>HQAIM Apps v2.0 Live</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Unleash Your Creativity with <span className="text-indigo-400">Generative AI</span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Welcome to the ultimate creative suite. Generate logos, websites, ad copy, and viral social content in seconds.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate(ToolId.PIXEL_GEN)}
              className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg shadow-white/5"
            >
              Start Creating
            </button>
            <button className="px-6 py-3 bg-slate-800/50 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors backdrop-blur-sm border border-slate-700">
              View Tutorials
            </button>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
          Available Tools
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {TOOLS.map((tool) => (
            <div 
              key={tool.id}
              onClick={() => onNavigate(tool.id)}
              className="group relative bg-slate-800/30 border border-slate-800 hover:border-indigo-500/30 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-slate-800/50 hover:-translate-y-1"
            >
              <div className={`mb-4 inline-flex p-3 rounded-xl bg-slate-900/50 ring-1 ring-inset ring-white/5 group-hover:bg-indigo-500/10 group-hover:ring-indigo-500/20 transition-colors ${tool.color}`}>
                {tool.icon}
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                {tool.description}
              </p>
              
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                <ArrowRight className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;