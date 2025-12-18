import React, { useState } from 'react';
import { generateImage, enhanceImagePrompt } from '../../services/geminiService';
import { Image as ImageIcon, Download, Sparkles, Ratio, Palette, Wand2, History, X } from 'lucide-react';
import AdUnit from '../AdUnit';

const STYLES = [
  "Photorealistic",
  "Cyberpunk 2077",
  "Studio Ghibli Anime",
  "3D Render (Octane)",
  "Oil Painting",
  "Cinematic Lighting",
  "Vector Art",
  "Analog Film",
  "Synthwave",
  "Architectural"
];

const RATIOS = [
  { label: 'Square (1:1)', val: '1:1', icon: 'square' },
  { label: 'Wide (16:9)', val: '16:9', icon: 'rectangle-horizontal' },
  { label: 'Tall (9:16)', val: '9:16', icon: 'rectangle-vertical' }
];

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}

const PixelGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Photorealistic');
  const [ratio, setRatio] = useState('1:1');
  
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);

  const handleEnhancePrompt = async () => {
    if (!prompt) return;
    setEnhancing(true);
    try {
      const enhanced = await enhanceImagePrompt(prompt);
      setPrompt(enhanced);
    } catch (e) {
      console.error(e);
    } finally {
      setEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    
    // Credit Check Simulation (In a real implementation, props.user.credits would be checked here)
    // For now, we assume the user has credits if they passed the LoginModal
    
    setLoading(true);
    
    // Engineer the prompt with style and ratio context
    const engineeredPrompt = `${prompt}. Art Style: ${style}. Aspect Ratio: ${ratio}. High quality, detailed, 8k resolution.`;
    
    try {
      const res = await generateImage(engineeredPrompt, ratio);
      const newImg = { id: Date.now().toString(), url: res, prompt: prompt };
      setCurrentImage(newImg);
      setHistory(prev => [newImg, ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row h-full lg:h-[calc(100vh-140px)] gap-6">
      {/* Control Panel */}
      <div className="w-full xl:w-96 flex flex-col gap-4 shrink-0">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex-1 flex flex-col space-y-5 h-full overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-pink-400">
              <ImageIcon className="w-6 h-6" />
              <h2 className="text-xl font-bold">Pixel Studio</h2>
            </div>
            <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-slate-400">Cost: 5 Cr</span>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vision Prompt</label>
                <button 
                  onClick={handleEnhancePrompt}
                  disabled={enhancing || !prompt}
                  className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
                >
                  <Wand2 className={`w-3 h-3 ${enhancing ? 'animate-spin' : ''}`} />
                  {enhancing ? 'Enhancing...' : 'Magic Enhance (Free)'}
                </button>
              </div>
              <textarea 
                className="w-full bg-slate-950 border border-slate-700 p-4 rounded-xl text-white h-32 resize-none focus:border-pink-500 outline-none transition-all placeholder:text-slate-600 text-sm leading-relaxed" 
                placeholder="Describe your imagination... (e.g., A futuristic city with neon lights)"
                value={prompt} 
                onChange={e => setPrompt(e.target.value)}
              />
            </div>

            <div className="space-y-3">
               <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                 <Palette className="w-3 h-3" /> Art Direction
               </label>
               <div className="grid grid-cols-2 gap-2">
                 {STYLES.map(s => (
                   <button 
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`text-xs p-2.5 rounded-lg border text-left transition-all truncate ${style === s ? 'bg-pink-500/20 border-pink-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-300'}`}
                   >
                     {s}
                   </button>
                 ))}
               </div>
            </div>

            <div className="space-y-3">
               <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                 <Ratio className="w-3 h-3" /> Canvas Ratio
               </label>
               <div className="flex gap-2">
                 {RATIOS.map(r => (
                   <button 
                    key={r.val}
                    onClick={() => setRatio(r.val)}
                    className={`flex-1 text-xs py-2.5 rounded-lg border transition-all ${ratio === r.val ? 'bg-pink-500/20 border-pink-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                   >
                     {r.label}
                   </button>
                 ))}
               </div>
            </div>
          </div>
          
          <button 
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full py-4 mt-auto bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-pink-500/30 disabled:opacity-50 flex justify-center items-center gap-2 group"
          >
            {loading ? <><Sparkles className="w-5 h-5 animate-spin" /> Rendering Assets...</> : <><Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" /> Generate Image (-5 Cr)</>}
          </button>
        </div>
      </div>

      {/* Main Stage */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* Ad Placement: Top of Stage */}
        <AdUnit type="banner" className="w-full !h-16 shrink-0" />

        {/* Canvas */}
        <div className="flex-1 bg-slate-900/30 border border-slate-800 rounded-2xl flex items-center justify-center relative overflow-hidden group min-h-[400px]">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>

          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 z-20 backdrop-blur-sm transition-opacity">
              <div className="relative w-24 h-24 mb-6">
                 <div className="absolute inset-0 border-4 border-pink-500/20 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                 <Sparkles className="absolute inset-0 m-auto text-pink-500 w-8 h-8 animate-pulse" />
              </div>
              <p className="text-white text-lg font-medium animate-pulse">Diffusing Pixels...</p>
              <p className="text-slate-400 text-sm mt-2">Applying {style} filters</p>
            </div>
          )}
          
          {currentImage ? (
            <>
              <img src={currentImage.url} alt="Generated" className="relative z-10 max-w-full max-h-full object-contain shadow-2xl rounded-lg ring-1 ring-white/10" />
              <div className="absolute top-4 left-4 z-20">
                 <span className="px-3 py-1 bg-black/60 backdrop-blur text-white text-xs rounded-full border border-white/10">
                    {style} • {ratio}
                 </span>
              </div>
              <div className="absolute bottom-6 right-6 flex gap-3 z-20 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                 <a 
                  href={currentImage.url} 
                  download={`pixel-studio-${Date.now()}.png`}
                  className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-200 rounded-xl flex items-center gap-2 shadow-lg font-bold transition-colors"
                >
                  <Download className="w-4 h-4" /> Download HD
                </a>
              </div>
            </>
          ) : (
            <div className="text-slate-600 text-center p-6 relative z-10 max-w-md">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-slate-700 shadow-xl transform rotate-3">
                 <ImageIcon className="w-10 h-10 opacity-40 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-300 mb-2">Creative Canvas</h3>
              <p className="text-slate-500">Configure your parameters on the left or use <span className="text-purple-400">Magic Enhance</span> to turn simple words into masterpieces.</p>
            </div>
          )}
        </div>

        {/* History Strip */}
        {history.length > 0 && (
          <div className="h-32 bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex gap-4 overflow-x-auto shrink-0 scrollbar-thin scrollbar-thumb-slate-700">
             {history.map((item) => (
               <div 
                 key={item.id}
                 onClick={() => setCurrentImage(item)}
                 className={`
                    relative min-w-[100px] w-[100px] h-full rounded-xl overflow-hidden cursor-pointer border-2 transition-all group
                    ${currentImage?.id === item.id ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-transparent hover:border-slate-600'}
                 `}
               >
                 <img src={item.url} className="w-full h-full object-cover" alt="History" />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <History className="w-4 h-4 text-white" />
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PixelGen;