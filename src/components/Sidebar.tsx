import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, 
  GitFork, 
  ArrowUpDown, 
  Layers3, 
  TrendingUp,
  BookOpen,
  X,
  Sparkles,
  ToggleRight,
  Clock,
  Cpu,
  GitCommit,
  Link,
  Users,
  Repeat,
  Binary,
  CircleDot,
  Workflow,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Award,
  Download,
  Upload,
  Check
} from 'lucide-react';
import { CONCEPTS, ConceptId, ConceptCategory } from '../types';
import { getProgression } from '../navigationPath';

interface SidebarProps {
  activeConceptId: ConceptId;
  onSelectConcept: (id: ConceptId) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  completedConcepts: ConceptId[];
  level1CompletedCount: number;
  totalLevel1: number;
  isLevel1Complete: boolean;
  onOpenCertificate: () => void;
  onExportJSON: () => void;
  onImportJSON: (json: string) => boolean;
}

export default function Sidebar({
  activeConceptId,
  onSelectConcept,
  isOpen,
  onCloseMobile,
  completedConcepts,
  level1CompletedCount,
  totalLevel1,
  isLevel1Complete,
  onOpenCertificate,
  onExportJSON,
  onImportJSON
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDataModal, setShowDataModal] = useState(false);
  const [importInput, setImportInput] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Next concept progression
  const progression = getProgression(activeConceptId);
  const nextConcept = progression.nextId ? CONCEPTS.find(c => c.id === progression.nextId) : null;

  // Icon mapping
  const renderIcon = (name: string, className: string) => {
    switch (name) {
      case 'CircleDot':
        return <CircleDot className={className} />;
      case 'Workflow':
        return <Workflow className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
      case 'Binary':
        return <Binary className={className} />;
      case 'Repeat':
        return <Repeat className={className} />;
      case 'ToggleRight':
        return <ToggleRight className={className} />;
      case 'Clock':
        return <Clock className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'GitCommit':
        return <GitCommit className={className} />;
      case 'Link':
        return <Link className={className} />;
      case 'Users':
        return <Users className={className} />;
      case 'Layers3':
        return <Layers3 className={className} />;
      case 'GitFork':
        return <GitFork className={className} />;
      case 'ArrowUpDown':
        return <ArrowUpDown className={className} />;
      case 'TrendingUp':
        return <TrendingUp className={className} />;
      default:
        return <BookOpen className={className} />;
    }
  };

  // Filter concepts based on search
  const filteredConcepts = useMemo(() => {
    if (!searchQuery.trim()) return CONCEPTS;
    const query = searchQuery.toLowerCase();
    return CONCEPTS.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.tagline.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group by category matching the user's Niveau 1 structure
  const categories: { key: ConceptCategory; label: string }[] = [
    { key: 'math-logic', label: '1. Logique & Mathématiques' },
    { key: 'systems-memory', label: '2. Systèmes & Modèle Mémoire' },
    { key: 'linear-structures', label: '3. Structures Linéaires & Algorithmes' },
    { key: 'algorithms-more', label: '4. Pour aller plus loin (Niveau 2)' },
  ];

  const level1ProgressPercent = Math.round((level1CompletedCount / totalLevel1) * 100);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = onImportJSON(content);
        if (success) {
          setImportStatus('Progression importée avec succès !');
          setTimeout(() => {
            setShowDataModal(false);
            setImportStatus(null);
          }, 1500);
        } else {
          setImportStatus('Format de fichier invalide.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Left Vertical Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-slate-900 border-r border-slate-800 flex flex-col z-50 transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-tight block leading-tight">
                AlgoAcadémie
              </span>
              <span className="text-[11px] text-slate-400 block font-mono">
                Local-First · Zero-Cost
              </span>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar inside sidebar */}
        <div className="p-3 border-b border-slate-800/80 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrer les notions..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Quick NEXT Action Button in vibrant emerald green */}
        {nextConcept && (
          <div className="px-3 pt-2.5 pb-2.5 border-b border-slate-800/80 bg-emerald-950/20 shrink-0">
            <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5 px-0.5">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Prochaine étape
              </span>
              <span className="font-mono text-slate-400">Étape {progression.order + 1}/13</span>
            </div>

            <button
              onClick={() => {
                onSelectConcept(nextConcept.id);
                onCloseMobile();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-extrabold px-3 py-2 rounded-xl flex items-center justify-between transition-all shadow-md shadow-emerald-500/20 cursor-pointer group text-left"
              title={`Continuer vers : ${nextConcept.title}`}
            >
              <div className="min-w-0 pr-2">
                <div className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-950/80 flex items-center gap-1">
                  <span>NEXT</span>
                  <span>·</span>
                  <span className="font-mono font-medium">{nextConcept.timeEstimate}</span>
                </div>
                <div className="text-xs font-black text-slate-950 truncate">
                  {nextConcept.title}
                </div>
              </div>
              <div className="w-7 h-7 rounded-lg bg-emerald-600/30 group-hover:bg-emerald-600/40 flex items-center justify-center shrink-0 transition-colors">
                <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        )}

        {/* Certificate Quick Banner if completed */}
        {isLevel1Complete && (
          <div className="px-3 py-2 border-b border-amber-500/30 bg-amber-500/10 shrink-0">
            <button
              onClick={onOpenCertificate}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition cursor-pointer"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span>🎓 Mon Certificat Niveau 1</span>
            </button>
          </div>
        )}

        {/* Navigation Notion List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {filteredConcepts.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              Aucune notion trouvée pour "{searchQuery}".
            </div>
          ) : (
            categories.map((cat) => {
              const conceptsInCat = filteredConcepts.filter((c) => c.category === cat.key);
              if (conceptsInCat.length === 0) return null;

              return (
                <div key={cat.key}>
                  <div className="px-2 mb-2 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>{cat.label}</span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {conceptsInCat.filter((c) => completedConcepts.includes(c.id)).length}/{conceptsInCat.length}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {conceptsInCat.map((concept) => {
                      const isActive = activeConceptId === concept.id;
                      const isCompleted = completedConcepts.includes(concept.id);

                      return (
                        <button
                          key={concept.id}
                          onClick={() => {
                            onSelectConcept(concept.id);
                            onCloseMobile();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 relative group cursor-pointer border ${
                            isActive
                              ? 'bg-sky-500/10 border-sky-500/30 text-white shadow-sm'
                              : isCompleted
                              ? 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700'
                              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                          }`}
                        >
                          {/* Left Accent indicator for active */}
                          {isActive && (
                            <div className="absolute left-0 top-2 bottom-2 w-1 bg-sky-400 rounded-r-full" />
                          )}

                          {/* Icon or Green Check if completed */}
                          <div
                            className={`p-1.5 rounded-lg shrink-0 mt-0.5 transition-colors relative ${
                              isActive
                                ? 'bg-sky-500/20 text-sky-400'
                                : isCompleted
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-slate-800 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-700/60'
                            }`}
                          >
                            {renderIcon(concept.iconName, 'w-4 h-4')}
                            {isCompleted && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center">
                                <Check className="w-2 h-2 text-slate-950 stroke-[3]" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span
                                className={`text-xs font-semibold truncate ${
                                  isActive ? 'text-white' : isCompleted ? 'text-slate-200' : 'text-slate-300'
                                }`}
                              >
                                {concept.title}
                              </span>
                              {concept.badge && (
                                <span className={`text-[10px] font-medium font-mono shrink-0 ${
                                  concept.badge.includes('Départ') || concept.badge.includes('ici') 
                                    ? 'text-emerald-400 font-bold' 
                                    : 'text-sky-400'
                                }`}>
                                  {concept.badge}
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-500 truncate mt-0.5 font-mono">
                              {concept.tagline}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer with Local-First Progress & Data Portability */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 shrink-0 space-y-2">
          
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Progression Niveau 1 :</span>
              <span className="font-mono font-bold text-emerald-400">{level1CompletedCount}/{totalLevel1} ({level1ProgressPercent}%)</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${level1ProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Backup / Export actions */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
            <button
              onClick={() => setShowDataModal(true)}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition"
              title="Sauvegarder ou restaurer mes données sans serveur"
            >
              <Download className="w-3 h-3 text-sky-400" />
              <span>Sauvegarde Local-First</span>
            </button>

            <button
              onClick={onOpenCertificate}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer transition"
            >
              <Award className="w-3 h-3" />
              <span>Certificat</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Data Backup Modal (Local-First JSON export/import) */}
      {showDataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-sm text-white">Sauvegarde & Restauration Local-First</h3>
              </div>
              <button 
                onClick={() => setShowDataModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Vos progrès sont stockés <strong>exclusivement dans votre navigateur</strong> (zéro coût serveur, respect absolu de votre vie privée). Emportez votre fichier JSON pour reprendre vos exercices sur un autre appareil.
            </p>

            <div className="mt-5 space-y-3">
              <button
                onClick={onExportJSON}
                className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Exporter ma progression (algo_progression.json)
              </button>

              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Importer un fichier JSON de progression
                </button>
              </div>

              {importStatus && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-medium">
                  {importStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
