import { useState } from 'react';
import { Layers, Landmark, TrendingUp, Compass, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';
import { mockCompanies } from '../data/mockData';

export default function UnitEconomics() {
  const [selectedCoId, setSelectedCoId] = useState('reliance');

  const company = mockCompanies.find(c => c.id === selectedCoId) || mockCompanies[0];
  const econ = company.unitEconomics[0];

  return (
    <div id="unit-econ-screen" className="space-y-6">
      <div className="p-6 bg-linear-to-r from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
            <Tag className="w-5 h-5 text-pink-500" />
            Unit Economics Workbench
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Analyzing granular operating metrics, volumes, realizations, and physical capacity allocations per company.
          </p>
        </div>

        <div>
          <select
            value={selectedCoId}
            onChange={(e) => setSelectedCoId(e.target.value)}
            className="bg-neutral-905 bg-neutral-900 border border-neutral-800 text-neutral-250 text-xs rounded-xl p-2.5 focus:border-pink-500 focus:outline-hidden"
          >
            {mockCompanies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.ticker} — {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <div className="border-b border-neutral-850 pb-3">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-semibold block">Granular Operating Breakdown</span>
          <h3 className="text-sm font-semibold text-neutral-200 mt-1">{company.name} ({econ?.period || 'Q4 FY25'})</h3>
        </div>

        {econ ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {econ.metrics.map((m, idx) => (
              <div key={idx} className="p-4 bg-neutral-950/30 border border-neutral-850 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-xs text-neutral-450 text-neutral-400 block">{m.label}</span>
                  <span className="text-lg font-mono font-bold text-neutral-200 mt-1.5 block">{m.value}</span>
                </div>

                <span className={`p-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 bg-neutral-900 border border-neutral-800 ${
                  m.trend === 'up' ? 'text-emerald-500' : m.trend === 'down' ? 'text-red-400' : 'text-neutral-500'
                }`}>
                  {m.trend === 'up' ? (
                    <>▲ Upward</>
                  ) : m.trend === 'down' ? (
                    <>▼ Downward</>
                  ) : (
                    <>■ Stable</>
                  )}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-neutral-500">
            No segment unit economic metrics registered for this company. Select RELIANCE or TCS to view.
          </div>
        )}
      </div>
    </div>
  );
}
