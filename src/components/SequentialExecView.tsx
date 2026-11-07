import React, { useState } from 'react';
import { 
  GitCommit, 
  ChevronRight, 
  RotateCcw, 
  Sparkles, 
  Info, 
  Code2, 
  Database,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface CodeLine {
  id: number;
  code: string;
  indent: number;
}

const PROGRAM_LINES: CodeLine[] = [
  { id: 1, code: 'let temperature = 28;', indent: 0 },
  { id: 2, code: 'let climatisation = false;', indent: 0 },
  { id: 3, code: 'let statut = "En attente";', indent: 0 },
  { id: 4, code: 'si (temperature >= 25) {', indent: 0 },
  { id: 5, code: '  climatisation = true;', indent: 1 },
  { id: 6, code: '  statut = "Refroidissement actif";', indent: 1 },
  { id: 7, code: '} sinon {', indent: 0 },
  { id: 8, code: '  climatisation = false;', indent: 1 },
  { id: 9, code: '  statut = "Température idéale";', indent: 1 },
  { id: 10, code: '// Fin du programme', indent: 0 },
];

export default function SequentialExecView() {
  const [initialTemp, setInitialTemp] = useState<number>(28);
  const [step, setStep] = useState<number>(0);

  // Program state based on step
  const conditionMet = initialTemp >= 25;

  // Compute exact execution path
  const executionPath = conditionMet ? [1, 2, 3, 4, 5, 6, 10] : [1, 2, 3, 4, 7, 8, 9, 10];

  const currentLineId = step === 0 ? null : executionPath[Math.min(step - 1, executionPath.length - 1)];

  // Memory states depending on steps
  const memoryState = {
    temperature: step >= 1 ? initialTemp : null,
    climatisation: step >= 2 ? (step >= 5 ? conditionMet : false) : null,
    statut: step >= 3 ? (step >= 6 ? (conditionMet ? 'Refroidissement actif' : 'Température idéale') : 'En attente') : null,
  };

  const isFinished = step >= executionPath.length;

  const handleNext = () => {
    if (!isFinished) {
      setStep((s) => s + 1);
    }
  };

  const handleReset = () => {
    setStep(0);
  };

  const handleTempChange = (newT: number) => {
    setInitialTemp(newT);
    setStep(0);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <GitCommit className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Le Pont Pédagogique : Exécution Séquentielle & if / else
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Comment les mathématiques et les systèmes s'unissent : chaque condition <code className="text-sky-300 font-mono">if</code> évalue une proposition booléenne (VRAI ou FAUX) qui modifie l'état des cases mémoire.
        </p>
      </section>

      {/* Preset Temperature Switcher */}
      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-2xl w-fit">
        <span className="text-xs text-slate-400 font-medium px-2">Tester avec la température :</span>
        <button
          onClick={() => handleTempChange(28)}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            initialTemp === 28
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          28°C (≥ 25 → Branche SI)
        </button>
        <button
          onClick={() => handleTempChange(19)}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            initialTemp === 19
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          19°C (&lt; 25 → Branche SINON)
        </button>
      </div>

      {/* Two Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Zone 1: Code Program (Left 6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-sky-400" />
                <span>Instructions du Processeur (CPU)</span>
              </h2>
              {currentLineId && (
                <span className="text-xs font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50">
                  Ligne active : {currentLineId}
                </span>
              )}
            </div>

            <div className="space-y-1 font-mono text-xs sm:text-sm">
              {PROGRAM_LINES.map((line) => {
                const isActive = currentLineId === line.id;
                const isSkipped =
                  (conditionMet && [7, 8, 9].includes(line.id)) ||
                  (!conditionMet && [5, 6].includes(line.id));

                let lineStyle = 'border-transparent text-slate-400';
                if (isActive) {
                  lineStyle = 'bg-sky-500/15 border-sky-400 text-white font-semibold ring-1 ring-sky-500/30';
                } else if (isSkipped && step > 4) {
                  lineStyle = 'text-slate-600 line-through opacity-40';
                }

                return (
                  <div
                    key={line.id}
                    className={`py-1.5 px-3 rounded-lg border-l-4 transition-all flex items-center gap-3 ${lineStyle}`}
                    style={{ paddingLeft: `${line.indent * 16 + 12}px` }}
                  >
                    <span className="text-[11px] text-slate-600 select-none w-5 text-right">
                      {line.id}
                    </span>
                    <span>{line.code}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Condition Evaluation Banner when at Line 4 */}
          {currentLineId === 4 && (
            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-sky-500/40 text-xs font-mono">
              <div className="text-slate-400">Évaluation de la proposition booléenne :</div>
              <div className="text-white font-bold mt-1">
                temperature ({initialTemp}) &gt;= 25 ? →{' '}
                <span className={conditionMet ? 'text-emerald-400' : 'text-red-400'}>
                  {conditionMet ? 'VRAI (Exécution de la branche SI)' : 'FAUX (Saut vers la branche SINON)'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Zone 2: Memory Registers State (Right 6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
              <Database className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                État Mémoire des Variables (RAM)
              </h2>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Observez comment les cases mémoires sont allouées puis modifiées au fil des instructions.
            </p>

            {/* Variable Slots */}
            <div className="space-y-3 font-mono text-xs">
              {/* Var 1 : temperature */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Adresse 0x2000 · int</span>
                  <span className="font-bold text-white text-sm">temperature</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[10px] block">Valeur</span>
                  <span className="text-base font-bold text-amber-400">
                    {memoryState.temperature !== null ? `${memoryState.temperature}°C` : '(non alloué)'}
                  </span>
                </div>
              </div>

              {/* Var 2 : climatisation */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Adresse 0x2004 · booléen</span>
                  <span className="font-bold text-white text-sm">climatisation</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[10px] block">Valeur</span>
                  <span className="text-base font-bold text-sky-300">
                    {memoryState.climatisation !== null ? (memoryState.climatisation ? 'true (1)' : 'false (0)') : '(non alloué)'}
                  </span>
                </div>
              </div>

              {/* Var 3 : statut */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Adresse 0x2008 · string</span>
                  <span className="font-bold text-white text-sm">statut</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[10px] block">Valeur</span>
                  <span className="text-base font-bold text-emerald-400">
                    {memoryState.statut !== null ? `"${memoryState.statut}"` : '(non alloué)'}
                  </span>
                </div>
              </div>
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
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
              }`}
            >
              <span>{isFinished ? 'Programme terminé' : 'Instruction Suivante'}</span>
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
