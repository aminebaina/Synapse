import React from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Compass, 
  Trophy, 
  CheckCircle2, 
  Clock,
  Award,
  Check
} from 'lucide-react';
import { ConceptId, CONCEPTS } from '../types';
import { getProgression } from '../navigationPath';

interface NextConceptBarProps {
  currentConceptId: ConceptId;
  onNavigate: (conceptId: ConceptId) => void;
  isCompleted: boolean;
  onToggleCompleted: () => void;
  onOpenCertificate: () => void;
  isLevel1Complete: boolean;
  completedCount: number;
}

export default function NextConceptBar({ 
  currentConceptId, 
  onNavigate,
  isCompleted,
  onToggleCompleted,
  onOpenCertificate,
  isLevel1Complete,
  completedCount
}: NextConceptBarProps) {
  const step = getProgression(currentConceptId);
  const nextConcept = step.nextId ? CONCEPTS.find(c => c.id === step.nextId) : null;
  const prevConcept = step.prevId ? CONCEPTS.find(c => c.id === step.prevId) : null;

  const totalNiveau1 = 13;
  const currentLevelProgress = Math.min(100, Math.round((completedCount / totalNiveau1) * 100));

  const handleNavigate = (id: ConceptId) => {
    onNavigate(id);
    // Smooth scroll back to top of lesson
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="mt-10 mb-6">
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-sky-500/30 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Progress Header & Mark-As-Completed Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                Progression Local-First
                <span className="text-slate-600">·</span>
                <span className="text-slate-300 font-normal">Niveau 1</span>
              </div>
              <div className="text-xs text-slate-400 font-medium">
                <strong className="text-emerald-400 font-mono font-bold">{completedCount}</strong> sur <strong className="text-white font-mono">{totalNiveau1}</strong> notions maîtrisées ({currentLevelProgress}% du Niveau 1)
              </div>
            </div>
          </div>

          {/* Action to Mark this concept as completed */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={onToggleCompleted}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                  : 'bg-slate-950 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors ${
                isCompleted ? 'bg-emerald-400 text-slate-950' : 'border border-slate-600'
              }`}>
                {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>{isCompleted ? 'Notion Maîtrisée ✓' : 'Marquer comme maîtrisée'}</span>
            </button>

            {/* Quick Certificate Link if available */}
            {isLevel1Complete && (
              <button
                onClick={onOpenCertificate}
                className="px-3 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Afficher mon certificat"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Mon Certificat</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Key Takeaway & Pedagogical Bridge */}
        <div className="my-5 bg-slate-950/70 rounded-xl p-4 border border-slate-800/80">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-1">
                Pourquoi cette notion ensuite ?
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {step.whyNext}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          
          {/* Previous Button (if applicable) */}
          {prevConcept ? (
            <button
              onClick={() => handleNavigate(prevConcept.id)}
              className="px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer order-2 sm:order-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Précédent : <span className="font-normal text-slate-400">{prevConcept.title}</span></span>
            </button>
          ) : (
            <div className="order-2 sm:order-1 hidden sm:block" />
          )}

          {/* Next Button / Level Complete Button */}
          {nextConcept ? (
            <button
              onClick={() => handleNavigate(nextConcept.id)}
              className="group px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-3 shadow-lg shadow-sky-500/25 active:scale-98 transition-all cursor-pointer order-1 sm:order-2"
            >
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold tracking-wider text-sky-100/90 flex items-center gap-1">
                  Étape Suivante Recommandée
                  <span className="text-sky-200">·</span>
                  <span className="font-mono text-sky-200 flex items-center gap-0.5">
                    <Clock className="w-3 h-3" /> {nextConcept.timeEstimate}
                  </span>
                </div>
                <div className="text-sm font-extrabold text-white group-hover:translate-x-0.5 transition-transform flex items-center gap-1.5">
                  Continuer : {nextConcept.title}
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:bg-white/30 group-hover:translate-x-1 transition-all">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenCertificate}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/20 active:scale-98 transition cursor-pointer order-1 sm:order-2"
            >
              <Award className="w-5 h-5 text-slate-950" />
              <span>Voir & Télécharger mon Certificat Niveau 1</span>
            </button>
          )}

        </div>

      </div>
    </section>
  );
}
