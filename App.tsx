import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LogoForge from './components/tools/LogoForge';
import SiteArchitect from './components/tools/SiteArchitect';
import CopyPro from './components/tools/CopyPro';
import PixelGen from './components/tools/PixelGen';
import EventHorizon from './components/tools/EventHorizon';
import SocialViral from './components/tools/SocialViral';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import { ToolId, ToolDefinition, User } from './types';
import { TOOLS, APP_NAME } from './constants';
import { Menu, Search, Bell, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<ToolId>(ToolId.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Auth & Credit State
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(true);

  // Helper to find current tool details
  const activeToolDef = TOOLS.find(t => t.id === activeToolId);

  // Dynamic Title Updating
  useEffect(() => {
    if (activeToolId === ToolId.DASHBOARD) {
      document.title = `${APP_NAME} | Generative AI Dashboard`;
    } else if (activeToolDef) {
      document.title = `${activeToolDef.name} - ${activeToolDef.description.split('.')[0]} | ${APP_NAME}`;
    }
  }, [activeToolId, activeToolDef]);

  // Auth Handlers
  const handleLogin = (email: string, name: string) => {
    // Simulating Backend Login
    setUser({
      id: 'usr_' + Date.now(),
      name: name,
      email: email,
      credits: 100, // Initial Free Credits
      isPro: false
    });
    setShowLogin(false);
  };

  const handleWatchAd = () => {
    // Simulating Ad Reward
    if (user) {
      setUser({ ...user, credits: user.credits + 50 });
    }
  };

  // Credit Deduction Logic
  // In a real app, this would be passed to tools or managed via Context
  const hasCredits = (cost: number) => (user?.credits || 0) >= cost;
  
  // NOTE: For this MVP, we are rendering components directly. 
  // Ideally, we'd pass `user` and `deductCredits` to every tool.
  // We will demonstrate this via PixelGen later, or assume tools check internal API which checks credits.

  const renderContent = () => {
    switch (activeToolId) {
      case ToolId.DASHBOARD:
        return <Dashboard onNavigate={setActiveToolId} />;
      case ToolId.LOGO_FORGE:
        return <LogoForge />;
      case ToolId.SITE_ARCHITECT:
        return <SiteArchitect />;
      case ToolId.COPY_PRO:
        return <CopyPro />;
      case ToolId.PIXEL_GEN:
        return <PixelGen />;
      case ToolId.EVENT_HORIZON:
        return <EventHorizon />;
      case ToolId.SOCIAL_VIRAL:
        return <SocialViral />;
      default:
        return <Dashboard onNavigate={setActiveToolId} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-inter">
      {/* Login Modal Overlay */}
      {showLogin && !user && <LoginModal onLogin={handleLogin} />}

      <Sidebar 
        activeTool={activeToolId} 
        onNavigate={setActiveToolId}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        user={user}
        onWatchAd={handleWatchAd}
      />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center text-sm text-slate-500 gap-2">
              <span className="hover:text-slate-300 cursor-pointer">Apps</span>
              <span>/</span>
              <span className="text-slate-200 font-medium">
                {activeToolId === ToolId.DASHBOARD ? 'Dashboard' : activeToolDef?.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search tools..." 
                className="w-64 bg-slate-900 border border-slate-800 rounded-full pl-10 pr-4 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-900"></span>
              </button>
              
              {user ? (
                <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {user.name.substring(0, 2)}
                  </div>
                  <span className="text-sm font-medium text-slate-300 hidden md:block pr-2">
                    {user.name}
                  </span>
                </button>
              ) : (
                <button 
                  onClick={() => setShowLogin(true)}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
                >
                  <UserIcon className="w-4 h-4" /> Login
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area Wrapper */}
        <div className="flex-1 overflow-y-auto bg-slate-950 scroll-smooth flex flex-col">
          {/* Content */}
          <div className="flex-1 p-4 lg:p-8 w-full max-w-[1920px] mx-auto">
            {renderContent()}
          </div>
          
          {/* Global Footer */}
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default App;