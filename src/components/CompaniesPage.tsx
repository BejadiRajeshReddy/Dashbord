import { useState } from 'react';
import { Search, Building, Signal, Landmark } from 'lucide-react';
import { Company } from '../types';
import { mockCompanies } from '../data/mockData';

interface CompaniesPageProps {
  onSelectCompany: (id: string) => void;
  onAddRecentlyViewed: (company: Company) => void;
}

export default function CompaniesPage({ onSelectCompany, onAddRecentlyViewed }: CompaniesPageProps) {
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedExchange, setSelectedExchange] = useState<'All' | 'NSE' | 'BSE'>('All');

  const sectors = ['All', ...new Set(mockCompanies.map((c) => c.sector.split(' / ')[0]))];

  const filtered = mockCompanies.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.ticker.toLowerCase().includes(search.toLowerCase());
    const matchesSector = selectedSector === 'All' || c.sector.startsWith(selectedSector);
    const matchesExchange = selectedExchange === 'All' || c.exchange === selectedExchange;
    return matchesSearch && matchesSector && matchesExchange;
  });

  const signalColors = {
    positive: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    warning: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    negative: 'text-red-500 bg-red-500/10 border-red-500/20',
  };

  return (
    <div id="companies-screen" className="space-y-6">
      {/* Banner */}
      <div className="p-6 bg-linear-to-r from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl">
        <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-500" />
          Indian Corporates Inventory
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Explore and filter coverage list of active Indian equities spanning NSE & BSE stock exchanges.
        </p>
      </div>

      {/* Filter and search bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
          <input
            id="company-search-input"
            type="text"
            placeholder="Search company name, ticker or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-xl p-3 pl-9 focus:border-blue-500 focus:outline-hidden"
          />
        </div>

        <div>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs rounded-xl p-3 focus:outline-hidden"
          >
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s} Sector
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedExchange}
            onChange={(e) => setSelectedExchange(e.target.value as any)}
            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs rounded-xl p-3 focus:outline-hidden"
          >
            <option value="All">All Exchanges</option>
            <option value="NSE">NSE Listing Only</option>
            <option value="BSE">BSE Listing Only</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((co) => (
          <div
            key={co.id}
            onClick={() => {
              onSelectCompany(co.id);
              onAddRecentlyViewed(co);
            }}
            className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between min-h-[185px]"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-mono bg-neutral-805 bg-neutral-800 text-neutral-450 text-neutral-400 border border-neutral-700 px-1.5 py-0.2 rounded font-semibold uppercase">
                    {co.exchange} Ticker
                  </span>
                  <h3 className="text-base font-extrabold text-neutral-150 mt-1">{co.ticker}</h3>
                  <p className="text-xs text-neutral-500 leading-none max-w-[170px] truncate">{co.name}</p>
                </div>

                <span className={`text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${signalColors[co.aiSignal]}`}>
                  {co.aiSignal}
                </span>
              </div>

              <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed bg-neutral-950/20 p-2.5 rounded-lg border border-neutral-850/40">
                {co.aiSignalSummary}
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-neutral-850 mt-3 text-xs font-mono text-neutral-500">
              <div className="flex gap-2.5">
                <span>PE: <strong className="text-neutral-350 text-neutral-350">{co.peTtm}</strong></span>
                <span>ROCE: <strong className="text-neutral-350">{co.roce}%</strong></span>
              </div>
              <span className="text-xs text-indigo-400 font-semibold cursor-pointer">Open Profile</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
