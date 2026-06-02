import { useState } from 'react';
import { Sparkles, Compass, Eye, TrendingUp, ChevronDown, ChevronUp, Bell, MapPin, Newspaper, CheckCircle, ArrowRightLeft, Landmark } from 'lucide-react';
import { Company, SavedScreen } from '../types';
import { mockCompanies, mockLeaderboard, mockNews } from '../data/mockData';

interface DashboardProps {
  onNavigateToCompany: (companyId: string) => void;
  onNavigateToRoute: (route: string) => void;
  onLoadSavedScreen: (screen: SavedScreen) => void;
  savedScreens: SavedScreen[];
}

export default function Dashboard({
  onNavigateToCompany,
  onNavigateToRoute,
  onLoadSavedScreen,
  savedScreens,
}: DashboardProps) {
  // Collapsible leaderboard state (G2: Collapsed by default)
  const [leaderboardExpanded, setLeaderboardExpanded] = useState(false);

  // Watchlisted companies
  const watchlisted = mockCompanies.slice(0, 3); // mock watchlist strip

  // Researched companies this week
  const researchedThisWeek = [
    { company: mockCompanies[0], date: 'Yesterday', summary: 'Energy margins steady, green hydrogen capex audited.' },
    { company: mockCompanies[1], date: 'May 28', summary: 'AI pipeline totals contract value of $1.2B.' },
  ];

  const signalBadgeStyles = {
    positive: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border border-amber-500/25',
    negative: 'bg-red-500/10 text-red-400 border border-red-500/20',
  };

  const signalLabels = {
    positive: 'Positive',
    warning: 'Anomaly Warning',
    negative: 'Negative Flag',
  };

  return (
    <div id="analyst-dashboard" className="space-y-6 animate-fade-in animate-duration-300">
      {/* Macro Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-neutral-800 bg-neutral-900 rounded-2xl p-4">
        <div className="flex items-center gap-3 border-r border-neutral-800 last:border-0 pr-4">
          <Landmark className="w-5 h-5 text-neutral-400 shrink-0" />
          <div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase">NIFTY 50 Index</span>
            <div className="text-sm font-semibold text-neutral-100 flex items-center gap-1.5 font-mono">
              21,840.15 <span className="text-xs text-emerald-500">+1.12%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-r border-neutral-800 last:border-0 pr-4 pl-0 sm:pl-4">
          <TrendingUp className="w-5 h-5 text-neutral-400 shrink-0" />
          <div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase">SENSEX Index</span>
            <div className="text-sm font-semibold text-neutral-100 flex items-center gap-1.5 font-mono">
              71,980.40 <span className="text-xs text-emerald-500">+0.95%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 last:border-0 pl-0 sm:pl-4">
          <Bell className="w-5 h-5 text-sky-400 shrink-0 animate-pulse" />
          <div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase font-sans">Active AI Auditing Alerts</span>
            <div className="text-sm font-semibold text-neutral-150 font-mono">
              6 anomalies detected (BSE)
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Watchlist Strip & Saved actions on Left, Sidebar metadata on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* G2: Watchlist Strip */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-neutral-250">Watchlist Intelligence Strip</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Your pinned companies with summarized AI signals</p>
              </div>

              <span className="text-[10px] font-mono text-neutral-500">3 Pinned Companies</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {watchlisted.map((co) => (
                <div
                  key={co.id}
                  onClick={() => onNavigateToCompany(co.id)}
                  className="bg-neutral-950/40 p-4 rounded-xl border border-neutral-850 hover:border-neutral-700 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-200">{co.ticker}</h4>
                      <span className="text-[10px] text-neutral-500 mt-0.5 max-w-[120px] block truncate">{co.name}</span>
                    </div>

                    <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${signalBadgeStyles[co.aiSignal]}`}>
                      {signalLabels[co.aiSignal]}
                    </span>
                  </div>

                  <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed bg-neutral-900/40 p-2 rounded-lg">
                    {co.aiSignalSummary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* G2: Saved Screens Shortcuts */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-[#f5f5f5] text-neutral-250">Saved Screener Shortcuts</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Quickly resume rules-based screening on NSE/BSE dataset</p>
              </div>

              <button
                onClick={() => onNavigateToRoute('/analysis')}
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-sans"
              >
                Create Screening <Compass className="w-3.5 h-3.5" />
              </button>
            </div>

            {savedScreens.length === 0 ? (
              <div className="p-8 border border-dashed border-neutral-800 rounded-xl text-center text-xs text-neutral-500">
                No screens saved yet → Run your first screen inside the Screener.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {savedScreens.map((screen) => (
                  <div
                    key={screen.id}
                    onClick={() => {
                      onLoadSavedScreen(screen);
                      onNavigateToRoute('/analysis');
                    }}
                    className="p-3.5 bg-neutral-950/40 border border-neutral-850 hover:border-neutral-700 rounded-xl cursor-pointer transition-all text-xs flex justify-between items-center"
                  >
                    <div>
                      <div className="font-semibold text-neutral-200">{screen.name}</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5 max-w-[210px] truncate">{screen.description}</div>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 border border-neutral-700 px-1.5 py-0.5 rounded">
                      {screen.filters.length} rules
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* G2: Researched Concalls This Week */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-250">In-Progress Research Tracker</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Companies you've researched this week with inline status</p>
            </div>

            <div className="space-y-3">
              {researchedThisWeek.map((item) => (
                <div
                  key={item.company.id}
                  onClick={() => onNavigateToCompany(item.company.id)}
                  className="p-3.5 bg-neutral-950/30 border border-neutral-850 hover:border-neutral-750 rounded-xl cursor-pointer transition-colors flex justify-between items-center gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-200">{item.company.ticker}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">• {item.date}</span>
                    </div>
                    <p className="text-neutral-400 text-[11px] max-w-md truncate">{item.summary}</p>
                  </div>

                  <span className="text-[10px] text-blue-400 font-semibold font-mono hover:underline">Resume Work</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: leaderboard and news */}
        <div className="space-y-6">
          {/* G2: Optional Leaderboard (Collapsed by default) */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => setLeaderboardExpanded(!leaderboardExpanded)}
              className="w-full flex justify-between items-center p-4 text-left hover:bg-neutral-850 transition-colors cursor-pointer"
            >
              <div>
                <h4 className="text-xs font-mono font-semibold text-neutral-400 tracking-wider">VALUATION LEADERBOARD</h4>
                <p className="text-[10px] text-neutral-500 mt-0.5">Calculated scoring matrices</p>
              </div>

              {leaderboardExpanded ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </button>

            {leaderboardExpanded && (
              <div className="border-t border-neutral-850 p-4 space-y-3 divide-y divide-neutral-850">
                {mockLeaderboard.map((item) => (
                  <div key={item.rank} className={`flex justify-between items-center text-xs ${item.rank > 1 ? 'pt-2.5' : ''}`}>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-neutral-500 w-3">#{item.rank}</span>
                      <div>
                        <div className="font-semibold text-neutral-200">{item.name}</div>
                        <div className="text-[10px] text-neutral-500">{item.label}</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-neutral-150">{item.score}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* News Feed */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase flex items-center gap-1.5"><Newspaper className="w-4 h-4 text-sky-400" /> Sector News Feed</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>

            <div className="space-y-3.5">
              {mockNews.map((news) => (
                <div key={news.id} className="space-y-1.5 text-xs">
                  <h5 className="font-semibold text-neutral-200 leading-snug cursor-pointer hover:text-stone-300">{news.title}</h5>
                  <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono">
                    <span>{news.source} • {news.time}</span>
                    <div className="flex gap-1">
                      {news.tickers.map(tk => (
                        <span key={tk} className="bg-neutral-950 px-1 rounded text-neutral-400 border border-neutral-850">{tk}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
