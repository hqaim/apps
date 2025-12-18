import React, { useState, useEffect } from 'react';
import { generateVideo } from '../../services/geminiService';
import { Video, Film, AlertCircle } from 'lucide-react';

const MotionAds: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    // Check if user has selected a key for Veo
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      window.aistudio.hasSelectedApiKey().then(setHasKey);
    } else {
      // Fallback if generic env key is present (for dev simulation)
      setHasKey(!!process.env.API_KEY); 
    }
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setVideoUrl('');
    try {
      const url = await generateVideo(prompt);
      setVideoUrl(url);
    } catch (e) {
      console.error(e);
      alert("Generation failed. Ensure you are using a Paid Project API Key for Veo.");
    } finally {
      setLoading(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Billing Required</h2>
        <p className="text-slate-400 mb-6">
          Veo video generation requires a paid Google Cloud Project API key. 
          Please select your key to continue.
        </p>
        <button 
          onClick={handleSelectKey}
          className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl"
        >
          Select Paid API Key
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] gap-6">
      <div className="w-full md:w-80 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex flex-col">
        <div className="flex items-center gap-2 mb-4 text-red-400">
          <Video className="w-5 h-5" />
          <h2 className="text-lg font-bold">Motion Ads (Veo)</h2>
        </div>
        <textarea 
          className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white h-40 mb-4 resize-none" 
          placeholder="Describe the video scene... (e.g., A cinematic drone shot of a futuristic car driving on a neon highway)"
          value={prompt} onChange={e => setPrompt(e.target.value)}
        />
        <button 
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 mt-auto flex justify-center items-center gap-2"
        >
          {loading ? 'Filming...' : <><Film className="w-4 h-4" /> Create Video</>}
        </button>
      </div>

      <div className="flex-1 bg-slate-900/30 border border-slate-800 rounded-2xl flex items-center justify-center p-4">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-slate-400 animate-pulse">Rendering Video (this may take a minute)...</p>
          </div>
        ) : videoUrl ? (
          <video 
            src={videoUrl} 
            controls 
            autoPlay 
            loop 
            className="max-w-full max-h-full rounded-lg shadow-2xl border border-slate-700"
          />
        ) : (
          <div className="text-slate-600 text-center">
            <Video className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Ready to generate 720p HD Video</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MotionAds;