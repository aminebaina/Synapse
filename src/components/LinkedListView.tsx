import React, { useState } from 'react';
import { Link, Plus, ArrowRight, Play, RotateCcw, Info, Sparkles, Database } from 'lucide-react';

interface NodeItem {
  id: number;
  val: number;
  addr: string;
  nextAddr: string | null;
}

export default function LinkedListView() {
  const [nodes, setNodes] = useState<NodeItem[]>([
    { id: 1, val: 12, addr: '0x3A00', nextAddr: '0x3B40' },
    { id: 2, val: 45, addr: '0x3B40', nextAddr: '0x3C10' },
    { id: 3, val: 89, addr: '0x3C10', nextAddr: null },
  ]);

  const [activeTraverseIndex, setActiveTraverseIndex] = useState<number | null>(null);
  const [newVal, setNewVal] = useState<string>('99');
  const [log, setLog] = useState<string>('Liste prête. Vous pouvez parcourir ou insérer en tête.');

  const handleTraverseStep = () => {
    if (activeTraverseIndex === null) {
      setActiveTraverseIndex(0);
      setLog(`Début du parcours à la tête (HEAD) : Nœud 0 (valeur = ${nodes[0].val}, adresse = ${nodes[0].addr}).`);
    } else if (activeTraverseIndex < nodes.length - 1) {
      const nextIdx = activeTraverseIndex + 1;
      setActiveTraverseIndex(nextIdx);
      setLog(`Suivi du pointeur next vers l'adresse ${nodes[activeTraverseIndex].nextAddr} : Nœud ${nextIdx} (valeur = ${nodes[nextIdx].val}).`);
    } else {
      setActiveTraverseIndex(null);
      setLog('Fin de la liste atteinte (pointeur next == NULL).');
    }
  };

  const handleInsertHead = (e: React.FormEvent) => {
    e.preventDefault();
    const v = parseInt(newVal, 10);
    if (isNaN(v)) return;

    const newHex = `0x3${Math.floor(Math.random() * 899 + 100).toString(16).toUpperCase()}`;
    const oldHead = nodes[0];

    const newNode: NodeItem = {
      id: Date.now(),
      val: v,
      addr: newHex,
      nextAddr: oldHead ? oldHead.addr : null,
    };

    setNodes([newNode, ...nodes]);
    setActiveTraverseIndex(null);
    setLog(`Insertion en tête O(1) : Nouveau nœud créé à l'adresse ${newHex}. Son pointeur next pointe vers l'ancienne tête (${oldHead?.addr || 'NULL'}). Aucun décalage de mémoire nécessaire !`);
    setNewVal(Math.floor(Math.random() * 90 + 10).toString());
  };

  const handleReset = () => {
    setNodes([
      { id: 1, val: 12, addr: '0x3A00', nextAddr: '0x3B40' },
      { id: 2, val: 45, addr: '0x3B40', nextAddr: '0x3C10' },
      { id: 3, val: 89, addr: '0x3C10', nextAddr: null },
    ]);
    setActiveTraverseIndex(null);
    setLog('Liste réinitialisée.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Link className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Liste Chaînée vs Tableau (Structures Linéaires)
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Dans un <strong>tableau</strong>, les cases se touchent obligatoirement en mémoire. Dans une <strong>liste chaînée</strong>, les éléments peuvent être éparpillés n'importe où dans la RAM et sont reliés par un pointeur <code className="text-sky-300 font-mono">next</code>.
        </p>
      </section>

      {/* Visual Chain representation */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
              HEAD (Tête) = {nodes[0]?.addr}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Nombre de nœuds : <strong className="text-white font-mono">{nodes.length}</strong>
          </span>
        </div>

        {/* Chain of Nodes */}
        <div className="flex items-center gap-3 overflow-x-auto py-4">
          {nodes.map((node, idx) => {
            const isCurrent = activeTraverseIndex === idx;

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  className={`shrink-0 rounded-2xl border-2 transition-all p-3 w-40 flex flex-col justify-between font-mono ${
                    isCurrent
                      ? 'bg-amber-400/20 border-amber-400 shadow-lg shadow-amber-400/20 scale-105 ring-2 ring-amber-400/50'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1 mb-2 border-b border-slate-800">
                    <span>Nœud #{idx}</span>
                    <span className="text-slate-400">{node.addr}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-1">
                    {/* Data */}
                    <div className="bg-slate-900/80 p-2 rounded-lg text-center">
                      <span className="text-[9px] text-slate-500 uppercase block">Donnée</span>
                      <span className="text-xl font-bold text-white">{node.val}</span>
                    </div>

                    {/* Next pointer */}
                    <div className="bg-slate-900/80 p-2 rounded-lg text-center">
                      <span className="text-[9px] text-slate-500 uppercase block">Next</span>
                      <span className="text-[11px] font-bold text-sky-400 truncate block">
                        {node.nextAddr || 'NULL'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow to Next */}
                {idx < nodes.length - 1 ? (
                  <div className="flex flex-col items-center shrink-0 text-sky-400">
                    <ArrowRight className="w-5 h-5 animate-pulse" />
                    <span className="text-[9px] font-mono text-slate-500">pointeur</span>
                  </div>
                ) : (
                  <div className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-red-400 font-bold">
                    NULL (Fin)
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Live Action Feedback */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{log}</span>
        </div>
      </section>

      {/* Controls & Operations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Traversal */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-300">1. Parcours de la liste</h3>
            <p className="text-xs text-slate-500">Avancer pas à pas de pointeur en pointeur (O(n)).</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleTraverseStep}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Avancer</span>
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 cursor-pointer"
              title="Réinitialiser"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Insert at Head */}
        <form onSubmit={handleInsertHead} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-300">2. Insérer en tête</h3>
            <p className="text-xs text-slate-500">Opération instantanée O(1) sans décalage.</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              className="w-16 bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-mono text-white text-center focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Insérer</span>
            </button>
          </div>
        </form>
      </div>

      {/* Comparison Table */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl overflow-x-auto">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-400" />
          <span>Tableau Comparatif : Tableau vs Liste Chaînée</span>
        </h3>
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-2.5 px-3">Critère</th>
              <th className="py-2.5 px-3">Tableau (Array)</th>
              <th className="py-2.5 px-3">Liste Chaînée (Linked List)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            <tr>
              <td className="py-3 px-3 font-bold text-white">Disposition en RAM</td>
              <td className="py-3 px-3 text-emerald-400">Cases contiguës (côte à côte)</td>
              <td className="py-3 px-3 text-amber-400">Cases dispersées avec pointeur</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-bold text-white">Accès par index [i]</td>
              <td className="py-3 px-3 text-emerald-400 font-bold">O(1) Instantané</td>
              <td className="py-3 px-3 text-red-400">O(n) Doit tout traverser</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-bold text-white">Insertion au début</td>
              <td className="py-3 px-3 text-red-400">O(n) Doit décaler tout le monde</td>
              <td className="py-3 px-3 text-emerald-400 font-bold">O(1) Instantané</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
