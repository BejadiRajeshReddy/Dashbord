import React, { useState } from 'react';
import { Terminal, Shield, UploadCloud, CheckCircle, Database, HelpCircle } from 'lucide-react';

export default function AdminPanel() {
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'completed'>('idle');

  const handleUploadSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToUpload) return;
    setUploadProgress('uploading');
    setTimeout(() => {
      setUploadProgress('completed');
      setFileToUpload(null);
    }, 1500);
  };

  return (
    <div id="admin-panel-screen" className="space-y-6">
      <div className="p-6 bg-linear-to-r from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl">
        <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-neutral-400" />
          Ingestion &amp; Pipeline Admin Panel
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Technical portal for engineers to audit scraper telemetry, schedule crawler tasks, and upload raw corporate iXBRL packets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns: Upload and Ingestion */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload panel (relocated from Analyst dashboard) */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest block">Upload Raw iXBRL File</h3>
            <p className="text-xs text-neutral-400">Ingest annual regulatory reporting Excel sheets complying with MCA frameworks.</p>

            <form onSubmit={handleUploadSimulate} className="space-y-4">
              <div className="border border-dashed border-neutral-800 hover:border-neutral-700 bg-neutral-950/35 p-8 rounded-xl text-center cursor-pointer transition-colors relative flex flex-col items-center justify-center space-y-2">
                <UploadCloud className="w-8 h-8 text-neutral-500" />
                <span className="text-xs text-neutral-300">Drag &amp; drop compliance PDF/Excel here or</span>
                <input
                  type="file"
                  onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
                <button
                  type="button"
                  className="px-3.5 py-1.5 bg-neutral-800 text-[11px] font-semibold rounded text-neutral-300 border border-neutral-750"
                >
                  Choose Document
                </button>

                {fileToUpload && (
                  <p className="text-xs text-emerald-400 mt-2 font-mono">Ready: {fileToUpload.name}</p>
                )}
              </div>

              {fileToUpload && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 text-xs font-semibold rounded-xl text-white transition-colors"
                  >
                    Run Ingestion Parser
                  </button>
                </div>
              )}

              {uploadProgress === 'uploading' && (
                <p className="text-xs text-amber-500 font-mono animate-pulse">Running Ind-AS mapping scrapers in background...</p>
              )}
              {uploadProgress === 'completed' && (
                <p className="text-xs text-emerald-400 font-mono">✓ iXBRL records compiled and mapped into coverage database successfully!</p>
              )}
            </form>
          </div>

          {/* Pipeline stats (relocated from dashboard as requested) */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest block">Pipeline Telemetry</h3>
              <p className="text-xs text-neutral-500 mt-1">Audit raw indexes harvested by InvestIQ background scrapers.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-neutral-950/40 border border-neutral-850 rounded-xl">
                <span className="text-[10px] font-mono text-neutral-500 block uppercase">Companies coverage</span>
                <h4 className="text-2xl font-mono font-bold text-neutral-200 mt-1">1,240</h4>
                <p className="text-[10px] text-neutral-500 mt-1">BSE Prime dataset index</p>
              </div>

              <div className="p-4 bg-neutral-950/40 border border-neutral-850 rounded-xl">
                <span className="text-[10px] font-mono text-neutral-500 block uppercase">Filing Rows parsed</span>
                <h4 className="text-2xl font-mono font-bold text-neutral-200 mt-1">1.8M+</h4>
                <p className="text-[10px] text-neutral-500 mt-1">iXBRL tables ingested</p>
              </div>

              <div className="p-4 bg-neutral-950/40 border border-neutral-850 rounded-xl">
                <span className="text-[10px] font-mono text-neutral-500 block uppercase font-sans">Quarterly PDFs Index</span>
                <h4 className="text-2xl font-mono font-bold text-neutral-250 text-neutral-200 mt-1">2,850</h4>
                <p className="text-[10px] text-neutral-500 mt-1">Audio Transcripts indexed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scraper logs */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-850">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase">Scraper Engine logs</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>

          <div className="bg-neutral-950 p-4 rounded-xl font-mono text-[10px] text-neutral-400 space-y-2 max-h-96 overflow-y-auto leading-relaxed">
            <p><span className="text-neutral-500">[08:12:00]</span> Fetching BSE index listings feeds...</p>
            <p><span className="text-neutral-500">[08:12:05]</span> Found 12 fresh corporate disclosure PDFs.</p>
            <p><span className="text-neutral-500">[08:14:15]</span> Compiling transcript summaries for Q4 FY25 RELIANCE...</p>
            <p><span className="text-neutral-500">[08:14:18]</span> Ingesting footnotes for TCS compliance accounts...</p>
            <p><span className="text-neutral-500">[08:15:00]</span> Mapped 2,410 cell records successfully. Integrity status green.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
