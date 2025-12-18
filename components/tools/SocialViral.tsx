import React, { useState } from 'react';
import { generateCopy, generateImage, generateViralHooks } from '../../services/geminiService';
import { 
  Share2, 
  Image as ImageIcon, 
  Copy, 
  RefreshCw, 
  Zap, 
  TrendingUp, 
  Hash, 
  MessageCircle, 
  Heart, 
  Bookmark, 
  Send, 
  Linkedin, 
  Twitter, 
  Instagram, 
  MoreHorizontal, 
  Repeat2,
  BarChart3,
  Globe,
  Camera,
  Type,
  Layers
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// --- CONFIGURATION ---

const PLATFORMS = [
  { id: 'Instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4" />, color: 'text-pink-500', bg: 'from-purple-500 to-pink-500' },
  { id: 'LinkedIn', label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" />, color: 'text-blue-600', bg: 'from-blue-600 to-cyan-600' },
  { id: 'Twitter', label: 'X / Twitter', icon: <Twitter className="w-4 h-4" />, color: 'text-sky-500', bg: 'from-sky-500 to-blue-500' },
];

const TREND_NICHES = [
  { id: 'ai-tools', label: 'AI Tools', icon: '🤖', sub: 'Tech & SaaS' },
  { id: 'wealth-mindset', label: 'Wealth Mindset', icon: '💸', sub: 'Finance' },
  { id: 'biohacking', label: 'Biohacking', icon: '🧬', sub: 'Health' },
  { id: 'solopreneur', label: 'Solopreneur', icon: '🚀', sub: 'Business' },
  { id: 'minimalism', label: 'Digital Nomad', icon: '🌏', sub: 'Lifestyle' },
  { id: 'coding', label: 'No-Code Dev', icon: '💻', sub: 'Coding' },
];

const VISUAL_STYLES = [
  { id: 'cinematic', label: 'Cinematic Portrait', icon: <Camera className="w-3 h-3"/>, prompt: 'Cinematic photography, 85mm lens, f/1.8, bokeh, dramatic lighting, high detail, 4k' },
  { id: '3d-render', label: '3D Glossy Render', icon: <Layers className="w-3 h-3"/>, prompt: '3D Blender render, isometric, glossy materials, vibrant studio lighting, octane render, abstract shapes' },
  { id: 'neon-cyber', label: 'Neon Cyberpunk', icon: <Zap className="w-3 h-3"/>, prompt: 'Cyberpunk aesthetic, neon pink and blue lights, dark background, futuristic city vibes, glitch effect' },
  { id: 'minimal', label: 'Swiss Minimalist', icon: <Type className="w-3 h-3"/>, prompt: 'Swiss minimalist design, plenty of whitespace, bold typography elements, geometric shapes, pastel colors' },
];

const VIBES = [
  { id: 'Controversial', label: 'Controversial 🌶️' },
  { id: 'Value-Packed', label: 'Value Stack 💡' },
  { id: 'Storytelling', label: 'Vulnerable Story 📖' },
  { id: 'Meme', label: 'Relatable / Meme 😂' },
  { id: 'Contrarian', label: 'Contrarian Take 🛑' },
];

const SocialViral: React.FC = () => {
  // Strategy State
  const [platform, setPlatform] = useState('Instagram');
  const [activeNiche, setActiveNiche] = useState<string | null>(null);
  const [visualStyle, setVisualStyle] = useState(VISUAL_STYLES[0]);
  const [customTopic, setCustomTopic] = useState('');
  const [vibe, setVibe] = useState('Value-Packed');
  
  // Content State
  const [generatedHooks, setGeneratedHooks] = useState<string[]>([]);
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState('');
  
  // Loading State
  const [loadingHooks, setLoadingHooks] = useState(false);
  const [generatingPost, setGeneratingPost] = useState(false);

  // --- ACTIONS ---

  const handleFetchHooks = async (nicheId: string) => {
    setActiveNiche(nicheId);
    setLoadingHooks(true);
    setGeneratedHooks([]);
    setCustomTopic(''); // Clear custom topic when selecting niche
    try {
      const nicheLabel = TREND_NICHES.find(n => n.id === nicheId)?.label || nicheId;
      const hooks = await generateViralHooks(nicheLabel, platform);
      setGeneratedHooks(hooks);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingHooks(false);
    }
  };

  const handleGeneratePost = async () => {
    if (!customTopic) return;

    setGeneratingPost(true);
    setPostText(''); 
    
    try {
      const nicheLabel = activeNiche ? TREND_NICHES.find(n => n.id === activeNiche)?.label : 'General';
      const currentPlat = PLATFORMS.find(p => p.id === platform);
      
      // Advanced Prompt Engineering for "Viral" Quality
      const textPrompt = `
        Create a VIRAL ${platform} post about: "${customTopic}".
        Context: The niche is ${nicheLabel}.
        Vibe: ${vibe}.
        
        CRITICAL RULES for ${platform.toUpperCase()}:
        ${platform === 'Instagram' ? '- Structure: Hook (Line 1), Value/Story (Body), CTA (End). Use 5-10 relevant hashtags.' : ''}
        ${platform === 'LinkedIn' ? '- Use "Bro-etry" formatting (one sentence per line). Focus on "Lesson Learned" or "Professional Insight". End with "Thoughts?".' : ''}
        ${platform === 'Twitter' ? '- Keep it under 280 characters OR format as the first tweet of a Thread (e.g., "1/5"). Punchy, short sentences.' : ''}
        
        TONE: High energy, authoritative, yet relatable.
      `;

      // Visual Prompt with Style Injection
      const imagePrompt = `
        Editorial quality social media visual for topic: "${customTopic}".
        Style: ${visualStyle.prompt}.
        Composition: ${platform === 'Twitter' ? 'Wide 16:9, cinematic' : 'Square 1:1, focused subject'}.
        Vibe: ${vibe}.
        NO TEXT IN IMAGE.
      `;

      const [text, img] = await Promise.all([
        generateCopy(platform + ' Post', customTopic, vibe, 'Viral Structure', nicheLabel),
        generateImage(imagePrompt, platform === 'Twitter' ? '16:9' : '1:1')
      ]);

      setPostText(text);
      setPostImage(img);

    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingPost(false);
    }
  };

  return (
    <div className="h-full flex flex-col xl:flex-row gap-6">
      
      {/* LEFT: STRATEGY DECK */}
      <div className="w-full xl:w-[480px] flex flex-col gap-4 overflow-y-auto pr-2 pb-20">
        
        {/* Header */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="relative z-10">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
               <Zap className="w-5 h-5 text-purple-400" /> Viral Lab
             </h2>
             <p className="text-xs text-slate-400 mt-1">Trend Hunter & Content Architect</p>
           </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-6">
          
          {/* Platform Switcher */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Target Platform</label>
            <div className="grid grid-cols-3 gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`
                    flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all
                    ${platform === p.id 
                      ? `bg-slate-800 border-slate-600 text-white shadow-lg` 
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-900'}
                  `}
                >
                  <div className={`${platform === p.id ? p.color : 'opacity-50'}`}>{p.icon}</div>
                  <span className="text-xs font-medium">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Trend Pulse */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-emerald-500" /> Trend Pulse
              </label>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 animate-pulse">
                Live High Volume
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {TREND_NICHES.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleFetchHooks(n.id)}
                  className={`
                    text-left p-3 rounded-xl border transition-all relative overflow-hidden
                    ${activeNiche === n.id 
                      ? 'bg-purple-600/10 border-purple-500 text-white' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}
                  `}
                >
                  <span className="text-xl block mb-1">{n.icon}</span>
                  <span className="text-[10px] font-bold block">{n.label}</span>
                  <span className="text-[9px] opacity-60 block">{n.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hook Selection */}
          {loadingHooks ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <div key={i} className="h-10 bg-slate-800 rounded-lg animate-pulse"></div>)}
            </div>
          ) : generatedHooks.length > 0 && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select a Hook</label>
              {generatedHooks.map((hook, idx) => (
                <button
                  key={idx}
                  onClick={() => setCustomTopic(hook)}
                  className={`
                    w-full text-left p-3 rounded-lg border text-sm transition-all
                    ${customTopic === hook 
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-100' 
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-indigo-500/50'}
                  `}
                >
                  "{hook}"
                </button>
              ))}
            </div>
          )}

          {/* Custom Topic Input */}
          <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Core Topic / Hook</label>
             <textarea 
               value={customTopic}
               onChange={(e) => setCustomTopic(e.target.value)}
               placeholder="E.g. 5 AI tools that will replace your marketing agency..."
               className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-none min-h-[80px]"
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
             {/* Vibe */}
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tone</label>
                <select 
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 p-2.5 rounded-xl text-white text-sm focus:border-purple-500 outline-none"
                >
                  {VIBES.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                </select>
             </div>
             {/* Visual Style */}
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visual Aesthetic</label>
                <select 
                  value={visualStyle.id}
                  onChange={(e) => setVisualStyle(VISUAL_STYLES.find(s => s.id === e.target.value) || VISUAL_STYLES[0])}
                  className="w-full bg-slate-950 border border-slate-700 p-2.5 rounded-xl text-white text-sm focus:border-purple-500 outline-none"
                >
                  {VISUAL_STYLES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
             </div>
          </div>

          <button
            onClick={handleGeneratePost}
            disabled={generatingPost || !customTopic}
            className={`
              w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all
              ${generatingPost 
                ? 'bg-slate-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-purple-900/20'}
            `}
          >
            {generatingPost ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            {generatingPost ? 'Crafting Viral Asset...' : 'Generate Content'}
          </button>

        </div>
      </div>

      {/* RIGHT: DEVICE SIMULATOR */}
      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-4 lg:p-8">
        
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>

        {!postText && !generatingPost ? (
          <div className="text-center max-w-sm relative z-10 opacity-50">
            <div className="w-24 h-24 mx-auto bg-slate-900 rounded-3xl flex items-center justify-center mb-6 ring-1 ring-slate-800 rotate-6 shadow-2xl">
              <Share2 className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">Device Simulator Ready</h3>
            <p className="text-sm text-slate-500">Select your platform and trend on the left. We'll generate a high-fidelity preview of your viral post.</p>
          </div>
        ) : (
          <div className="w-full max-w-[400px] animate-in slide-in-from-bottom-8 duration-700 relative z-10">
            
            {/* Phone Bezel */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 ring-4 ring-slate-800">
              
              {/* --- INSTAGRAM SIMULATOR --- */}
              {platform === 'Instagram' && (
                <div className="text-slate-900">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]">
                          <div className="w-full h-full rounded-full bg-white p-[2px]">
                             <img src="https://i.pravatar.cc/150?u=a" className="w-full h-full rounded-full object-cover" />
                          </div>
                       </div>
                       <span className="text-xs font-semibold">hqaim.apps</span>
                    </div>
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                  </div>
                  
                  {/* Image */}
                  <div className="aspect-square bg-slate-100 relative flex items-center justify-center overflow-hidden">
                    {generatingPost && !postImage ? (
                      <div className="flex flex-col items-center gap-2 text-purple-600">
                         <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <img src={postImage} className="w-full h-full object-cover" />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="px-4 py-3">
                    <div className="flex justify-between mb-3">
                       <div className="flex gap-4 text-slate-800">
                         <Heart className="w-6 h-6 hover:text-red-500 cursor-pointer" />
                         <MessageCircle className="w-6 h-6" />
                         <Send className="w-6 h-6" />
                       </div>
                       <Bookmark className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold mb-2">12,405 likes</div>
                    <div className="text-xs space-y-1">
                      <span className="font-bold mr-1">hqaim.apps</span>
                      {generatingPost ? <span className="text-gray-400 italic">Writing caption...</span> : (
                        <span className="text-gray-800 leading-snug whitespace-pre-wrap">{postText.slice(0, 150)}... <span className="text-gray-400">more</span></span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* --- LINKEDIN SIMULATOR --- */}
              {platform === 'LinkedIn' && (
                <div className="bg-[#F3F2EF] text-slate-900 min-h-[500px]">
                  {/* Header */}
                  <div className="bg-white px-4 py-3 flex gap-3 border-b border-gray-200">
                    <img src="https://i.pravatar.cc/150?u=a" className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="text-sm font-bold flex items-center gap-1">HQAIM Apps <span className="text-gray-400 font-normal text-xs">• 1st</span></div>
                      <div className="text-xs text-gray-500">Viral Content Architect</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">1h • <Globe className="w-3 h-3" /></div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="bg-white px-4 py-2 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                     {generatingPost ? (
                       <div className="space-y-2 py-4">
                         <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                         <div className="h-2 bg-gray-200 rounded w-full"></div>
                         <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                       </div>
                     ) : (
                       <div className="line-clamp-[8]">{postText}</div>
                     )}
                  </div>

                  {/* Image */}
                  {!generatingPost && postImage && (
                    <div className="bg-white pb-2">
                       <img src={postImage} className="w-full h-auto object-cover border-t border-gray-100" />
                    </div>
                  )}

                  {/* Footer */}
                  <div className="bg-white px-4 py-3 border-t border-gray-200 flex justify-between text-gray-500">
                    <div className="flex items-center gap-1"><div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white">👍</div> <span className="text-xs">438</span></div>
                    <span className="text-xs">42 comments</span>
                  </div>
                </div>
              )}

              {/* --- TWITTER SIMULATOR --- */}
              {platform === 'Twitter' && (
                <div className="bg-black text-white p-4 min-h-[400px]">
                   <div className="flex gap-3">
                      <img src="https://i.pravatar.cc/150?u=a" className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                         <div className="flex items-center gap-1 mb-1">
                            <span className="font-bold text-sm">HQAIM Apps</span>
                            <span className="text-slate-500 text-sm">@hqaim.apps • 2h</span>
                         </div>
                         <div className="text-[15px] leading-normal whitespace-pre-wrap mb-3">
                           {generatingPost ? <span className="text-slate-500 animate-pulse">Drafting tweet...</span> : postText}
                         </div>
                         {postImage && !generatingPost && (
                           <div className="rounded-xl overflow-hidden border border-slate-800 mb-3">
                             <img src={postImage} className="w-full h-auto" />
                           </div>
                         )}
                         <div className="flex justify-between text-slate-500 text-xs pr-8">
                            <div className="flex items-center gap-1 hover:text-blue-400"><MessageCircle className="w-4 h-4" /> 24</div>
                            <div className="flex items-center gap-1 hover:text-green-400"><Repeat2 className="w-4 h-4" /> 12</div>
                            <div className="flex items-center gap-1 hover:text-pink-400"><Heart className="w-4 h-4" /> 182</div>
                            <div className="flex items-center gap-1 hover:text-blue-400"><BarChart3 className="w-4 h-4" /> 2.4k</div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

            </div>

            {/* Actions */}
            {postText && !generatingPost && (
              <div className="mt-6 flex justify-center gap-3">
                <button 
                  onClick={() => navigator.clipboard.writeText(postText)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
                >
                  <Copy className="w-3 h-3" /> Copy Text
                </button>
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = postImage;
                    link.download = `social-viral-${Date.now()}.png`;
                    link.click();
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
                >
                  <ImageIcon className="w-3 h-3" /> Save Image
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default SocialViral;