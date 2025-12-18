import React, { useState } from 'react';
import { generateLogo, generateLogoConcept, enhanceImagePrompt } from '../../services/geminiService';
import { 
  Wand2, 
  Download, 
  Copy, 
  RefreshCcw, 
  Layers, 
  Zap,
  PenTool,
  Image as ImageIcon,
  Grid,
  Sun,
  Moon,
  Triangle,
  Circle,
  Box
} from 'lucide-react';

const LOGO_TYPES = [
  { id: 'Abstract Mark', icon: <Triangle className="w-4 h-4" />, desc: 'Geometric & Conceptual' },
  { id: 'Wordmark', icon: <PenTool className="w-4 h-4" />, desc: 'Typographic Focus' },
  { id: 'Pictorial', icon: <Circle className="w-4 h-4" />, desc: 'Literal Object/Icon' },
  { id: 'Emblem', icon: <Box className="w-4 h-4" />, desc: 'Badge / Shield Style' },
];

const STYLES = [
  { id: 'Tech Minimal', label: 'Tech Minimal', color: 'bg-blue-500', preview: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { id: 'Organic Line', label: 'Organic Line', color: 'bg-emerald-500', preview: 'M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z' },
  { id: 'Cyber Gradient', label: 'Cyber Gradient', color: 'bg-purple-500', preview: 'M4 4h16v16H4z' },
  { id: 'Luxury Serif', label: 'Luxury Serif', color: 'bg-amber-500', preview: 'M12 2L2 22h20L12 2z' },
];

const LogoForge: React.FC = () => {
  // Mode: 'vector' (Code/SVG) or 'concept' (Image/Raster)
  const [mode, setMode] = useState<'vector' | 'concept'>('vector');
  
  // Inputs
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [selectedType, setSelectedType] = useState('Abstract Mark');
  const [selectedStyle, setSelectedStyle] = useState('Tech Minimal');
  const [conceptPrompt, setConceptPrompt] = useState('');

  // UI State
  const [isDarkBg, setIsDarkBg] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  
  // Outputs
  const [generatedSvg, setGeneratedSvg] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<{type: 'svg'|'img', content: string}[]>([]);

  // Actions
  const handleEnhancePrompt = async () => {
    if (!conceptPrompt && !brandName) return;
    setEnhancing(true);
    try {
      const base = conceptPrompt || `Logo for ${brandName} in ${industry} industry. Style: ${selectedStyle}`;
      const enhanced = await enhanceImagePrompt(base);
      setConceptPrompt(enhanced);
    } catch (e) {
      console.error(e);
    } finally {
      setEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if ((mode === 'vector' && !brandName) || (mode === 'concept' && !conceptPrompt && !brandName)) return;
    
    setIsGenerating(true);
    setGeneratedSvg(null);
    setGeneratedImage(null);

    try {
      if (mode === 'vector') {
        const svg = await generateLogo(
          brandName, 
          industry || 'General', 
          selectedStyle, 
          'Professional Palette', 
          selectedType
        );
        setGeneratedSvg(svg);
        setHistory(prev => [{type: 'svg', content: svg}, ...prev]);
      } else {
        const promptToUse = conceptPrompt || `Logo for ${brandName}, ${selectedStyle} style, ${industry}`;
        const img = await generateLogoConcept(brandName, selectedStyle, promptToUse);
        setGeneratedImage(img);
        setHistory(prev => [{type: 'img', content: img}, ...prev]);
      }
    } catch (e) {
      console.error(e);
      // Fallback UI handled by null states
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAsset = () => {
    if (mode === 'vector' && generatedSvg) {
      const blob = new Blob([generatedSvg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${brandName}-logo.svg`;
      a.click();
    } else if (mode === 'concept' && generatedImage) {
      const a = document.createElement('a');
      a.href = generatedImage;
      a.download = `${brandName}-concept.png`;
      a.click();
    }
  };

  return (
    <div className="flex flex-col xl:flex-row h-[calc(100vh-140px)] gap-6">
      
      {/* LEFT: FORGE CONTROL */}
      <div className="w-full xl:w-[420px] flex flex-col gap-4 overflow-y-auto pr-2">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-6">
          
          {/* Header & Mode Switch */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                Logo Forge
              </h2>
              <p className="text-xs text-slate-400 mt-1">Dual-Engine Brand Architect</p>
            </div>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button 
                onClick={() => setMode('vector')}
                className={`p-2 rounded-md transition-all ${mode === 'vector' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                title="Vector Engine (SVG)"
              >
                <PenTool className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setMode('concept')}
                className={`p-2 rounded-md transition-all ${mode === 'concept' ? 'bg-pink-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                title="Concept Engine (Raster)"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Common Inputs */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Brand Identity</label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <input 
                  className="bg-slate-950 border border-slate-700 p-3 rounded-xl text-white focus:border-emerald-500 outline-none"
                  placeholder="Brand Name"
                  value={brandName} onChange={e => setBrandName(e.target.value)}
                />
                <input 
                  className="bg-slate-950 border border-slate-700 p-3 rounded-xl text-white focus:border-emerald-500 outline-none"
                  placeholder="Industry (e.g. AI)"
                  value={industry} onChange={e => setIndustry(e.target.value)}
                />
              </div>
            </div>

            {/* Vector Mode Specifics */}
            {mode === 'vector' && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                   <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Structure</label>
                   <div className="grid grid-cols-2 gap-2 mt-2">
                     {LOGO_TYPES.map(t => (
                       <button
                        key={t.id}
                        onClick={() => setSelectedType(t.id)}
                        className={`text-left p-2.5 rounded-lg border flex items-center gap-3 transition-all ${selectedType === t.id ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                       >
                         {t.icon}
                         <div>
                           <div className="text-xs font-medium">{t.id}</div>
                         </div>
                       </button>
                     ))}
                   </div>
                </div>

                <div>
                   <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Aesthetic</label>
                   <div className="grid grid-cols-2 gap-2 mt-2">
                     {STYLES.map(s => (
                       <button
                        key={s.id}
                        onClick={() => setSelectedStyle(s.id)}
                        className={`relative overflow-hidden group p-3 rounded-lg border text-left transition-all ${selectedStyle === s.id ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-800 hover:border-slate-600'}`}
                       >
                         <div className={`absolute top-0 right-0 w-16 h-16 ${s.color} opacity-10 rounded-bl-full group-hover:scale-110 transition-transform`}></div>
                         <span className="relative z-10 text-sm font-medium text-slate-200">{s.label}</span>
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            )}

            {/* Concept Mode Specifics */}
            {mode === 'concept' && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Visual Brief</label>
                    <button 
                      onClick={handleEnhancePrompt}
                      disabled={enhancing}
                      className="text-xs flex items-center gap-1 text-pink-400 hover:text-pink-300"
                    >
                      <Wand2 className={`w-3 h-3 ${enhancing ? 'animate-spin' : ''}`} /> Magic Enhance
                    </button>
                  </div>
                  <textarea 
                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white h-32 focus:border-pink-500 outline-none text-sm resize-none"
                    placeholder="Describe the logo concept in detail..."
                    value={conceptPrompt} onChange={e => setConceptPrompt(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || (mode === 'vector' && !brandName)}
              className={`
                w-full py-4 font-bold rounded-xl text-white shadow-lg flex items-center justify-center gap-2 transition-all mt-4
                ${isGenerating 
                  ? 'bg-slate-700 cursor-not-allowed' 
                  : mode === 'vector' 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500' 
                    : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500'}
              `}
            >
              {isGenerating ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              {isGenerating ? 'Forging Asset...' : mode === 'vector' ? 'Forge Vector Logo' : 'Generate Concept'}
            </button>
          </div>

        </div>
      </div>

      {/* RIGHT: ARTIFACT GRID */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* Main Preview */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="h-12 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between px-4 backdrop-blur-sm z-10">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Grid className="w-4 h-4" />
              <span>{mode === 'vector' ? 'Vector Artboard' : 'Raster Canvas'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsDarkBg(!isDarkBg)} className="p-2 text-slate-400 hover:text-white rounded-lg">
                {isDarkBg ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <div className="h-4 w-px bg-slate-700"></div>
              <button 
                onClick={downloadAsset}
                disabled={!generatedSvg && !generatedImage}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-30"
              >
                <Download className="w-3 h-3" /> Export
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className={`flex-1 flex items-center justify-center relative ${isDarkBg ? 'bg-slate-900' : 'bg-gray-100'} transition-colors duration-500`}>
             <div className="absolute inset-0 opacity-10" style={{backgroundImage: `radial-gradient(${isDarkBg ? '#475569' : '#cbd5e1'} 1px, transparent 1px)`, backgroundSize: '20px 20px'}}></div>
             
             {isGenerating ? (
               <div className="z-10 text-center animate-pulse">
                 <div className="w-24 h-24 mx-auto border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                 <p className={`font-medium ${isDarkBg ? 'text-white' : 'text-slate-900'}`}>Synthesizing Brand DNA...</p>
               </div>
             ) : (mode === 'vector' && generatedSvg) ? (
               <div 
                 className="w-full h-full p-12 max-w-2xl flex items-center justify-center z-10 [&>svg]:w-full [&>svg]:h-full [&>svg]:drop-shadow-2xl"
                 dangerouslySetInnerHTML={{ __html: generatedSvg }} 
               />
             ) : (mode === 'concept' && generatedImage) ? (
               <img src={generatedImage} alt="Logo Concept" className="max-h-[80%] max-w-[80%] shadow-2xl rounded-lg z-10" />
             ) : (
               <div className="z-10 text-center opacity-40">
                 <Layers className={`w-16 h-16 mx-auto mb-4 ${isDarkBg ? 'text-slate-600' : 'text-slate-400'}`} />
                 <p className={`${isDarkBg ? 'text-slate-500' : 'text-slate-400'}`}>Awaiting Input</p>
               </div>
             )}
          </div>
        </div>

        {/* Recent Artifacts Strip */}
        {history.length > 0 && (
          <div className="h-24 bg-slate-950 border border-slate-800 rounded-xl p-2 flex gap-2 overflow-x-auto">
            {history.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  if (item.type === 'svg') {
                    setGeneratedSvg(item.content);
                    setMode('vector');
                  } else {
                    setGeneratedImage(item.content);
                    setMode('concept');
                  }
                }}
                className="h-full aspect-square bg-slate-900 rounded-lg border border-slate-800 overflow-hidden hover:border-emerald-500 transition-colors flex items-center justify-center relative group"
              >
                {item.type === 'svg' ? (
                  <div className="w-full h-full p-2" dangerouslySetInnerHTML={{ __html: item.content }} />
                ) : (
                  <img src={item.content} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className={`w-2 h-2 rounded-full ${item.type === 'svg' ? 'bg-emerald-500' : 'bg-pink-500'}`}></div>
                </div>
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default LogoForge;