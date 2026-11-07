import React, { useState } from 'react';
import { 
  ToggleLeft, 
  ToggleRight as ToggleIcon, 
  Lightbulb, 
  Sparkles, 
  Info, 
  HelpCircle,
  Zap,
  CheckCircle2,
  XCircle
} from 'lucide-react';

type GateType = 'AND' | 'OR' | 'NOT' | 'XOR';

export default function LogicGatesView() {
  const [selectedGate, setSelectedGate] = useState<GateType>('AND');
  const [inputA, setInputA] = useState<boolean>(true);
  const [inputB, setInputB] = useState<boolean>(false);

  // Compute output
  const calculateOutput = (gate: GateType, a: boolean, b: boolean): boolean => {
    switch (gate) {
      case 'AND':
        return a && b;
      case 'OR':
        return a || b;
      case 'NOT':
        return !a;
      case 'XOR':
        return a !== b;
    }
  };

  const output = calculateOutput(selectedGate, inputA, inputB);

  // Truth table definition for each gate
  const truthTables: Record<GateType, { a: boolean; b?: boolean; out: boolean }[]> = {
    AND: [
      { a: false, b: false, out: false },
      { a: false, b: true, out: false },
      { a: true, b: false, out: false },
      { a: true, b: true, out: true },
    ],
    OR: [
      { a: false, b: false, out: false },
      { a: false, b: true, out: true },
      { a: true, b: false, out: true },
      { a: true, b: true, out: true },
    ],
    NOT: [
      { a: false, out: true },
      { a: true, out: false },
    ],
    XOR: [
      { a: false, b: false, out: false },
      { a: false, b: true, out: true },
      { a: true, b: false, out: true },
      { a: true, b: true, out: false },
    ],
  };

  const gateDescriptions: Record<GateType, { title: string; desc: string; analogy: string }> = {
    AND: {
      title: 'Porte ET (AND)',
      desc: 'La sortie vaut 1 (VRAI) UNIQUEMENT si toutes les entrées valent 1.',
      analogy: '« Pour entrer dans l’avion, il faut un billet (A) ET un passeport (B). »',
    },
    OR: {
      title: 'Porte OU (OR)',
      desc: 'La sortie vaut 1 (VRAI) si AU MOINS UNE des entrées vaut 1.',
      analogy: '« Tu peux régler tes achats par carte bancaire (A) OU en espèces (B). »',
    },
    NOT: {
      title: 'Porte NON (NOT - Inverseur)',
      desc: 'Inverse l’état : si l’entrée est 1, la sortie devient 0, et inversement.',
      analogy: '« Un bouton silencieux : si tu actives le mode muet (1), le son se coupe (0). »',
    },
    XOR: {
      title: 'Porte OU Exclusif (XOR)',
      desc: 'La sortie vaut 1 si UNE SEULE entrée vaut 1, mais pas les deux en même temps.',
      analogy: '« Interrupteur va-et-vient d’un couloir : appuyer sur l’un ou l’autre allume, mais appuyer sur les deux éteint. »',
    },
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Zap className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Portes Logiques & Booléens
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          La brique fondamentale absolue de toute l’informatique. Des milliards de ces petites portes composent chaque processeur (CPU) pour réaliser tous les calculs.
        </p>
      </section>

      {/* Gate Selector Tabs */}
      <section className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl w-fit">
        {(['AND', 'OR', 'NOT', 'XOR'] as GateType[]).map((gate) => (
          <button
            key={gate}
            onClick={() => setSelectedGate(gate)}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
              selectedGate === gate
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Porte {gate}
          </button>
        ))}
      </section>

      {/* Main Two-Zone Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Zone 1: Interactive Circuit (Left 7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-sky-400" />
                <span>Circuit Interactif</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                Cliquez sur les interrupteurs
              </span>
            </div>

            {/* Circuit Board */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 my-4 relative overflow-hidden">
              <div className="flex items-center justify-between gap-4">
                
                {/* Inputs (Switches) */}
                <div className="flex flex-col gap-6">
                  {/* Switch A */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setInputA(!inputA)}
                      className={`w-14 h-9 rounded-full p-1 transition-colors cursor-pointer border ${
                        inputA ? 'bg-sky-500 border-sky-400' : 'bg-slate-800 border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full bg-white transition-transform ${
                          inputA ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-300 block">
                        Entrée A : <strong className={inputA ? 'text-sky-400' : 'text-slate-500'}>{inputA ? '1 (VRAI)' : '0 (FAUX)'}</strong>
                      </span>
                      <span className="text-[10px] text-slate-500">Interrupteur A</span>
                    </div>
                  </div>

                  {/* Switch B (only for 2-input gates) */}
                  {selectedGate !== 'NOT' && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setInputB(!inputB)}
                        className={`w-14 h-9 rounded-full p-1 transition-colors cursor-pointer border ${
                          inputB ? 'bg-sky-500 border-sky-400' : 'bg-slate-800 border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full bg-white transition-transform ${
                            inputB ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <div>
                        <span className="text-xs font-mono font-bold text-slate-300 block">
                          Entrée B : <strong className={inputB ? 'text-sky-400' : 'text-slate-500'}>{inputB ? '1 (VRAI)' : '0 (FAUX)'}</strong>
                        </span>
                        <span className="text-[10px] text-slate-500">Interrupteur B</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Gate Logic Chip in Middle */}
                <div className="flex flex-col items-center justify-center p-4 bg-slate-900 border-2 border-sky-500/40 rounded-2xl shadow-lg shadow-sky-500/10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
                    Composant
                  </span>
                  <span className="text-2xl font-black font-mono text-white tracking-wider">
                    {selectedGate}
                  </span>
                  <span className="text-[10px] text-sky-400 font-mono mt-1">
                    {selectedGate === 'AND' && 'A • B'}
                    {selectedGate === 'OR' && 'A + B'}
                    {selectedGate === 'NOT' && 'Ā'}
                    {selectedGate === 'XOR' && 'A ⊕ B'}
                  </span>
                </div>

                {/* Output (Light Bulb) */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                      output
                        ? 'bg-amber-400/20 border-amber-400 shadow-xl shadow-amber-400/30 scale-110'
                        : 'bg-slate-900 border-slate-800 opacity-50'
                    }`}
                  >
                    <Lightbulb
                      className={`w-10 h-10 transition-colors ${
                        output ? 'text-amber-300 fill-amber-300' : 'text-slate-600'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold mt-2 text-center block">
                    Sortie :{' '}
                    <strong className={output ? 'text-amber-300' : 'text-slate-500'}>
                      {output ? '1 (ALLUMÉ)' : '0 (ÉTEINT)'}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Everyday Analogy */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Exemple concret du quotidien :</span>
              </div>
              <p className="text-sm text-slate-200 font-medium">
                {gateDescriptions[selectedGate].analogy}
              </p>
            </div>
          </div>
        </div>

        {/* Zone 2: Truth Table & Theory (Right 5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <Info className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Table de Vérité
              </h2>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              {gateDescriptions[selectedGate].desc}
            </p>

            {/* Dynamic Truth Table */}
            <div className="overflow-hidden border border-slate-800 rounded-xl bg-slate-950 font-mono text-xs">
              <table className="w-full text-center">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
                    <th className="py-2.5 px-3">Entrée A</th>
                    {selectedGate !== 'NOT' && <th className="py-2.5 px-3">Entrée B</th>}
                    <th className="py-2.5 px-3">Sortie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {truthTables[selectedGate].map((row, idx) => {
                    const isCurrentState =
                      row.a === inputA && (selectedGate === 'NOT' || row.b === inputB);

                    return (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          isCurrentState
                            ? 'bg-sky-500/20 font-bold text-white'
                            : 'text-slate-400 hover:bg-slate-900/40'
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          <span className={row.a ? 'text-sky-400' : 'text-slate-500'}>
                            {row.a ? '1' : '0'}
                          </span>
                        </td>
                        {selectedGate !== 'NOT' && (
                          <td className="py-2.5 px-3">
                            <span className={row.b ? 'text-sky-400' : 'text-slate-500'}>
                              {row.b ? '1' : '0'}
                            </span>
                          </td>
                        )}
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] ${
                              row.out
                                ? 'bg-amber-400/20 text-amber-300 font-bold'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {row.out ? '1 (Vrai)' : '0 (Faux)'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <span className="text-[11px] text-slate-500 mt-2 block italic text-center">
              La ligne surlignée en bleu correspond à la position actuelle de vos interrupteurs.
            </span>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
            <strong>Pourquoi est-ce plus simple que la recherche linéaire ?</strong>
            <p className="mt-1 text-slate-500">
              Il n'y a pas de boucle, pas d'index, pas de répétition : le calcul est immédiat et atomique.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
