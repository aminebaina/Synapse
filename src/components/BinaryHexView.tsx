import React, { useState } from 'react';
import { 
  Binary, 
  RotateCcw, 
  Sparkles, 
  Info, 
  Cpu, 
  Trophy, 
  CheckCircle2, 
  Sliders,
  ArrowRight
} from 'lucide-react';

export default function BinaryHexView() {
  // 8 bits state: array of 8 booleans [b7, b6, b5, b4, b3, b2, b1, b0]
  // b7 = 128, ..., b0 = 1
  const [bits, setBits] = useState<boolean[]>([false, false, true, false, true, false, true, false]); // Default to 42 (00101010)

  // Brilliant-style quiz state
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [quizTarget] = useState<number>(53); // Target for challenge
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Powers of 2 weights
  const weights = [128, 64, 32, 16, 8, 4, 2, 1];

  // Calculate decimal value
  const decimalValue = bits.reduce((sum, bit, idx) => sum + (bit ? weights[idx] : 0), 0);

  // High nibble (bits 0..3) & Low nibble (bits 4..7)
  const highNibbleValue = (bits[0] ? 8 : 0) + (bits[1] ? 4 : 0) + (bits[2] ? 2 : 0) + (bits[3] ? 1 : 0);
  const lowNibbleValue = (bits[4] ? 8 : 0) + (bits[5] ? 4 : 0) + (bits[6] ? 2 : 0) + (bits[7] ? 1 : 0);

  // Hexadecimal digits
  const toHexDigit = (val: number) => val.toString(16).toUpperCase();
  const hexString = `0x${toHexDigit(highNibbleValue)}${toHexDigit(lowNibbleValue)}`;

  // ASCII character if printable
  const asciiChar = decimalValue >= 32 && decimalValue <= 126 ? String.fromCharCode(decimalValue) : null;

  // Toggle individual bit
  const handleToggleBit = (index: number) => {
    setBits((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      // Check quiz completion
      const nextDec = next.reduce((sum, bit, idx) => sum + (bit ? weights[idx] : 0), 0);
      if (nextDec === quizTarget) {
        setQuizCompleted(true);
      }
      return next;
    });
  };

  // Set from decimal input
  const handleSetFromDecimal = (dec: number) => {
    const clamped = Math.max(0, Math.min(255, dec));
    const newBits = weights.map((w) => (clamped & w) === w);
    setBits(newBits);
    if (clamped === quizTarget) {
      setQuizCompleted(true);
    }
  };

  // Presets
  const applyPreset = (val: number) => {
    handleSetFromDecimal(val);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Binary className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Le Codage Binaire & Hexadécimal
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Révéler comment la mémoire stocke concrètement les nombres : les 8 interrupteurs physiques d'un octet (byte) et leur conversion naturelle en hexadécimal (base 16).
        </p>
      </section>

      {/* Top Presets & Brilliant Challenge Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 mr-1">Valeurs clés :</span>
          <button
            onClick={() => applyPreset(42)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              decimalValue === 42
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            42 (0x2A)
          </button>
          <button
            onClick={() => applyPreset(255)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              decimalValue === 255
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            255 (0xFF max)
          </button>
          <button
            onClick={() => applyPreset(170)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              decimalValue === 170
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            170 (0xAA motif 1010)
          </button>
          <button
            onClick={() => applyPreset(65)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              decimalValue === 65
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            65 (Lettre 'A')
          </button>
          <button
            onClick={() => applyPreset(0)}
            className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 cursor-pointer"
            title="Tout mettre à zéro"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Challenge Button */}
        <button
          onClick={() => setShowQuiz(!showQuiz)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
            showQuiz
              ? 'bg-amber-500 text-slate-950 border-amber-400'
              : 'bg-slate-900 text-amber-300 border-amber-500/40 hover:bg-slate-800'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>{showQuiz ? 'Fermer le Défi' : 'Mode Défi : Composer 53'}</span>
        </button>
      </div>

      {/* Brilliant Style Challenge Banner */}
      {showQuiz && (
        <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-5 shadow-xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4" />
              <span>Défi Interactif (Learning by Doing)</span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Cible = <strong className="text-amber-300 font-bold">{quizTarget}</strong>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200">
            Allumez les bons interrupteurs ci-dessous pour former exactement la valeur décimale <strong>{quizTarget}</strong>.
            <br />
            <span className="text-slate-400 text-xs">
              Astuce : Cherchez la plus grande puissance de 2 qui rentre dans 53 (32), puis continuez avec le reste !
            </span>
          </p>

          {decimalValue === quizTarget && (
            <div className="mt-3 p-3 bg-emerald-500/20 border border-emerald-400 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Bravo ! 53 = 32 + 16 + 4 + 1. En binaire : 0011 0101 et en hexadécimal : 0x35 !
              </span>
            </div>
          )}
        </div>
      )}

      {/* 3 Result Cards : Binaire, Décimal, Hexadécimal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Décimal */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            Base 10 · Décimal
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-4xl font-extrabold font-mono text-white tabular-nums">
              {decimalValue}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              / 255 max
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Saisie directe :</span>
            <input
              type="number"
              min="0"
              max="255"
              value={decimalValue}
              onChange={(e) => handleSetFromDecimal(parseInt(e.target.value, 10) || 0)}
              className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-white text-right focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {/* Hexadécimal */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-purple-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
            Base 16 · Hexadécimal (RAM)
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-4xl font-extrabold font-mono text-purple-300 tabular-nums">
              {hexString}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              2 quartets
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between font-mono">
            <span>Poids fort : <strong className="text-purple-300">{toHexDigit(highNibbleValue)}</strong></span>
            <span>·</span>
            <span>Poids faible : <strong className="text-sky-300">{toHexDigit(lowNibbleValue)}</strong></span>
          </div>
        </div>

        {/* ASCII / Interprétation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-sky-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
            Caractère ASCII
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-4xl font-extrabold font-mono text-white">
              {asciiChar ? `'${asciiChar}'` : <span className="text-slate-600 text-lg">Non imprimable</span>}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Code {decimalValue}
            </span>
          </div>
          <p className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
            {asciiChar ? `Ce byte code la lettre/symbole '${asciiChar}' en texte.` : 'Caractère de contrôle ou hors table standard.'}
          </p>
        </div>
      </div>

      {/* Main 8-Bit Interactive Register Rack */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>L'Octet Physique (1 Byte = 8 Bits)</span>
            </h2>
            <span className="text-xs text-slate-500">
              Cliquez sur n'importe quel bit pour basculer son état (0 ↔ 1).
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-purple-400" />
              <span className="text-slate-400">Quartet Fort (4 bits)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-sky-400" />
              <span className="text-slate-400">Quartet Faible (4 bits)</span>
            </span>
          </div>
        </div>

        {/* 8 Bits Interactive Switches */}
        <div className="grid grid-cols-8 gap-2 sm:gap-3.5 max-w-3xl mx-auto">
          {bits.map((isOn, idx) => {
            const weight = weights[idx];
            const bitPower = 7 - idx; // 7, 6, 5...
            const isHighNibble = idx < 4;

            let activeColor = isHighNibble
              ? 'bg-purple-500/25 border-purple-400 text-purple-200 shadow-lg shadow-purple-500/20 ring-2 ring-purple-400/50'
              : 'bg-sky-500/25 border-sky-400 text-sky-200 shadow-lg shadow-sky-500/20 ring-2 ring-sky-400/50';

            let inactiveColor = 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700';

            return (
              <div key={idx} className="flex flex-col items-center">
                {/* Power of 2 label */}
                <div className="text-center mb-1">
                  <span className="text-[10px] font-mono text-slate-500 block">
                    2<sup>{bitPower}</sup>
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {weight}
                  </span>
                </div>

                {/* Interactive Bit Switch */}
                <button
                  onClick={() => handleToggleBit(idx)}
                  className={`w-full aspect-[4/5] rounded-xl border-2 flex flex-col items-center justify-center p-1.5 transition-all duration-200 cursor-pointer ${
                    isOn ? activeColor : inactiveColor
                  }`}
                >
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums">
                    {isOn ? '1' : '0'}
                  </span>
                  <span className="text-[10px] font-mono mt-1 font-bold">
                    {isOn ? `+${weight}` : '0'}
                  </span>
                </button>

                {/* Bit Index */}
                <span className="text-[10px] font-mono text-slate-600 mt-1.5">
                  b{bitPower}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mathematical Sum Formula Breakdown */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-center overflow-x-auto">
          <span className="text-slate-500 text-[11px] block mb-1">Somme des puissances actives :</span>
          <div className="text-slate-300 whitespace-nowrap">
            {bits.map((isOn, idx) => (
              <span key={idx}>
                <span className={isOn ? 'text-white font-bold' : 'text-slate-600'}>
                  ({isOn ? '1' : '0'} × {weights[idx]})
                </span>
                {idx < 7 && <span className="text-slate-600 mx-1">+</span>}
              </span>
            ))}
            <span className="text-slate-500 mx-2">=</span>
            <strong className="text-emerald-400 text-sm">{decimalValue}</strong>
          </div>
        </div>
      </section>

      {/* The Hexadecimal Secret (Why 2 hex digits = 1 byte) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Pourquoi l'Hexadécimal ? L'astuce des 4 bits</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed space-y-2">
            <span>
              Un nombre binaire de 8 chiffres comme <code className="text-slate-200 font-mono">11010110</code> est difficile à lire pour un humain.
            </span>
            <br /><br />
            <span>
              L'astuce de génie : <strong>4 bits</strong> peuvent prendre exactement $2^4 = 16$ valeurs possibles (de 0 à 15).
              En base 16, chaque groupe de 4 bits correspond exactement à <strong>un seul caractère</strong> (0 à 9, puis A=10, B=11, C=12, D=13, E=14, F=15).
            </span>
            <br /><br />
            <span>
              Ainsi, n'importe quel octet se résume élégamment en <strong>2 lettres/chiffres</strong> (ex: <code className="text-purple-300 font-mono">{hexString}</code>).
            </span>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400" />
            <span>Table de Correspondance Rapide (10 à 15)</span>
          </h3>
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
              <span className="text-slate-500 text-[10px] block">10 (1010)</span>
              <strong className="text-sky-300 text-sm">A</strong>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
              <span className="text-slate-500 text-[10px] block">11 (1011)</span>
              <strong className="text-sky-300 text-sm">B</strong>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
              <span className="text-slate-500 text-[10px] block">12 (1100)</span>
              <strong className="text-sky-300 text-sm">C</strong>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
              <span className="text-slate-500 text-[10px] block">13 (1101)</span>
              <strong className="text-sky-300 text-sm">D</strong>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
              <span className="text-slate-500 text-[10px] block">14 (1110)</span>
              <strong className="text-sky-300 text-sm">E</strong>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
              <span className="text-slate-500 text-[10px] block">15 (1111)</span>
              <strong className="text-sky-300 text-sm">F</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
