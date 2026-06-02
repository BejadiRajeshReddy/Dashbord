import { useState } from 'react';
import { ShieldCheck, AlertOctagon, Heart, HelpCircle, ArrowRight, ArrowRightLeft, FileSpreadsheet, Compass } from 'lucide-react';
import { mockCompanies } from '../data/mockData';

export default function ValidationEngine() {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Narrative' | 'Accounting' | 'Filing'>('All');

  // Collect all anomalies from coverage database
  const allAnomalies = mockCompanies.flatMap((co) =>
    co.anomalies.map((anom) => ({
      ...anom,
      companyTicker: co.ticker,
      companyName: co.name,
    }))
  );

  const filteredAnomalies = activeCategory === 'All'
    ? allAnomalies
    : allAnomalies.filter(an => an.category === activeCategory);

  return (
    <div id="validation-engine-screen" className="space-y-6">
      <div className="p-6 bg-linear-to-r from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            AI Validation Engine
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Auditing filings automatically to cross-reference corporate claims in texts vs absolute numbers in balance sheet accounts.
          </p>
        </div>

        <div className="flex bg-neutral-950 border border-neutral-800 p-1 rounded-xl shrink-0">
          {(['All', 'Narrative', 'Accounting', 'Filing'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {cat === 'All' ? 'All Discrepancies' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List details */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest block">Active Discrepancy Audits</h3>

          {filteredAnomalies.length === 0 ? (
            <div className="p-12 text-center text-xs text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-2xl">
              No anomalies registered under selected filters.
            </div>
          ) : (
            filteredAnomalies.map((anom) => (
              <div
                key={anom.id}
                className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3 relative overflow-hidden"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] font-mono bg-neutral-850 px-1.5 py-0.5 rounded text-neutral-400 font-bold mr-2 uppercase border border-neutral-700">
                      {anom.companyTicker}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-medium font-sans">({anom.companyName})</span>
                  </div>

                  <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                    anom.severity === 'high' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>
                    {anom.severity} Severity flag
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-neutral-150">{anom.title}</h4>
                  <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">{anom.description}</p>
                </div>

                <div className="p-3 bg-neutral-950/40 border border-neutral-850 rounded-xl space-y-1 text-xs">
                  <span className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-semibold">Analytical Impact Rationale</span>
                  <p className="text-neutral-300 pr-4">{anom.impact}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right column: general stats info */}
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">
              Audit Health Indexes
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-neutral-850 pb-2">
                <span className="text-neutral-500">Active Companies Audited</span>
                <span className="font-semibold text-neutral-200">5 Indian Tickers (NSE)</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-neutral-850 pb-2">
                <span className="text-neutral-500">Unresolved Anomalies</span>
                <span className="font-mono font-semibold text-amber-500">5 flags flagged</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-500">Validation System status</span>
                <span className="font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wide">OPERATIONAL</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-semibold text-amber-500 uppercase tracking-widest flex items-center gap-1">
              <AlertOctagon className="w-4 h-4" /> NOTE TO FORENSIC AUDITORS
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              When companies alter footnotes regarding cost allocations in order to bolster Gross margin figures, our parsers trigger high-severity checks to safeguard investment models.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
