/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Menu, 
  Volume2, 
  VolumeX 
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
import { ConceptId, CONCEPTS } from './types';

export default function App() {
  const [activeConceptId, setActiveConceptId] = useState<ConceptId>(() => {
    const saved = localStorage.getItem('algo_active_concept');
    return (saved as ConceptId) || 'logic-gates';
  });
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  React.useEffect(() => {
    localStorage.setItem('algo_active_concept', activeConceptId);
  }, [activeConceptId]);

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
              <SequentialExecView />
            )}
            {activeConceptId === 'loop-control' && (
              <LoopControlView />
            )}
            {activeConceptId === 'call-stack' && (
              <CallStackView />
            )}

            {/* 3. Structures Linéaires & Algorithmes */}
            {activeConceptId === 'linear-search' && (
              <LinearSearchView soundEnabled={soundEnabled} />
            )}
            {activeConceptId === 'find-extrema' && (
              <FindExtremaView />
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

            {/* Recommandation de la prochaine notion & bouton NEXT */}
            <NextConceptBar
              currentConceptId={activeConceptId}
              onNavigate={(id) => setActiveConceptId(id)}
            />

            {/* Avis & Retour d'apprentissage sous l'exercice */}
            <ConceptFeedback 
              conceptId={activeConceptId} 
              conceptTitle={activeConcept.title} 
            />
          </main>
        </div>
      </div>
    </div>
  );
}
