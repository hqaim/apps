import React, { useState, useRef, useEffect } from 'react';
import { generateHtml, refineHtml } from '../../services/geminiService';
import { Layout, Globe, Code, Play, Box, Zap, Layers, ExternalLink, Eye, Edit3, Save, Sparkles, MessageSquare, Undo } from 'lucide-react';

const SiteArchitect: React.FC = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [theme, setTheme] = useState('Modern Tech');
  const [structure, setStructure] = useState('Modern Landing Page');
  const [hasThreeJs, setHasThreeJs] = useState(false);
  const [hasAnimations, setHasAnimations] = useState(true);
  
  // HTML State
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  
  // View/Edit State
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [isVisualEditMode, setIsVisualEditMode] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState('');

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // --- GENERATION HANDLERS ---
  const handleGenerate = async () => {
    if (!name || !desc) return;
    setLoading(true);
    setHtml(''); 
    setIsVisualEditMode(false);
    try {
      const result = await generateHtml('website', name, desc, theme, {
        hasThreeJs,
        hasAnimations,
        structure
      });
      setHtml(result);
    } catch (e) {
      console.error(e);
      setHtml('<div style="color:red; padding:20px; font-family:sans-serif;">Error generating website. Please try again.</div>');
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!refinePrompt || !html) return;
    setRefining(true);
    try {
      // First, get the current HTML from the iframe if in visual edit mode to save manual changes
      let currentCode = html;
      if (iframeRef.current && iframeRef.current.contentDocument) {
        currentCode = iframeRef.current.contentDocument.documentElement.outerHTML;
      }
      
      const refinedCode = await refineHtml(currentCode, refinePrompt);
      setHtml(refinedCode);
      setRefinePrompt('');
      setIsVisualEditMode(false); // Reset to view mode to render new changes cleanly
    } catch (e) {
      console.error(e);
    } finally {
      setRefining(false);
    }
  };

  // --- VISUAL EDIT LOGIC ---
  const toggleVisualEdit = () => {
    if (!iframeRef.current || !iframeRef.current.contentDocument) return;

    const doc = iframeRef.current.contentDocument;
    
    if (isVisualEditMode) {
      // SAVE: Extract HTML and update state
      const updatedHtml = doc.documentElement.outerHTML;
      setHtml(updatedHtml);
      setIsVisualEditMode(false);
    } else {
      // ENABLE: Inject Styles & Attributes
      const style = doc.createElement('style');
      style.id = 'editor-styles';
      style.innerHTML = `
        *[contenteditable="true"] { outline: 2px dashed #3b82f6; outline-offset: 2px; cursor: text; }
        *[contenteditable="true"]:focus { outline: 2px solid #2563eb; background: rgba(59, 130, 246, 0.1); }
      `;
      doc.head.appendChild(style);

      // Make text elements editable
      const textElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, li');
      textElements.forEach(el => {
        el.setAttribute('contenteditable', 'true');
      });

      setIsVisualEditMode(true);
    }
  };

  const openInNewTab = () => {
    if (!html) return;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col xl:flex-row xl:h-full gap-6">
      
      {/* LEFT PANEL: CONFIGURATION */}
      <div className="w-full xl:w-[380px] flex flex-col gap-6 xl:overflow-y-auto pr-2">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-5 h-full">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layout className="w-5 h-5 text-blue-400" />
              Site Architect <span className="text-xs bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">WYSIWYG</span>
            </h2>
            <p className="text-xs text-slate-400">Generate, Visualize, and Refine in real-time.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Identity</label>
              <input 
                className="w-full mt-2 bg-slate-950 border border-slate-700 p-3 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors" 
                placeholder="Project Name (e.g. Orbiter SaaS)"
                value={name} onChange={e => setName(e.target.value)}
              />
            </div>
            
            <div>
               <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Content Brief</label>
              <textarea 
                className="w-full mt-2 bg-slate-950 border border-slate-700 p-3 rounded-xl text-white h-24 focus:border-blue-500 focus:outline-none transition-colors resize-none" 
                placeholder="Describe the goal. (e.g. A portfolio for a 3D artist showcasing space renders)"
                value={desc} onChange={e => setDesc(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Theme</label>
                <select 
                  className="w-full mt-2 bg-slate-950 border border-slate-700 p-3 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  value={theme} onChange={e => setTheme(e.target.value)}
                >
                  <option>Modern Tech</option>
                  <option>Cyberpunk Neon</option>
                  <option>Minimalist Swiss</option>
                  <option>Luxury Serif</option>
                  <option>Organic & Clean</option>
                </select>
               </div>
               <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Layout</label>
                <select 
                  className="w-full mt-2 bg-slate-950 border border-slate-700 p-3 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  value={structure} onChange={e => setStructure(e.target.value)}
                >
                  <option>Modern Landing Page</option>
                  <option>Bento Grid (Trend)</option>
                  <option>Split Screen</option>
                  <option>Typographic Heavy</option>
                </select>
               </div>
            </div>

            <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50 space-y-3">
              <label className="text-xs font-semibold text-blue-300 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-3 h-3" /> Advanced Stack
              </label>
              
              <button 
                onClick={() => setHasThreeJs(!hasThreeJs)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${hasThreeJs ? 'bg-blue-500/20 border-blue-500/50 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Box className="w-4 h-4" /> 3D Elements (Three.js)
                </span>
                <div className={`w-4 h-4 rounded-full border ${hasThreeJs ? 'bg-blue-500 border-blue-500' : 'border-slate-500'}`}></div>
              </button>

              <button 
                onClick={() => setHasAnimations(!hasAnimations)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${hasAnimations ? 'bg-purple-500/20 border-purple-500/50 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Layers className="w-4 h-4" /> Scroll Animations (GSAP)
                </span>
                <div className={`w-4 h-4 rounded-full border ${hasAnimations ? 'bg-purple-500 border-purple-500' : 'border-slate-500'}`}></div>
              </button>
            </div>
          </div>

          <button 
            onClick={handleGenerate} 
            disabled={loading || !name}
            className={`
              w-full py-4 font-bold rounded-xl text-white shadow-lg flex items-center justify-center gap-2 transition-all mt-auto
              ${loading ? 'bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30 hover:-translate-y-0.5'}
            `}
          >
            {loading ? (
               <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Compiling 3D Assets...</>
            ) : (
               <><Play className="w-4 h-4" /> Initialize Build</>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT PANEL: WYSIWYG PREVIEW */}
      <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-2xl relative border border-slate-800 min-h-[600px] flex flex-col">
        
        {/* Editor Toolbar */}
        <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-20 shadow-md">
          <div className="flex items-center gap-3">
             {/* View Mode Toggle */}
             <div className="flex bg-slate-800 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <span className="flex items-center gap-2"><Eye className="w-3 h-3"/> Preview</span>
              </button>
              <button 
                onClick={() => { setViewMode('code'); setIsVisualEditMode(false); }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'code' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <span className="flex items-center gap-2"><Code className="w-3 h-3"/> Source</span>
              </button>
            </div>

            <div className="h-6 w-px bg-slate-700 mx-1"></div>

            {/* Visual Edit Toggle */}
            {viewMode === 'preview' && (
              <button 
                onClick={toggleVisualEdit}
                disabled={!html}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border
                  ${isVisualEditMode 
                    ? 'bg-green-500/10 border-green-500 text-green-400 animate-pulse' 
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'}
                `}
              >
                {isVisualEditMode ? <><Save className="w-3 h-3" /> Save Edits</> : <><Edit3 className="w-3 h-3" /> Visual Edit Mode</>}
              </button>
            )}
          </div>
          
          <button 
            onClick={openInNewTab}
            disabled={!html}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors disabled:opacity-30"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Open Fullscreen</span>
          </button>
        </div>

        {/* AI Refine Bar */}
        {html && viewMode === 'preview' && (
          <div className="bg-slate-800 border-b border-slate-700 p-2 flex gap-2 animate-in slide-in-from-top-2">
             <div className="flex-1 relative">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input 
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                  placeholder="Ask AI to tweak sections (e.g., 'Change the hero background to dark blue', 'Make the buttons rounder')..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-purple-500 focus:outline-none placeholder:text-slate-500"
                />
             </div>
             <button 
               onClick={handleRefine}
               disabled={refining || !refinePrompt}
               className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
             >
               {refining ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <MessageSquare className="w-4 h-4" />}
               Refine
             </button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 relative bg-slate-100 h-full">
          {html ? (
            viewMode === 'preview' ? (
              <>
                <iframe 
                  ref={iframeRef}
                  // We treat srcDoc as initial load. Updates are handled via setHtml which re-renders iframe
                  srcDoc={html} 
                  className="w-full h-full border-0 bg-white absolute inset-0" 
                  title="Preview" 
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation"
                />
                {isVisualEditMode && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg pointer-events-none animate-bounce z-50">
                    Visual Editing Active
                  </div>
                )}
              </>
            ) : (
              <pre className="w-full h-full overflow-auto p-4 text-xs font-mono bg-slate-950 text-slate-300 absolute inset-0">
                {html}
              </pre>
            )
          ) : (
            <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-slate-500">
              {loading ? (
                <div className="text-center animate-pulse">
                  <div className="w-20 h-20 mx-auto mb-6 relative">
                    <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <Box className="absolute inset-0 m-auto w-8 h-8 text-blue-500 animate-bounce" />
                  </div>
                  <h3 className="text-xl text-white font-medium mb-2">Generating Architecture</h3>
                  <p className="text-sm">Writing HTML • Configuring Tailwind • Injecting Three.js</p>
                </div>
              ) : (
                <div className="text-center max-w-sm px-6">
                  <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6 ring-1 ring-slate-700">
                    <Globe className="w-10 h-10 opacity-50 text-blue-400" />
                  </div>
                  <h3 className="text-lg text-white font-medium mb-2">Ready to Build</h3>
                  <p className="text-sm text-slate-400">
                    Configure your project on the left. Once built, use the <span className="text-blue-400">Visual Edit</span> button to click and type, or <span className="text-purple-400">AI Refine</span> to tweak sections.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteArchitect;