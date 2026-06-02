import { useState, useEffect } from 'react';
import { BookOpen, MapPin, Calendar, FileText, CheckCircle, MessagesSquare, MessageCircle, Sparkles, TrendingUp, Filter } from 'lucide-react';
import { ConcallSummary, Company } from '../types';
import { mockCompanies, mockConcallSummaries } from '../data/mockData';

interface ResearchHubProps {
  onAddRecentlyViewed: (company: Company) => void;
}

export default function ResearchHub({ onAddRecentlyViewed }: ResearchHubProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState('reliance');
  const [activeTab, setActiveTab] = useState<'summaries' | 'concalls' | 'transcripts'>('summaries');

  // Filter schedules
  const activeSummary = mockConcallSummaries.find(s => s.companyId === selectedCompanyId);

  // Auto-track recently viewed on company focus
  const handleCompanyChange = (id: string) => {
    setSelectedCompanyId(id);
    const comp = mockCompanies.find(c => c.id === id);
    if (comp) onAddRecentlyViewed(comp);
  };

  const sentimentColors = {
    positive: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    neutral: 'text-neutral-400 bg-neutral-400/10 border-neutral-400/25',
    negative: 'text-red-400 bg-red-400/10 border-red-400/20',
  };

  return (
    <div id="research-hub-screen" className="space-y-6">
      {/* Scope filter card G6 */}
      <div className="p-6 bg-linear-to-r from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Research Hub
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Browse corporate quarterly filings, Q&A records, and deep AI-summarized transcripts.
          </p>
        </div>

        {/* Unified Top Company Selector G6 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 font-mono flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-neutral-500" /> FOCUS SCOPE
          </span>
          <select
            id="research-company-selector"
            value={selectedCompanyId}
            onChange={(e) => handleCompanyChange(e.target.value)}
            className="bg-neutral-905 bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs rounded-xl p-2.5 focus:border-indigo-500 focus:outline-hidden"
          >
            {mockCompanies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.ticker} — {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3-Tab Navigator G6 */}
      <div className="flex border-b border-neutral-800 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('summaries')}
          className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 -mb-[2px] ${
            activeTab === 'summaries'
              ? 'border-indigo-500 text-neutral-100'
              : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
        >
          AI Summaries (Primary)
        </button>
        <button
          onClick={() => setActiveTab('concalls')}
          className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 -mb-[2px] ${
            activeTab === 'concalls'
              ? 'border-indigo-500 text-neutral-100'
              : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
        >
          Quarterly Concalls
        </button>
        <button
          onClick={() => setActiveTab('transcripts')}
          className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 -mb-[2px] ${
            activeTab === 'transcripts'
              ? 'border-indigo-500 text-neutral-100'
              : 'border-transparent text-neutral-500 hover:text-neutral-300'
          }`}
        >
          Raw Transcripts
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area: Tab display */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'summaries' ? (
            <div className="space-y-6">
              {/* Executive summary block (G6: AI summaries default expanded) */}
              {activeSummary ? (
                <div className="space-y-6">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                      <span>Executive Summation — {activeSummary.period}</span>
                    </div>

                    <h3 className="text-base font-semibold text-neutral-100 leading-snug">
                      {activeSummary.executiveSummary}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <span className="block text-xs font-mono text-neutral-450 uppercase tracking-wider">KEY ANALYTICAL INSIGHTS</span>
                        <ul className="space-y-2">
                          {activeSummary.keyTakeaways.map((takeaway, idx) => (
                            <li key={idx} className="text-xs text-neutral-300 flex items-start gap-2">
                              <span className="text-indigo-455 text-indigo-400 font-semibold mt-0.5">•</span>
                              <span>{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-indigo-950/20 border border-indigo-500/20 p-4 rounded-xl space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wide">
                          <TrendingUp className="w-4 h-4" />
                          <span>Management Outlook Guidance</span>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                          {activeSummary.guidanceSummary}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Q&A Overview segment */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-2 text-neutral-400 font-mono text-xs font-semibold uppercase tracking-wider">
                      <MessageCircle className="w-4 h-4" />
                      <span>Audited Call Q&A Highlights</span>
                    </div>

                    <div className="space-y-4 divide-y divide-neutral-850">
                      {activeSummary.qaSummaries.map((qa, index) => (
                        <div key={index} className={`space-y-3 ${index > 0 ? 'pt-4' : ''}`}>
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <span className="text-xs font-semibold text-neutral-250">{qa.analyst}</span>
                              <span className="text-[10px] text-neutral-500 font-mono ml-2">({qa.firm})</span>
                            </div>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${sentimentColors[qa.sentiment]}`}>
                              {qa.sentiment.toUpperCase()} SENTIMENT
                            </span>
                          </div>

                          <div className="space-y-2 pl-3 border-l-2 border-neutral-800 text-xs">
                            <p className="text-neutral-400 font-medium">Q: {qa.question}</p>
                            <p className="text-neutral-300 pl-2 bg-neutral-950/30 p-2.5 rounded-lg border border-neutral-850/40">
                              <span className="font-semibold text-indigo-400">A:</span> {qa.answer}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 border border-neutral-800 text-center rounded-2xl bg-neutral-900 text-xs text-neutral-500">
                  No AI transcript summaries parsed for this company. Select RELIANCE or TCS to view active records.
                </div>
              )}
            </div>
          ) : activeTab === 'concalls' ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-neutral-200">Quarterly Call Audio & Summaries</h3>
              <p className="text-xs text-neutral-400">
                Indexed quarterly calls and transcript playbacks for Indian analysts.
              </p>

              <div className="space-y-3">
                {[
                  { title: `Q4 FY25 Conference Webcast`, date: `2025-05-20`, length: '48 mins', size: '12.4 MB' },
                  { title: `Q3 FY25 Interim Analyst Call`, date: `2025-02-15`, length: '52 mins', size: '14.1 MB' },
                  { title: `Q2 FY25 Results Disclosures`, date: `2024-11-12`, length: '40 mins', size: '10.8 MB' },
                ].map((call, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3.5 bg-neutral-950/50 border border-neutral-850 rounded-xl hover:border-neutral-700 transition-colors">
                    <div>
                      <div className="text-xs font-semibold text-neutral-200">{call.title}</div>
                      <div className="flex items-center gap-3 text-[10px] text-neutral-500 font-mono mt-1">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {call.date}</span>
                        <span>Length: {call.length}</span>
                      </div>
                    </div>

                    <button className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-750 text-[11px] font-medium text-neutral-300 rounded-lg border border-neutral-700 transition-colors">
                      Listen / Download PDF ({call.size})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-200">Raw Transcript Content</h3>
                <span className="text-[10px] font-mono bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded border border-neutral-700">PAGE 1 OF 35</span>
              </div>

              <div className="p-4 bg-neutral-950 border border-neutral-850 rounded-xl space-y-4 max-h-96 overflow-y-auto">
                <div className="text-[11px] leading-relaxed font-mono space-y-3 text-neutral-400">
                  <p><span className="text-indigo-400 font-semibold">[00:02 — OPERATOR]</span> Welcome to the Indian corporate investor relations conference call. All participants will have an opportunity to query management following the overview. I now turn the meeting over to Chief Investor Liaison officer.</p>
                  <p><span className="text-indigo-400 font-semibold">[01:15 — MANAGEMENT]</span> Welcome, ladies and gentlemen. Today we align our growth framework. Our operational performance continues to expand across multiple nodes. Jio added margins of 52%, or we saw capital commit allocations towards core infrastructure expansions scaling nicely through the quarter...</p>
                  <p><span className="text-indigo-405 text-indigo-400 font-semibold">[05:40 — ANALYST]</span> Thank you for taking my question. Can you please bridge the gap on raw energy output and outline how much of the energy subsidy is listed in operational lines?</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column: Document Details / Metadata */}
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-mono font-semibold text-neutral-450 uppercase tracking-wider">
              Document Metadata
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-neutral-800 pb-1.5">
                <span className="text-neutral-500">Source Agency</span>
                <span className="font-semibold text-neutral-250">Ministry of Corporate Affairs (iXBRL)</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-neutral-800 pb-1.5">
                <span className="text-neutral-500">Reporting Format</span>
                <span className="font-semibold text-neutral-250">Ind-AS 115 Compliance</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-neutral-800 pb-1.5">
                <span className="text-neutral-500">Audit Status</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle className="w-3.5 h-3.5" /> SECURED
                </span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-950/10 border border-indigo-500/20 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              INTELLIGENT INSIGHT NOTE
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              InvestIQ AI automatically reads through footnotes and annexures to verify if there are discrepancies between what corporate directors discussed in audio records versus what was submitted in audited Excel columns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
