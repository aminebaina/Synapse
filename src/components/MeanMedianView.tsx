import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  Plus, 
  Trash2, 
  Sparkles, 
  Info, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';

export default function MeanMedianView() {
  const [numbers, setNumbers] = useState<number[]>([2, 4, 4, 6, 8, 10, 15]);
  const [newVal, setNewVal] = useState<string>('12');

  // Calculations
  const sortedNumbers = useMemo(() => [...numbers].sort((a, b) => a - b), [numbers]);

  // Moyenne
  const mean = useMemo(() => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return Math.round((sum / numbers.length) * 10) / 10;
  }, [numbers]);

  // Médiane
  const median = useMemo(() => {
    if (sortedNumbers.length === 0) return 0;
    const mid = Math.floor(sortedNumbers.length / 2);
    if (sortedNumbers.length % 2 !== 0) {
      return sortedNumbers[mid];
    }
    return (sortedNumbers[mid - 1] + sortedNumbers[mid]) / 2;
  }, [sortedNumbers]);

  // Mode (most frequent)
  const mode = useMemo(() => {
    if (numbers.length === 0) return [];
    const counts: Record<number, number> = {};
    numbers.forEach((n) => {
      counts[n] = (counts[n] || 0) + 1;
    });
    let maxFreq = 0;
    for (const k in counts) {
      if (counts[k] > maxFreq) maxFreq = counts[k];
    }
    if (maxFreq <= 1) return []; // No repetition
    return Object.keys(counts)
      .map(Number)
      .filter((k) => counts[k] === maxFreq);
  }, [numbers]);

  const handleAddNumber = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(newVal, 10);
    if (isNaN(val)) return;
    setNumbers((prev) => [...prev, val]);
    setNewVal('');
  };

  const handleRemoveNumber = (indexToRemove: number) => {
    setNumbers((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Presets
  const applyPreset = (preset: 'balanced' | 'outlier' | 'salaries') => {
    if (preset === 'balanced') {
      setNumbers([10, 12, 14, 15, 16, 18, 20]);
    } else if (preset === 'outlier') {
      // The billionaire effect
      setNumbers([2, 3, 3, 4, 5, 6, 80]);
    } else if (preset === 'salaries') {
      setNumbers([1800, 2000, 2100, 2200, 2400, 3100, 15000]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Scale className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Moyenne vs Médiane (Data Science & Stats)
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Le concept le plus fondamental pour comprendre des données : la moyenne calcule le centre de gravité, tandis que la médiane sépare l'échantillon exactement en deux moitiés égales.
        </p>
      </section>

      {/* Preset Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-500 mr-1">Scénarios pédagogiques :</span>
        <button
          onClick={() => applyPreset('balanced')}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Distribution normale (Moyenne ≈ Médiane)
        </button>
        <button
          onClick={() => applyPreset('outlier')}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition-colors cursor-pointer"
        >
          L'effet « Valeur Extrême / Milliardaire »
        </button>
        <button
          onClick={() => applyPreset('salaries')}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Salaires en entreprise (€)
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Moyenne */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-sky-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
            La Moyenne (Mean)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {mean}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              = Somme / {numbers.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Sensible aux valeurs extrêmes. Tout le monde contribue au total.
          </p>
        </div>

        {/* Médiane */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            La Médiane (Median)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {median}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              (La valeur du milieu)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            50% des valeurs sont au-dessous, 50% au-dessus. Insensible aux extrêmes.
          </p>
        </div>

        {/* Mode */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-purple-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
            Le Mode (Mode)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {mode.length > 0 ? mode.join(', ') : 'Aucun'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            La valeur qui apparaît le plus souvent (comme la taille de vêtement la plus vendue).
          </p>
        </div>
      </div>

      {/* Sorted Data List */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Échantillon de Données ({numbers.length} valeurs ordonnées)
            </h3>
            <span className="text-xs text-slate-500">
              Cliquez sur la croix rouge pour retirer une valeur ou ajoutez-en une.
            </span>
          </div>

          {/* Add form */}
          <form onSubmit={handleAddNumber} className="flex items-center gap-2">
            <input
              type="number"
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              placeholder="Valeur"
              className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter</span>
            </button>
          </form>
        </div>

        {/* Data Cards */}
        <div className="flex flex-wrap gap-2.5 pt-2">
          {sortedNumbers.map((num, idx) => {
            const isMedianElement =
              sortedNumbers.length % 2 !== 0
                ? idx === Math.floor(sortedNumbers.length / 2)
                : idx === sortedNumbers.length / 2 - 1 || idx === sortedNumbers.length / 2;

            return (
              <div
                key={idx}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-mono text-sm transition-all ${
                  isMedianElement
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400/50 scale-105'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              >
                <span className="font-bold">{num}</span>
                {isMedianElement && (
                  <span className="text-[10px] font-bold text-emerald-300 uppercase">
                    Médiane
                  </span>
                )}
                <button
                  onClick={() => handleRemoveNumber(idx)}
                  className="text-slate-500 hover:text-red-400 ml-1 cursor-pointer"
                  title="Retirer cette valeur"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pedagogical Explanation: The Bill Gates effect */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Pourquoi comprendre la différence est capital ?</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Imaginez un café où 10 personnes gagnent chacune <strong>2 000 €</strong> par mois.
          <br />
          Soudain, un milliardaire entre dans le café. La <strong>moyenne</strong> des salaires dans le café bondit instantanément à <strong>100 000 €</strong> par personne (totalement trompeur pour décrire le client typique !).
          <br />
          En revanche, la <strong>médiane</strong> reste rigoureusement à <strong>2 000 €</strong>. C’est pourquoi les statisticiens préfèrent toujours parler de <em>salaire médian</em> plutôt que de salaire moyen.
        </p>
      </div>
    </div>
  );
}
