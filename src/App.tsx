/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Volume2, 
  VolumeX,
  Award,
  CheckCircle2,
  GraduationCap,
  Tv,
  Compass
} from 'lucide-react';
import TracksCatalogView, { TrackId } from './components/TracksCatalogView';
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
import StudentClassBanner from './components/StudentClassBanner';
import TeacherDashboardModal from './components/TeacherDashboardModal';
import JoinClassModal from './components/JoinClassModal';
import { 
  getStoredClasses, 
  saveClasses, 
  getActiveStudentClassCode, 
  setActiveStudentClassCode, 
  TeacherClass 
} from './teacherStore';
import { useProgression } from './progressionStore';
import { useCodeLanguage } from './languageStore';
import { ConceptId, CONCEPTS } from './types';

export default function App() {
  const [activeConceptId, setActiveConceptId] = useState<ConceptId>(() => {
    const saved = localStorage.getItem('algo_active_concept');
    return (saved as ConceptId) || 'logic-gates';
  });
  
  // Track selection state: 'tracks' for the 3 tracks catalog, 'curriculum' for the interactive course
  const [currentView, setCurrentView] = useState<'tracks' | 'curriculum'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('concept')) {
        return 'curriculum';
      }
    }
    const saved = localStorage.getItem('algo_current_view');
    return (saved as 'tracks' | 'curriculum') || 'tracks';
  });

  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  
  // Teacher Portal & Student Class states
  const [classes, setClasses] = useState<TeacherClass[]>(() => getStoredClasses());
  const [activeClassCode, setActiveClassCode] = useState<string | null>(() => getActiveStudentClassCode());
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState<boolean>(false);
  const [isJoinClassModalOpen, setIsJoinClassModalOpen] = useState<boolean>(false);
  const [isProjectorMode, setIsProjectorMode] = useState<boolean>(false);

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

  // Active class lookup
  const activeClass = classes.find((c) => c.code === activeClassCode) || null;

  // Check URL on mount for ?class=CODE
  useEffect(() => {
    const code = getActiveStudentClassCode();
    if (code) {
      setActiveClassCode(code);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('algo_active_concept', activeConceptId);
  }, [activeConceptId]);

  useEffect(() => {
    localStorage.setItem('algo_current_view', currentView);
  }, [currentView]);

  // Synchronize completion with active class roster if student is enrolled
  const handleToggleConceptWithClass = (conceptId: ConceptId) => {
    toggleConcept(conceptId);

    if (activeClassCode) {
      setClasses((prevClasses) => {
        const updated = prevClasses.map((cls) => {
          if (cls.code === activeClassCode) {
            const studentExists = cls.students.some((s) => s.name === learnerName);
            const willBeCompleted = !isCompleted(conceptId);
            const nextCompleted = willBeCompleted
              ? [...completed, conceptId]
              : completed.filter((id) => id !== conceptId);

            const scoreTwenty = Math.round((nextCompleted.length / cls.assignedConceptIds.length) * 20 * 10) / 10;

            let nextStudents;
            if (studentExists) {
              nextStudents = cls.students.map((s) =>
                s.name === learnerName
                  ? {
                      ...s,
                      completedConcepts: nextCompleted,
                      lastActive: "À l'instant",
                      scoreTwenty
                    }
                  : s
              );
            } else {
              nextStudents = [
                {
                  id: `stu_self_${Date.now()}`,
                  name: learnerName,
                  email: '',
                  completedConcepts: nextCompleted,
                  lastActive: "À l'instant",
                  scoreTwenty
                },
                ...cls.students
              ];
            }
            return { ...cls, students: nextStudents };
          }
          return cls;
        });
        saveClasses(updated);
        return updated;
      });
    }
  };

  const handleJoinClass = (code: string, studentName: string) => {
    setActiveStudentClassCode(code);
    setActiveClassCode(code);
    setLearnerName(studentName);
  };

  const handleLeaveClass = () => {
    setActiveStudentClassCode(null);
    setActiveClassCode(null);
  };

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

  if (currentView === 'tracks') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
        <TracksCatalogView
          onSelectTrack={(trackId) => {
            if (trackId === 'algo-maths') {
              setCurrentView('curriculum');
            }
          }}
          completedCount={level1CompletedCount}
          totalCount={totalLevel1}
          onOpenTeacherPortal={() => setIsTeacherDashboardOpen(true)}
          onOpenCertificate={() => setIsCertificateOpen(true)}
          onOpenJoinClass={() => setIsJoinClassModalOpen(true)}
          activeClassCode={activeClassCode}
        />

        {/* Modals accessible directly from tracks landing */}
        <CertificateModal
          isOpen={isCertificateOpen}
          onClose={() => setIsCertificateOpen(false)}
          learnerName={learnerName}
          onUpdateLearnerName={setLearnerName}
          completedCount={level1CompletedCount}
        />

        <TeacherDashboardModal
          isOpen={isTeacherDashboardOpen}
          onClose={() => setIsTeacherDashboardOpen(false)}
          classes={classes}
          onUpdateClasses={setClasses}
          onToggleProjectorMode={() => setIsProjectorMode(!isProjectorMode)}
          isProjectorMode={isProjectorMode}
        />

        <JoinClassModal
          isOpen={isJoinClassModalOpen}
          onClose={() => setIsJoinClassModalOpen(false)}
          classes={classes}
          onJoinSuccess={handleJoinClass}
          currentStudentName={learnerName}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
      <div className="flex flex-1 min-h-screen">
        {/* Left Vertical Navigation Bar (Hidden on desktop if Projector Mode is on) */}
        {!isProjectorMode && (
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
            onReturnToTracks={() => setCurrentView('tracks')}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Mobile hamburger button to open sidebar */}
                {!isProjectorMode && (
                  <button
                    onClick={() => setIsSidebarOpenMobile(true)}
                    className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    aria-label="Ouvrir le menu des notions"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                )}

                {/* Return to tracks button */}
                <button
                  onClick={() => setCurrentView('tracks')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-semibold transition cursor-pointer"
                  title="Voir les 3 parcours disponibles"
                >
                  <Compass className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">Parcours (3)</span>
                </button>

                {/* Active concept indicator in header */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                    Notion :
                  </span>
                  <span className="text-sm font-bold text-white flex items-center gap-1.5 truncate max-w-[180px] sm:max-w-none">
                    <span className="w-2 h-2 rounded-full bg-sky-400 inline-block shrink-0" />
                    <span className="truncate">{activeConcept.title}</span>
                  </span>
                </div>
              </div>

              {/* Utility Actions */}
              <div className="flex items-center gap-2">
                
                {/* Espace Enseignant Button */}
                <button
                  onClick={() => setIsTeacherDashboardOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-bold transition cursor-pointer"
                  title="Ouvrir le portail enseignant & suivi de classe"
                >
                  <GraduationCap className="w-4 h-4 text-sky-400" />
                  <span className="hidden sm:inline">Espace Enseignant</span>
                </button>

                {/* Projector / Amphi Mode Button */}
                <button
                  onClick={() => setIsProjectorMode(!isProjectorMode)}
                  className={`p-2 rounded-lg transition cursor-pointer ${
                    isProjectorMode 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  title={isProjectorMode ? 'Quitter le mode projection' : 'Mode Vidéoprojecteur (Plein écran Amphi)'}
                >
                  <Tv className="w-4 h-4 text-amber-400" />
                </button>

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
              </div>
            </div>
          </header>

          {/* Student Class Enrollment Banner */}
          <StudentClassBanner
            currentClass={activeClass}
            learnerName={learnerName}
            onUpdateLearnerName={setLearnerName}
            completedCount={level1CompletedCount}
            totalAssigned={activeClass ? activeClass.assignedConceptIds.length : totalLevel1}
            onOpenJoinModal={() => setIsJoinClassModalOpen(true)}
            onLeaveClass={handleLeaveClass}
          />

          {/* Projector Mode Top Notification */}
          {isProjectorMode && (
            <div className="bg-amber-500/20 border-b border-amber-500/40 px-4 py-2 flex items-center justify-between text-xs text-amber-200 font-bold">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>MODE VIDÉOPROJECTEUR ACTIF · Format agrandi pour amphi & grand écran</span>
              </div>
              <button
                onClick={() => setIsProjectorMode(false)}
                className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] cursor-pointer"
              >
                Quitter la projection
              </button>
            </div>
          )}

          {/* Body Content */}
          <main className={`flex-1 w-full mx-auto px-4 py-8 sm:py-10 ${isProjectorMode ? 'max-w-6xl' : 'max-w-5xl'}`}>
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
              onToggleCompleted={() => handleToggleConceptWithClass(activeConceptId)}
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

      {/* Teacher Dashboard & Class Management Modal */}
      <TeacherDashboardModal
        isOpen={isTeacherDashboardOpen}
        onClose={() => setIsTeacherDashboardOpen(false)}
        classes={classes}
        onUpdateClasses={setClasses}
        onToggleProjectorMode={() => setIsProjectorMode(!isProjectorMode)}
        isProjectorMode={isProjectorMode}
      />

      {/* Student Join Class Modal */}
      <JoinClassModal
        isOpen={isJoinClassModalOpen}
        onClose={() => setIsJoinClassModalOpen(false)}
        classes={classes}
        onJoinSuccess={handleJoinClass}
        currentStudentName={learnerName}
      />
    </div>
  );
}
