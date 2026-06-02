import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Building, Terminal, Eye, HelpCircle } from 'lucide-react';
import { Company } from '../types';
import { mockCompanies } from '../data/mockData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string, companyId?: string) => void;
  onAddRecentlyViewed: (company: Company) => void;
  recentlyViewed: Company[];
}

export default function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onAddRecentlyViewed,
  recentlyViewed,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter systems
  const filteredCompanies = query
    ? mockCompanies.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.ticker.toLowerCase().includes(query.toLowerCase()) ||
          c.sector.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const quickActions = [
    { id: 'act-screen', title: 'Run Core Screener', desc: 'Sift NSE/BSE by custom rules', route: '/analysis' },
    { id: 'act-val', title: 'Open Valuation Workbench', desc: 'Build dynamic DCF and comparables', route: '/valuation' },
    { id: 'act-qp', title: 'Generate AI Pre-Call Questions', desc: 'Create custom analyst question packs', route: '/questions' },
    { id: 'act-validation', title: 'Run AI Validation Engine', desc: 'Analyze narrative discrepancies & filing gaps', route: '/validation' },
  ].filter((act) => !query || act.title.toLowerCase().includes(query.toLowerCase()));

  // Items combination
  const searchResults: { type: 'company' | 'action'; id: string; label: string; desc: string; extra?: string; value: string }[] = [];

  filteredCompanies.forEach((company) => {
    searchResults.push({
      type: 'company',
      id: company.id,
      label: `${company.ticker} — ${company.name}`,
      desc: company.sector,
      extra: company.exchange,
      value: company.id,
    });
  });

  quickActions.forEach((act) => {
    searchResults.push({
      type: 'action',
      id: act.id,
      label: act.title,
      desc: act.desc,
      value: act.route,
    });
  });

  const hasResults = searchResults.length > 0;
  const listToRender = hasResults ? searchResults : [];

  const handleSelect = (item: typeof searchResults[0]) => {
    if (item.type === 'company') {
      const found = mockCompanies.find(c => c.id === item.value);
      if (found) onAddRecentlyViewed(found);
      onNavigate(`/companies/${item.value}`, item.value);
    } else {
      onNavigate(item.value);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (listToRender.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (listToRender.length || 1)) % (listToRender.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (listToRender[selectedIndex]) {
        handleSelect(listToRender[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-50 flex items-start justify-center pt-24 px-4">
      <div
        id="cmd-palette-box"
        ref={containerRef}
        onKeyDown={handleKeyDown}
        className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="flex items-center px-4 border-b border-neutral-800">
          <Search className="text-neutral-500 w-5 h-5 mr-3 shrink-0" />
          <input
            id="cmd-palette-input"
            ref={inputRef}
            type="text"
            placeholder="Search tickers, companies, sectors, or type quick actions..."
            className="w-full py-4 bg-transparent text-neutral-100 outline-hidden font-sans text-base placeholder-neutral-500"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-sm border border-neutral-700">
            Esc
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {query === '' ? (
            <div>
              {recentlyViewed.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-1.5 text-xs font-mono font-medium text-neutral-500 uppercase tracking-widest">
                    Recently Viewed
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {recentlyViewed.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onNavigate(`/companies/${c.id}`, c.id);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-neutral-800/60 transition-colors text-left"
                      >
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 text-neutral-400 mr-2.5" />
                          <div>
                            <div className="text-sm font-medium text-neutral-200">
                              {c.ticker} <span className="text-neutral-400 font-normal">— {c.name}</span>
                            </div>
                            <div className="text-xs text-neutral-500">{c.sector}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono bg-neutral-800 border border-neutral-700 px-1.5 py-0.5 rounded text-neutral-400">
                          {c.exchange}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="px-3 py-1.5 text-xs font-mono font-medium text-neutral-500 uppercase tracking-widest">
                  Quick Actions
                </div>
                <div className="mt-1 space-y-0.5">
                  {quickActions.map((act, index) => {
                    const isSelected = listToRender.length === 0 && index === selectedIndex;
                    return (
                      <button
                        key={act.id}
                        onClick={() => {
                          onNavigate(act.route);
                          onClose();
                        }}
                        className={`w-full flex items-center text-left px-3 py-2.5 rounded-xl transition-colors ${
                          isSelected ? 'bg-blue-600/10 border-blue-500/20 text-neutral-100' : 'hover:bg-neutral-800/60'
                        }`}
                      >
                        <Terminal className="w-4 h-4 text-sky-400 mr-2.5 shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-neutral-200">{act.title}</div>
                          <div className="text-xs text-neutral-500">{act.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : listToRender.length > 0 ? (
            <div className="space-y-0.5">
              {listToRender.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl transition-colors ${
                      isSelected ? 'bg-blue-600 text-white' : 'hover:bg-neutral-800/60'
                    }`}
                  >
                    <div className="flex items-center">
                      {item.type === 'company' ? (
                        <Building className={`w-4.5 h-4.5 mr-2.5 shrink-0 ${isSelected ? 'text-white' : 'text-neutral-400'}`} />
                      ) : (
                        <Sparkles className={`w-4.5 h-4.5 mr-2.5 shrink-0 ${isSelected ? 'text-white' : 'text-amber-400'}`} />
                      )}
                      <div>
                        <div className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-neutral-100'}`}>
                          {item.label}
                        </div>
                        <div className={`text-xs ${isSelected ? 'text-blue-100' : 'text-neutral-400'}`}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    {item.extra && (
                      <span className={`text-[10px] font-mono border px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-blue-700/50 border-blue-400 text-blue-100' : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                      }`}>
                        {item.extra}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-neutral-500">
              <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No matches found for "{query}"</p>
              <p className="text-xs mt-1">Try specifying a ticker like "RELIANCE" or "TCS"</p>
            </div>
          )}
        </div>

        <div className="border-t border-neutral-800/80 px-4 py-3 bg-neutral-950/40 flex justify-between items-center text-[11px] font-mono text-neutral-500">
          <div className="flex items-center gap-3">
            <span><kbd className="bg-neutral-800 px-1 py-0.5 rounded text-neutral-400">↑↓</kbd> Navigate</span>
            <span><kbd className="bg-neutral-800 px-1 py-0.5 rounded text-neutral-400">Enter</kbd> Select</span>
          </div>
          <span>InvestIQ Global Search (NSE/BSE)</span>
        </div>
      </div>
    </div>
  );
}
