import { useState, useRef, useEffect } from 'react';
import { Home, Building, ArrowRightLeft, Sliders, ShieldCheck, BookOpen, Sparkles, FileText, LayoutGrid, Menu, MoreHorizontal, Settings, HelpCircle } from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  openPalette: () => void;
}

export default function Sidebar({ currentRoute, onNavigate, openPalette }: SidebarProps) {
  const [showMoreMenuMobile, setShowMoreMenuMobile] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile popup if click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenuMobile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const coreRoutes = [
    { label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'Companies', icon: Building, path: '/companies' },
    { label: 'Compare Matrix', icon: ArrowRightLeft, path: '/compare' },
  ];

  const intelligenceRoutes = [
    { label: 'Screener Engine', icon: Sliders, path: '/analysis' },
    { label: 'Validation Engine', icon: ShieldCheck, path: '/validation' },
  ];

  const researchRoutes = [
    { label: 'Research Hub', icon: BookOpen, path: '/research' },
    { label: 'Question Engine', icon: Sparkles, path: '/questions' },
    { label: 'Reports Hub', icon: FileText, path: '/reports' },
  ];

  const valuationRoutes = [
    { label: 'DCF Workbench', icon: LayoutGrid, path: '/valuation' },
    { label: 'Unit Economics', icon: Settings, path: '/unit-economics' },
  ];

  const allAnalystRoutes = [...coreRoutes, ...intelligenceRoutes, ...researchRoutes, ...valuationRoutes];

  const renderActiveBorder = (path: string) => {
    return currentRoute === path || currentRoute.startsWith(path + '/')
      ? 'border-l-2 border-blue-500 bg-neutral-800 text-neutral-100 font-semibold'
      : 'text-neutral-450 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40 border-l-2 border-transparent';
  };

  return (
    <>
      {/* Desktop Sidebar (visible on screen md:flex) */}
      <aside className="hidden md:flex flex-col w-64 bg-neutral-900 border-r border-neutral-800 pb-6 shrink-0 h-screen sticky top-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('/dashboard')}>
            <div className="h-7 w-7 bg-blue-600 rounded-lg flex items-center justify-center font-black text-xs text-white">
              IQ
            </div>
            <span className="font-extrabold text-neutral-100 tracking-tight text-base font-sans select-none">
              InvestIQ
            </span>
          </div>

          <kbd className="text-[10px] font-mono border border-neutral-850 bg-neutral-950 text-neutral-500 px-1.5 py-0.5 rounded">
            Cmd+K
          </kbd>
        </div>

        {/* Scrollable Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* Section: Core */}
          <div className="space-y-1.5">
            <span className="block px-3 text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">
              Core Area
            </span>
            {coreRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <button
                  key={route.path}
                  onClick={() => onNavigate(route.path)}
                  className={`w-full text-left py-2 px-3 rounded-lg text-xs flex items-center gap-2.5 transition-all transition-duration-150 ${renderActiveBorder(route.path)}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{route.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section: Intelligence */}
          <div className="space-y-1.5 align-middle">
            <span className="block px-3 text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">
              Intelligence
            </span>
            {intelligenceRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <button
                  key={route.path}
                  onClick={() => onNavigate(route.path)}
                  className={`w-full text-left py-2 px-3 rounded-lg text-xs flex items-center gap-2.5 transition-all transition-duration-150 ${renderActiveBorder(route.path)}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{route.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section: Research */}
          <div className="space-y-1.5 align-middle">
            <span className="block px-3 text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">
              Research
            </span>
            {researchRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <button
                  key={route.path}
                  onClick={() => onNavigate(route.path)}
                  className={`w-full text-left py-2 px-3 rounded-lg text-xs flex items-center gap-2.5 transition-all transition-duration-150 ${renderActiveBorder(route.path)}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{route.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section: Valuation */}
          <div className="space-y-1.5 align-middle">
            <span className="block px-3 text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">
              Valuation Models
            </span>
            {valuationRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <button
                  key={route.path}
                  onClick={() => onNavigate(route.path)}
                  className={`w-full text-left py-2 px-3 rounded-lg text-xs flex items-center gap-2.5 transition-all transition-duration-150 ${renderActiveBorder(route.path)}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{route.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Desktop Footer redirection to Admin */}
        <div className="px-5 border-t border-neutral-800/80 pt-4 flex flex-col gap-2">
          <button
            onClick={() => onNavigate('/admin')}
            className={`w-full p-2.5 text-center text-[10px] font-semibold tracking-wider font-mono uppercase bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 rounded-lg text-neutral-400 block`}
          >
            Data Ops &amp; Admin Panel
          </button>
        </div>
      </aside>

      {/* G12: Mobile Bottom Navigation Bar (visible < 768px in responsive layout) */}
      <nav id="mobile-bottom-nav" className="flex md:hidden fixed bottom-0 left-0 right-0 h-16 bg-neutral-900 border-t border-neutral-800 px-4 justify-around items-center z-40 select-none">
        {/* 1. Dashboard */}
        <button
          onClick={() => onNavigate('/dashboard')}
          className={`flex flex-col items-center gap-1 text-[10px] ${
            currentRoute === '/dashboard' ? 'text-blue-500 font-bold' : 'text-neutral-500'
          }`}
        >
          <Home className="w-5 h-5 shrink-0" />
          <span>Dashboard</span>
        </button>

        {/* 2. Companies */}
        <button
          onClick={() => onNavigate('/companies')}
          className={`flex flex-col items-center gap-1 text-[10px] ${
            currentRoute.startsWith('/companies') ? 'text-blue-500 font-bold' : 'text-neutral-500'
          }`}
        >
          <Building className="w-5 h-5 shrink-0" />
          <span>Companies</span>
        </button>

        {/* 3. Analysis (Screener) */}
        <button
          onClick={() => onNavigate('/analysis')}
          className={`flex flex-col items-center gap-1 text-[10px] ${
            currentRoute === '/analysis' ? 'text-blue-500 font-bold' : 'text-neutral-500'
          }`}
        >
          <Sliders className="w-5 h-5 shrink-0" />
          <span>Screener</span>
        </button>

        {/* 4. Research */}
        <button
          onClick={() => onNavigate('/research')}
          className={`flex flex-col items-center gap-1 text-[10px] ${
            currentRoute === '/research' ? 'text-blue-500 font-bold' : 'text-neutral-500'
          }`}
        >
          <BookOpen className="w-5 h-5 shrink-0" />
          <span>Research</span>
        </button>

        {/* 5. More (Trigger Drawer) */}
        <button
          onClick={() => setShowMoreMenuMobile(prev => !prev)}
          className={`flex flex-col items-center gap-1 text-[10px] ${
            showMoreMenuMobile ? 'text-blue-500 font-bold' : 'text-neutral-500'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 shrink-0" />
          <span>More</span>
        </button>

        {/* Drawer overlay popup for More routing options on mobile */}
        {showMoreMenuMobile && (
          <div
            id="mobile-more-menu-panel"
            ref={moreMenuRef}
            className="absolute bottom-[66px] right-4 bg-neutral-900 border border-neutral-800 rounded-2xl w-56 p-2 space-y-0.5 shadow-2xl z-50 flex flex-col"
          >
            <button
              onClick={() => {
                onNavigate('/compare');
                setShowMoreMenuMobile(false);
              }}
              className="text-left py-2.5 px-3 text-xs text-neutral-200 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4 text-blue-500" /> Compare Companies
            </button>
            <button
              onClick={() => {
                onNavigate('/valuation');
                setShowMoreMenuMobile(false);
              }}
              className="text-left py-2.5 px-3 text-xs text-neutral-200 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
            >
              <LayoutGrid className="w-4 h-4 text-emerald-500" /> DCF Valuation
            </button>
            <button
              onClick={() => {
                onNavigate('/validation');
                setShowMoreMenuMobile(false);
              }}
              className="text-left py-2.5 px-3 text-xs text-neutral-200 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" /> Validation Engine
            </button>
            <button
              onClick={() => {
                onNavigate('/questions');
                setShowMoreMenuMobile(false);
              }}
              className="text-left py-2.5 px-3 text-xs text-neutral-200 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-sky-450 text-sky-400" /> Question Engine
            </button>
            <button
              onClick={() => {
                onNavigate('/unit-economics');
                setShowMoreMenuMobile(false);
              }}
              className="text-left py-2.5 px-3 text-xs text-neutral-200 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
            >
              <Settings className="w-4 h-4 text-pink-500" /> Unit Economics
            </button>
            <button
              onClick={() => {
                onNavigate('/reports');
                setShowMoreMenuMobile(false);
              }}
              className="text-left py-2.5 px-3 text-xs text-neutral-200 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-indigo-400" /> Reports Hub
            </button>
            <div className="h-[1px] bg-neutral-800 my-1" />
            <button
              onClick={() => {
                onNavigate('/admin');
                setShowMoreMenuMobile(false);
              }}
              className="text-left py-2.5 px-3 text-xs text-neutral-450 text-neutral-400 hover:bg-neutral-800 rounded-lg flex items-center gap-2 font-mono uppercase bg-neutral-950 font-semibold"
            >
              Data Ops / Admin
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
