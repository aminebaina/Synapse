import React, { useState } from 'react';
import { Trophy, ChevronRight, RotateCcw, Shuffle, Sparkles, Info, Code2, Eye } from 'lucide-react';
import { CodeLanguage } from '../languageStore';

interface ExtremaStep {
  lineId: number;
  idx: number;
  currentChampion: number;
  championIdx: number;
  isComparing: boolean;
  isNewChampion: boolean;
  explanation: string;
}

interface FindExtremaViewProps {
  language?: CodeLanguage;
  onLanguageChange?: (lang: CodeLanguage) => void;
}

export default function FindExtremaView({
  language = 'python',
  onLanguageChange
}: FindExtremaViewProps = {}) {
  const [array, setArray] = useState<number[]>([23, 78, 12, 95, 41]);
  const [mode, setMode] = useState<'MAX' | 'MIN'>('MAX');
  const [stepIndex, setStepIndex] = useState<number>(-1);

  // Generate sequence of steps
  const steps: ExtremaStep[] = React.useMemo(() => {
    const list: ExtremaStep[] = [];
    let champ = array[0];
    let champIndex = 0;

    // Step 1 : Init champion
    list.push({
      lineId: 1,
      idx: 0,
      currentChampion: champ,
      championIdx: champIndex,
      isComparing: false,
      isNewChampion: false,
      explanation: `Initialisation : Le premier élément tableau[0] (${champ}) est déclaré ${mode === 'MAX' ? 'maximum' : 'minimum'} par défaut.`,
    });

    for (let i = 1; i < array.length; i++) {
      const val = array[i];

      // Step 2 : Loop header
      list.push({
        lineId: 2,
        idx: i,
        currentChampion: champ,
        championIdx: champIndex,
        isComparing: false,
        isNewChampion: false,
        explanation: `Boucle : Nous examinons la case d'indice ${i} (valeur = ${val}).`,
      });

      // Step 3 : Test condition
      const isBetter = mode === 'MAX' ? val > champ : val < champ;
      list.push({
        lineId: 3,
        idx: i,
        currentChampion: champ,
        championIdx: champIndex,
        isComparing: true,
        isNewChampion: false,
        explanation: `Comparaison : Est-ce que ${val} ${mode === 'MAX' ? '>' : '<'} ${champ} (champion actuel) ? ${isBetter ? 'OUI !' : 'NON.'}`,
      });

      if (isBetter) {
        champ = val;
        champIndex = i;
        // Step 4 : Update champion
        list.push({
          lineId: 4,
          idx: i,
          currentChampion: champ,
          championIdx: champIndex,
          isComparing: false,
          isNewChampion: true,
          explanation: `Nouveau champion ! Le ${mode === 'MAX' ? 'maximum' : 'minimum'} devient ${champ} (à l'indice ${i}).`,
        });
      }
    }

    // Step 5 : Final
    list.push({
      lineId: 5,
      idx: array.length - 1,
      currentChampion: champ,
      championIdx: champIndex,
      isComparing: false,
      isNewChampion: false,
      explanation: `Algorithme terminé ! Le ${mode === 'MAX' ? 'maximum' : 'minimum'} absolu du tableau est ${champ} (indice ${champIndex}).`,
    });

    return list;
  }, [array, mode]);

  const current = stepIndex >= 0 && stepIndex < steps.length ? steps[stepIndex] : null;
  const isFinished = stepIndex >= steps.length - 1 && stepIndex !== -1;

  const handleNext = () => {
    if (stepIndex < steps.length - 1) setStepIndex((s) => s + 1);
  };

  const handleReset = () => {
    setStepIndex(-1);
  };

  const handleShuffle = () => {
    handleReset();
    const newArr = Array.from({ length: 5 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArr);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Trophy className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Recherche du Maximum / Minimum (Extrema)
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          L'algorithme fondamental d'évaluation : conserver en mémoire le meilleur candidat rencontré jusqu'à présent (le trophée) et le mettre à jour à chaque fois qu'un élément le dépasse.
        </p>
      </section>

      {/* Mode Switcher & Shuffle */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
          <button
            onClick={() => { handleReset(); setMode('MAX'); }}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              mode === 'MAX' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Chercher le Maximum
          </button>
          <button
            onClick={() => { handleReset(); setMode('MIN'); }}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              mode === 'MIN' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Chercher le Minimum
          </button>
        </div>

        <button
          onClick={handleShuffle}
          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Générer d'autres nombres</span>
        </button>
      </div>

      {/* Two Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Zone 1: Code (Left 5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-sky-400" />
                <span>Zone 1 · {language === 'python' ? 'Code Python' : 'Pseudo-code'}</span>
              </h2>

              <div className="flex items-center gap-2">
                {/* Language Switcher */}
                <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => onLanguageChange && onLanguageChange('python')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                      language === 'python'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>🐍</span>
                    <span>Python</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onLanguageChange && onLanguageChange('pseudocode')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                      language === 'pseudocode'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>📝</span>
                    <span>Pseudo</span>
                  </button>
                </div>

                {current && (
                  <span className="text-xs font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50">
                    L.{current.lineId}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5 font-mono text-xs sm:text-sm">
              <div className={`p-2 rounded-lg border-l-4 transition-all ${
                current?.lineId === 1 ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold ring-1 ring-amber-400/30' : 'border-transparent text-slate-400'
              }`}>
                <span className="text-slate-600 mr-2 text-[11px]">1 :</span>
                <span>champion = tableau[0]</span>
              </div>

              <div className={`p-2 rounded-lg border-l-4 transition-all ${
                current?.lineId === 2 ? 'bg-sky-500/15 border-sky-400 text-white font-bold ring-1 ring-sky-500/30' : 'border-transparent text-slate-400'
              }`}>
                <span className="text-slate-600 mr-2 text-[11px]">2 :</span>
                <span>{language === 'python' ? 'for i in range(1, len(tableau)):' : 'Pour i allant de 1 à N-1 :'}</span>
              </div>

              <div className={`p-2 pl-6 rounded-lg border-l-4 transition-all ${
                current?.lineId === 3 ? 'bg-sky-500/15 border-sky-400 text-white font-bold ring-1 ring-sky-500/30' : 'border-transparent text-slate-400'
              }`}>
                <span className="text-slate-600 mr-2 text-[11px]">3 :</span>
                <span>
                  {language === 'python'
                    ? `if tableau[i] ${mode === 'MAX' ? '>' : '<'} champion:`
                    : `Si tableau[i] ${mode === 'MAX' ? '>' : '<'} champion :`}
                </span>
              </div>

              <div className={`p-2 pl-10 rounded-lg border-l-4 transition-all ${
                current?.lineId === 4 ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold ring-1 ring-emerald-400/30' : 'border-transparent text-slate-400'
              }`}>
                <span className="text-slate-600 mr-2 text-[11px]">4 :</span>
                <span>{language === 'python' ? '    champion = tableau[i]' : 'champion = tableau[i]'}</span>
              </div>

              <div className={`p-2 rounded-lg border-l-4 transition-all ${
                current?.lineId === 5 ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold ring-1 ring-emerald-400/30' : 'border-transparent text-slate-400'
              }`}>
                <span className="text-slate-600 mr-2 text-[11px]">5 :</span>
                <span>{language === 'python' ? 'return champion' : 'Fin, retourner champion'}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500">
            Complexité en temps : <strong className="text-white font-mono">O(n)</strong> (exactement N-1 comparaisons).
          </div>
        </div>

        {/* Zone 2: Visual Array with the Moving Trophy (Right 7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Eye className="w-4 h-4 text-sky-400" />
                <span>Zone 2 · Le Trophée du Champion</span>
              </h2>
              <div className="text-xs font-mono text-slate-400">
                Champion actuel = <strong className="text-amber-300">{current ? current.currentChampion : array[0]}</strong>
              </div>
            </div>

            {/* 5 Cells with Floating Trophy */}
            <div className="py-6">
              <div className="grid grid-cols-5 gap-3 max-w-lg mx-auto">
                {array.map((val, idx) => {
                  const isChampion = current ? current.championIdx === idx : idx === 0;
                  const isCurrentInspected = current?.idx === idx && !isFinished;

                  let border = 'border-slate-800 bg-slate-950 text-slate-300';
                  if (isChampion) {
                    border = 'border-amber-400 bg-amber-400/20 text-amber-200 ring-2 ring-amber-400/50 scale-105';
                  } else if (isCurrentInspected) {
                    border = 'border-sky-400 bg-sky-500/20 text-sky-200';
                  }

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      {/* Trophy indicator */}
                      <div className="h-7 flex items-center justify-center mb-1">
                        {isChampion && (
                          <div className="flex flex-col items-center animate-bounce">
                            <Trophy className="w-5 h-5 text-amber-400 fill-amber-400" />
                          </div>
                        )}
                      </div>

                      {/* Card */}
                      <div
                        className={`w-full aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all duration-300 ${border}`}
                      >
                        <span className="text-[10px] font-mono opacity-60">[{idx}]</span>
                        <span className="text-2xl font-extrabold font-mono tabular-nums">
                          {val}
                        </span>
                      </div>

                      {/* Tag */}
                      <div className="h-5 flex items-center justify-center mt-1 text-[10px] font-mono">
                        {isChampion ? (
                          <span className="text-amber-300 font-bold">CHAMPION</span>
                        ) : isCurrentInspected ? (
                          <span className="text-sky-300">TEST</span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explanation card */}
            <div className="mt-2 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>
                {current ? current.explanation : "Cliquez sur 'Étape Suivante' pour démarrer la recherche d'extrema."}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={handleNext}
              disabled={isFinished}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
                isFinished
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20'
              }`}
            >
              <span>{isFinished ? 'Recherche terminée' : 'Étape Suivante'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
