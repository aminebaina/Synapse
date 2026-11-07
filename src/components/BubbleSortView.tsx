import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ArrowUpDown, 
  CheckCircle2, 
  Sparkles, 
  Info, 
  Code2, 
  Eye,
  Shuffle
} from 'lucide-react';

interface BubbleStep {
  lineId: number;
  array: number[];
  i: number;
  j: number;
  isComparing: boolean;
  isSwapping: boolean;
  sortedIndices: number[];
  explanation: string;
}

export default function BubbleSortView() {
  const initialData = [50, 20, 80, 10, 40];
  const [data, setData] = useState<number[]>(initialData);
  const [stepIndex, setStepIndex] = useState<number>(-1);
  const [isRunningAuto, setIsRunningAuto] = useState<boolean>(false);

  const PSEUDO_CODE = [
    { id: 1, label: 'Ligne 1', code: 'Pour i allant de 0 à N - 1 :' },
    { id: 2, label: 'Ligne 2', code: '  Pour j allant de 0 à N - i - 2 :' },
    { id: 3, label: 'Ligne 3', code: '    Si tableau[j] > tableau[j + 1] :' },
    { id: 4, label: 'Ligne 4', code: '      Permuter(tableau[j], tableau[j + 1])' },
    { id: 5, label: 'Ligne 5', code: 'Fin des passes, tableau complètement trié' },
  ];

  // Precompute steps
  const steps: BubbleStep[] = React.useMemo(() => {
    const list: BubbleStep[] = [];
    const arr = [...data];
    const n = arr.length;
    const sorted: number[] = [];

    for (let i = 0; i < n; i++) {
      list.push({
        lineId: 1,
        array: [...arr],
        i,
        j: 0,
        isComparing: false,
        isSwapping: false,
        sortedIndices: [...sorted],
        explanation: `Passe ${i + 1} / ${n} : On va faire remonter le plus grand élément vers la droite.`,
      });

      for (let j = 0; j < n - i - 1; j++) {
        list.push({
          lineId: 2,
          array: [...arr],
          i,
          j,
          isComparing: false,
          isSwapping: false,
          sortedIndices: [...sorted],
          explanation: `Itération j = ${j} : sélection des éléments adjacents aux indices ${j} et ${j + 1}.`,
        });

        // Compare
        const needSwap = arr[j] > arr[j + 1];
        list.push({
          lineId: 3,
          array: [...arr],
          i,
          j,
          isComparing: true,
          isSwapping: false,
          sortedIndices: [...sorted],
          explanation: `Comparaison : Est-ce que ${arr[j]} > ${arr[j + 1]} ? ${needSwap ? 'OUI (permutation nécessaire)' : 'NON (ordre correct)'}.`,
        });

        if (needSwap) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;

          list.push({
            lineId: 4,
            array: [...arr],
            i,
            j,
            isComparing: false,
            isSwapping: true,
            sortedIndices: [...sorted],
            explanation: `Permutation effectuée : [${arr[j + 1]}, ${arr[j]}] devient [${arr[j]}, ${arr[j + 1]}].`,
          });
        }
      }
      sorted.push(n - i - 1);
    }

    list.push({
      lineId: 5,
      array: [...arr],
      i: n,
      j: 0,
      isComparing: false,
      isSwapping: false,
      sortedIndices: [0, 1, 2, 3, 4],
      explanation: 'Tri à bulles terminé ! Tous les éléments sont triés par ordre croissant.',
    });

    return list;
  }, [data]);

  const current = stepIndex >= 0 && stepIndex < steps.length ? steps[stepIndex] : null;
  const isFinished = stepIndex >= steps.length - 1 && stepIndex !== -1;
  const displayedArray = current ? current.array : data;

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

  const handleShuffle = () => {
    handleReset();
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    setData(shuffled);
  };

  useEffect(() => {
    if (!isRunningAuto) return;
    if (isFinished) {
      setIsRunningAuto(false);
      return;
    }
    const t = setTimeout(handleNext, 900);
    return () => clearTimeout(t);
  }, [isRunningAuto, stepIndex, isFinished]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ArrowUpDown className="w-7 h-7 text-sky-400" />
            <span>Tri à Bulles (Bubble Sort)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Compare successivement les paires voisines et les échange si elles sont dans le désordre. Complexité <strong className="text-sky-300 font-mono">O(n²)</strong>.
          </p>
        </div>

        <button
          onClick={handleShuffle}
          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Mélanger</span>
        </button>
      </section>

      {/* Two Zones */}
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
                  activeStyle = 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-500/30';
                } else if (line.id === 5 && isActive) {
                  activeStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 ring-1 ring-emerald-500/30';
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
            <span>À chaque grande passe, le plus grand élément remonte telle une bulle à sa position finale.</span>
          </div>
        </div>

        {/* Zone 2: Visual Area with animated bars */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Zone 2 · Zone Visuelle (Barres & Cases)
                </h2>
              </div>
              <div className="text-xs text-slate-400">
                Passe : <strong className="text-slate-200">{current ? current.i + 1 : 0} / 5</strong>
              </div>
            </div>

            {/* Visual Bars Container */}
            <div className="py-6 flex items-end justify-center gap-4 h-56">
              {displayedArray.map((val, idx) => {
                const isComparing = current?.isComparing && (idx === current.j || idx === current.j + 1);
                const isSwapping = current?.isSwapping && (idx === current.j || idx === current.j + 1);
                const isSorted = current?.sortedIndices.includes(idx);

                let barColor = 'bg-slate-800 border-slate-700 text-slate-300';
                if (isSorted) {
                  barColor = 'bg-emerald-500/25 border-emerald-400 text-emerald-200';
                } else if (isSwapping) {
                  barColor = 'bg-purple-500/30 border-purple-400 text-purple-200 scale-105';
                } else if (isComparing) {
                  barColor = 'bg-amber-400/30 border-amber-400 text-amber-200 scale-105';
                }

                return (
                  <div key={idx} className="flex-1 max-w-[70px] flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-xs font-mono font-bold">{val}</span>
                    <div
                      className={`w-full rounded-t-xl border-2 transition-all duration-300 flex items-center justify-center ${barColor}`}
                      style={{ height: `${(val / 90) * 100}%` }}
                    />
                    <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
                  </div>
                );
              })}
            </div>

            {/* Step Explanation */}
            <div className="mt-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Explication :</span>
              </div>
              <p className="text-sm text-slate-200 font-medium">
                {current ? current.explanation : "Cliquez sur 'Étape Suivante' pour démarrer le tri à bulles."}
              </p>
            </div>
          </div>

          {isFinished && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div className="text-xs sm:text-sm">
                <strong>Tableau trié avec succès !</strong> Les 5 éléments sont maintenant dans l'ordre croissant.
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
