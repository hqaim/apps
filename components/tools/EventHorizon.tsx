import React, { useState } from 'react';
import { generateHtml, generateImage } from '../../services/geminiService';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Ticket, 
  LayoutTemplate, 
  Zap, 
  Download, 
  Share2, 
  Printer, 
  RefreshCw,
  Image as ImageIcon,
  Maximize2
} from 'lucide-react';

// --- TYPES & CONSTANTS ---

const VIBES = [
  { id: 'neon', label: 'Neon Cyberpunk', prompt: 'futuristic, neon lights, dark background, glitch effect, high contrast' },
  { id: 'luxury', label: 'Luxury Gala', prompt: 'gold and black, elegant serif fonts, marble texture, minimalist' },
  { id: 'corporate', label: 'Tech Summit', prompt: 'clean white and blue, geometric shapes, sans-serif, professional' },
  { id: 'festival', label: 'Music Festival', prompt: 'vibrant colors, psychedelic patterns, bold grunge typography, energetic' },
  { id: 'wedding', label: 'Modern Wedding', prompt: 'soft pastels, floral accents, script typography, airy and light' },
];

const FORMATS = [
  { id: 'flyer', label: 'Flyer (Portrait)', aspect: '3:4', width: 'w-[400px]', height: 'h-[533px]' },
  { id: 'story', label: 'Story (9:16)', aspect: '9:16', width: 'w-[300px]', height: 'h-[533px]' },
  { id: 'post', label: 'Social (1:1)', aspect: '1:1', width: 'w-[450px]', height: 'h-[450px]' },
  { id: 'banner', label: 'Banner (16:9)', aspect: '16:9', width: 'w-[500px]', height: 'h-[281px]' },
];

const EventHorizon: React.FC = () => {
  // Inputs
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [rsvp, setRsvp] = useState('');
  const [description, setDescription] = useState('');
  
  // Config
  const [selectedVibe, setSelectedVibe] = useState(VIBES[0]);
  const [selectedFormat, setSelectedFormat] = useState(FORMATS[0]);
  const [includeQr, setIncludeQr] = useState(true);

  // Output
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [generatedBg, setGeneratedBg] = useState<string>('');
  
  // States
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string>('');

  const handleGenerate = async () => {
    if (!title) return;
    
    setIsGenerating(true);
    setStatus('Initializing Creative Core...');
    setGeneratedHtml('');
    
    try {
      // 1. Generate Background Image (Parallel)
      setStatus('Synthesizing Visuals & Layout...');
      
      const bgPrompt = `
        Artistic background texture for an event flyer. 
        Theme: ${selectedVibe.label}. 
        Style: ${selectedVibe.prompt}. 
        No text, no words, abstract or scenic only. High resolution, 4k.
      `;

      // We run these in parallel for speed
      const [bgImage, htmlContent] = await Promise.all([
        generateImage(bgPrompt, selectedFormat.aspect),
        generateHtml(
          'flyer', 
          title, 
          `Event: ${title}. Date: ${date}. Location: ${location}. RSVP: ${rsvp}. Details: ${description}. Vibe: ${selectedVibe.label}. Format: ${selectedFormat.label}. ${includeQr ? 'Include a placeholder QR code section.' : ''}`, 
          selectedVibe.label
        )
      ]);

      setGeneratedBg(bgImage);
      setGeneratedHtml(htmlContent);

    } catch (e) {
      console.error(e);
      setStatus('Error: Creative Core Interrupted.');
    } finally {
      setIsGenerating(false);
      setStatus('');
    }
  };

  // Inject the generated background into the HTML preview
  const getPreviewHtml = () => {
    if (!generatedHtml) return '';
    
    // We inject a style tag to force the body background to use our generated image
    // This overrides whatever the AI generated for the background color
    const injection = `
      <style>
        body {
          background-image: url('${generatedBg}');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .backdrop-overlay {
          background: rgba(0,0,0,0.4); /* Ensure text readability */
          position: absolute;
          inset: 0;
          z-index: -1;
        }
      </style>
      <div class="backdrop-overlay"></div>
    `;
    
    // Insert before closing head or body
    return generatedHtml.replace('</head>', `${injection}</head>`);
  };

  return (
    <div className="flex flex-col xl:flex-row h-full xl:h-[calc(100vh-140px)] gap-6">
      
      {/* LEFT: COMMAND DECK */}
      <div className="w-full xl:w-[400px] flex flex-col gap-4 overflow-y-auto pr-2">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-orange-500">
              <Calendar className="w-6 h-6" />
              <h2 className="text-xl font-bold">Event Horizon</h2>
            </div>
            <span className="text-[10px] font-mono uppercase bg-orange-900/30 text-orange-400 px-2 py-1 rounded border border-orange-500/20">
              Studio v2.0
            </span>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-3 h-3" /> Event Logistics
            </label>
            
            <input 
              className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white focus:border-orange-500 outline-none transition-all placeholder:text-slate-600"
              placeholder="Event Title (e.g. Neon Nights 2024)"
              value={title} onChange={e => setTitle(e.target.value)}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input 
                  className="w-full bg-slate-950 border border-slate-700 p-3 pl-9 rounded-xl text-white text-sm focus:border-orange-500 outline-none"
                  placeholder="Date & Time"
                  value={date} onChange={e => setDate(e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input 
                  className="w-full bg-slate-950 border border-slate-700 p-3 pl-9 rounded-xl text-white text-sm focus:border-orange-500 outline-none"
                  placeholder="Venue City"
                  value={location} onChange={e => setLocation(e.target.value)}
                />
              </div>
            </div>

            <textarea 
              className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white text-sm h-20 resize-none focus:border-orange-500 outline-none" 
              placeholder="Key details, special guests, or tagline..."
              value={description} onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="w-full h-px bg-slate-800" />

          {/* Design Controls */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <LayoutTemplate className="w-3 h-3" /> Design Matrix
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 mb-1 block">Aesthetic</span>
                <select 
                  className="w-full bg-slate-950 border border-slate-700 p-2 rounded-lg text-white text-sm focus:border-orange-500 outline-none"
                  value={selectedVibe.id}
                  onChange={(e) => setSelectedVibe(VIBES.find(v => v.id === e.target.value) || VIBES[0])}
                >
                  {VIBES.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 mb-1 block">Format</span>
                <select 
                  className="w-full bg-slate-950 border border-slate-700 p-2 rounded-lg text-white text-sm focus:border-orange-500 outline-none"
                  value={selectedFormat.id}
                  onChange={(e) => setSelectedFormat(FORMATS.find(f => f.id === e.target.value) || FORMATS[0])}
                >
                  {FORMATS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                </select>
              </div>
            </div>

            <button 
              onClick={() => setIncludeQr(!includeQr)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${includeQr ? 'bg-orange-500/10 border-orange-500/50 text-orange-200' : 'bg-slate-950 border-slate-700 text-slate-400'}`}
            >
              <span className="text-sm font-medium flex items-center gap-2"><Ticket className="w-4 h-4" /> Include RSVP QR Code</span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${includeQr ? 'bg-orange-500 border-orange-500' : 'border-slate-500'}`}>
                {includeQr && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
            </button>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !title}
            className={`
              w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all mt-2
              ${isGenerating ? 'bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-orange-900/20'}
            `}
          >
            {isGenerating ? <><RefreshCw className="w-5 h-5 animate-spin" /> {status || 'Processing...'}</> : <><Zap className="w-5 h-5" /> Ignite Design Core</>}
          </button>

        </div>
      </div>

      {/* RIGHT: VIEWPORT */}
      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl relative flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="h-14 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between px-6 backdrop-blur-md z-10">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Maximize2 className="w-4 h-4" />
            Preview Mode: <span className="text-white font-medium">{selectedFormat.label}</span>
          </div>
          <div className="flex gap-2">
             <button 
                disabled={!generatedHtml}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30"
                title="Print Design"
             >
               <Printer className="w-5 h-5" />
             </button>
             <button 
                disabled={!generatedHtml}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-30"
             >
               <Download className="w-4 h-4" /> Export
             </button>
             <button 
                disabled={!generatedHtml}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-30 shadow-lg shadow-orange-900/20"
             >
               <Share2 className="w-4 h-4" /> Share
             </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] bg-slate-900 flex items-center justify-center p-8 relative">
          
          {generatedHtml ? (
            <div 
              className={`relative shadow-2xl transition-all duration-500 ease-out bg-white overflow-hidden ${selectedFormat.width} ${selectedFormat.height}`}
              style={{ minHeight: 'fit-content' }} // Ensure content doesn't collapse
            >
               {/* We render the generated HTML inside an iframe to isolate styles */}
               <iframe 
                 srcDoc={getPreviewHtml()}
                 className="w-full h-full border-0 pointer-events-none select-none"
                 title="Flyer Preview"
               />
            </div>
          ) : (
            <div className="text-center max-w-md opacity-40">
              <div className="w-24 h-24 mx-auto border-2 border-dashed border-slate-600 rounded-2xl flex items-center justify-center mb-6">
                <ImageIcon className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-300 mb-2">Awaiting Schematics</h3>
              <p className="text-slate-500">
                Configure your event parameters in the Command Deck to initialize the design generation sequence.
              </p>
            </div>
          )}

          {/* Loading Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-t-2 border-orange-500 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-r-2 border-red-500 rounded-full animate-spin reverse"></div>
                <div className="absolute inset-4 border-b-2 border-yellow-500 rounded-full animate-spin"></div>
              </div>
              <div className="text-orange-400 font-mono text-sm animate-pulse">{status}</div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EventHorizon;