import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  Info,
  Code2,
  Eye,
  GitFork
} from 'lucide-react';

interface BinarySearchStep {
  lineId: number;
  left: number;
  right: number;
  mid: number | null;
  phase: 'check_loop' | 'calc_mid' | 'compare' | 'found' | 'adjust_left' | 'adjust_right' | 'not_found';
  explanation: string;
}

export default function BinarySearchView({ soundEnabled }: { soundEnabled: boolean }) {
  // Sorted array for binary search
  const array = [12, 25, 37, 48, 59, 73, 86];
  const [target, setTarget] = useState<number>(59);

  const [stepIndex, setStepIndex] = useState<number>(-1);
  const [isRunningAuto, setIsRunningAuto] = useState<boolean>(false);

  const PSEUDO_CODE = [
    { id: 1, label: 'Ligne 1', code: 'gauche = 0, droite = taille - 1' },
    { id: 2, label: 'Ligne 2', code: 'Tant que gauche <= droite :' },
    { id: 3, label: 'Ligne 3', code: '  milieu = floor((gauche + droite) / 2)' },
    { id: 4, label: 'Ligne 4', code: '  Si élément[milieu] == cible : retourner "Trouvé"' },
    { id: 5, label: 'Ligne 5', code: '  Si élément[milieu] < cible : gauche = milieu + 1' },
    { id: 6, label: 'Ligne 6', code: '  Sinon : droite = milieu - 1' },
    { id: 7, label: 'Ligne 7', code: 'Fin de boucle, retourner "Non trouvé"' },
  ];

  // Generate sequence of steps
  const steps: BinarySearchStep[] = React.useMemo(() => {
    const list: BinarySearchStep[] = [];
    let l = 0;
    let r = array.length - 1;

    list.push({
      lineId: 1,
      left: l,
      right: r,
      mid: null,
      phase: 'check_loop',
      explanation: `Initialisation des bornes : gauche = 0, droite = ${r}.`,
    });

    while (l <= r) {
      list.push({
        lineId: 2,
        left: l,
        right: r,
        mid: null,
        phase: 'check_loop',
        explanation: `Test boucle : gauche (${l}) <= droite (${r}) ? Vrai. On continue l'exploration.`,
      });

      const m = Math.floor((l + r) / 2);
      list.push({
        lineId: 3,
        left: l,
        right: r,
        mid: m,
        phase: 'calc_mid',
        explanation: `Calcul du milieu : (${l} + ${r}) / 2 = indice ${m} (valeur = ${array[m]}).`,
      });

      if (array[m] === target) {
        list.push({
          lineId: 4,
          left: l,
          right: r,
          mid: m,
          phase: 'found',
          explanation: `Succès ! array[${m}] (${array[m]}) == cible (${target}). Cible trouvée en O(log n) étapes !`,
        });
        return list;
      }

      if (array[m] < target) {
        list.push({
          lineId: 5,
          left: l,
          right: r,
          mid: m,
          phase: 'adjust_left',
          explanation: `${array[m]} < ${target} : la cible est dans la moitié droite. Nouvelle borne : gauche = ${m + 1}.`,
        });
        l = m + 1;
      } else {
        list.push({
          lineId: 6,
          left: l,
          right: r,
          mid: m,
          phase: 'adjust_right',
          explanation: `${array[m]} > ${target} : la cible est dans la moitié gauche. Nouvelle borne : droite = ${m - 1}.`,
        });
        r = m - 1;
      }
    }

    list.push({
      lineId: 7,
      left: l,
      right: r,
      mid: null,
      phase: 'not_found',
      explanation: `gauche (${l}) > droite (${r}) : la zone de recherche est vide. Cible ${target} non trouvée.`,
    });

    return list;
  }, [array, target]);

  const current = stepIndex >= 0 && stepIndex < steps.length ? steps[stepIndex] : null;
  const isFinished = stepIndex >= steps.length - 1 && stepIndex !== -1;
  const isFound = current?.phase === 'found';
  const isNotFound = current?.phase === 'not_found';

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((s) => s + 1);
    } else {
      setIsRunningAuto(false);
    }
  };

  const handleReset = () => {
    setIsRunningAuto(false);
    setStepIndex(-1);
  };

  useEffect(() => {
    if (!isRunningAuto) return;
    if (isFinished) {
      setIsRunningAuto(false);
      return;
    }
    const t = setTimeout(handleNext, 1200);
    return () => clearTimeout(t);
  }, [isRunningAuto, stepIndex, isFinished]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Target */}
      <section className="text-center">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-left flex items-center gap-2.5">
              <GitFork className="w-7 h-7 text-sky-400" />
              <span>Recherche Binaire (Binary Search)</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 text-left mt-1">
              Nécessite un tableau <strong>trié</strong>. Divise l'espace de recherche par deux à chaque comparaison : complexité <strong className="text-sky-300 font-mono">O(log n)</strong>.
            </p>
          </div>
        </div>

        {/* Target Selector */}
        <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-2.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-slate-400">
            <Search className="w-3.5 h-3.5 text-sky-400" />
            <span>Cible :</span>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-sky-500/30">
            <span className="text-2xl font-bold font-mono text-sky-300 tabular-nums">
              {target}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-center px-2">
            <span className="text-[11px] text-slate-500 mr-1">Tester :</span>
            {[25, 48, 59, 86, 99].map((val) => (
              <button
                key={val}
                onClick={() => {
                  handleReset();
                  setTarget(val);
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  target === val
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {val === 99 ? '99 (absent)' : val}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Two Zones: Pseudo-code & Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Zone 1: Pseudo-code */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Zone 1 · Pseudo-code
                </h2>
              </div>
              {current && (
                <span className="text-xs font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50">
                  Ligne {current.lineId}
                </span>
              )}
            </div>

            <div className="space-y-1.5 font-mono text-xs sm:text-sm">
              {PSEUDO_CODE.map((line) => {
                const isActive = current?.lineId === line.id;
                let activeStyle = 'bg-sky-500/15 border-sky-400 text-white ring-1 ring-sky-500/20';
                if (line.id === 4 && isActive) {
                  activeStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 ring-1 ring-emerald-500/30';
                } else if (line.id === 7 && isActive) {
                  activeStyle = 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-500/30';
                }

                return (
                  <div
                    key={line.id}
                    className={`py-2 px-3 rounded-lg border-l-4 transition-all duration-300 ${
                      isActive
                        ? activeStyle
                        : 'border-transparent text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <span className="text-slate-500 mr-2 text-[11px]">{line.label} :</span>
                    <span className={isActive ? 'font-semibold' : ''}>{line.code}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>À chaque étape, la taille du problème est divisée par 2.</span>
          </div>
        </div>

        {/* Zone 2: Visual Area */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Zone 2 · Zone Visuelle (Tableau Trié)
                </h2>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 font-mono">
                <span>G = Gauche</span>
                <span>·</span>
                <span>M = Milieu</span>
                <span>·</span>
                <span>D = Droite</span>
              </div>
            </div>

            {/* Array of 7 sorted elements */}
            <div className="py-6">
              <div className="grid grid-cols-7 gap-2 max-w-xl mx-auto">
                {array.map((val, idx) => {
                  const isMid = current?.mid === idx;
                  const isLeft = current?.left === idx;
                  const isRight = current?.right === idx;
                  
                  // Out of active bounds
                  const isOutOfRange = current ? idx < current.left || idx > current.right : false;
                  const isMatched = isFound && isMid;

                  let cardClasses = 'bg-slate-950 border-slate-800 text-slate-300';
                  if (isMatched) {
                    cardClasses = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 scale-105 ring-2 ring-emerald-500/50';
                  } else if (isMid) {
                    cardClasses = 'bg-amber-400/25 border-amber-400 text-amber-200 scale-105 ring-2 ring-amber-400/60';
                  } else if (isOutOfRange) {
                    cardClasses = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-30 line-through';
                  }

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      {/* Pointer Pointers Top */}
                      <div className="h-6 flex items-center justify-center gap-1 mb-1 text-[11px] font-mono font-bold">
                        {isLeft && <span className="text-sky-400">G</span>}
                        {isMid && <span className="text-amber-300">M</span>}
                        {isRight && <span className="text-purple-400">D</span>}
                      </div>

                      {/* Card */}
                      <div
                        className={`w-full aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-1 transition-all duration-300 ${cardClasses}`}
                      >
                        <span className="text-[10px] font-mono opacity-60">[{idx}]</span>
                        <span className="text-lg sm:text-xl font-extrabold font-mono tabular-nums">
                          {val}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explanation box */}
            <div className="mt-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Explication de l'étape :</span>
              </div>
              <p className="text-sm text-slate-200 font-medium">
                {current ? current.explanation : "Cliquez sur 'Étape Suivante' pour débuter la recherche binaire."}
              </p>
            </div>
          </div>

          {/* Result banners */}
          {isFound && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div className="text-xs sm:text-sm">
                <strong>Trouvé !</strong> La cible {target} est localisée à l'indice {current?.mid} en un temps record.
              </div>
            </div>
          )}

          {isNotFound && (
            <div className="mt-4 p-4 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center gap-3">
              <XCircle className="w-6 h-6 text-amber-400 shrink-0" />
              <div className="text-xs sm:text-sm">
                <strong>Non trouvé !</strong> Les bornes se sont croisées sans trouver {target}.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleNext}
            disabled={isFinished}
            className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
              isFinished
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
            }`}
          >
            <span>Étape Suivante</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="px-5 py-3 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Réinitialiser</span>
          </button>
        </div>

        <button
          onClick={() => {
            if (isFinished) handleReset();
            setIsRunningAuto(!isRunningAuto);
          }}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
        >
          {isRunningAuto ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isRunningAuto ? 'Pause' : 'Lecture Auto'}</span>
        </button>
      </section>
    </div>
  );
}
