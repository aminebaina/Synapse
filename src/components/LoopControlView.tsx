import React, { useState, useEffect } from 'react';
import { 
  Repeat, 
  ChevronRight, 
  RotateCcw, 
  Play, 
  Pause, 
  Sparkles, 
  Info, 
  Code2, 
  Database,
  ArrowDown,
  CheckCircle2,
  HelpCircle,
  Trophy
} from 'lucide-react';

interface LoopStep {
  lineId: number;
  i: number;
  somme: number;
  conditionMet: boolean;
  explanation: string;
  isLoopBack?: boolean;
}

export default function LoopControlView() {
  const [n, setN] = useState<number>(4);
  const [syntaxMode, setSyntaxMode] = useState<'while' | 'for'>('while');
  const [stepIndex, setStepIndex] = useState<number>(-1);
  const [isRunningAuto, setIsRunningAuto] = useState<boolean>(false);

  // Brilliant-style Interactive Quiz state
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  // Precompute complete execution trace for N
  const executionSteps: LoopStep[] = React.useMemo(() => {
    const list: LoopStep[] = [];
    let currentSomme = 0;
    let currentI = 1;

    // Step 1 : Init somme
    list.push({
      lineId: 1,
      i: 0,
      somme: 0,
      conditionMet: true,
      explanation: "Initialisation : L'accumulateur 'somme' est mis à zéro (0).",
    });

    // Step 2 : Init i
    list.push({
      lineId: 2,
      i: 1,
      somme: 0,
      conditionMet: true,
      explanation: "Initialisation : Le compteur d'itérations 'i' démarre à 1.",
    });

    while (currentI <= n) {
      // Step 3 : Test condition
      list.push({
        lineId: 3,
        i: currentI,
        somme: currentSomme,
        conditionMet: true,
        explanation: `Test de boucle : Est-ce que i (${currentI}) <= N (${n}) ? VRAI. On entre dans la boucle.`,
      });

      // Step 4 : Accumuler
      currentSomme += currentI;
      list.push({
        lineId: 4,
        i: currentI,
        somme: currentSomme,
        conditionMet: true,
        explanation: `Accumulation : somme = ${currentSomme - currentI} + ${currentI} = ${currentSomme}.`,
      });

      // Step 5 : Incrémenter
      currentI += 1;
      list.push({
        lineId: 5,
        i: currentI,
        somme: currentSomme,
        conditionMet: true,
        isLoopBack: true,
        explanation: `Incrémentation : i passe à ${currentI}. L'instruction JUMP renvoie le CPU vers la ligne 3 !`,
      });
    }

    // Step 3 (False exit)
    list.push({
      lineId: 3,
      i: currentI,
      somme: currentSomme,
      conditionMet: false,
      explanation: `Test de boucle : Est-ce que i (${currentI}) <= N (${n}) ? FAUX ! La condition d'arrêt est atteinte.`,
    });

    // Step 6 : End
    list.push({
      lineId: 6,
      i: currentI,
      somme: currentSomme,
      conditionMet: false,
      explanation: `Fin de la boucle ! Le résultat final accumulé est ${currentSomme} (vérifiable via Gauss : ${n}×${n + 1}/2 = ${currentSomme}).`,
    });

    return list;
  }, [n]);

  const current = stepIndex >= 0 && stepIndex < executionSteps.length ? executionSteps[stepIndex] : null;
  const isFinished = stepIndex >= executionSteps.length - 1 && stepIndex !== -1;

  const handleNext = () => {
    if (stepIndex < executionSteps.length - 1) {
      setStepIndex((s) => s + 1);
    } else {
      setIsRunningAuto(false);
    }
  };

  const handleReset = () => {
    setIsRunningAuto(false);
    setStepIndex(-1);
  };

  // Auto-play timer
  useEffect(() => {
    if (!isRunningAuto) return;
    if (isFinished) {
      setIsRunningAuto(false);
      return;
    }
    const t = setTimeout(handleNext, 900);
    return () => clearTimeout(t);
  }, [isRunningAuto, stepIndex, isFinished]);

  // Quiz submission
  const handleQuizAnswer = (choice: number) => {
    setQuizSelected(choice);
    setQuizAnswered(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Repeat className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Les Boucles (while / for) & l'Accumulateur
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          La 3ème structure de contrôle fondamentale de Böhm-Jacopini : répéter un bloc d'instructions en mémoire tant qu'une proposition booléenne reste vraie.
        </p>
      </section>

      {/* Top Controls: N Selector, Syntax Switcher & Challenge Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* N Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
          <span className="text-xs text-slate-400 font-mono px-2">Borne N =</span>
          {[3, 4, 5].map((val) => (
            <button
              key={val}
              onClick={() => {
                handleReset();
                setN(val);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                n === val
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              N = {val}
            </button>
          ))}
        </div>

        {/* Syntax toggle (while vs for) */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
          <button
            onClick={() => setSyntaxMode('while')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              syntaxMode === 'while' ? 'bg-sky-500/20 text-sky-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tant que (while)
          </button>
          <button
            onClick={() => setSyntaxMode('for')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              syntaxMode === 'for' ? 'bg-sky-500/20 text-sky-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pour (for)
          </button>
        </div>

        {/* Brilliant-style Challenge Toggle */}
        <button
          onClick={() => setShowQuiz(!showQuiz)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
            showQuiz
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
              : 'bg-slate-900 text-amber-300 border-amber-500/40 hover:bg-slate-800'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>{showQuiz ? 'Fermer le Défi' : 'Mode Défi (Quiz Interactif)'}</span>
        </button>
      </div>

      {/* Brilliant-style Challenge Card */}
      {showQuiz && (
        <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 mb-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-4 h-4" />
            <span>Défi Pédagogique (Style Brilliant)</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white mb-3">
            Si N = 4, quelle sera la valeur exacte dans la case mémoire 'somme' après 3 itérations (quand i = 3 a été additionné) ?
          </h3>

          <div className="grid grid-cols-3 gap-3 max-w-md my-4">
            {[3, 6, 10].map((choice) => {
              const isCorrect = choice === 6;
              const isPicked = quizSelected === choice;

              let btnStyle = 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800';
              if (quizAnswered) {
                if (isCorrect) btnStyle = 'bg-emerald-500 text-slate-950 font-extrabold border-emerald-400';
                else if (isPicked) btnStyle = 'bg-red-500 text-white font-bold border-red-400';
                else btnStyle = 'bg-slate-950 text-slate-600 border-slate-800 opacity-50';
              }

              return (
                <button
                  key={choice}
                  disabled={quizAnswered}
                  onClick={() => handleQuizAnswer(choice)}
                  className={`py-3 rounded-xl border-2 font-mono text-base font-bold transition-all cursor-pointer ${btnStyle}`}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          {quizAnswered && (
            <div className="text-xs text-slate-300 pt-2 border-t border-amber-500/30">
              {quizSelected === 6 ? (
                <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Exactement ! À la 3ème itération, somme = 1 + 2 + 3 = 6. Utilisez le visualiseur ci-dessous pour le vérifier pas à pas !
                </span>
              ) : (
                <span className="text-red-300 font-bold">
                  Pas tout à fait. À l'itération 1 (somme=1), itération 2 (somme=1+2=3), itération 3 (somme=3+3=6). Vérifiez-le ci-dessous !
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Two-Zone Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Zone 1: Pseudo-code & Instructions CPU (Left 6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-sky-400" />
                <span>Zone 1 · Instructions du Processeur</span>
              </h2>
              {current && (
                <span className="text-xs font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50">
                  Ligne {current.lineId}
                </span>
              )}
            </div>

            {/* Code Lines Listing */}
            <div className="space-y-1.5 font-mono text-xs sm:text-sm">
              {/* Line 1 */}
              <div className={`p-2 rounded-lg border-l-4 transition-all flex items-center gap-3 ${
                current?.lineId === 1 ? 'bg-sky-500/15 border-sky-400 text-white font-bold ring-1 ring-sky-500/30' : 'border-transparent text-slate-400'
              }`}>
                <span className="text-slate-600 text-[11px] w-4">1</span>
                <span>let somme = 0;</span>
              </div>

              {/* Line 2 */}
              <div className={`p-2 rounded-lg border-l-4 transition-all flex items-center gap-3 ${
                current?.lineId === 2 ? 'bg-sky-500/15 border-sky-400 text-white font-bold ring-1 ring-sky-500/30' : 'border-transparent text-slate-400'
              }`}>
                <span className="text-slate-600 text-[11px] w-4">2</span>
                <span>let i = 1;</span>
              </div>

              {/* Line 3 (Loop condition) */}
              <div className={`p-2 rounded-lg border-l-4 transition-all flex items-center justify-between ${
                current?.lineId === 3
                  ? current.conditionMet
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold ring-1 ring-amber-400/30'
                    : 'bg-red-500/20 border-red-400 text-red-200 font-bold'
                  : 'border-transparent text-slate-400'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-slate-600 text-[11px] w-4">3</span>
                  <span>
                    {syntaxMode === 'while'
                      ? `tant_que (i <= ${n}) faire :`
                      : `pour (i = 1; i <= ${n}; i++) :`}
                  </span>
                </div>
                {current?.lineId === 3 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    current.conditionMet ? 'bg-amber-400 text-slate-950' : 'bg-red-400 text-slate-950'
                  }`}>
                    {current.conditionMet ? 'VRAI' : 'FAUX (SORTIE)'}
                  </span>
                )}
              </div>

              {/* Line 4 (Body) */}
              <div className={`p-2 pl-8 rounded-lg border-l-4 transition-all flex items-center gap-3 ${
                current?.lineId === 4 ? 'bg-sky-500/15 border-sky-400 text-white font-bold ring-1 ring-sky-500/30' : 'border-transparent text-slate-400'
              }`}>
                <span className="text-slate-600 text-[11px] w-4">4</span>
                <span>somme = somme + i;</span>
              </div>

              {/* Line 5 (Increment & Jump) */}
              <div className={`p-2 pl-8 rounded-lg border-l-4 transition-all flex items-center justify-between ${
                current?.lineId === 5 ? 'bg-purple-500/20 border-purple-400 text-purple-200 font-bold ring-1 ring-purple-400/30' : 'border-transparent text-slate-400'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-slate-600 text-[11px] w-4">5</span>
                  <span>i = i + 1;</span>
                </div>
                {current?.lineId === 5 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-400 text-slate-950 flex items-center gap-1 animate-pulse">
                    <Repeat className="w-3 h-3" />
                    <span>JUMP LIGNE 3</span>
                  </span>
                )}
              </div>

              {/* Line 6 (End) */}
              <div className={`p-2 rounded-lg border-l-4 transition-all flex items-center gap-3 ${
                current?.lineId === 6 ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold ring-1 ring-emerald-400/30' : 'border-transparent text-slate-400'
              }`}>
                <span className="text-slate-600 text-[11px] w-4">6</span>
                <span>// Fin de boucle, résultat = somme</span>
              </div>
            </div>
          </div>

          {/* Mathematical Form */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Formule Mathématique de Gauss :</span>
            </div>
            <p className="font-mono text-slate-400">
              ∑(k=1 à {n}) k = 1 + ... + {n} = ({n} × {n + 1}) / 2 = <strong className="text-sky-300 font-bold">{n * (n + 1) / 2}</strong>
            </p>
          </div>
        </div>

        {/* Zone 2: Registres Mémoire & Accumulateur Visuel (Right 6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-400" />
                <span>Zone 2 · Registres Mémoire & Accumulateur</span>
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Itération {current && current.i > 0 ? Math.min(current.i, n) : 0} / {n}
              </span>
            </div>

            {/* Memory Registers Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Register i */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono">
                <span className="text-[10px] text-slate-500 uppercase block">Registre Compteur (i)</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-extrabold text-amber-400 tabular-nums">
                    {current ? current.i : 0}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    max: {n}
                  </span>
                </div>
              </div>

              {/* Register somme */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono">
                <span className="text-[10px] text-slate-500 uppercase block">Accumulateur (somme)</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-extrabold text-emerald-400 tabular-nums">
                    {current ? current.somme : 0}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    total
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Reservoir Bucket */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <span className="text-[11px] font-mono text-slate-400 block mb-2">
                Réservoir d'accumulation (les termes s'empilent) :
              </span>
              <div className="h-28 border-x-2 border-b-2 border-slate-700 bg-slate-900/60 rounded-b-xl p-2 flex flex-col-reverse gap-1.5 overflow-hidden">
                {Array.from({ length: current && current.somme > 0 ? Math.min(current.i, n) : 0 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-6 rounded bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono text-xs flex items-center justify-between px-3 animate-in fade-in slide-in-from-top duration-300"
                  >
                    <span>Terme +{idx + 1}</span>
                    <span className="text-[10px] opacity-75">étape {idx + 1}</span>
                  </div>
                ))}
                {(!current || current.somme === 0) && (
                  <div className="h-full flex items-center justify-center text-xs text-slate-600 font-mono italic">
                    Réservoir vide (somme = 0)
                  </div>
                )}
              </div>
            </div>

            {/* Explanation card */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>
                {current ? current.explanation : "Cliquez sur 'Instruction Suivante' pour débuter l'exécution de la boucle."}
              </span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleNext}
                disabled={isFinished}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
                  isFinished
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20'
                }`}
              >
                <span>{isFinished ? 'Boucle terminée' : 'Instruction Suivante'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser</span>
              </button>
            </div>

            {/* Auto-play */}
            <button
              onClick={() => {
                if (isFinished) handleReset();
                setIsRunningAuto(!isRunningAuto);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              {isRunningAuto ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunningAuto ? 'Pause' : 'Auto'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
