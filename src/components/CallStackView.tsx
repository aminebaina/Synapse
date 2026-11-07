import React, { useState } from 'react';
import { Workflow, ChevronRight, RotateCcw, Sparkles, Info, Code2, Layers3 } from 'lucide-react';

interface StackFrame {
  name: string;
  args: Record<string, number>;
  locals: Record<string, number>;
  color: string;
}

interface Step {
  lineId: number;
  frames: StackFrame[];
  explanation: string;
  returnedValue?: number | null;
}

export default function CallStackView() {
  const [stepIndex, setStepIndex] = useState<number>(0);

  const CODE_LINES = [
    { id: 1, text: 'function calculerTVA(montant) {' },
    { id: 2, text: '  let taux = 0.20;' },
    { id: 3, text: '  return montant * taux;' },
    { id: 4, text: '}' },
    { id: 5, text: 'function calculerTotal(ht) {' },
    { id: 6, text: '  let tva = calculerTVA(ht);' },
    { id: 7, text: '  return ht + tva;' },
    { id: 8, text: '}' },
    { id: 9, text: '// Début du programme' },
    { id: 10, text: 'let total = calculerTotal(100);' },
  ];

  const steps: Step[] = [
    {
      lineId: 9,
      frames: [{ name: 'main()', args: {}, locals: { total: 0 }, color: 'border-slate-700 bg-slate-900' }],
      explanation: "Programme principal démarré : le cadre 'main()' est placé à la base de la pile d'appels.",
    },
    {
      lineId: 10,
      frames: [{ name: 'main()', args: {}, locals: { total: 0 }, color: 'border-slate-700 bg-slate-900' }],
      explanation: "Ligne 10 : Appel de calculerTotal(100). Le CPU prépare l'empilement d'un nouveau cadre.",
    },
    {
      lineId: 5,
      frames: [
        { name: 'main()', args: {}, locals: { total: 0 }, color: 'border-slate-700 bg-slate-900' },
        { name: 'calculerTotal()', args: { ht: 100 }, locals: { tva: 0 }, color: 'border-sky-500 bg-sky-950/40' },
      ],
      explanation: "Cadre 'calculerTotal' empilé au sommet : paramètre ht=100 alloué dans sa mémoire locale.",
    },
    {
      lineId: 6,
      frames: [
        { name: 'main()', args: {}, locals: { total: 0 }, color: 'border-slate-700 bg-slate-900' },
        { name: 'calculerTotal()', args: { ht: 100 }, locals: { tva: 0 }, color: 'border-sky-500 bg-sky-950/40' },
      ],
      explanation: "Ligne 6 : Dans calculerTotal, appel de la sous-fonction calculerTVA(100).",
    },
    {
      lineId: 1,
      frames: [
        { name: 'main()', args: {}, locals: { total: 0 }, color: 'border-slate-700 bg-slate-900' },
        { name: 'calculerTotal()', args: { ht: 100 }, locals: { tva: 0 }, color: 'border-sky-500 bg-sky-950/40' },
        { name: 'calculerTVA()', args: { montant: 100 }, locals: { taux: 0.20 }, color: 'border-amber-500 bg-amber-950/40' },
      ],
      explanation: "Cadre 'calculerTVA' empilé au sommet ! La pile a maintenant 3 étages de profondeur.",
    },
    {
      lineId: 3,
      frames: [
        { name: 'main()', args: {}, locals: { total: 0 }, color: 'border-slate-700 bg-slate-900' },
        { name: 'calculerTotal()', args: { ht: 100 }, locals: { tva: 0 }, color: 'border-sky-500 bg-sky-950/40' },
        { name: 'calculerTVA()', args: { montant: 100 }, locals: { taux: 0.20 }, color: 'border-amber-500 bg-amber-950/40' },
      ],
      returnedValue: 20,
      explanation: "Ligne 3 : return 100 × 0.20 = 20. La valeur 20 est renvoyée à l'appelant.",
    },
    {
      lineId: 6,
      frames: [
        { name: 'main()', args: {}, locals: { total: 0 }, color: 'border-slate-700 bg-slate-900' },
        { name: 'calculerTotal()', args: { ht: 100 }, locals: { tva: 20 }, color: 'border-sky-500 bg-sky-950/40' },
      ],
      explanation: "Dépilement : Le cadre 'calculerTVA' est détruit de la RAM ! La variable tva reçoit 20 dans calculerTotal.",
    },
    {
      lineId: 7,
      frames: [
        { name: 'main()', args: {}, locals: { total: 0 }, color: 'border-slate-700 bg-slate-900' },
        { name: 'calculerTotal()', args: { ht: 100 }, locals: { tva: 20 }, color: 'border-sky-500 bg-sky-950/40' },
      ],
      returnedValue: 120,
      explanation: "Ligne 7 : return ht + tva (100 + 20 = 120). Valeur finale renvoyée au programme principal.",
    },
    {
      lineId: 10,
      frames: [{ name: 'main()', args: {}, locals: { total: 120 }, color: 'border-slate-700 bg-slate-900' }],
      explanation: "Dépilement : Le cadre 'calculerTotal' est détruit. La variable total vaut 120 dans main(). Programme terminé !",
    },
  ];

  const current = steps[stepIndex];
  const isFinished = stepIndex >= steps.length - 1;

  const handleNext = () => {
    if (!isFinished) setStepIndex((s) => s + 1);
  };

  const handleReset = () => {
    setStepIndex(0);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Workflow className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Fonctions & Pile d’Appels (The Call Stack)
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Comment le système d'exploitation et le processeur gèrent les fonctions : chaque appel empile un cadre mémoire (*Stack Frame*) qui est automatiquement détruit lors du <code className="text-sky-300 font-mono">return</code>.
        </p>
      </section>

      {/* Two Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Zone 1: Code Program (Left 6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-sky-400" />
                <span>Code Source Exécuté</span>
              </h2>
              <span className="text-xs font-mono text-sky-400">
                Ligne {current.lineId}
              </span>
            </div>

            <div className="space-y-1 font-mono text-xs sm:text-sm">
              {CODE_LINES.map((line) => {
                const isActive = current.lineId === line.id;
                return (
                  <div
                    key={line.id}
                    className={`py-1 px-3 rounded-lg border-l-4 transition-all flex items-center gap-3 ${
                      isActive
                        ? 'bg-sky-500/20 border-sky-400 text-white font-bold ring-1 ring-sky-500/30'
                        : 'border-transparent text-slate-400'
                    }`}
                  >
                    <span className="text-slate-600 text-[11px] w-4">{line.id}</span>
                    <span>{line.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-slate-300 block mb-1">
              Portée des variables (Scope) :
            </span>
            <p className="text-slate-500">
              La variable <code className="text-slate-400 font-mono">taux</code> n'existe QUE pendant que le cadre de <code className="text-slate-400 font-mono">calculerTVA()</code> est empilé. Dès le return, elle est effacée de la mémoire vive.
            </p>
          </div>
        </div>

        {/* Zone 2: Visual Call Stack (Right 6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Layers3 className="w-4 h-4 text-sky-400" />
                <span>La Pile d'Appels en RAM (Call Stack)</span>
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Profondeur : {current.frames.length}
              </span>
            </div>

            {/* Vertical Stack of Frames (Bottom to Top) */}
            <div className="h-64 border-x-4 border-b-4 border-slate-700 bg-slate-950/70 rounded-b-2xl p-2 flex flex-col-reverse gap-2 overflow-hidden shadow-inner">
              {current.frames.map((frame, idx) => {
                const isTop = idx === current.frames.length - 1;

                return (
                  <div
                    key={frame.name}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 ${frame.color} ${
                      isTop ? 'scale-[1.02] shadow-md ring-1 ring-sky-400/30' : 'opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-white mb-1">
                      <span>{frame.name}</span>
                      {isTop && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-400 text-slate-950 uppercase">
                          Actif
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                      <div>
                        {Object.entries(frame.args).map(([k, v]) => (
                          <span key={k} className="mr-2 text-slate-400">
                            param {k}={v}
                          </span>
                        ))}
                      </div>
                      <div>
                        {Object.entries(frame.locals).map(([k, v]) => (
                          <span key={k} className="text-emerald-300 font-bold">
                            local {k}={v}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation & Controls */}
          <div className="mt-4 space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>{current.explanation}</span>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={handleNext}
                disabled={isFinished}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
                  isFinished
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20'
                }`}
              >
                <span>{isFinished ? 'Exécution terminée' : 'Étape Suivante'}</span>
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
    </div>
  );
}
