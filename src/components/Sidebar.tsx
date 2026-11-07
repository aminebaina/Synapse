import React, { useState, useMemo } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { CONCEPTS, ConceptId, ConceptCategory } from '../types';
import { getProgression } from '../navigationPath';

interface SidebarProps {
  activeConceptId: ConceptId;
  onSelectConcept: (id: ConceptId) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({
  activeConceptId,
  onSelectConcept,
  isOpen,
  onCloseMobile
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

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
      case 'Search':
        return <Search className={className} />;
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

  // Filter concepts based on search query
  const filteredConcepts = useMemo(() => {
    if (!searchQuery.trim()) return CONCEPTS;
    const query = searchQuery.toLowerCase();
    return CONCEPTS.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.tagline.toLowerCase().includes(query) ||
        c.categoryName.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group by category matching the user's Niveau 1 structure
  const categories: { key: ConceptCategory; label: string }[] = [
    { key: 'math-logic', label: '1. Logique & Mathématiques' },
    { key: 'systems-memory', label: '2. Systèmes & Modèle Mémoire' },
    { key: 'linear-structures', label: '3. Structures Linéaires & Algorithmes' },
    { key: 'algorithms-more', label: '4. Pour aller plus loin (Niveau 2)' },
  ];

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
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-tight block leading-tight">
                AlgoAcadémie
              </span>
              <span className="text-[11px] text-slate-400 block">
                Visualiseur d'Algorithmes
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
                  {/* Category Title Header */}
                  <div className="px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none">
                    {cat.label}
                  </div>

                  {/* Concepts inside category */}
                  <div className="space-y-1">
                    {conceptsInCat.map((concept) => {
                      const isActive = concept.id === activeConceptId;
                      return (
                        <button
                          key={concept.id}
                          onClick={() => {
                            onSelectConcept(concept.id);
                            onCloseMobile();
                          }}
                          className={`w-full text-left p-2.5 rounded-xl transition-all duration-200 flex items-start gap-3 group relative cursor-pointer border ${
                            isActive
                              ? 'bg-sky-500/10 border-sky-500/30 text-white shadow-sm'
                              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                          }`}
                        >
                          {/* Left Accent indicator for active */}
                          {isActive && (
                            <div className="absolute left-0 top-2 bottom-2 w-1 bg-sky-400 rounded-r-full" />
                          )}

                          {/* Icon */}
                          <div
                            className={`p-1.5 rounded-lg shrink-0 mt-0.5 transition-colors ${
                              isActive
                                ? 'bg-sky-500/20 text-sky-400'
                                : 'bg-slate-800 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-700/60'
                            }`}
                          >
                            {renderIcon(concept.iconName, 'w-4 h-4')}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span
                                className={`text-xs font-semibold truncate ${
                                  isActive ? 'text-white' : 'text-slate-300'
                                }`}
                              >
                                {concept.title}
                              </span>
                              {concept.badge && (
                                <span className="text-[10px] font-medium text-sky-400 font-mono shrink-0">
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

        {/* Sidebar Footer */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/60 shrink-0">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{CONCEPTS.length} notions interactives</span>
            <span className="text-emerald-400 font-mono font-semibold">Niveau 1 Complet</span>
          </div>
        </div>
      </aside>
    </>
  );
}
