import { useState, useEffect } from 'react';
import { Search, Bell, Sparkles, User, Calendar, Clock, ArrowRight, ShieldAlert, Sun, Moon } from 'lucide-react';
import { Company, SavedScreen } from './types';
import { mockCompanies, DEFAULT_SAVED_SCREENS } from './data/mockData';

// Modular supporting components
import Sidebar from './components/Sidebar';
import CommandPalette from './components/CommandPalette';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import CompaniesPage from './components/CompaniesPage';
import CompanyDetail from './components/CompanyDetail';
import Screener from './components/Screener';
import ValidationEngine from './components/ValidationEngine';
import ValuationWorkbench from './components/ValuationWorkbench';
import UnitEconomics from './components/UnitEconomics';
import ResearchHub from './components/ResearchHub';
import QuestionEngine from './components/QuestionEngine';
import Reports from './components/Reports';
import ComparePage from './components/ComparePage';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('/dashboard');
  const [selectedCompanyId, setSelectedCompanyId] = useState('reliance');

  // Interactive Theme management (Dark Mode toggle matching professional platforms)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('investiq_theme');
    return saved !== 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('investiq_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Command Palette trigger
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Recently viewed trackers
  const [recentlyViewed, setRecentlyViewed] = useState<Company[]>([]);

  // Saved screens trackers
  const [savedScreens, setSavedScreens] = useState<SavedScreen[]>([]);

  // Clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Load recently viewed
    const localRV = localStorage.getItem('investiq_recent_viewed');
    if (localRV) {
      setRecentlyViewed(JSON.parse(localRV));
    } else {
      // pre-seed
      setRecentlyViewed([mockCompanies[0], mockCompanies[1]]);
    }

    // Load saved screens
    const localScreens = localStorage.getItem('investiq_saved_screens');
    if (localScreens) {
      setSavedScreens(JSON.parse(localScreens));
    } else {
      setSavedScreens(DEFAULT_SAVED_SCREENS);
      localStorage.setItem('investiq_saved_screens', JSON.stringify(DEFAULT_SAVED_SCREENS));
    }

    // Clock ticker
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddRecentlyViewed = (company: Company) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((c) => c.id !== company.id);
      const updated = [company, ...filtered].slice(0, 4); // max 4 items
      localStorage.setItem('investiq_recent_viewed', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSaveScreen = (newScreen: SavedScreen) => {
    setSavedScreens((prev) => {
      const updated = [newScreen, ...prev];
      localStorage.setItem('investiq_saved_screens', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteScreen = (id: string) => {
    setSavedScreens((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      localStorage.setItem('investiq_saved_screens', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLoadSavedScreen = (screen: SavedScreen) => {
    // Navigate straight to Screener and preset active screens
    setCurrentRoute('/analysis');
  };

  // Onboarding workflow routing executor
  const handleOnboardingAction = (step: number) => {
    if (step === 1) {
      setIsPaletteOpen(true);
    } else if (step === 2) {
      setCurrentRoute('/analysis');
    } else if (step === 3) {
      setCurrentRoute('/questions');
    }
  };

  const handleDeepLinkCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setCurrentRoute(`/companies/${companyId}`);
  };

  // Direct route dispatcher
  const renderActiveScreen = () => {
    if (currentRoute === '/dashboard') {
      return (
        <Dashboard
          onNavigateToCompany={handleDeepLinkCompany}
          onNavigateToRoute={setCurrentRoute}
          onLoadSavedScreen={handleLoadSavedScreen}
          savedScreens={savedScreens}
        />
      );
    } else if (currentRoute === '/companies') {
      return (
        <CompaniesPage
          onSelectCompany={handleDeepLinkCompany}
          onAddRecentlyViewed={handleAddRecentlyViewed}
        />
      );
    } else if (currentRoute.startsWith('/companies/')) {
      return (
        <CompanyDetail
          companyId={selectedCompanyId}
          onNavigateToTab={setCurrentRoute}
        />
      );
    } else if (currentRoute === '/analysis') {
      return (
        <Screener
          onNavigateToCompany={handleDeepLinkCompany}
          savedScreens={savedScreens}
          onSaveScreen={handleSaveScreen}
          onDeleteScreen={handleDeleteScreen}
        />
      );
    } else if (currentRoute === '/validation') {
      return <ValidationEngine />;
    } else if (currentRoute === '/valuation') {
      return <ValuationWorkbench onAddRecentlyViewed={handleAddRecentlyViewed} />;
    } else if (currentRoute === '/unit-economics') {
      return <UnitEconomics />;
    } else if (currentRoute === '/research') {
      return <ResearchHub onAddRecentlyViewed={handleAddRecentlyViewed} />;
    } else if (currentRoute === '/questions') {
      return <QuestionEngine onAddRecentlyViewed={handleAddRecentlyViewed} />;
    } else if (currentRoute === '/reports') {
      return <Reports />;
    } else if (currentRoute === '/compare') {
      return <ComparePage />;
    } else if (currentRoute === '/admin') {
      return <AdminPanel />;
    } else {
      return <div className="p-8 text-neutral-400">Loading module...</div>;
    }
  };

  const formattedUTC = currentTime.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row antialiased select-none pb-16 md:pb-0">
      {/* Dynamic responsive Navigation rail G12 */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={setCurrentRoute}
        openPalette={() => setIsPaletteOpen(true)}
      />

      <div className="flex-1 flex flex-col overflow-x-hidden min-h-screen">
        {/* Global sticky header */}
        <header className="h-16 border-b border-neutral-800 bg-neutral-900 px-6 shrink-0 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 max-w-lg">
            {/* Fake Search Bar triggering real palette-search (G1 CMD+K) */}
            <div
              onClick={() => setIsPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 w-full bg-neutral-950 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 rounded-xl cursor-pointer text-xs transition-colors"
            >
              <Search className="w-4 h-4 text-neutral-500 shrink-0" />
              <span className="text-neutral-500 font-sans flex-1 text-left">Search tickers, screens, models...</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-neutral-400 bg-neutral-800 px-1.5 rounded border border-neutral-700">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Real-time UTC timezone helper clock */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-neutral-450 text-neutral-400 bg-neutral-950 border border-neutral-850 px-3 py-1.5 rounded-xl">
              <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0 animate-pulse" />
              <span>{formattedUTC}</span>
            </div>

            {/* Dark/Light mode toggle switch (Bloomberg/Koyfin style) */}
            <button
              onClick={() => setIsDarkMode(prev => !prev)}
              className="p-2 ml-1 rounded-xl bg-neutral-950 hover:bg-neutral-900 text-neutral-450 transition-all flex items-center justify-center cursor-pointer"
              title="Toggle Theme"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-blue-600" />}
            </button>

            <div className="h-4 w-[1px] bg-neutral-800 hidden lg:block" />

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-600/12 border border-blue-500/25 flex items-center justify-center">
                <User className="h-4 w-4 text-blue-400" />
              </div>
              <span className="text-xs font-medium text-neutral-300 hidden sm:block">rocky952s (Analyst)</span>
            </div>
          </div>
        </header>

        {/* Primary Page Canvas */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          {renderActiveScreen()}
        </main>
      </div>

      {/* G1 — FLOATING PALETTE OVERLAY (keyboard control) */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onNavigate={setCurrentRoute}
        onAddRecentlyViewed={handleAddRecentlyViewed}
        recentlyViewed={recentlyViewed}
      />

      {/* G10 — Guided Onboarding Assistant tour (dismissable card) */}
      <Onboarding onStartAction={handleOnboardingAction} />
    </div>
  );
}
