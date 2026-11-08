/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Menu, 
  Volume2, 
  VolumeX,
  Award,
  CheckCircle2
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import LinearSearchView from './components/LinearSearchView';
import BinarySearchView from './components/BinarySearchView';
import BubbleSortView from './components/BubbleSortView';
import StackView from './components/StackView';
import BigOView from './components/BigOView';
import LogicGatesView from './components/LogicGatesView';
import ModuloView from './components/ModuloView';
import MemoryModelView from './components/MemoryModelView';
import BinaryHexView from './components/BinaryHexView';
import SequentialExecView from './components/SequentialExecView';
import LinkedListView from './components/LinkedListView';
import QueueView from './components/QueueView';
import LoopControlView from './components/LoopControlView';
import SetsVennView from './components/SetsVennView';
import CallStackView from './components/CallStackView';
import FindExtremaView from './components/FindExtremaView';
import ConceptFeedback from './components/ConceptFeedback';
import NextConceptBar from './components/NextConceptBar';
import CertificateModal from './components/CertificateModal';
import { useProgression } from './progressionStore';
import { useCodeLanguage } from './languageStore';
import { ConceptId, CONCEPTS } from './types';

export default function App() {
  const [activeConceptId, setActiveConceptId] = useState<ConceptId>(() => {
    const saved = localStorage.getItem('algo_active_concept');
    return (saved as ConceptId) || 'logic-gates';
  });
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);

  // Global Code Language (Python / Pseudo-code)
  const { language, setLanguage, isPython } = useCodeLanguage();

  // Local-First progression store
  const {
    completed,
    isCompleted,
    toggleConcept,
    learnerName,
    setLearnerName,
    level1CompletedCount,
    totalLevel1,
    percentage,
    isLevel1Complete,
    exportJSON,
    importJSON
  } = useProgression();

  React.useEffect(() => {
    localStorage.setItem('algo_active_concept', activeConceptId);
  }, [activeConceptId]);

  // Export JSON file download
  const handleExportJSON = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `algo_progression_${learnerName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Find active concept metadata
  const activeConcept = CONCEPTS.find((c) => c.id === activeConceptId) || CONCEPTS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
      <div className="flex flex-1 min-h-screen">
        {/* Left Vertical Navigation Bar (Barre verticale à gauche) */}
        <Sidebar
          activeConceptId={activeConceptId}
          onSelectConcept={(id) => setActiveConceptId(id)}
          isOpen={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
          completedConcepts={completed}
          level1CompletedCount={level1CompletedCount}
          totalLevel1={totalLevel1}
          isLevel1Complete={isLevel1Complete}
          onOpenCertificate={() => setIsCertificateOpen(true)}
          onExportJSON={handleExportJSON}
          onImportJSON={importJSON}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Mobile hamburger button to open sidebar */}
                <button
                  onClick={() => setIsSidebarOpenMobile(true)}
                  className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Ouvrir le menu des notions"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* Active concept indicator in header */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                    Notion active :
                  </span>
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
                    {activeConcept.title}
                  </span>
                </div>
              </div>

              {/* Utility Actions */}
              <div className="flex items-center gap-2">
                
                {/* Global Code Language Switcher (Python / Pseudo) */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setLanguage('python')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      isPython
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Syntaxe Python 3 idiomatic"
                  >
                    <span>🐍</span>
                    <span className="hidden md:inline font-mono">Python</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('pseudocode')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      !isPython
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Syntaxe Pseudo-code didactique"
                  >
                    <span>📝</span>
                    <span className="hidden md:inline font-mono">Pseudo</span>
                  </button>
                </div>

                {/* Certificate & Progression Header Badge */}
                <button
                  onClick={() => setIsCertificateOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition cursor-pointer"
                  title="Ouvrir mon Certificat Niveau 1"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Niveau 1 :</span>
                  <span className="font-mono text-emerald-400">{level1CompletedCount}/{totalLevel1}</span>
                  <span className="text-[10px] text-amber-400/80">({percentage}%)</span>
                </button>

                {/* Sound Toggle */}
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                  title={soundEnabled ? 'Désactiver les sons' : 'Activer les sons'}
                  aria-label="Effets sonores"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 border-l border-slate-800 pl-3">
                  <span className="font-mono text-slate-300">{activeConcept.timeEstimate}</span>
                  <span aria-hidden="true" className="text-slate-700">·</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px]">
                    {activeConcept.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Body Content */}
          <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-10">
            {/* 1. Logique & Mathématiques */}
            {activeConceptId === 'logic-gates' && (
              <LogicGatesView />
            )}
            {activeConceptId === 'modulo-arithmetic' && (
              <ModuloView />
            )}
            {activeConceptId === 'sets-venn' && (
              <SetsVennView />
            )}

            {/* 2. Systèmes & Modèle Mémoire */}
            {activeConceptId === 'memory-model' && (
              <MemoryModelView />
            )}
            {activeConceptId === 'binary-hex' && (
              <BinaryHexView />
            )}
            {activeConceptId === 'sequential-exec' && (
              <SequentialExecView 
                language={language} 
                onLanguageChange={setLanguage} 
              />
            )}
            {activeConceptId === 'loop-control' && (
              <LoopControlView 
                language={language} 
                onLanguageChange={setLanguage} 
              />
            )}
            {activeConceptId === 'call-stack' && (
              <CallStackView 
                language={language} 
                onLanguageChange={setLanguage} 
              />
            )}

            {/* 3. Structures Linéaires & Algorithmes */}
            {activeConceptId === 'linear-search' && (
              <LinearSearchView 
                soundEnabled={soundEnabled} 
                language={language} 
                onLanguageChange={setLanguage} 
              />
            )}
            {activeConceptId === 'find-extrema' && (
              <FindExtremaView 
                language={language} 
                onLanguageChange={setLanguage} 
              />
            )}
            {activeConceptId === 'linked-list' && (
              <LinkedListView />
            )}
            {activeConceptId === 'stack' && (
              <StackView />
            )}
            {activeConceptId === 'queue' && (
              <QueueView />
            )}

            {/* 4. Pour aller plus loin (Niveau 2) */}
            {activeConceptId === 'binary-search' && (
              <BinarySearchView soundEnabled={soundEnabled} />
            )}
            {activeConceptId === 'bubble-sort' && (
              <BubbleSortView />
            )}
            {activeConceptId === 'big-o' && (
              <BigOView />
            )}

            {/* Recommandation de la prochaine notion & bouton NEXT + Marquer comme maîtrisé */}
            <NextConceptBar
              currentConceptId={activeConceptId}
              onNavigate={(id) => setActiveConceptId(id)}
              isCompleted={isCompleted(activeConceptId)}
              onToggleCompleted={() => toggleConcept(activeConceptId)}
              onOpenCertificate={() => setIsCertificateOpen(true)}
              isLevel1Complete={isLevel1Complete}
              completedCount={level1CompletedCount}
            />

            {/* Avis & Retour d'apprentissage sous l'exercice */}
            <ConceptFeedback 
              conceptId={activeConceptId} 
              conceptTitle={activeConcept.title} 
            />
          </main>
        </div>
      </div>

      {/* Official Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        learnerName={learnerName}
        onUpdateLearnerName={setLearnerName}
        completedCount={level1CompletedCount}
      />
    </div>
  );
}
