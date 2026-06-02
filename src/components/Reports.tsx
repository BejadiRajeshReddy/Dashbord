import { useState } from 'react';
import { FileText, Download, Calendar, Mail, CheckCircle, Search } from 'lucide-react';

export default function Reports() {
  const [activeTab, setActiveTab] = useState<'all' | 'audited' | 'sector'>('all');

  const docRows = [
    { title: 'TCS - Annual Compliance Statement Ind-AS', type: 'Annual Report', date: 'May 2025', size: '22.4 MB' },
    { title: 'RELIANCE - Green Hydrogen Subsidy Footnote Audit', type: 'Audit Pack', date: 'April 2025', size: '8.1 MB' },
    { title: 'ITC - Rural Consumption Demographics Survey', type: 'Brokerage Research', date: 'March 2025', size: '14.5 MB' },
    { title: 'HDFC Bank - Post-Merger NIM Recalculation Annex', type: 'Filing Annex', date: 'Feb 2025', size: '4.2 MB' },
  ];

  return (
    <div id="reports-hub-screen" className="space-y-6">
      <div className="p-6 bg-linear-to-r from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl">
        <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          Research Reports Hub
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Access indexed regulatory files, compliance folders, and brokerage studies for BSE-listed corporate clusters.
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-neutral-850 pb-3">
          <h3 className="text-sm font-semibold text-neutral-250">Downloadable Regulatory Folders</h3>
          <span className="text-[10px] font-mono text-neutral-500">4 file nodes online</span>
        </div>

        <div className="space-y-2.5">
          {docRows.map((doc, idx) => (
            <div key={idx} className="p-4 bg-neutral-950/30 border border-neutral-855 border-neutral-850 rounded-xl flex justify-between items-center gap-4 hover:border-neutral-700 transition-colors text-xs">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-neutral-200">{doc.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-neutral-500 font-mono mt-1">
                    <span>{doc.type}</span>
                    <span>• {doc.date}</span>
                  </div>
                </div>
              </div>

              <button className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-800 hover:bg-neutral-750 text-xs font-semibold text-neutral-300 rounded-xl border border-neutral-700 transition-colors shrink-0">
                <Download className="w-3.5 h-3.5" /> Download PDF ({doc.size})
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
