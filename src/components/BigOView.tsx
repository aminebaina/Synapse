import React, { useState } from 'react';
import { TrendingUp, Info, HelpCircle } from 'lucide-react';

export default function BigOView() {
  const [n, setN] = useState<number>(32);

  const complexities = [
    {
      notation: 'O(1)',
      name: 'Constante',
      example: 'Accès index tableau, Sommet de pile',
      calculate: () => 1,
      color: '#38bdf8', // sky-400
      badge: 'Idéal',
    },
    {
      notation: 'O(log n)',
      name: 'Logarithmique',
      example: 'Recherche Binaire, Arbre binaire équilibré',
      calculate: (val: number) => Math.ceil(Math.log2(val || 1)),
      color: '#34d399', // emerald-400
      badge: 'Excellent',
    },
    {
      notation: 'O(n)',
      name: 'Linéaire',
      example: 'Recherche Linéaire, Parcours de liste',
      calculate: (val: number) => val,
      color: '#fbbf24', // amber-400
      badge: 'Acceptable',
    },
    {
      notation: 'O(n log n)',
      name: 'Quasi-linéaire',
      example: 'Tri Fusion (MergeSort), Tri Rapide moyen',
      calculate: (val: number) => Math.ceil(val * Math.log2(val || 1)),
      color: '#a855f7', // purple-500
      badge: 'Bon tri',
    },
    {
      notation: 'O(n²)',
      name: 'Quadratique',
      example: 'Tri à Bulles, Tri par Insertion, Boucles imbriquées',
      calculate: (val: number) => val * val,
      color: '#f87171', // red-400
      badge: 'Lent à grande échelle',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <section>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <TrendingUp className="w-7 h-7 text-sky-400" />
          <span>Théorie : Notation Grand-O (Complexité Asymptotique)</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Mesure la croissance du temps d'exécution ou du nombre d'opérations lorsque la taille des données d'entrée <strong className="text-sky-300 font-mono">N</strong> augmente.
        </p>
      </section>

      {/* Interactive Slider Section */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Paramètre d'entrée : Taille du problème (N)
            </span>
            <span className="text-xs text-slate-500">
              Déplacez le curseur pour observer comment réagit chaque classe de complexité.
            </span>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 px-5 py-2.5 rounded-xl border border-sky-500/30">
            <span className="text-xs text-slate-400 font-mono">N =</span>
            <span className="text-3xl font-extrabold font-mono text-sky-400 tabular-nums">
              {n}
            </span>
            <span className="text-xs text-slate-500">éléments</span>
          </div>
        </div>

        <input
          type="range"
          min="1"
          max="100"
          value={n}
          onChange={(e) => setN(parseInt(e.target.value, 10))}
          className="w-full accent-sky-400 cursor-pointer h-2 bg-slate-950 rounded-lg appearance-none"
        />

        <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2">
          <span>N = 1 (très petit)</span>
          <span>N = 50</span>
          <span>N = 100 (modéré)</span>
        </div>
      </section>

      {/* Comparative Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {complexities.map((comp) => {
          const ops = comp.calculate(n);
          return (
            <div
              key={comp.notation}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors"
            >
              <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: comp.color }} />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-lg font-extrabold font-mono px-2 py-0.5 rounded"
                    style={{ color: comp.color, backgroundColor: `${comp.color}15` }}
                  >
                    {comp.notation}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
                    {comp.badge}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white mb-1">{comp.name}</h3>
                <p className="text-xs text-slate-400 mb-4">{comp.example}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-baseline justify-between font-mono">
                <span className="text-xs text-slate-500">Opérations pour N={n} :</span>
                <span className="text-xl font-extrabold text-white tabular-nums">
                  {ops.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Pedagogical Comparison Table */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl overflow-x-auto">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-400" />
          <span>Comparaison à Grande Échelle (L'impact réel du choix algorithmique)</span>
        </h3>

        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-2.5 px-3">Complexité</th>
              <th className="py-2.5 px-3">N = 10</th>
              <th className="py-2.5 px-3">N = 100</th>
              <th className="py-2.5 px-3">N = 10 000</th>
              <th className="py-2.5 px-3">N = 1 000 000</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            <tr>
              <td className="py-3 px-3 font-bold text-sky-400">O(1) - Constante</td>
              <td className="py-3 px-3">1</td>
              <td className="py-3 px-3">1</td>
              <td className="py-3 px-3">1</td>
              <td className="py-3 px-3 text-emerald-400 font-bold">1 op (immédiat)</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-bold text-emerald-400">O(log n) - Binaire</td>
              <td className="py-3 px-3">4</td>
              <td className="py-3 px-3">7</td>
              <td className="py-3 px-3">14</td>
              <td className="py-3 px-3 text-emerald-400 font-bold">~ 20 op seulement !</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-bold text-amber-400">O(n) - Linéaire</td>
              <td className="py-3 px-3">10</td>
              <td className="py-3 px-3">100</td>
              <td className="py-3 px-3">10 000</td>
              <td className="py-3 px-3 text-amber-400 font-bold">1 000 000 op</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-bold text-red-400">O(n²) - Quadratique</td>
              <td className="py-3 px-3">100</td>
              <td className="py-3 px-3">10 000</td>
              <td className="py-3 px-3">100 000 000</td>
              <td className="py-3 px-3 text-red-400 font-bold">1 000 milliards (trop lent !)</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
