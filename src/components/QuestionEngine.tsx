import { useState, useEffect } from 'react';
import { HelpCircle, Trash2, Edit2, Check, ArrowUp, ArrowDown, Clipboard, Sparkles, History, ArrowRight } from 'lucide-react';
import { QuestionPack, Company } from '../types';
import { mockCompanies, INITIAL_QUESTION_PACKS } from '../data/mockData';

interface QuestionEngineProps {
  onAddRecentlyViewed: (company: Company) => void;
}

export default function QuestionEngine({ onAddRecentlyViewed }: QuestionEngineProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState('reliance');
  const [activePack, setActivePack] = useState<QuestionPack | null>(null);
  const [packsHistory, setPacksHistory] = useState<QuestionPack[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [copied, setCopied] = useState(false);

  // New question inputs
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState<'Opening' | 'Probing' | 'Follow-up'>('Probing');

  useEffect(() => {
    // Load historical packs from localStorage or initial mock data
    const localHistory = localStorage.getItem('investiq_question_packs');
    if (localHistory) {
      setPacksHistory(JSON.parse(localHistory));
    } else {
      setPacksHistory(INITIAL_QUESTION_PACKS);
      localStorage.setItem('investiq_question_packs', JSON.stringify(INITIAL_QUESTION_PACKS));
    }
  }, []);

  useEffect(() => {
    // Sync current active pack based on company selection
    const pack = packsHistory.find((p) => p.companyId === selectedCompanyId);
    if (pack) {
      setActivePack({ ...pack });
    } else {
      // Create empty initial questions for the company if not exists
      const fallbackPack: QuestionPack = {
        id: `qp-${selectedCompanyId}-${Date.now()}`,
        companyId: selectedCompanyId,
        companyName: mockCompanies.find((c) => c.id === selectedCompanyId)?.name || 'Company',
        dateCreated: '2026-06-02',
        questions: [
          { id: `q-${Date.now()}-1`, text: 'Can you outline the organic guidance target for next fiscal?', category: 'Opening' },
        ],
      };
      setActivePack(fallbackPack);
      setPacksHistory((prev) => {
        const withNew = [fallbackPack, ...prev];
        localStorage.setItem('investiq_question_packs', JSON.stringify(withNew));
        return withNew;
      });
    }
  }, [selectedCompanyId, packsHistory.length]);

  const saveHistory = (updatedPack: QuestionPack) => {
    setActivePack(updatedPack);
    setPacksHistory((prev) => {
      const filtered = prev.filter((p) => p.id !== updatedPack.id);
      const output = [updatedPack, ...filtered];
      localStorage.setItem('investiq_question_packs', JSON.stringify(output));
      return output;
    });
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    if (!activePack) return;
    const questions = [...activePack.questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= questions.length) return;

    // Swap elements
    const temp = questions[index];
    questions[index] = questions[targetIndex];
    questions[targetIndex] = temp;

    const updated = { ...activePack, questions };
    saveHistory(updated);
  };

  const handleStartEditing = (id: string, text: string) => {
    setEditingQuestionId(id);
    setEditingText(text);
  };

  const handleSaveEdit = (id: string) => {
    if (!activePack || !editingText.trim()) return;
    const questions = activePack.questions.map((q) => {
      if (q.id === id) {
        return { ...q, text: editingText };
      }
      return q;
    });

    const updated = { ...activePack, questions };
    saveHistory(updated);
    setEditingQuestionId(null);
  };

  const handleDeleteQuestion = (id: string) => {
    if (!activePack) return;
    const questions = activePack.questions.filter((q) => q.id !== id);
    const updated = { ...activePack, questions };
    saveHistory(updated);
  };

  const handleAddQuestion = () => {
    if (!activePack || !newText.trim()) return;
    const questions = [
      ...activePack.questions,
      {
        id: `q-${Date.now()}`,
        text: newText,
        category: newCategory,
      },
    ];

    const updated = { ...activePack, questions };
    saveHistory(updated);
    setNewText('');
  };

  const handleExportToClipboard = () => {
    if (!activePack || activePack.questions.length === 0) return;

    let text = `InvestIQ Pre-Call Analyst Question Pack | Company: ${activePack.companyName} (${selectedCompanyId.toUpperCase()})\n`;
    text += `Generated: ${activePack.dateCreated}\n`;
    text += `========================================================\n\n`;

    activePack.questions.forEach((q, i) => {
      text += `[${i + 1}] (${q.category}) — ${q.text}\n\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const categoryStyles = {
    'Opening': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    'Probing': 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
    'Follow-up': 'bg-amber-500/10 text-amber-400 border border-amber-500/25',
  };

  // Find recent 5 generated packs
  const recentPacks = packsHistory.slice(0, 5);

  return (
    <div id="questions-screen" className="space-y-6">
      {/* Header section */}
      <div className="p-6 bg-linear-to-r from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            AI Question Engine
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Auto-generate and structure custom question cards for upcoming conference calls based on transcipt and iXBRL discrepancies.
          </p>
        </div>

        {/* Company picker scoped */}
        <div className="flex gap-2">
          <select
            id="questions-company-picker"
            value={selectedCompanyId}
            onChange={(e) => {
              setSelectedCompanyId(e.target.value);
              const comp = mockCompanies.find((c) => c.id === e.target.value);
              if (comp) onAddRecentlyViewed(comp);
            }}
            className="bg-neutral-900 border border-neutral-800 text-neutral-250 text-xs rounded-xl p-2.5 focus:border-sky-500 focus:outline-hidden"
          >
            {mockCompanies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.ticker} — {c.name}
              </option>
            ))}
          </select>

          {activePack && activePack.questions.length > 0 && (
            <button
              onClick={handleExportToClipboard}
              className="flex items-center gap-1.5 px-4 bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white rounded-xl transition-colors shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
              <span>{copied ? 'Copied Pack!' : 'Export Pack'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left column: History Sidebar */}
        <div className="lg:col-span-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300 border-b border-neutral-800 pb-2">
            <History className="w-4 h-4 text-neutral-400" />
            <span>LAST 5 PACKS (HISTORY)</span>
          </div>

          <div className="space-y-2">
            {recentPacks.map((pack) => (
              <button
                key={pack.id}
                onClick={() => setSelectedCompanyId(pack.companyId)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs space-y-1 block ${
                  selectedCompanyId === pack.companyId
                    ? 'bg-sky-950/20 border-sky-500/30'
                    : 'bg-neutral-950 border-neutral-850 hover:bg-neutral-800/40 text-neutral-400'
                }`}
              >
                <div className="font-semibold text-neutral-200">{pack.companyName}</div>
                <div className="flex justify-between items-center text-[10px] text-neutral-500">
                  <span>{pack.questions.length} questions</span>
                  <span>{pack.dateCreated}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="text-[11px] text-neutral-500 leading-relaxed pt-2">
            Tip: Choose a company from the top selector to automatically generate or load its active analyst card pack.
          </div>
        </div>

        {/* Right column: Questions Pack Management G5 */}
        <div className="lg:col-span-3 space-y-4">
          {activePack && activePack.questions.length > 0 ? (
            <div className="space-y-3">
              {activePack.questions.map((q, index) => {
                const isEditing = editingQuestionId === q.id;

                return (
                  <div
                    key={q.id}
                    className="group bg-neutral-904 bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex gap-4 items-start hover:border-neutral-700 transition-colors"
                  >
                    {/* Reorder actions G5 */}
                    <div className="flex flex-col gap-1 shrink-0 bg-neutral-950/50 p-1.5 rounded-lg">
                      <button
                        onClick={() => handleMoveQuestion(index, 'up')}
                        disabled={index === 0}
                        className="text-neutral-500 hover:text-sky-400 hover:bg-neutral-800 disabled:opacity-30 disabled:hover:text-neutral-500 rounded p-0.5"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveQuestion(index, 'down')}
                        disabled={index === activePack.questions.length - 1}
                        className="text-neutral-500 hover:text-sky-400 hover:bg-neutral-800 disabled:opacity-30 disabled:hover:text-neutral-500 rounded p-0.5"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        {/* Custom visual categories pills G5 */}
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${categoryStyles[q.category]}`}>
                          {q.category}
                        </span>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {isEditing ? (
                            <button
                              onClick={() => handleSaveEdit(q.id)}
                              className="text-emerald-400 hover:text-emerald-300 p-1 rounded hover:bg-neutral-850"
                              title="Save Question"
                            >
                              <Check className="w-4.5 h-4.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartEditing(q.id, q.text)}
                              className="text-neutral-400 hover:text-sku-300 hover:text-sky-400 p-1 rounded hover:bg-neutral-850"
                              title="Edit Question"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="text-neutral-500 hover:text-red-400 p-1 rounded hover:bg-neutral-850"
                            title="Delete Question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Edit or Display body as G5 */}
                      {isEditing ? (
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-100 outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                          rows={2}
                        />
                      ) : (
                        <p className="text-xs text-neutral-200 leading-relaxed pr-6">
                          {q.text}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 border border-dashed border-neutral-800 rounded-2xl text-center text-xs text-neutral-500 bg-neutral-900/40">
              No questions in this pack yet. Generate your first question card below.
            </div>
          )}

          {/* Quick builder component */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider">
              Add Custom Analyst Question
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-3">
                <input
                  type="text"
                  placeholder="e.g. Can you bridges the EBIT contraction of 40 bps with the subcontractor mix change?"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full bg-neutral-955 bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-150 focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs rounded-xl p-2.5 focus:border-sky-500 focus:outline-hidden"
                >
                  <option value="Opening">Opening Question</option>
                  <option value="Probing">Probing Question</option>
                  <option value="Follow-up">Follow-up Question</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleAddQuestion}
                disabled={!newText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-neutral-805 bg-neutral-800 hover:bg-neutral-750 font-semibold text-neutral-200 text-xs rounded-xl transition-colors border border-neutral-700 disabled:opacity-40"
              >
                <span>Add Question Card</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
