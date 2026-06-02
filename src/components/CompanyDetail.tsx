import { useState } from 'react';
import { Sparkles, Calendar, BookOpen, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, CheckSquare, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';
import { Company, FinancialPeriod, Anomaly, ConcallSummary } from '../types';
import { mockCompanies, mockConcallSummaries } from '../data/mockData';

interface CompanyDetailProps {
  companyId: string;
  onNavigateToTab: (route: string) => void;
}

export default function CompanyDetail({ companyId, onNavigateToTab }: CompanyDetailProps) {
  const company = mockCompanies.find((c) => c.id === companyId) || mockCompanies[0];
  const [activeTab, setActiveTab] = useState<'ai' | 'financials' | 'anomalies' | 'research'>('ai');

  // Dismissible anomaly banner state (G3)
  const [showAnomalyBanner, setShowAnomalyBanner] = useState(company.anomalyCount > 0);

  // Accordion collapsed state for remaining financial segments (G3: remaining accordions collapsed by default)
  const [expandedAccordionId, setExpandedAccordionId] = useState<string | null>(null);

  // Expandable research items state (G9)
  const [expandedConcallIds, setExpandedConcallIds] = useState<Record<string, boolean>>({});

  const toggleConcallExpand = (id: string) => {
    setExpandedConcallIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAccordion = (id: string) => {
    setExpandedAccordionId((prev) => (prev === id ? null : id));
  };

  // Find 3 most recent concalls for G9 (Inline Research tab)
  const companyConcalls = mockConcallSummaries.filter((s) => s.companyId === company.id);

  // Custom mini-sparkline SVG plotter for the 3 core metrics (Revenue, Profit, Cashflow)
  const plotMiniSVG = (dataPoints: number[], strokeColor = '#2563eb') => {
    const width = 100;
    const height = 24;
    const min = Math.min(...dataPoints);
    const max = Math.max(...dataPoints);
    const range = max - min || 1;

    const points = dataPoints
      .map((val, i) => {
        const x = (i / (dataPoints.length - 1)) * (width - 4) + 2;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline fill="none" stroke={strokeColor} strokeWidth="1.8" points={points} />
        {/* End pulse dot */}
        <circle
          cx={(dataPoints.length - 1) / (dataPoints.length - 1) * (width - 4) + 2}
          cy={height - ((dataPoints[dataPoints.length - 1] - min) / range) * (height - 4) - 2}
          r="2.5"
          fill={strokeColor}
        />
      </svg>
    );
  };

  // Extract financial trend points (FY23, FY24, Q1-Q4 FY25 chronological order)
  const chronologicalFinancials = [...company.financials].reverse();
  const revenueTrend = chronologicalFinancials.map((f) => f.revenueCr);
  const profitTrend = chronologicalFinancials.map((f) => f.profitCr);
  const cashflowTrend = chronologicalFinancials.map((f) => f.cashflowCr);

  const signalAccents = {
    positive: { text: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20', badge: 'Positive Signal' },
    warning: { text: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20', badge: 'Anomaly Warning' },
    negative: { text: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20', badge: 'Negative Flag' },
  };

  const currentAccent = signalAccents[company.aiSignal];

  return (
    <div id="company-detail-screen" className="space-y-6">
      {/* G3: Sticky Above-the-fold condensed header zone */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-neutral-800 text-neutral-400 border border-neutral-700 px-2 py-0.5 rounded-sm">
                {company.exchange} LISTED
              </span>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${currentAccent.bg} ${currentAccent.text}`}>
                {currentAccent.badge}
              </span>
            </div>

            <h1 className="text-2xl font-black text-neutral-100 mt-2 tracking-tight">
              {company.ticker} <span className="text-neutral-450 font-normal">— {company.name}</span>
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">{company.sector}</p>
          </div>

          <div className="text-right">
            <span className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-semibold">Live Market Quote</span>
            <div className="flex items-baseline md:justify-end gap-2 mt-1">
              <span className="text-3xl font-mono font-bold text-neutral-100">
                ₹{company.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className={`text-xs font-mono font-bold flex items-center ${company.changePercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {company.changePercent >= 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                )}
                {company.changePercent >= 0 ? '+' : ''}
                {company.changePercent}%
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-500">Quotes delayed 15m (BSE/NSE Feed)</span>
          </div>
        </div>

        {/* Priority metrics section G3 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-neutral-850">
          <div className="bg-neutral-950/40 p-3 rounded-xl border border-neutral-850">
            <span className="text-[9px] font-mono text-neutral-500 uppercase">Market Capitalization</span>
            <div className="text-sm font-mono font-bold text-neutral-200 mt-1">
              ₹{(company.marketCapCr / 10000).toFixed(2)} L Cr
            </div>
          </div>

          <div className="bg-neutral-950/40 p-3 rounded-xl border border-neutral-850">
            <span className="text-[9px] font-mono text-neutral-500 uppercase">P/E Ratio (TTM)</span>
            <div className="text-sm font-mono font-bold text-neutral-200 mt-1">
              {company.peTtm}x
            </div>
          </div>

          <div className="bg-neutral-950/40 p-3 rounded-xl border border-neutral-850">
            <span className="text-[9px] font-mono text-neutral-500 uppercase font-sans">ROCE TTM</span>
            <div className="text-sm font-mono font-bold text-neutral-220 text-neutral-200 mt-1">
              {company.roce}%
            </div>
          </div>

          <div className="bg-neutral-950/40 p-3 rounded-xl border border-neutral-850">
            <span className="text-[9px] font-mono text-neutral-500 uppercase">Revenue CAGR 3Y</span>
            <div className="text-sm font-mono font-bold text-neutral-200 mt-1">
              {company.revenueCagr3Y}%
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 -mb-[2px] ${
            activeTab === 'ai' ? 'border-blue-500 text-neutral-100' : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
        >
          AI Analysis (S&P Signal)
        </button>
        <button
          onClick={() => setActiveTab('financials')}
          className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 -mb-[2px] ${
            activeTab === 'financials' ? 'border-blue-500 text-neutral-100' : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
        >
          Priority Financials
        </button>
        <button
          onClick={() => setActiveTab('research')}
          className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 -mb-[2px] ${
            activeTab === 'research' ? 'border-blue-500 text-neutral-100' : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
        >
          Inline Concalls Summaries
        </button>
        <button
          onClick={() => setActiveTab('anomalies')}
          className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 -mb-[2px] ${
            activeTab === 'anomalies' ? 'border-blue-500 text-neutral-100' : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
        >
          Anomalies Log ({company.anomalyCount})
        </button>
      </div>

      {/* Tabs content area */}
      <div className="space-y-6">
        {activeTab === 'ai' && (
          <div className="space-y-6 animate-fade-in">
            {/* G3: Dismissible anomaly banner in the AI tab. Clickable dismiss closes visual state */}
            {showAnomalyBanner && company.anomalyCount > 0 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <h4 className="text-xs font-semibold text-amber-500 uppercase tracking-wider font-mono">ANOMALY WARNING DETECTED</h4>
                    <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
                      InvestIQ parsed <strong>{company.anomalyCount} narrative/accounting discrepancies</strong> inside the latest Q4 disclosures which conflict with preceding investor communication.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAnomalyBanner(false)}
                  className="text-neutral-500 hover:text-neutral-300 font-mono text-[11px] underline shrink-0 cursor-pointer"
                >
                  Dismiss Banner
                </button>
              </div>
            )}

            {/* AI core Signal card */}
            <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 animate-pulse text-amber-400" />
                <span>INTELLIGENT INSIGHT SYNOPSIS</span>
              </div>

              <p className="text-sm text-neutral-200 leading-relaxed font-medium">
                {company.aiSignalSummary}
              </p>

              <div className="p-4 bg-neutral-950 border border-neutral-850 rounded-xl space-y-3">
                <h4 className="text-xs font-semibold text-neutral-300">Signal Rationale Framework:</h4>
                <div className="text-xs text-neutral-400 leading-relaxed space-y-2 font-sans">
                  <li>Evaluates cash-to-income conversion to detect potential unbilled inventory bloating.</li>
                  <li>Cross-references board directives with subsequent filings regarding leverage margins.</li>
                  <li>Normalizes other operating incomes from green tax credits to safeguard operational gross ratios.</li>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Financials Tab (G3: 3 row-sparkline cards & others collapsed) */}
        {activeTab === 'financials' && (
          <div className="space-y-6 animate-fade-in">
            {/* 3 Sparkline summary cards G3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-semibold block">Operating Revenue</span>
                    <h4 className="text-lg font-black text-neutral-200 mt-1">
                      ₹{company.financials[0].revenueCr.toLocaleString('en-IN')} Cr
                    </h4>
                  </div>
                  {/* Micro sparkline plotter */}
                  {plotMiniSVG(revenueTrend, '#3b82f6')}
                </div>
                <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider flex justify-between items-center bg-neutral-950/40 p-2 rounded-lg">
                  <span>6-Period Trend (FY23 &gt; Q4 FY25)</span>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-semibold block">Net Profit</span>
                    <h4 className="text-lg font-black text-neutral-200 mt-1 text-emerald-500">
                      ₹{company.financials[0].profitCr.toLocaleString('en-IN')} Cr
                    </h4>
                  </div>
                  {plotMiniSVG(profitTrend, '#10b981')}
                </div>
                <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider flex justify-between items-center bg-neutral-950/40 p-2 rounded-lg">
                  <span>6-Period Net Income Progression</span>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-semibold block font-sans">Free Cash Flow</span>
                    <h4 className="text-lg font-black text-neutral-200 mt-1">
                      ₹{company.financials[0].cashflowCr.toLocaleString('en-IN')} Cr
                    </h4>
                  </div>
                  {plotMiniSVG(cashflowTrend, '#f59e0b')}
                </div>
                <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider flex justify-between items-center bg-neutral-950/40 p-2 rounded-lg">
                  <span>6-Period FCF Operating Levels</span>
                </div>
              </div>
            </div>

            {/* Remaining accordions collapsed by default G3 */}
            <div className="space-y-2">
              <span className="block text-[11px] font-mono text-neutral-500 uppercase tracking-wider pb-1">Additional Detailed Financial Disclosures</span>

              {/* Accordion 1: Balance Sheet */}
              <div className="border border-neutral-850 rounded-xl bg-neutral-950/10 overflow-hidden">
                <button
                  onClick={() => toggleAccordion('bal')}
                  className="w-full flex justify-between items-center p-4 text-xs font-semibold text-neutral-300 hover:bg-neutral-900/60 transition-colors text-left"
                >
                  <span className="font-sans font-medium">Detailed Capital Allocations &amp; Debt Annexures</span>
                  {expandedAccordionId === 'bal' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedAccordionId === 'bal' && (
                  <div className="p-4 bg-neutral-900 border-t border-neutral-850 text-xs text-neutral-400 space-y-3 font-mono">
                    <div className="flex justify-between border-b border-neutral-850 pb-1">
                      <span>Capital Reserves (INR Cr)</span>
                      <span className="text-neutral-200 font-semibold font-mono">₹4,25,000 Cr</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-850 pb-1">
                      <span>Outstanding Debt Facilities</span>
                      <span className="text-neutral-200 font-semibold font-mono">₹{(company.debtToEquity * 200000).toLocaleString('en-IN')} Cr</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Audited Goodwill Valuations</span>
                      <span className="text-neutral-200 font-semibold font-mono">₹14,500 Cr</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Notes & Footnotes */}
              <div className="border border-neutral-850 rounded-xl bg-neutral-950/10 overflow-hidden">
                <button
                  onClick={() => toggleAccordion('notes')}
                  className="w-full flex justify-between items-center p-4 text-xs font-semibold text-neutral-300 hover:bg-neutral-900/60 transition-colors text-left"
                >
                  <span className="font-sans font-medium">Filing Footnotes &amp; Related Parties Disclosures</span>
                  {expandedAccordionId === 'notes' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedAccordionId === 'notes' && (
                  <div className="p-4 bg-neutral-900 border-t border-neutral-850 text-xs text-neutral-400 space-y-2">
                    <p className="leading-relaxed">
                      Auditors flagged minor re-valuations on green concessions (subsidy treatments). Refer to Annexure 2 for related parties commitments including inter-corporate state holdings and revolving revolving credit limits.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Inline Research Summaries Tab G9 */}
        {activeTab === 'research' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-neutral-200">Expandable Conference Call Summaries</h3>
                <p className="text-xs text-neutral-500 mt-1">3 most recent calls with inline expanded AI summaries and insights.</p>
              </div>

              <button
                onClick={() => onNavigateToTab('/research')}
                className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
              >
                Open in Research Hub <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {companyConcalls.length === 0 ? (
                <div className="p-12 border border-dashed border-neutral-850 text-center rounded-2xl bg-neutral-900 text-xs text-neutral-500">
                  No registered conference calls in the database matching this company. Choose RELIANCE or TCS to view active records.
                </div>
              ) : (
                companyConcalls.slice(0, 3).map((concall) => {
                  const isExpanded = !!expandedConcallIds[concall.id];

                  return (
                    <div key={concall.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => toggleConcallExpand(concall.id)}
                        className="w-full flex justify-between items-center p-4 text-left hover:bg-neutral-850 transition-colors"
                      >
                        <div>
                          <div className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> {concall.period} Concall Synopsis
                          </div>
                          <span className="text-xs text-neutral-500 font-mono block mt-1">Concall Date: {concall.date}</span>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                      </button>

                      {isExpanded && (
                        <div className="p-5 border-t border-neutral-850 bg-neutral-950/20 space-y-4">
                          <p className="text-xs text-neutral-200 leading-relaxed font-sans bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                            {concall.executiveSummary}
                          </p>

                          <div className="space-y-2">
                            <span className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-semibold">Key Analyst Takeaways</span>
                            <ul className="space-y-1.5 pl-1 text-xs text-neutral-300">
                              {concall.keyTakeaways.map((task, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-blue-500 font-bold mt-0.5">•</span>
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Anomalies tab */}
        {activeTab === 'anomalies' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-sm font-semibold text-neutral-200">Flagged Anomalies Audit</h3>
              <p className="text-xs text-neutral-500 mt-1">Discrepancy anomalies detected inside corporate filings and transcripts.</p>
            </div>

            {company.anomalies.length === 0 ? (
              <div className="p-12 border border-dashed border-neutral-800 rounded-2xl text-center text-xs text-emerald-500 bg-emerald-500/5 font-mono">
                ✓ No material anomalies found. Audit records completely verified.
              </div>
            ) : (
              <div className="space-y-3">
                {company.anomalies.map((anom) => (
                  <div key={anom.id} className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[9px] font-mono uppercase bg-neutral-950 border border-neutral-850 px-2 py-0.5 rounded text-neutral-450 text-neutral-400 font-semibold mr-2">{anom.category}</span>
                        <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                          anom.severity === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                          {anom.severity} Severity
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">Log ID: {anom.id}</span>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-neutral-150">{anom.title}</h4>
                      <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">{anom.description}</p>
                    </div>

                    <div className="p-3 bg-neutral-950/50 border border-neutral-850 rounded-xl text-xs text-neutral-300">
                      <strong>Impact Rationale:</strong> {anom.impact}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
