import { useState, useEffect } from 'react';
import { Play, Save, Trash2, ShieldCheck, HelpCircle, ArrowUpRight, ArrowDownRight, FolderOpen, Sliders, Layers } from 'lucide-react';
import { Company, ScreenerFilter, SavedScreen } from '../types';
import { mockCompanies, METRIC_DEFINITIONS, DEFAULT_SAVED_SCREENS } from '../data/mockData';

interface ScreenerProps {
  onNavigateToCompany: (companyId: string) => void;
  savedScreens: SavedScreen[];
  onSaveScreen: (screen: SavedScreen) => void;
  onDeleteScreen: (id: string) => void;
}

export default function Screener({
  onNavigateToCompany,
  savedScreens,
  onSaveScreen,
  onDeleteScreen,
}: ScreenerProps) {
  // Configured filters state
  const [filters, setFilters] = useState<ScreenerFilter[]>([
    { metric: 'roce', operator: 'greater_than', value1: 15 },
  ]);
  const [selectedMetricKey, setSelectedMetricKey] = useState('roce');
  const [activeScreenId, setActiveScreenId] = useState<string | null>(null);

  // Results state
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>(mockCompanies);

  const [savingName, setSavingName] = useState('');
  const [savingDesc, setSavingDesc] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Group metrics
  const groupedMetrics = METRIC_DEFINITIONS.reduce((acc, def) => {
    if (!acc[def.group]) acc[def.group] = [];
    acc[def.group].push(def);
    return acc;
  }, {} as Record<string, typeof METRIC_DEFINITIONS>);

  // Compute filtered results
  const applyFilters = () => {
    let results = [...mockCompanies];

    filters.forEach((f) => {
      const def = METRIC_DEFINITIONS.find((m) => m.key === f.metric);
      if (!def) return;

      results = results.filter((company) => {
        const val = company[f.metric as keyof Company] as number;
        if (f.operator === 'greater_than') {
          return val >= f.value1;
        } else if (f.operator === 'less_than') {
          return val <= f.value1;
        } else if (f.operator === 'between') {
          return val >= f.value1 && val <= (f.value2 || f.value1);
        }
        return true;
      });
    });

    setFilteredCompanies(results);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const loadScreen = (screen: SavedScreen) => {
    setFilters(screen.filters);
    setActiveScreenId(screen.id);
  };

  const handleCreateFilter = () => {
    const existing = filters.find((f) => f.metric === selectedMetricKey);
    if (existing) return; // avoid duplicated metric configs
    setFilters((prev) => [...prev, { metric: selectedMetricKey, operator: 'greater_than', value1: 10 }]);
  };

  const handleUpdateFilter = (index: number, updated: Partial<ScreenerFilter>) => {
    setFilters((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updated };
      return copy;
    });
  };

  const handleRemoveFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
    setActiveScreenId(null);
  };

  const handleSaveScreen = () => {
    if (!savingName.trim()) return;
    const newScreen: SavedScreen = {
      id: `screen-${Date.now()}`,
      name: savingName,
      description: savingDesc || 'Custom filtered screen built by user',
      filters: [...filters],
    };

    onSaveScreen(newScreen);
    setSavingName('');
    setSavingDesc('');
    setShowSaveModal(false);
    setActiveScreenId(newScreen.id);
  };

  // Sparkline generator helper
  const renderMiniSparkline = (company: Company) => {
    // Collect the last 4 quarterly revenues in chronological order (Q1 FY25 to Q4 FY25)
    // Q1: 201100, Q2: 198900, Q3: 208300, Q4: 215400
    // Get quarters
    const quarters = company.financials.filter((f) => f.period.startsWith('Q')).reverse();
    if (quarters.length < 2) return <span className="text-neutral-500">N/A</span>;

    const values = quarters.map((q) => q.revenueCr);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    // Build SVG path
    const width = 64;
    const height = 18;
    const points = values
      .map((val, i) => {
        const x = (i / (values.length - 1)) * (width - 4) + 2;
        const y = height - ((val - minVal) / range) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(' ');

    const trendColor = values[values.length - 1] >= values[0] ? '#10b981' : '#ef4444';

    return (
      <div className="flex items-center gap-2">
        <svg width={width} height={height} className="overflow-visible">
          <polyline
            fill="none"
            stroke={trendColor}
            strokeWidth="1.5"
            points={points}
          />
          {/* endpoints dots */}
          <circle cx={(values.length - 1) / (values.length - 1) * (width - 4) + 2} cy={height - ((values[values.length - 1] - minVal) / range) * (height - 4) - 2} r="2" fill={trendColor} />
        </svg>
        <span className="text-[10px] font-mono flex items-center">
          {values[values.length - 1] >= values[0] ? (
            <ArrowUpRight className="w-3 h-3 text-emerald-500 shrink-0" />
          ) : (
            <ArrowDownRight className="w-3 h-3 text-red-500 shrink-0" />
          )}
        </span>
      </div>
    );
  };

  return (
    <div id="screener-screen" className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-linear-to-r from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-500" />
            Screener Engine
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Build rule-based queries on Indian equity data to find companies that meet your investment criteria.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {savedScreens.map((screen) => (
            <button
              key={screen.id}
              onClick={() => loadScreen(screen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                activeScreenId === screen.id
                  ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-300'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              {screen.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filter Selection Panel */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-6 lg:col-span-1">
          <div>
            <h3 className="text-sm font-semibold text-neutral-200">Rule Constructor</h3>
            <p className="text-xs text-neutral-500 mt-1">Create composite conditions across fundamental categories</p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider">Select Fundamental Metric</label>
            <div className="flex gap-2">
              <select
                id="metric-picker-select"
                value={selectedMetricKey}
                onChange={(e) => setSelectedMetricKey(e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-800 text-neutral-250 text-xs rounded-xl p-2.5 focus:border-blue-500 focus:outline-hidden"
              >
                {Object.entries(groupedMetrics).map(([group, list]) => (
                  <optgroup key={group} label={group} className="bg-neutral-900 text-neutral-400 text-[11px]">
                    {list.map((def) => (
                      <option key={def.key} value={def.key} className="text-neutral-200 text-xs">
                        {def.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <button
                onClick={handleCreateFilter}
                className="px-4 bg-neutral-850 hover:bg-neutral-800 text-xs font-semibold text-neutral-250 border border-neutral-800 rounded-xl transition-colors quick-action-btn"
              >
                Add Rule
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <span className="block text-xs font-mono text-neutral-450 uppercase tracking-wider">Active Filters</span>
            {filters.length === 0 ? (
              <div className="p-4 border border-dashed border-neutral-800 rounded-xl text-center text-xs text-neutral-500">
                No active conditions. All companies listed.
              </div>
            ) : (
              <div className="space-y-3">
                {filters.map((f, index) => {
                  const def = METRIC_DEFINITIONS.find((m) => m.key === f.metric);
                  if (!def) return null;

                  return (
                    <div key={f.metric} className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2 relative group/item">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5 group">
                          {def.label}
                          <div className="relative inline-block">
                            <HelpCircle className="w-3.5 h-3.5 text-neutral-500 cursor-pointer hover:text-neutral-300" />
                            {/* Hover tooltip as per G4 */}
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-5 hidden group-hover:block w-48 p-2 bg-neutral-900 text-[10px] text-neutral-300 rounded border border-neutral-700 shadow-xl z-20 leading-relaxed font-normal">
                              {def.desc}
                            </div>
                          </div>
                        </span>
                        <button
                          onClick={() => handleRemoveFilter(index)}
                          className="text-neutral-500 hover:text-red-400 transition-colors"
                          title="Remove Rule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={f.operator}
                          onChange={(e) => handleUpdateFilter(index, { operator: e.target.value as any })}
                          className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-[11px] rounded-lg p-1.5 focus:outline-hidden"
                        >
                          <option value="greater_than">Greater Than (&gt;=)</option>
                          <option value="less_than">Less Than (&lt;=)</option>
                          <option value="between">Between</option>
                        </select>

                        <div className="flex gap-1.5 items-center">
                          <input
                            type="number"
                            step="0.1"
                            value={f.value1}
                            onChange={(e) => handleUpdateFilter(index, { value1: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs font-mono rounded-lg p-1.5 text-right placeholder-neutral-700 focus:outline-hidden"
                          />
                          {f.operator === 'between' && (
                            <>
                              <span className="text-[10px] text-neutral-500 font-mono">and</span>
                              <input
                                type="number"
                                step="0.1"
                                placeholder="Max"
                                value={f.value2 ?? ''}
                                onChange={(e) => handleUpdateFilter(index, { value2: parseFloat(e.target.value) || 0 })}
                                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs font-mono rounded-lg p-1.5 text-right placeholder-neutral-700 focus:outline-hidden"
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={applyFilters}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-xl transition-colors shadow-xs"
            >
              <Play className="w-3.5 h-3.5" />
              Apply Rules
            </button>

            <button
              onClick={() => setShowSaveModal(true)}
              className="px-3 bg-neutral-850 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 rounded-xl transition-colors"
              title="Save Current Screen"
            >
              <Save className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results list table G4 */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden lg:col-span-2 flex flex-col">
          <div className="px-5 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/20">
            <div>
              <h3 className="text-sm font-semibold text-neutral-200">Matching Equities</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Showing {filteredCompanies.length} Indian companies</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              NSE / BSE Database Live
            </div>
          </div>

          {filteredCompanies.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <p className="text-neutral-400 text-sm font-medium">No results match your active rules</p>
              <p className="text-neutral-500 text-xs mt-1 max-w-sm">
                Try widening your ROCE criteria or adjusting leverage ratios to return more Indian equities.
              </p>
              <button
                onClick={() => setFilters([{ metric: 'roce', operator: 'greater_than', value1: 10 }])}
                className="mt-4 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-xl transition-colors border border-neutral-700"
              >
                Reset to Default ROCE &gt; 10%
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table id="screener-results-table" className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-[10px] font-mono text-neutral-500 uppercase tracking-wider bg-neutral-950/40">
                    <th className="py-3 px-4">Company & Ticker</th>
                    <th className="py-3 px-4">Sector</th>
                    <th className="py-3 px-4 text-right">Price</th>
                    <th className="py-3 px-4 text-right">ROCE TTM</th>
                    <th className="py-3 px-4 text-right">P/E Ratio</th>
                    <th className="py-3 px-4 text-right">D/E Ratio</th>
                    <th className="py-3 px-4 text-center">Quarterly Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredCompanies.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => onNavigateToCompany(c.id)}
                      className="hover:bg-neutral-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="text-sm font-semibold text-neutral-150">{c.ticker}</div>
                        <div className="text-xs text-neutral-500 max-w-[150px] truncate">{c.name}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-neutral-300">
                        {c.sector}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-right text-neutral-200">
                        ₹{c.price.toLocaleString('en-IN')}
                      </td>
                      <td className={`py-3.5 px-4 text-xs font-mono text-right font-medium ${c.roce >= 30 ? 'text-emerald-500' : 'text-neutral-200'}`}>
                        {c.roce}%
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-right text-neutral-200">
                        {c.peTtm}x
                      </td>
                      <td className={`py-3.5 px-4 text-xs font-mono text-right text-neutral-200`}>
                        {c.debtToEquity}
                      </td>
                      <td className="py-3.5 px-4 flex justify-center">
                        {/* Quarterly Trend Micro Sparkline (G4) */}
                        {renderMiniSparkline(c)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Save Screen Modal Dialog */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-neutral-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-neutral-100">Save Technical Screen</h3>
            <p className="text-xs text-neutral-400">Save active rules as a persistent shortcut to your workspace.</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">SCREEN NAME</label>
                <input
                  type="text"
                  placeholder="e.g. Debt-Free Compounders"
                  value={savingName}
                  onChange={(e) => setSavingName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-100 outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">DESCRIPTION</label>
                <textarea
                  placeholder="Core methodology summary..."
                  value={savingDesc}
                  onChange={(e) => setSavingDesc(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-100 outline-hidden focus:border-blue-500 h-16"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-xs font-medium bg-neutral-850 hover:bg-neutral-800 text-neutral-450 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveScreen}
                disabled={!savingName.trim()}
                className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-50 transition-colors"
              >
                Save Shortcut
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
