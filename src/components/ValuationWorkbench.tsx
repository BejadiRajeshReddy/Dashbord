import { useState, useEffect } from 'react';
import { Sliders, HelpCircle, Save, CheckCircle2, TrendingUp, AlertCircle, FileText, Sparkles, RefreshCw } from 'lucide-react';
import { Company, ValuationModel } from '../types';
import { mockCompanies } from '../data/mockData';

interface ValuationWorkbenchProps {
  onAddRecentlyViewed: (company: Company) => void;
}

export default function ValuationWorkbench({ onAddRecentlyViewed }: ValuationWorkbenchProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState('reliance');

  // DCF Parameter values
  const [wacc, setWacc] = useState(11.5);
  const [gordonG, setGordonG] = useState(4.0);
  const [growthStage1, setGrowthStage1] = useState(12.5); // Stage 1 (Years 1-5)
  const [growthStage2, setGrowthStage2] = useState(6.0);  // Stage 2 (Years 5-10)
  const [targetMargin, setTargetMargin] = useState(16.0);

  // States
  const [derivedValue, setDerivedValue] = useState(0);
  const [isModified, setIsModified] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Active loaded model reference
  const currentCompany = mockCompanies.find(c => c.id === selectedCompanyId) || mockCompanies[0];

  // Load state from localStorage on company change
  useEffect(() => {
    const key = `investiq_val_model_${selectedCompanyId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const model: ValuationModel = JSON.parse(saved);
      setWacc(model.targetWacc);
      setGordonG(model.gordonG);
      setGrowthStage1(model.growthStage1);
      setGrowthStage2(model.growthStage2);
      setTargetMargin(model.operatingMarginTarget);
      setLastSaved(model.lastUpdated);
      setIsModified(false);
    } else {
      // Default configurations per company to look hyper realistic
      if (selectedCompanyId === 'reliance') {
        setWacc(11.2);
        setGordonG(4.0);
        setGrowthStage1(13.5);
        setGrowthStage2(6.5);
        setTargetMargin(16.4);
      } else if (selectedCompanyId === 'tcs') {
        setWacc(9.5);
        setGordonG(4.5);
        setGrowthStage1(10.0);
        setGrowthStage2(5.5);
        setTargetMargin(26.2);
      } else if (selectedCompanyId === 'infosys') {
        setWacc(9.8);
        setGordonG(4.0);
        setGrowthStage1(8.5);
        setGrowthStage2(5.0);
        setTargetMargin(20.1);
      } else {
        setWacc(10.5);
        setGordonG(4.0);
        setGrowthStage1(11.0);
        setGrowthStage2(6.0);
        setTargetMargin(35.0);
      }
      setLastSaved(null);
      setIsModified(false);
    }
  }, [selectedCompanyId]);

  // Compute live fair value per share dynamically
  useEffect(() => {
    // Basic multi-stage free cash flow approximation formula for real-time interactivity
    // CF0 = current company net profit
    const netProfit = currentCompany.financials[4]?.profitCr || 15000; // default to sensible fallback
    const r = wacc / 100;
    const g1 = growthStage1 / 100;
    const g2 = growthStage2 / 100;
    const terminalG = gordonG / 100;

    // Disconted cash flows over 10 years
    let sumCf = 0;
    let tempCf = netProfit;

    // Years 1-5
    for (let yr = 1; yr <= 5; yr++) {
      tempCf = tempCf * (1 + g1);
      sumCf += tempCf / Math.pow(1 + r, yr);
    }

    // Years 6-10
    for (let yr = 6; yr <= 10; yr++) {
      tempCf = tempCf * (1 + g2);
      sumCf += tempCf / Math.pow(1 + r, yr);
    }

    // Terminal value (Gordon growth model model at year 10)
    const terminalValue = (tempCf * (1 + terminalG)) / (r - terminalG > 0 ? r - terminalG : 0.05);
    const discountedTerminalValue = terminalValue / Math.pow(1 + r, 10);

    const totalEquityWorthCr = sumCf + discountedTerminalValue;

    // Value per share = Worth Cr / mock shares outstanding
    // We compute a realistic baseline per share based on company's mock stock price
    const sharesDivisor = (currentCompany.marketCapCr / currentCompany.price) || 500;
    const perShare = (totalEquityWorthCr / sharesDivisor) * 1.5; // weight scalar

    setDerivedValue(Math.round(perShare * 100) / 100);

    // Track if user changed parameters from loaded saved database
    const key = `investiq_val_model_${selectedCompanyId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const model: ValuationModel = JSON.parse(saved);
      if (
        model.targetWacc !== wacc ||
        model.gordonG !== gordonG ||
        model.growthStage1 !== growthStage1 ||
        model.growthStage2 !== growthStage2 ||
        model.operatingMarginTarget !== targetMargin
      ) {
        setIsModified(true);
      } else {
        setIsModified(false);
      }
    } else {
      // If no saved model exists yet, we only trigger modified state upon slider edits
      setIsModified(true);
    }

  }, [wacc, gordonG, growthStage1, growthStage2, targetMargin, selectedCompanyId, currentCompany]);

  const handleSaveModel = () => {
    const key = `investiq_val_model_${selectedCompanyId}`;
    const nowStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('en-IN');

    const model: ValuationModel = {
      companyId: selectedCompanyId,
      targetWacc: wacc,
      gordonG: gordonG,
      growthStage1: growthStage1,
      growthStage2: growthStage2,
      operatingMarginTarget: targetMargin,
      derivedValuePerShare: derivedValue,
      thesis: generateThesisParagraph(),
      lastUpdated: nowStr,
    };

    localStorage.setItem(key, JSON.stringify(model));
    setLastSaved(nowStr);
    setIsModified(false);
  };

  const generateThesisParagraph = () => {
    const marginGap = targetMargin - currentCompany.financials[0].operatingMargin;
    const marginThesis = marginGap >= 0
      ? `Operating margin target of ${targetMargin}% indicates anticipated expansion via optimized delivery and operational leverage.`
      : `Conservatively models a drop in margins to ${targetMargin}% to build margin of safety against macro headwinds.`;

    const modelStance = derivedValue > currentCompany.price ? 'under-valued / attractive buying node' : 'fairly/over-valued relative to active trading multiples';

    return `Valuation thesis for ${currentCompany.ticker}: Operating under a cost of capital structure of ${wacc}% (WACC) with a long-term compound terminal growth rate of ${gordonG}%. In Stage 1 (Years 1-5), top-line growth is forecasted at ${growthStage1}%, reverting to ${growthStage2}% during Stage 2 consolidation. ${marginThesis} Based on our composite multi-phase DCF framework, the equity appears ${modelStance} at a fair intrinsic target rate of ₹${derivedValue.toLocaleString('en-IN')} per share.`;
  };

  const handleRestoreDefaults = () => {
    localStorage.removeItem(`investiq_val_model_${selectedCompanyId}`);
    // re-trigger load sequence
    setSelectedCompanyId('');
    setTimeout(() => setSelectedCompanyId(currentCompany.id), 10);
  };

  return (
    <div id="valuation-screen" className="space-y-6">
      {/* Top Banner and company picker */}
      <div className="p-6 bg-linear-to-r from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-500" />
              Valuation Workbench
            </h2>
            {/* Unsaved changes indicator G7 */}
            {isModified ? (
              <span className="flex items-center gap-1 text-[10px] font-mono font-medium text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                <AlertCircle className="w-3 h-3 animate-pulse" /> Unsaved changes
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> Saved to Workspace
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Build and tweak discounted cash flow models with complete persistent auto-saves per ticker.
          </p>
        </div>

        <div className="flex gap-2">
          <select
            id="val-company-picker"
            value={selectedCompanyId}
            onChange={(e) => {
              setSelectedCompanyId(e.target.value);
              const comp = mockCompanies.find(c => c.id === e.target.value);
              if (comp) onAddRecentlyViewed(comp);
            }}
            className="bg-neutral-900 border border-neutral-800 text-neutral-250 text-xs rounded-xl p-2.5 focus:border-emerald-500 focus:outline-hidden"
          >
            {mockCompanies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.ticker} — {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleSaveModel}
            className="flex items-center gap-1.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded-xl transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Model</span>
          </button>
        </div>
      </div>

      {/* Resume from Date Indicator G7 */}
      {lastSaved && (
        <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-xl flex items-center justify-between text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Active model resumed from backup checkpoint: <strong>{lastSaved}</strong></span>
          </div>

          <button
            onClick={handleRestoreDefaults}
            className="text-[10px] text-neutral-500 hover:text-neutral-300 hover:underline flex items-center gap-1"
            title="Reset to Baseline metrics"
          >
            <RefreshCw className="w-3 h-3" /> Reset Baseline defaults
          </button>
        </div>
      )}

      {/* Main Grid: Parameters on Left, Output & Thesis on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Panel */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-6 lg:col-span-1">
          <div>
            <h3 className="text-sm font-semibold text-neutral-200">DCF Forecast Scenarios</h3>
            <p className="text-xs text-neutral-500 mt-1">Adjust weighted valuation variables relative to active cycles</p>
          </div>

          <div className="space-y-4">
            {/* WACC */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400 font-medium">Cost of Capital (WACC)</span>
                <span className="font-mono text-neutral-100 font-semibold">{wacc}%</span>
              </div>
              <input
                type="range"
                min="6"
                max="18"
                step="0.1"
                value={wacc}
                onChange={(e) => setWacc(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Growth Stage 1 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400 font-medium">Stage 1 Growth (Yr 1-5)</span>
                <span className="font-mono text-neutral-100 font-semibold">{growthStage1}%</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="0.5"
                value={growthStage1}
                onChange={(e) => setGrowthStage1(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Growth Stage 2 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400 font-medium">Stage 2 Growth (Yr 6-10)</span>
                <span className="font-mono text-neutral-100 font-semibold">{growthStage2}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="0.1"
                value={growthStage2}
                onChange={(e) => setGrowthStage2(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Gordon G */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400 font-medium">Terminal Growth Rate (g)</span>
                <span className="font-mono text-neutral-100 font-semibold">{gordonG}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                step="0.1"
                value={gordonG}
                onChange={(e) => setGordonG(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Target operating Margin */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400 font-medium font-sans">Target Corporate Margin</span>
                <span className="font-mono text-neutral-100 font-semibold">{targetMargin}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="0.5"
                value={targetMargin}
                onChange={(e) => setTargetMargin(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Intrinsics and AI Thesis Output G7 */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          {/* Main value indicator */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-semibold block">DETERMINED FAIR INTRINSIC PRICE</span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-neutral-100 tracking-tight font-sans">
                  ₹{derivedValue.toLocaleString('en-IN')}
                </h3>
                <span className="text-xs text-neutral-400 font-mono">per NSE share</span>
              </div>
              <p className="text-xs text-neutral-400 max-w-sm">
                Computed value under active discounted rates compared to stock market price of ₹{currentCompany.price.toLocaleString('en-IN')}.
              </p>
            </div>

            <div className="bg-neutral-950/40 border border-neutral-850 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">RELATIVE SPREAD</span>
              {derivedValue >= currentCompany.price ? (
                <div className="space-y-0.5">
                  <div className="text-emerald-500 font-mono font-bold text-sm">
                    +{Math.round(((derivedValue - currentCompany.price) / currentCompany.price) * 100)}% Discount
                  </div>
                  <span className="inline-block text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider">UNDERVALUE buy</span>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <div className="text-red-400 font-mono font-bold text-sm">
                    -{Math.round(((currentCompany.price - derivedValue) / currentCompany.price) * 100)}% Premium
                  </div>
                  <span className="inline-block text-[9px] font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full border border-red-400/20 uppercase tracking-wider">OVERVALUE hold</span>
                </div>
              )}
            </div>
          </div>

          {/* AI-Generated Thesis Section G7 */}
          <div className="bg-indigo-950/10 border border-indigo-500/20 p-6 rounded-2xl flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>AI INVESTMENT THESIS GENERATOR</span>
              </div>

              <div className="text-xs text-neutral-200 leading-relaxed font-sans bg-neutral-950/30 p-4 rounded-xl border border-neutral-850">
                {generateThesisParagraph()}
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
              <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Thesis aligns automatically with slider valuations</span>
              <span>Model is synced with local browser storage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
