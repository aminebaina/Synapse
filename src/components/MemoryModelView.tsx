import React, { useState } from 'react';
import { Cpu, ArrowRight, Sparkles, Info, Edit3, Check } from 'lucide-react';

interface MemoryCell {
  address: string;
  varName: string;
  varType: string;
  value: number | string;
  isPointer?: boolean;
  pointsToAddress?: string;
}

export default function MemoryModelView() {
  const [cells, setCells] = useState<MemoryCell[]>([
    { address: '0x1000', varName: 'score', varType: 'int (entier)', value: 42 },
    { address: '0x1004', varName: 'age', varType: 'int (entier)', value: 25 },
    { address: '0x1008', varName: 'ptr', varType: 'int* (pointeur)', value: '0x1000', isPointer: true, pointsToAddress: '0x1000' },
    { address: '0x100C', varName: '(libre)', varType: 'libre', value: 0 },
  ]);

  const [inputVal, setInputVal] = useState<string>('50');

  // Modify direct variable
  const handleUpdateDirect = (address: string, newVal: number) => {
    setCells((prev) =>
      prev.map((c) => (c.address === address ? { ...c, value: newVal } : c))
    );
  };

  // Modify target of pointer
  const handlePointTo = (targetAddr: string) => {
    setCells((prev) =>
      prev.map((c) =>
        c.varName === 'ptr'
          ? { ...c, value: targetAddr, pointsToAddress: targetAddr }
          : c
      )
    );
  };

  // Modify through dereference (*ptr = value)
  const handleDereferenceWrite = (newVal: number) => {
    const ptrCell = cells.find((c) => c.varName === 'ptr');
    if (!ptrCell || !ptrCell.pointsToAddress) return;

    setCells((prev) =>
      prev.map((c) =>
        c.address === ptrCell.pointsToAddress ? { ...c, value: newVal } : c
      )
    );
  };

  const ptrCell = cells.find((c) => c.varName === 'ptr');
  const pointedCell = cells.find((c) => c.address === ptrCell?.pointsToAddress);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Cpu className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Systèmes : Modèle Mémoire, Variables & Pointeurs
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Démystifier la mémoire vive (RAM) : une variable n'a rien de magique, c'est simplement une <strong>étiquette</strong> collée sur une <strong>adresse physique</strong> contenant une valeur.
        </p>
      </section>

      {/* Main Two-Zone Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Zone 1: Physical RAM Grid (Left 7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-400" />
                <span>Casier de la Mémoire Vive (RAM)</span>
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Adresses sur 16-bits
              </span>
            </div>

            {/* Memory Cells Rack */}
            <div className="space-y-3 font-mono text-xs">
              {cells.map((cell) => {
                const isTargetOfPointer = ptrCell?.pointsToAddress === cell.address;
                const isPtr = cell.isPointer;

                return (
                  <div
                    key={cell.address}
                    className={`p-3.5 rounded-xl border-2 transition-all flex items-center justify-between gap-4 ${
                      isTargetOfPointer
                        ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/10 ring-1 ring-amber-400/50'
                        : isPtr
                        ? 'bg-sky-500/15 border-sky-400 shadow-md shadow-sky-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    {/* Column 1: Physical Address */}
                    <div className="w-20">
                      <span className="text-[10px] text-slate-500 uppercase block">Adresse</span>
                      <span className="font-bold text-slate-200">{cell.address}</span>
                    </div>

                    {/* Column 2: Variable Name & Type */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 uppercase">Variable</span>
                        {isTargetOfPointer && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                            CIBLÉE PAR PTR
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-sm text-white">{cell.varName}</span>
                      <span className="text-[10px] text-slate-500 block">{cell.varType}</span>
                    </div>

                    {/* Column 3: Stored Value */}
                    <div className="w-28 text-right">
                      <span className="text-[10px] text-slate-500 uppercase block">Valeur stockée</span>
                      <span className={`text-base font-extrabold tabular-nums ${
                        isPtr ? 'text-sky-300 underline' : 'text-emerald-400'
                      }`}>
                        {cell.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Pointer Arrow Explanation */}
          <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 font-mono text-sky-400 mb-1">
              <span className="font-bold">ptr ({ptrCell?.address})</span>
              <ArrowRight className="w-4 h-4 animate-pulse" />
              <span className="font-bold">pointe vers {pointedCell?.varName} ({pointedCell?.address})</span>
            </div>
            <p className="text-slate-400">
              Un pointeur ne contient pas un nombre ordinaire : sa valeur est <strong>l'adresse mémoire</strong> d'une autre case !
            </p>
          </div>
        </div>

        {/* Zone 2: Interactive Controls & Explanation (Right 5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
              <Info className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Laboratoire d'Expérimentation
              </h2>
            </div>

            <div className="space-y-4">
              {/* Action 1: Change pointer target */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  1. Faire pointer `ptr` vers une autre case :
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePointTo('0x1000')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                      ptrCell?.pointsToAddress === '0x1000'
                        ? 'bg-sky-500 text-slate-950 border-sky-400'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    ptr = &score (0x1000)
                  </button>
                  <button
                    onClick={() => handlePointTo('0x1004')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                      ptrCell?.pointsToAddress === '0x1004'
                        ? 'bg-sky-500 text-slate-950 border-sky-400'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    ptr = &age (0x1004)
                  </button>
                </div>
              </div>

              {/* Action 2: Déréférencer pour écrire */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  2. Modifier la case ciblée via le pointeur (*ptr = ...) :
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="w-24 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white text-center focus:outline-none focus:border-sky-500"
                  />
                  <button
                    onClick={() => handleDereferenceWrite(parseInt(inputVal, 10) || 0)}
                    className="flex-1 py-2 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Écrire *ptr = {inputVal}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pedagogical Bridge */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Le Pont Pédagogique :</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              En mathématiques, une variable est un symbole abstrait (<code className="text-slate-400 font-mono">x ∈ ℤ</code>).
              En informatique, <code className="text-slate-400 font-mono">x</code> désigne une case physique précise dans une puce de silicium, avec une capacité en bits limitée.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
