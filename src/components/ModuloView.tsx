import React, { useState } from 'react';
import { Clock, RotateCcw, Sparkles, Info, HelpCircle } from 'lucide-react';

export default function ModuloView() {
  const [a, setA] = useState<number>(14);
  const [n, setN] = useState<number>(12); // Default to clock 12

  // Division euclidienne : a = q * n + r avec 0 <= r < n
  const q = Math.floor(a / n);
  const r = ((a % n) + n) % n;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Clock className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Arithmétique Modulo & Ensembles Finis
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          L'arithmétique circulaire : l'opération <strong>modulo (%)</strong> ne retient que le <strong>reste</strong> de la division euclidienne. C'est le principe même de l'horloge.
        </p>
      </section>

      {/* Preset Quick Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-500 mr-1">Exemples concrets :</span>
        <button
          onClick={() => { setA(14); setN(12); }}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          14h sur une montre (14 mod 12 = 2h)
        </button>
        <button
          onClick={() => { setA(10); setN(7); }}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Dans 10 jours quel jour ? (10 mod 7 = 3)
        </button>
        <button
          onClick={() => { setA(7); setN(2); }}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Pair / Impair (7 mod 2 = 1)
        </button>
      </div>

      {/* Main Two-Zone Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Zone 1: Interactive Clock Dial (Left 6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Le Cadran Circulaire (Modulo {n})</span>
            </h2>
            <span className="text-xs font-mono text-sky-400">
              Ensemble fini : [0, {n - 1}]
            </span>
          </div>

          {/* SVG Circular Dial */}
          <div className="relative w-64 h-64 my-2 flex items-center justify-center">
            {/* Center circle */}
            <div className="w-20 h-20 rounded-full bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center z-10 shadow-inner">
              <span className="text-[10px] text-slate-500 font-mono">Résultat</span>
              <span className="text-2xl font-extrabold font-mono text-sky-400 tabular-nums">
                {r}
              </span>
            </div>

            {/* Dial Tick Points */}
            {Array.from({ length: n }).map((_, idx) => {
              const angle = (idx / n) * 2 * Math.PI - Math.PI / 2;
              const radius = 100; // px
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isCurrentRemainder = idx === r;

              return (
                <div
                  key={idx}
                  className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold font-mono transition-all duration-300 ${
                    isCurrentRemainder
                      ? 'bg-sky-500 border-white text-slate-950 scale-125 shadow-lg shadow-sky-500/50 z-20'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  {idx}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 text-center mt-4">
            Le pointeur a fait <strong className="text-white font-mono">{q} tour(s) complet(s)</strong> et s'est arrêté à la position <strong className="text-sky-400 font-mono font-bold">{r}</strong>.
          </p>
        </div>

        {/* Zone 2: Mathematical Breakdown & Sliders (Right 6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
              <Info className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                La Division Euclidienne Exacte
              </h2>
            </div>

            {/* Formula Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-center my-2">
              <span className="text-xs text-slate-500 block mb-1">Théorème fondamental de l'arithmétique :</span>
              <div className="text-lg sm:text-xl font-bold text-white">
                <span className="text-sky-400">{a}</span> = (<span className="text-purple-400">{q}</span> × <span className="text-amber-400">{n}</span>) + <span className="text-emerald-400">{r}</span>
              </div>
              <div className="flex justify-center gap-4 text-[11px] text-slate-400 mt-2">
                <span>Dividende : <strong className="text-sky-400">{a}</strong></span>
                <span>Quotient : <strong className="text-purple-400">{q}</strong></span>
                <span>Diviseur : <strong className="text-amber-400">{n}</strong></span>
                <span>Reste : <strong className="text-emerald-400 font-bold">{r}</strong></span>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 mt-6">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Valeur d'entrée (a) :</span>
                  <strong className="text-sky-400 font-bold">{a}</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={a}
                  onChange={(e) => setA(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Modulo (n - taille du cycle) :</span>
                  <strong className="text-amber-400 font-bold">{n}</strong>
                </div>
                <input
                  type="range"
                  min="2"
                  max="16"
                  value={n}
                  onChange={(e) => setN(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Pedagogical Note */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
            <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Pourquoi est-ce capital en informatique ?</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Le modulo permet de confiner n'importe quel grand nombre dans un intervalle fermé fini <code className="text-slate-300 font-mono">[0, n-1]</code>. C'est la base des <strong>buffers circulaires</strong>, des <strong>tables de hachage</strong> et du <strong>chiffrement RSA</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
