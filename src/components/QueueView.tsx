import React, { useState } from 'react';
import { Users, Plus, Minus, Eye, RotateCcw, Sparkles, Info, ArrowRight } from 'lucide-react';

export default function QueueView() {
  const [queue, setQueue] = useState<string[]>(['Tâche #1', 'Tâche #2', 'Tâche #3']);
  const [inputName, setInputName] = useState<string>('Tâche #4');
  const [message, setMessage] = useState<string>('File prête. Le premier élément arrivé sera le premier traité (FIFO).');

  const maxCapacity = 5;

  const handleEnqueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;

    if (queue.length >= maxCapacity) {
      setMessage("File pleine ! Capacité maximale de 5 éléments atteinte.");
      return;
    }

    setQueue((prev) => [...prev, inputName.trim()]);
    setMessage(`Enfilé (Enqueue) : "${inputName.trim()}" a rejoint l'arrière de la file.`);

    const nextTasks = ['Tâche #5', 'Tâche #6', 'Tâche #7', 'Tâche #8', 'Tâche #9', 'Tâche #10'];
    setInputName(nextTasks[Math.floor(Math.random() * nextTasks.length)]);
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      setMessage("File vide : aucun élément à traiter.");
      return;
    }

    const served = queue[0];
    setQueue((prev) => prev.slice(1));
    setMessage(`Défilé (Dequeue) : "${served}" (en tête de file) a été traité(e) et quitte la file.`);
  };

  const handleClear = () => {
    setQueue([]);
    setMessage('File vidée.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Users className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Structure Linéaire : File (Queue - FIFO)
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Principe <strong>FIFO</strong> (First-In, First-Out) : le premier élément inséré est obligatoirement le premier à être extrait. Comme une file d'attente à la boulangerie ou une file d'impression.
        </p>
      </section>

      {/* Main Sandbox */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-sky-300">
              Guichet de service (SORTIE / DEQUEUE)
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Taille : <strong className="text-white">{queue.length} / {maxCapacity}</strong>
          </span>
        </div>

        {/* Horizontal Tunnel View */}
        <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 flex items-center justify-between gap-4 overflow-x-auto min-h-[140px]">
          
          {/* Service Counter / Exit (Front) */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-500/15 border-2 border-emerald-400 text-emerald-300 shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-wider">TÊTE (Front)</span>
            <span className="text-xs font-bold mt-1">Guichet</span>
          </div>

          <div className="flex items-center gap-1 text-emerald-400 shrink-0">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Queue elements */}
          <div className="flex-1 flex items-center gap-3 justify-start min-w-[300px]">
            {queue.map((person, idx) => {
              const isFront = idx === 0;
              const isRear = idx === queue.length - 1;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center min-w-[90px] transition-all font-mono ${
                    isFront
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-md ring-1 ring-emerald-400/50'
                      : isRear
                      ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-md ring-1 ring-sky-400/50'
                      : 'bg-slate-900 border-slate-700 text-slate-200'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 mb-1">
                    {isFront ? '1er (Prochain)' : isRear ? 'Dernier' : `#${idx + 1}`}
                  </span>
                  <span className="font-bold text-sm text-white">{person}</span>
                </div>
              );
            })}

            {queue.length === 0 && (
              <div className="text-xs text-slate-600 font-mono italic mx-auto">
                File d'attente vide
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-sky-400 shrink-0">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Entrance (Rear) */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-500/15 border-2 border-sky-400 text-sky-300 shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-wider">QUEUE (Rear)</span>
            <span className="text-xs font-bold mt-1">Entrée</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Enqueue form */}
          <form onSubmit={handleEnqueue} className="flex items-center gap-2">
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="Identifiant tâche"
              className="w-36 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              disabled={queue.length >= maxCapacity}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                queue.length >= maxCapacity
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Enfiler (Enqueue)</span>
            </button>
          </form>

          {/* Dequeue */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDequeue}
              disabled={queue.length === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                queue.length === 0
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              <Minus className="w-4 h-4" />
              <span>Défiler (Dequeue)</span>
            </button>

            <button
              onClick={handleClear}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 cursor-pointer"
              title="Vider la file"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status log */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{message}</span>
        </div>
      </div>

      {/* Pile vs File Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-sky-400 mb-2 font-mono">
            Pile (Stack) : LIFO
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dernier Entré = Premier Sorti. Exemple : une pile d'assiettes, l'historique de navigation (revenir en arrière), le Ctrl+Z (annuler la dernière frappe).
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-emerald-400 mb-2 font-mono">
            File (Queue) : FIFO
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Premier Entré = Premier Sorti. Exemple : une file d'attente à la caisse, les documents envoyés à une imprimante partagée, le traitement équitable des requêtes réseau.
          </p>
        </div>
      </div>
    </div>
  );
}
