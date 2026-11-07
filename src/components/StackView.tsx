import React, { useState } from 'react';
import { 
  Layers3, 
  Plus, 
  Minus, 
  Eye, 
  RotateCcw, 
  Sparkles, 
  Info, 
  Code2, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export default function StackView() {
  const [stack, setStack] = useState<number[]>([15, 42, 88]);
  const [inputVal, setInputVal] = useState<string>('99');
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('Prêt. Vous pouvez empiler (Push) ou dépiler (Pop).');
  const [peeked, setPeeked] = useState<boolean>(false);

  const maxSize = 5;

  const handlePush = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseInt(inputVal, 10);
    if (isNaN(val)) return;

    if (stack.length >= maxSize) {
      setMessage("Débordement de pile (Stack Overflow) ! La pile est pleine (capacité max = 5).");
      return;
    }

    setPeeked(false);
    setActiveAction('push');
    setStack((prev) => [...prev, val]);
    setMessage(`Empilé (Push) : La valeur ${val} a été ajoutée au sommet de la pile.`);
    // Generate new random next suggestion
    setInputVal(Math.floor(Math.random() * 90 + 10).toString());
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setMessage("Sous-débordement de pile (Stack Underflow) ! La pile est déjà vide.");
      return;
    }

    setPeeked(false);
    setActiveAction('pop');
    const removed = stack[stack.length - 1];
    setStack((prev) => prev.slice(0, prev.length - 1));
    setMessage(`Dépilé (Pop) : L'élément au sommet (${removed}) a été extrait et retiré.`);
  };

  const handlePeek = () => {
    if (stack.length === 0) {
      setMessage("La pile est vide : aucun élément au sommet.");
      return;
    }
    setPeeked(true);
    setActiveAction('peek');
    const top = stack[stack.length - 1];
    setMessage(`Consultation (Peek) : La valeur au sommet est ${top} (sans la retirer).`);
  };

  const handleClear = () => {
    setStack([]);
    setPeeked(false);
    setActiveAction('clear');
    setMessage('Pile réinitialisée à vide.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <section>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Layers3 className="w-7 h-7 text-sky-400" />
          <span>Structure de Données : Pile (Stack - LIFO)</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Principe <strong>LIFO</strong> (Last-In, First-Out) : le dernier élément ajouté est toujours le premier à être retiré. Complexité des opérations : <strong className="text-sky-300 font-mono">O(1)</strong>.
        </p>
      </section>

      {/* Two Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Zone 1: Pseudo-code & Theory */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <Code2 className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Zone 1 · Spécification & Pseudo-code
              </h2>
            </div>

            <div className="space-y-3 font-mono text-xs sm:text-sm">
              <div className={`p-3 rounded-lg border-l-4 transition-all ${
                activeAction === 'push' ? 'bg-sky-500/15 border-sky-400 text-white' : 'border-transparent text-slate-400'
              }`}>
                <div className="font-bold text-sky-300 mb-0.5">Empiler (Push) :</div>
                <div>Si sommet &gt;= MAX : Erreur Overflow</div>
                <div>Sinon : sommet = sommet + 1, pile[sommet] = valeur</div>
              </div>

              <div className={`p-3 rounded-lg border-l-4 transition-all ${
                activeAction === 'pop' ? 'bg-amber-500/15 border-amber-400 text-white' : 'border-transparent text-slate-400'
              }`}>
                <div className="font-bold text-amber-300 mb-0.5">Dépiler (Pop) :</div>
                <div>Si sommet &lt; 0 : Erreur Underflow</div>
                <div>Sinon : valeur = pile[sommet], sommet = sommet - 1</div>
              </div>

              <div className={`p-3 rounded-lg border-l-4 transition-all ${
                activeAction === 'peek' ? 'bg-emerald-500/15 border-emerald-400 text-white' : 'border-transparent text-slate-400'
              }`}>
                <div className="font-bold text-emerald-300 mb-0.5">Consulter (Peek) :</div>
                <div>Retourner pile[sommet] sans modifier la pile</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500">
            <div className="font-semibold text-slate-400 mb-1">Cas d'usage concrets :</div>
            <ul className="list-disc pl-4 space-y-1">
              <li>Bouton "Annuler" (Ctrl+Z / Undo history)</li>
              <li>Pile d'appels de fonctions (Call Stack de JavaScript / Python)</li>
              <li>Évaluation d'expressions arithmétiques parenthésées</li>
            </ul>
          </div>
        </div>

        {/* Zone 2: Visual Vertical Container */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Zone 2 · Conteneur Vertical
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Taille : <strong className="text-slate-200">{stack.length} / {maxSize}</strong>
              </span>
            </div>

            {/* Vertical Stack Canister */}
            <div className="py-2 flex flex-col items-center">
              <div className="w-56 h-64 border-x-4 border-b-4 border-slate-700 bg-slate-950/70 rounded-b-2xl p-2 flex flex-col-reverse gap-2 relative shadow-inner">
                {stack.map((val, idx) => {
                  const isTop = idx === stack.length - 1;
                  let bg = 'bg-slate-800 border-slate-700 text-white';
                  if (isTop) {
                    bg = peeked 
                      ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/50' 
                      : 'bg-sky-500/25 border-sky-400 text-sky-200 ring-1 ring-sky-400/50';
                  }

                  return (
                    <div
                      key={idx}
                      className={`h-10 rounded-xl border-2 flex items-center justify-between px-4 transition-all duration-300 ${bg}`}
                    >
                      <span className="text-xs font-mono opacity-70">[{idx}]</span>
                      <span className="text-base font-bold font-mono">{val}</span>
                      {isTop ? (
                        <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-sky-500/30 text-sky-300">
                          SOMMET
                        </span>
                      ) : <span className="w-6" />}
                    </div>
                  );
                })}

                {stack.length === 0 && (
                  <div className="h-full flex items-center justify-center text-xs text-slate-600 font-mono italic">
                    Pile vide
                  </div>
                )}
              </div>
              <span className="text-[11px] text-slate-500 font-mono mt-2">Fond de la pile (Base)</span>
            </div>

            {/* Message Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Statut de l'opération :</span>
              </div>
              <p className="text-sm text-slate-200 font-medium">
                {message}
              </p>
            </div>
          </div>

          {/* Interactive Stack Action Controls */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <form onSubmit={handlePush} className="flex items-center gap-2">
              <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-20 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white text-center focus:outline-none focus:border-sky-500"
                placeholder="val"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Empiler (Push)</span>
              </button>
            </form>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePop}
                disabled={stack.length === 0}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  stack.length === 0
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                }`}
              >
                <Minus className="w-4 h-4" />
                <span>Dépiler (Pop)</span>
              </button>

              <button
                onClick={handlePeek}
                disabled={stack.length === 0}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Sommet (Peek)</span>
              </button>

              <button
                onClick={handleClear}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                title="Vider la pile"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
