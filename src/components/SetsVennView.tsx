import React, { useState } from 'react';
import { CircleDot, Sparkles, Info, Trophy, CheckCircle2, RotateCcw } from 'lucide-react';

type SetOperation = 'ALL' | 'UNION' | 'INTERSECTION' | 'DIFF_A_B' | 'DIFF_B_A';

export default function SetsVennView() {
  const [operation, setOperation] = useState<SetOperation>('INTERSECTION');
  const [testElem, setTestElem] = useState<string>('6');

  // Set A and Set B items
  const setA = [2, 4, 6, 8, 10]; // Multiples de 2
  const setB = [3, 6, 9, 12];     // Multiples de 3

  // Calculated subsets
  const onlyA = setA.filter((x) => !setB.includes(x));      // [2, 4, 8, 10]
  const intersection = setA.filter((x) => setB.includes(x)); // [6]
  const onlyB = setB.filter((x) => !setA.includes(x));      // [3, 9, 12]
  const union = Array.from(new Set([...setA, ...setB])).sort((a, b) => a - b);

  // Result of current operation
  const getResultElements = () => {
    switch (operation) {
      case 'ALL':
        return union;
      case 'UNION':
        return union;
      case 'INTERSECTION':
        return intersection;
      case 'DIFF_A_B':
        return onlyA;
      case 'DIFF_B_A':
        return onlyB;
    }
  };

  const resultList = getResultElements();

  // Test membership
  const parsedTest = parseInt(testElem, 10);
  const inA = !isNaN(parsedTest) && setA.includes(parsedTest);
  const inB = !isNaN(parsedTest) && setB.includes(parsedTest);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <CircleDot className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Théorie des Ensembles & Diagrammes de Venn
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Le socle mathématique de la manipulation de données : comprendre comment les opérations booléennes (ET, OU, NON) agissent sur des collections d'éléments.
        </p>
      </section>

      {/* Operation Selection Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setOperation('INTERSECTION')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            operation === 'INTERSECTION'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          A ∩ B (Intersection / ET)
        </button>
        <button
          onClick={() => setOperation('UNION')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            operation === 'UNION'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          A ∪ B (Union / OU)
        </button>
        <button
          onClick={() => setOperation('DIFF_A_B')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            operation === 'DIFF_A_B'
              ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          A \ B (Seulement A)
        </button>
        <button
          onClick={() => setOperation('DIFF_B_A')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            operation === 'DIFF_B_A'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          B \ A (Seulement B)
        </button>
      </div>

      {/* Two-Zone Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Zone 1: Interactive Venn Diagram Visual (Left 7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Diagramme de Venn Interactif
              </span>
              <span className="text-xs font-mono text-slate-400">
                Univers U = [1, 15]
              </span>
            </div>

            {/* Venn Diagram Container */}
            <div className="relative w-full h-64 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center p-4 overflow-hidden">
              {/* Circle A (Left) */}
              <div
                className={`absolute w-48 h-48 rounded-full border-2 transition-all duration-300 flex flex-col items-start justify-center pl-6 ${
                  operation === 'UNION' || operation === 'DIFF_A_B'
                    ? 'bg-purple-500/20 border-purple-400 ring-2 ring-purple-400/40'
                    : 'bg-purple-950/30 border-purple-700/60'
                }`}
                style={{ left: 'calc(50% - 150px)' }}
              >
                <span className="absolute top-3 left-4 text-xs font-bold font-mono text-purple-300">
                  Ensemble A
                </span>
                <div className="flex flex-wrap gap-1.5 max-w-[80px]">
                  {onlyA.map((val) => (
                    <span
                      key={val}
                      className={`w-6 h-6 rounded-md font-mono text-xs font-bold flex items-center justify-center ${
                        resultList.includes(val)
                          ? 'bg-white text-slate-950 shadow-md'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {val}
                    </span>
                  ))}
                </div>
              </div>

              {/* Circle B (Right) */}
              <div
                className={`absolute w-48 h-48 rounded-full border-2 transition-all duration-300 flex flex-col items-end justify-center pr-6 ${
                  operation === 'UNION' || operation === 'DIFF_B_A'
                    ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-400/40'
                    : 'bg-emerald-950/30 border-emerald-700/60'
                }`}
                style={{ right: 'calc(50% - 150px)' }}
              >
                <span className="absolute top-3 right-4 text-xs font-bold font-mono text-emerald-300">
                  Ensemble B
                </span>
                <div className="flex flex-wrap gap-1.5 max-w-[80px] justify-end">
                  {onlyB.map((val) => (
                    <span
                      key={val}
                      className={`w-6 h-6 rounded-md font-mono text-xs font-bold flex items-center justify-center ${
                        resultList.includes(val)
                          ? 'bg-white text-slate-950 shadow-md'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {val}
                    </span>
                  ))}
                </div>
              </div>

              {/* Overlap / Intersection Zone in Center */}
              <div
                className={`relative z-10 w-24 h-32 rounded-3xl flex flex-col items-center justify-center transition-all duration-300 ${
                  operation === 'UNION' || operation === 'INTERSECTION'
                    ? 'bg-amber-400/30 border-2 border-amber-400 ring-2 ring-amber-400/50 scale-105'
                    : 'opacity-60'
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-amber-300 mb-1">
                  A ∩ B
                </span>
                <div className="flex flex-wrap gap-1 justify-center">
                  {intersection.map((val) => (
                    <span
                      key={val}
                      className={`w-7 h-7 rounded-lg font-mono text-xs font-extrabold flex items-center justify-center ${
                        resultList.includes(val)
                          ? 'bg-amber-400 text-slate-950 shadow-lg'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {val}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Operation Result Box */}
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs flex items-center justify-between">
            <span className="text-slate-400">Éléments dans le résultat :</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-bold">&#123;</span>
              <strong className="text-amber-300 text-sm">
                {resultList.join(', ')}
              </strong>
              <span className="text-slate-500 font-bold">&#125;</span>
              <span className="text-slate-500 text-[10px] ml-1">
                (cardinal = {resultList.length})
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Definitions & Membership Test (Right 5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
              <Info className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Logique Formelle & Appartenance (∈)
              </h2>
            </div>

            {/* Explanations */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-300 font-mono block mb-0.5">
                  A ∩ B (Intersection) = &#123; x | x ∈ A ET x ∈ B &#125;
                </span>
                <span className="text-slate-400 text-[11px]">
                  Les éléments qui appartiennent simultanément aux deux ensembles.
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-sky-300 font-mono block mb-0.5">
                  A ∪ B (Union) = &#123; x | x ∈ A OU x ∈ B &#125;
                </span>
                <span className="text-slate-400 text-[11px]">
                  Tous les éléments présents dans l'un, dans l'autre, ou dans les deux (sans doublon).
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-purple-300 font-mono block mb-0.5">
                  A \ B (Différence) = &#123; x | x ∈ A ET x ∉ B &#125;
                </span>
                <span className="text-slate-400 text-[11px]">
                  Les éléments qui sont dans A en retirant tous ceux de B.
                </span>
              </div>
            </div>

            {/* Membership Tester */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 block mb-2">
                Tester l'appartenance d'un élément (x ∈ S) :
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={testElem}
                  onChange={(e) => setTestElem(e.target.value)}
                  placeholder="ex: 6"
                  className="w-20 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono text-white text-center focus:outline-none focus:border-sky-500"
                />
                <div className="flex-1 text-xs font-mono">
                  <span className={inA ? 'text-purple-300 font-bold' : 'text-slate-600'}>
                    {inA ? `${parsedTest} ∈ A` : `${parsedTest} ∉ A`}
                  </span>
                  <span className="text-slate-600 mx-2">·</span>
                  <span className={inB ? 'text-emerald-300 font-bold' : 'text-slate-600'}>
                    {inB ? `${parsedTest} ∈ B` : `${parsedTest} ∉ B`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-slate-300 block mb-1">
              Pont avec les bases de données (SQL) :
            </span>
            <code className="text-sky-300 font-mono text-[11px]">
              WHERE age &gt;= 18 AND ville = 'Paris'
            </code>
            <p className="text-slate-500 mt-0.5">
              C'est rigoureusement l'intersection mathématique de l'ensemble des majeurs et de l'ensemble des parisiens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
