import React, { useState } from 'react';
import { generateCopy } from '../../services/geminiService';
import { Type, Copy, Sparkles, Target, Users, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Assuming we handle markdown manually or simple rendering

const CopyPro: React.FC = () => {
  const [format, setFormat] = useState('Facebook Ad');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Persuasive');
  const [framework, setFramework] = useState('AIDA (Attention-Interest-Desire-Action)');
  const [audience, setAudience] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      // Extract framework short name for better prompt
      const frameworkName = framework.split(' ')[0];
      const res = await generateCopy(format, topic, tone, frameworkName, audience || 'General Public');
      setOutput(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 h-full lg:h-[calc(100vh-140px)]">
      {/* Input Panel */}
      <div className="w-full lg:w-1/3 space-y-6 lg:overflow-y-auto pr-2">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-5">
          <div className="flex items-center gap-2 text-yellow-400">
            <Type className="w-6 h-6" />
            <h2 className="text-xl font-bold">Copy Pro</h2>
          </div>
          
          <div className="space-y-4">
             <div>
               <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Format</label>
               <select 
                  className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white focus:border-yellow-500 outline-none"
                  value={format} onChange={e => setFormat(e.target.value)}
                >
                  <option>Facebook Ad</option>
                  <option>Instagram Caption</option>
                  <option>Google Ad Headline</option>
                  <option>Landing Page Hero</option>
                  <option>Email Newsletter</option>
                  <option>Viral Tweet Thread</option>
                </select>
             </div>

             <div>
               <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Target Audience</label>
               <div className="relative">
                 <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                 <input 
                    className="w-full bg-slate-950 border border-slate-700 p-3 pl-10 rounded-xl text-white focus:border-yellow-500 outline-none placeholder:text-slate-600"
                    placeholder="e.g. CTOs of Startups, Fitness Enthusiasts"
                    value={audience} onChange={e => setAudience(e.target.value)}
                  />
               </div>
             </div>

             <div className="grid grid-cols-1 gap-4">
                <div>
                   <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Framework</label>
                   <select 
                      className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white focus:border-yellow-500 outline-none text-sm"
                      value={framework} onChange={e => setFramework(e.target.value)}
                    >
                      <option>AIDA (Attention-Interest-Desire-Action)</option>
                      <option>PAS (Problem-Agitation-Solution)</option>
                      <option>BAB (Before-After-Bridge)</option>
                      <option>4Ps (Promise-Picture-Proof-Push)</option>
                      <option>Storytelling Hero's Journey</option>
                    </select>
                </div>
                <div>
                   <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Tone</label>
                   <select 
                      className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white focus:border-yellow-500 outline-none"
                      value={tone} onChange={e => setTone(e.target.value)}
                    >
                      <option>Persuasive & Salesy</option>
                      <option>Professional & Corporate</option>
                      <option>Witty & Humorous</option>
                      <option>Urgent & FOMO</option>
                      <option>Empathetic & Warm</option>
                    </select>
                </div>
             </div>

             <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Topic / Product</label>
                <textarea 
                  className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white h-32 focus:border-yellow-500 outline-none resize-none" 
                  placeholder="Describe your product or topic in detail..."
                  value={topic} onChange={e => setTopic(e.target.value)}
                />
             </div>
          </div>
          
          <button 
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-slate-900 font-bold rounded-xl transition-all shadow-lg hover:shadow-yellow-500/20 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? <><Sparkles className="w-5 h-5 animate-spin" /> Crafting Copy...</> : <><Sparkles className="w-5 h-5" /> Generate Copy</>}
          </button>
        </div>
      </div>

      {/* Output Panel */}
      <div className="flex-1 bg-slate-900/30 border border-slate-800 rounded-2xl p-6 relative overflow-y-auto">
        {output ? (
          <div className="max-w-3xl mx-auto">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Generated Content</h3>
                <button 
                  onClick={() => navigator.clipboard.writeText(output)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-white transition-colors border border-slate-700"
                >
                  <Copy className="w-4 h-4" /> Copy All
                </button>
             </div>
             
             <div className="bg-slate-950 rounded-xl p-8 border border-slate-800 shadow-2xl">
                <div className="prose prose-invert prose-lg max-w-none whitespace-pre-wrap leading-relaxed">
                  {output}
                </div>
             </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
             <BookOpen className="w-16 h-16 mb-4" />
             <p className="text-lg font-medium">Your copy will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CopyPro;