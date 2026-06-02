import { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { Search, X, Check, ArrowRightLeft, Layers, HelpCircle, LayoutGrid } from 'lucide-react';
import { Company } from '../types';
import { mockCompanies } from '../data/mockData';

export default function ComparePage() {
  // Slots stores up to 4 selected company IDs. Default pre-populates Reliance and TCS
  const [selectedIds, setSelectedIds] = useState<string[]>(['reliance', 'tcs']);
  // Time period toggle G8
  const [globalPeriod, setGlobalPeriod] = useState<'Latest' | 'FY24' | 'FY23'>('Latest');

  // Search autocomplete active selectors per slot indices
  const [openSelectorIndex, setOpenSelectorIndex] = useState<number | null>(null);
  const [selectorSearchQuery, setSelectorSearchQuery] = useState('');

  const handleRemoveSlot = (indexToRemove: number) => {
    setSelectedIds((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddSlotPlaceholder = () => {
    if (selectedIds.length >= 4) return;
    setSelectorSearchQuery('');
    setOpenSelectorIndex(selectedIds.length); // trigger selection menu
  };

  const handleSelectCompanyInSlot = (id: string, index: number) => {
    setSelectedIds((prev) => {
      const copy = [...prev];
      copy[index] = id;
      return copy;
    });
    setOpenSelectorIndex(null);
    setSelectorSearchQuery('');
  };

  // Companies details selected
  const activeCompanies = selectedIds
    .map(id => mockCompanies.find(c => c.id === id))
    .filter((c): c is Company => !!c);

  // Filter financial periods per selected company based on global period toggle G8
  const getPeriodFinancials = (company: Company) => {
    if (globalPeriod === 'Latest') {
      return company.financials[0]; // first quarterly index
    } else if (globalPeriod === 'FY24') {
      return company.financials.find(f => f.period === 'FY24') || company.financials[4];
    } else {
      return company.financials.find(f => f.period === 'FY23') || company.financials[5];
    }
  };

  // Build Radar Chart Data structures
  const radarData = [
    { subject: 'ROCE TTM', A: 0, B: 0, C: 0, D: 0, fullMark: 50 },
    { subject: 'Revenue CAGR', A: 0, B: 0, C: 0, D: 0, fullMark: 30 },
    { subject: 'Operating Margin', A: 0, B: 0, C: 0, D: 0, fullMark: 50 },
    { subject: 'Inverse P/E Multiple', A: 0, B: 0, C: 0, D: 0, fullMark: 50 },
    { subject: 'Inverse Leverage Ratio', A: 0, B: 0, C: 0, D: 0, fullMark: 100 },
  ];

  activeCompanies.forEach((company, index) => {
    const key = String.fromCharCode(65 + index) as 'A' | 'B' | 'C' | 'D'; // A, B, C, D
    const latestFin = getPeriodFinancials(company);

    radarData[0][key] = company.roce;
    radarData[1][key] = company.revenueCagr3Y;
    radarData[2][key] = latestFin?.operatingMargin || 15;
    // Scale P/E so lower PE shows higher intrinsic radar strength
    radarData[3][key] = Math.max(5, 50 - company.peTtm); 
    // Scale debt metrics
    radarData[4][key] = Math.max(10, 100 - (company.debtToEquity * 40));
  });

  const slotsIndexes = [0, 1, 2, 3];
  const chartColors = ['#2563eb', '#10b981', '#f59e0b', '#ec4899'];

  // Search filtered autocomplete suggestions
  const filterSuggestions = mockCompanies.filter(c => {
    const isAlreadySelected = selectedIds.includes(c.id);
    const matchesSearch = c.name.toLowerCase().includes(selectorSearchQuery.toLowerCase()) || 
                          c.ticker.toLowerCase().includes(selectorSearchQuery.toLowerCase());
    return !isAlreadySelected && matchesSearch;
  });

  return (
    <div id="compare-screen" className="space-y-6">
      {/* Top Banner with globally selector */}
      <div className="p-6 bg-linear-to-r from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-blue-500" />
            Relative Comparables Matrix
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Analyze historical trajectories and operational indicators across up to 4 Indian companies side-by-side.
          </p>
        </div>

        {/* Global period selector G8 */}
        <div className="flex bg-neutral-950 border border-neutral-800 p-1 rounded-xl shrink-0">
          {(['Latest', 'FY24', 'FY23'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setGlobalPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                globalPeriod === p
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {p === 'Latest' ? 'Latest Period' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Grid slots with dropdown autocomplete company selectors G8 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {slotsIndexes.map((slotIdx) => {
          const selectedCo = activeCompanies[slotIdx];
          const isSlotActive = !!selectedCo;
          const isMenuOpen = openSelectorIndex === slotIdx;

          return (
            <div
              key={slotIdx}
              className={`p-4 rounded-2xl border transition-all relative min-h-[140px] flex flex-col justify-between ${
                isSlotActive
                  ? 'bg-neutral-900 border-neutral-800'
                  : 'bg-neutral-950 border-neutral-900 border-dashed justify-center items-center p-8'
              }`}
            >
              {isSlotActive ? (
                <>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] font-mono bg-neutral-800 text-neutral-400 border border-neutral-700 px-1.5 py-0.5 rounded">
                        SLOT {slotIdx + 1} ({selectedCo.exchange})
                      </span>
                      <h3 className="text-base font-bold text-neutral-150 mt-2">{selectedCo.ticker}</h3>
                      <p className="text-xs text-neutral-500 max-w-[170px] truncate">{selectedCo.name}</p>
                    </div>

                    <button
                      onClick={() => handleRemoveSlot(slotIdx)}
                      className="text-neutral-500 hover:text-red-400 p-1 bg-neutral-950 border border-neutral-850 rounded-lg"
                      title="Clear comparative Slot"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-baseline pt-4 border-t border-neutral-850 text-xs">
                    <span className="text-neutral-500">ROCE TTM</span>
                    <span className="font-mono font-semibold text-neutral-200">{selectedCo.roce}%</span>
                  </div>
                </>
              ) : isMenuOpen ? (
                <div className="w-full space-y-2 text-left z-20">
                  <div className="flex items-center gap-1.5 bg-neutral-90 or border border-neutral-850 rounded-xl px-2 py-1">
                    <Search className="w-3.5 h-3.5 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Type ticker..."
                      value={selectorSearchQuery}
                      onChange={(e) => setSelectorSearchQuery(e.target.value)}
                      className="bg-transparent text-xs text-neutral-100 outline-hidden w-full placeholder-neutral-500 py-1"
                      autoFocus
                    />
                    <button onClick={() => setOpenSelectorIndex(null)}>
                      <X className="w-3 h-3 text-neutral-500" />
                    </button>
                  </div>

                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-h-36 overflow-y-auto divide-y divide-neutral-850 text-xs shadow-2xl absolute left-0 right-0 top-full mt-1">
                    {filterSuggestions.length === 0 ? (
                      <div className="p-3 text-neutral-500 text-center text-[11px]">No slots available</div>
                    ) : (
                      filterSuggestions.map((co) => (
                        <button
                          key={co.id}
                          onClick={() => handleSelectCompanyInSlot(co.id, slotIdx)}
                          className="w-full text-left p-2.5 text-[11px] hover:bg-neutral-800 flex justify-between items-center transition-colors text-neutral-200"
                        >
                          <div>
                            <span className="font-semibold">{co.ticker}</span>
                            <span className="text-neutral-500 ml-1 block text-[10px]">{co.name}</span>
                          </div>
                          <span className="text-[9px] bg-neutral-800 border border-neutral-700 px-1 py-0.2 rounded text-neutral-400">
                            {co.exchange}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectorSearchQuery('');
                    setOpenSelectorIndex(slotIdx);
                  }}
                  className="text-xs font-semibold text-neutral-500 hover:text-white flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <LayoutGrid className="w-6 h-6 text-neutral-600 group-hover:text-blue-500 transition-colors" />
                  <span>+ Add NSE / BSE Company</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {activeCompanies.length === 0 ? (
        <div className="p-12 border border-dashed border-neutral-800 rounded-2xl text-center bg-neutral-900/10 text-neutral-500 text-xs">
          Please add at least 1 company comparison slot to generate comparative radar index models.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Radar Chart (using recharts) */}
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl lg:col-span-2 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-200">Fundamental Strength Radar</h3>
              <p className="text-xs text-neutral-500 mt-1">Gauges multi-variable rankings across key indicators</p>
            </div>

            <div className="h-[210px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#262626" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#a3a3a3', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  {activeCompanies.map((c, index) => {
                    const key = String.fromCharCode(65 + index) as 'A' | 'B' | 'C' | 'D';
                    return (
                      <Radar
                        key={c.id}
                        name={c.ticker}
                        dataKey={key}
                        stroke={chartColors[index]}
                        fill={chartColors[index]}
                        fillOpacity={0.15}
                      />
                    );
                  })}
                  <Tooltip
                    contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', fontSize: 12, borderRadius: 8 }}
                    itemStyle={{ color: '#e5e5e5' }}
                  />
                  <Legend tickFormatter={(val) => val} wrapperStyle={{ fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics Grid comparative table */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden lg:col-span-3">
            <div className="px-5 py-3.5 border-b border-neutral-800 bg-neutral-955 bg-neutral-950/20 header flex justify-between items-center">
              <span className="text-xs font-bold text-neutral-200 font-mono tracking-widest uppercase">Metrics Comparison ({globalPeriod})</span>
              <span className="text-[10px] text-neutral-500 font-mono">Numbers in Indian format (₹, Cr)</span>
            </div>

            <div className="overflow-x-auto">
              <table id="comparables-metrics-grid" className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-850 text-[10px] font-mono text-neutral-500 uppercase tracking-wider bg-neutral-950/30">
                    <th className="py-2.5 px-4">Metric Column</th>
                    {activeCompanies.map((c, index) => (
                      <th key={c.id} className="py-2.5 px-4 text-right">
                        <span className="inline-block h-2 w-2 rounded-full mr-1.5" style={{ backgroundColor: chartColors[index] }} />
                        {c.ticker}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-850">
                  <tr className="hover:bg-neutral-800/20">
                    <td className="py-2.5 px-4 font-medium text-neutral-400">Exchange price</td>
                    {activeCompanies.map((c) => (
                      <td key={c.id} className="py-2.5 px-4 text-right font-mono text-neutral-200">
                        ₹{c.price.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>

                  <tr className="hover:bg-neutral-800/20">
                    <td className="py-2.5 px-4 font-medium text-neutral-400">Corporate Market Cap</td>
                    {activeCompanies.map((c) => (
                      <td key={c.id} className="py-2.5 px-4 text-right font-mono text-neutral-200">
                        ₹{(c.marketCapCr / 10000).toFixed(2)} L Cr
                      </td>
                    ))}
                  </tr>

                  <tr className="hover:bg-neutral-800/20">
                    <td className="py-2.5 px-4 font-medium text-neutral-400">Operating Revenue (Cr)</td>
                    {activeCompanies.map((c) => {
                      const financials = getPeriodFinancials(c);
                      return (
                        <td key={c.id} className="py-2.5 px-4 text-right font-mono text-neutral-200 font-semibold">
                          ₹{financials?.revenueCr.toLocaleString('en-IN')} Cr
                        </td>
                      );
                    })}
                  </tr>

                  <tr className="hover:bg-neutral-800/20">
                    <td className="py-2.5 px-4 font-medium text-neutral-400">Quarterly Net Profit (Cr)</td>
                    {activeCompanies.map((c) => {
                      const financials = getPeriodFinancials(c);
                      return (
                        <td key={c.id} className="py-2.5 px-4 text-right font-mono text-neutral-200">
                          ₹{financials?.profitCr.toLocaleString('en-IN')} Cr
                        </td>
                      );
                    })}
                  </tr>

                  <tr className="hover:bg-neutral-800/20">
                    <td className="py-2.5 px-4 font-medium text-neutral-400">Operating EBIT Margin</td>
                    {activeCompanies.map((c) => {
                      const financials = getPeriodFinancials(c);
                      return (
                        <td key={c.id} className="py-2.5 px-4 text-right font-mono text-neutral-200">
                          {financials?.operatingMargin}%
                        </td>
                      );
                    })}
                  </tr>

                  <tr className="hover:bg-neutral-800/20">
                    <td className="py-2.5 px-4 font-medium text-neutral-400">Return on Capital (ROCE)</td>
                    {activeCompanies.map((c) => (
                      <td key={c.id} className="py-2.5 px-4 text-right font-mono text-neutral-200">
                        {c.roce}%
                      </td>
                    ))}
                  </tr>

                  <tr className="hover:bg-neutral-800/20">
                    <td className="py-2.5 px-4 font-medium text-neutral-400 font-sans">Debt To Equity Ratio</td>
                    {activeCompanies.map((c) => (
                      <td key={c.id} className="py-2.5 px-4 text-right font-mono text-neutral-200">
                        {c.debtToEquity}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
