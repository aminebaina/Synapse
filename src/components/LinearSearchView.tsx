import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  Shuffle,
  Info,
  Code2,
  Eye,
  SlidersHorizontal,
  Check,
  Copy,
  Download
} from 'lucide-react';

import { CodeLanguage } from '../languageStore';

interface PseudoCodeLine {
  id: number;
  label: string;
  code: string;
  indent: number;
}

const PSEUDO_CODE_LINES: PseudoCodeLine[] = [
  { id: 1, label: 'Ligne 1', code: 'Pour chaque élément dans le tableau', indent: 0 },
  { id: 2, label: 'Ligne 2', code: "Si l'élément est égal à la cible", indent: 1 },
  { id: 3, label: 'Ligne 3', code: "Alors retourner 'Trouvé'", indent: 2 },
  { id: 4, label: 'Ligne 4', code: 'Sinon continuer', indent: 2 },
  { id: 5, label: 'Ligne 5', code: "Fin de boucle, retourner 'Non trouvé'", indent: 0 },
];

const PYTHON_CODE_LINES: PseudoCodeLine[] = [
  { id: 1, label: 'Ligne 1', code: 'for i in range(len(tableau)):', indent: 0 },
  { id: 2, label: 'Ligne 2', code: '    if tableau[i] == cible:', indent: 1 },
  { id: 3, label: 'Ligne 3', code: '        return i  # Trouvé !', indent: 2 },
  { id: 4, label: 'Ligne 4', code: '    # continuer la recherche', indent: 1 },
  { id: 5, label: 'Ligne 5', code: 'return -1  # Non trouvé', indent: 0 },
];

interface StepState {
  lineId: number;
  arrayIndex: number | null;
  subPhase: 'inspect' | 'compare' | 'found' | 'continue' | 'not_found';
  explanation: string;
  comparisonDetails?: {
    elementValue: number;
    targetValue: number;
    isEqual: boolean;
  };
}

interface LinearSearchViewProps {
  soundEnabled: boolean;
  language?: CodeLanguage;
  onLanguageChange?: (lang: CodeLanguage) => void;
}

export default function LinearSearchView({ 
  soundEnabled, 
  language = 'python', 
  onLanguageChange 
}: LinearSearchViewProps) {
  // Array configuration (strictly 5 numbers as requested)
  const [array, setArray] = useState<number[]>([14, 42, 7, 89, 53]);
  const [target, setTarget] = useState<number>(89);
  
  // Customization modal / editing state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editArrayInput, setEditArrayInput] = useState<string>('14, 42, 7, 89, 53');
  const [editTargetInput, setEditTargetInput] = useState<string>('89');

  // Algorithm runtime state
  const [stepIndex, setStepIndex] = useState<number>(-1);
  const [isRunningAuto, setIsRunningAuto] = useState<boolean>(false);
  const [autoSpeedMs, setAutoSpeedMs] = useState<number>(1000);
  const [showStandaloneModal, setShowStandaloneModal] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Audio synthesizer using Web Audio API
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  }, [soundEnabled]);

  // Precompute the complete sequence of logical execution steps
  const generateExecutionSequence = useCallback((arr: number[], tgt: number): StepState[] => {
    const steps: StepState[] = [];
    let found = false;

    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      // Step A: Ligne 1 - Pour chaque élément dans le tableau
      steps.push({
        lineId: 1,
        arrayIndex: i,
        subPhase: 'inspect',
        explanation: `Boucle : Nous examinons la case ${i} (valeur = ${val}).`,
      });

      // Step B: Ligne 2 - Si l'élément est égal à la cible
      const isEqual = val === tgt;
      steps.push({
        lineId: 2,
        arrayIndex: i,
        subPhase: 'compare',
        explanation: `Comparaison : Est-ce que l'élément (${val}) est égal à la cible (${tgt}) ? ${isEqual ? 'OUI !' : 'NON.'}`,
        comparisonDetails: {
          elementValue: val,
          targetValue: tgt,
          isEqual,
        },
      });

      if (isEqual) {
        // Step C1: Ligne 3 - Alors retourner 'Trouvé'
        steps.push({
          lineId: 3,
          arrayIndex: i,
          subPhase: 'found',
          explanation: `Cible trouvée ! La valeur ${tgt} a été localisée à l'indice ${i} (position ${i + 1}).`,
          comparisonDetails: {
            elementValue: val,
            targetValue: tgt,
            isEqual: true,
          },
        });
        found = true;
        break;
      } else {
        // Step C2: Ligne 4 - Sinon continuer
        steps.push({
          lineId: 4,
          arrayIndex: i,
          subPhase: 'continue',
          explanation: `Non égal : ${val} ≠ ${tgt}. On poursuit l'exploration vers la case suivante.`,
          comparisonDetails: {
            elementValue: val,
            targetValue: tgt,
            isEqual: false,
          },
        });
      }
    }

    if (!found) {
      // Step D: Ligne 5 - Fin de boucle, retourner 'Non trouvé'
      steps.push({
        lineId: 5,
        arrayIndex: null,
        subPhase: 'not_found',
        explanation: `Fin de boucle atteinte : les 5 cases ont été testées sans trouver ${tgt}. L'algorithme retourne 'Non trouvé'.`,
      });
    }

    return steps;
  }, []);

  const executionPlan = React.useMemo(() => {
    return generateExecutionSequence(array, target);
  }, [array, target, generateExecutionSequence]);

  const currentStep = stepIndex >= 0 && stepIndex < executionPlan.length ? executionPlan[stepIndex] : null;
  const isFinished = stepIndex >= executionPlan.length - 1 && stepIndex !== -1;
  const isFound = currentStep?.subPhase === 'found';
  const isNotFound = currentStep?.subPhase === 'not_found';

  // Sound effects on step change
  useEffect(() => {
    if (!currentStep) return;
    if (currentStep.subPhase === 'inspect') {
      playTone(440, 0.08, 'sine');
    } else if (currentStep.subPhase === 'compare') {
      playTone(523.25, 0.09, 'triangle');
    } else if (currentStep.subPhase === 'found') {
      playTone(523.25, 0.15, 'triangle');
      setTimeout(() => playTone(659.25, 0.15, 'triangle'), 120);
      setTimeout(() => playTone(783.99, 0.35, 'triangle'), 240);
    } else if (currentStep.subPhase === 'continue') {
      playTone(330, 0.08, 'sine');
    } else if (currentStep.subPhase === 'not_found') {
      playTone(392, 0.2, 'sawtooth');
      setTimeout(() => playTone(311.13, 0.3, 'sine'), 160);
    }
  }, [stepIndex, currentStep, playTone]);

  // Handle "Étape Suivante"
  const handleNextStep = useCallback(() => {
    if (stepIndex < executionPlan.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      setIsRunningAuto(false);
    }
  }, [stepIndex, executionPlan]);

  // Handle "Réinitialiser"
  const handleReset = useCallback(() => {
    setIsRunningAuto(false);
    setStepIndex(-1);
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (!isRunningAuto) return;
    if (isFinished) {
      setIsRunningAuto(false);
      return;
    }

    const timer = setTimeout(() => {
      handleNextStep();
    }, autoSpeedMs);

    return () => clearTimeout(timer);
  }, [isRunningAuto, stepIndex, isFinished, autoSpeedMs, handleNextStep]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space' || e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextStep();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextStep, handleReset]);

  // Target presets
  const applyPreset = (newTarget: number, newArr?: number[]) => {
    handleReset();
    if (newArr) setArray(newArr);
    setTarget(newTarget);
    setEditTargetInput(newTarget.toString());
    if (newArr) setEditArrayInput(newArr.join(', '));
  };

  // Randomize array
  const handleRandomize = () => {
    handleReset();
    const newArr: number[] = [];
    while (newArr.length < 5) {
      const num = Math.floor(Math.random() * 90) + 10;
      if (!newArr.includes(num)) newArr.push(num);
    }
    const isInside = Math.random() > 0.3;
    const newTarget = isInside ? newArr[Math.floor(Math.random() * 5)] : Math.floor(Math.random() * 90) + 10;
    setArray(newArr);
    setTarget(newTarget);
    setEditArrayInput(newArr.join(', '));
    setEditTargetInput(newTarget.toString());
  };

  // Save manual edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = editArrayInput
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    if (parsed.length !== 5) {
      alert('Veuillez entrer exactement 5 nombres séparés par des virgules.');
      return;
    }

    const parsedTarget = parseInt(editTargetInput.trim(), 10);
    if (isNaN(parsedTarget)) {
      alert('Veuillez entrer un nombre valide pour la cible.');
      return;
    }

    handleReset();
    setArray(parsed);
    setTarget(parsedTarget);
    setIsEditing(false);
  };

  // Determine cell state for index i
  const getCellVisualState = (i: number) => {
    if (stepIndex === -1 || !currentStep) {
      return {
        status: 'idle',
        isInspected: false,
        isFound: false,
        isPassed: false,
      };
    }

    const isCurrentPointer = currentStep.arrayIndex === i;
    const isSuccess = isFound && currentStep.arrayIndex === i;
    
    let isPassed = false;
    if (currentStep.arrayIndex !== null) {
      if (i < currentStep.arrayIndex) {
        isPassed = true;
      } else if (i === currentStep.arrayIndex && (currentStep.subPhase === 'continue')) {
        isPassed = true;
      }
    } else if (isNotFound) {
      isPassed = true;
    }

    return {
      status: isSuccess ? 'found' : isCurrentPointer ? 'inspected' : isPassed ? 'passed' : 'pending',
      isInspected: isCurrentPointer && !isSuccess,
      isFound: isSuccess,
      isPassed: isPassed && !isSuccess && !isCurrentPointer,
    };
  };

  const standaloneHtmlString = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visualiseur de Recherche Linéaire</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0f172a; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; width: 100%; max-width: 860px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
    h1 { font-size: 26px; font-weight: 800; text-align: center; margin-bottom: 8px; color: #38bdf8; }
    p.subtitle { text-align: center; color: #94a3b8; font-size: 14px; margin-bottom: 28px; }
    .target-banner { display: flex; align-items: center; justify-content: center; gap: 12px; background: #0f172a; border: 1px solid #38bdf8; border-radius: 12px; padding: 12px 24px; margin-bottom: 28px; width: fit-content; margin-inline: auto; }
    .target-val { background: #0284c7; color: white; font-weight: 800; font-size: 22px; padding: 4px 16px; border-radius: 8px; font-family: 'JetBrains Mono', monospace; }
    .grid-container { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
    @media (max-width: 768px) { .grid-container { grid-template-columns: 1fr; } }
    .panel { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 20px; }
    .panel-title { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
    .code-line { font-family: 'JetBrains Mono', monospace; font-size: 13px; padding: 8px 12px; border-radius: 6px; margin-bottom: 6px; border-left: 3px solid transparent; color: #94a3b8; transition: all 0.25s ease; }
    .code-line.active { background: rgba(56, 189, 248, 0.15); border-left-color: #38bdf8; color: #ffffff; font-weight: 600; }
    .array-container { display: flex; gap: 12px; justify-content: center; margin-top: 16px; }
    .cell { flex: 1; min-width: 54px; max-width: 72px; aspect-ratio: 1; border: 2px solid #334155; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #1e293b; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    .cell-idx { font-size: 11px; color: #64748b; font-family: 'JetBrains Mono', monospace; margin-bottom: 2px; }
    .cell-val { font-size: 22px; font-weight: 800; font-family: 'JetBrains Mono', monospace; color: #f8fafc; }
    .cell.inspected { background: #fef08a !important; border-color: #eab308 !important; transform: translateY(-4px); }
    .cell.inspected .cell-idx { color: #854d0e; }
    .cell.inspected .cell-val { color: #713f12; }
    .cell.found { background: #bbf7d0 !important; border-color: #22c55e !important; transform: scale(1.06); }
    .cell.found .cell-idx { color: #166534; }
    .cell.found .cell-val { color: #14532d; }
    .cell.passed { opacity: 0.45; border-color: #475569; }
    .status-box { background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 12px 16px; margin-top: 16px; font-size: 14px; min-height: 48px; color: #cbd5e1; }
    .controls { display: flex; gap: 12px; justify-content: center; margin-top: 24px; }
    button { cursor: pointer; font-family: inherit; font-size: 14px; font-weight: 700; padding: 12px 24px; border-radius: 8px; border: none; }
    .btn-primary { background: #0284c7; color: white; }
    .btn-secondary { background: #334155; color: #f8fafc; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Visualiseur de Recherche Linéaire</h1>
    <p class="subtitle">Algorithme séquentiel pas-à-pas avec pseudo-code synchronisé</p>
    <div class="target-banner"><span>Cible recherchée :</span><div class="target-val">89</div></div>
    <div class="grid-container">
      <div class="panel">
        <div class="panel-title">Zone de Pseudo-code</div>
        <div id="l1" class="code-line">Ligne 1 : Pour chaque élément dans le tableau</div>
        <div id="l2" class="code-line" style="padding-left:24px;">Ligne 2 : Si l'élément est égal à la cible</div>
        <div id="l3" class="code-line" style="padding-left:36px;">Ligne 3 : Alors retourner 'Trouvé'</div>
        <div id="l4" class="code-line" style="padding-left:36px;">Ligne 4 : Sinon continuer</div>
        <div id="l5" class="code-line">Ligne 5 : Fin de boucle, retourner 'Non trouvé'</div>
      </div>
      <div class="panel">
        <div class="panel-title">Zone Visuelle</div>
        <div class="array-container" id="arr"></div>
        <div class="status-box" id="msg">Cliquez sur 'Étape Suivante' pour débuter.</div>
      </div>
    </div>
    <div class="controls">
      <button class="btn-primary" id="b-next">Étape Suivante</button>
      <button class="btn-secondary" id="b-rst">Réinitialiser</button>
    </div>
  </div>
</body>
</html>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(standaloneHtmlString);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const downloadStandaloneHtml = () => {
    const blob = new Blob([standaloneHtmlString], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recherche-lineaire.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Target Card & Controls Banner */}
      <section className="text-center">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-left">
              Recherche Linéaire (Linear Search)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 text-left mt-1">
              Algorithme séquentiel : examine les cases de l'indice 0 jusqu'à la fin.
            </p>
          </div>

          <button
            onClick={() => setShowStandaloneModal(true)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Fichier HTML Unique</span>
          </button>
        </div>

        {/* Target Card - Clearly identifiable at the top */}
        <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-2 sm:p-2.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-slate-400">
            <Search className="w-3.5 h-3.5 text-sky-400" />
            <span>Cible recherchée :</span>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-sky-500/30">
            <span className="text-xs text-sky-400 font-semibold uppercase tracking-wider">Cible =</span>
            <span className="text-2xl font-bold font-code text-sky-300 tabular-nums">
              {target}
            </span>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center px-2">
            <span className="text-[11px] text-slate-500 hidden lg:inline mr-1">Cas types :</span>
            <button
              onClick={() => applyPreset(42)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                target === 42 && array[1] === 42
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Début (42)
            </button>
            <button
              onClick={() => applyPreset(89)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                target === 89 && array[3] === 89
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Milieu (89)
            </button>
            <button
              onClick={() => applyPreset(99)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                target === 99
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Non trouvé (99)
            </button>
            <button
              onClick={handleRandomize}
              className="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Shuffle className="w-3 h-3" />
              <span>Aléatoire</span>
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Personnaliser</span>
            </button>
          </div>
        </div>

        {/* Expandable Manual Customization Form */}
        {isEditing && (
          <form onSubmit={handleSaveEdit} className="mt-4 max-w-md mx-auto p-4 bg-slate-900 border border-slate-800 rounded-xl text-left">
            <div className="mb-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Les 5 nombres du tableau (séparés par des virgules) :
              </label>
              <input
                type="text"
                value={editArrayInput}
                onChange={(e) => setEditArrayInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-code text-white focus:outline-none focus:border-sky-500"
                placeholder="ex: 14, 42, 7, 89, 53"
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre cible à chercher :
              </label>
              <input
                type="number"
                value={editTargetInput}
                onChange={(e) => setEditTargetInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-code text-white focus:outline-none focus:border-sky-500"
                placeholder="ex: 89"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
              >
                Appliquer
              </button>
            </div>
          </form>
        )}
      </section>

      {/* The Two Distinct Core Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ======================================================== */}
        {/* ZONE 1 : PSEUDO-CODE (Columns 1 to 5)                    */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl">
          <div>
            {/* Header with Language Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Zone 1 · {language === 'python' ? 'Code Python' : 'Pseudo-code'}
                </h2>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => onLanguageChange && onLanguageChange('python')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                      language === 'python'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>🐍</span>
                    <span>Python</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onLanguageChange && onLanguageChange('pseudocode')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                      language === 'pseudocode'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>📝</span>
                    <span>Pseudo</span>
                  </button>
                </div>

                {currentStep && (
                  <span className="text-[11px] font-semibold font-code text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50">
                    L.{currentStep.lineId}
                  </span>
                )}
              </div>
            </div>

            {/* Code listing with independent highlighting */}
            <div className="space-y-1.5 font-code">
              {(language === 'python' ? PYTHON_CODE_LINES : PSEUDO_CODE_LINES).map((line) => {
                const isActive = currentStep?.lineId === line.id;
                
                let activeClasses = 'bg-sky-500/15 border-sky-400 text-white shadow-sm ring-1 ring-sky-500/20';
                if (line.id === 3 && isActive) {
                  activeClasses = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-sm ring-1 ring-emerald-500/30';
                } else if (line.id === 5 && isActive) {
                  activeClasses = 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm ring-1 ring-amber-500/30';
                }

                return (
                  <div
                    key={line.id}
                    className={`relative flex items-center transition-all duration-300 rounded-lg py-2.5 px-3 border-l-4 ${
                      isActive
                        ? activeClasses
                        : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/40'
                    }`}
                    style={{ paddingLeft: `${12 + line.indent * 18}px` }}
                  >
                    <div className="w-5 shrink-0 flex items-center justify-center">
                      {isActive ? (
                        <ChevronRight className="w-4 h-4 text-sky-400 animate-pulse" />
                      ) : (
                        <span className="text-[11px] text-slate-600 select-none">
                          {line.id}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 text-xs sm:text-sm tracking-wide">
                      <span className="text-slate-500 mr-2 select-none font-medium">
                        {line.label} :
                      </span>
                      <span className={isActive ? 'font-semibold' : ''}>
                        {line.code}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/70 text-xs text-slate-500 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              La surbrillance s'aligne exactement sur l'instruction couramment exécutée par le processeur.
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ZONE 2 : ZONE VISUELLE (Columns 6 to 12)                 */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Zone 2 · Zone Visuelle
                </h2>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>Taille = <strong className="text-slate-200">5 cases</strong></span>
                <span aria-hidden="true" className="text-slate-700">·</span>
                <span>Indices = <strong className="text-slate-200 font-code">0 à 4</strong></span>
              </div>
            </div>

            {/* Horizontal array of 5 cells */}
            <div className="py-4">
              <div className="grid grid-cols-5 gap-2 sm:gap-3.5 max-w-lg mx-auto">
                {array.map((value, idx) => {
                  const state = getCellVisualState(idx);
                  const isCurrentPointer = currentStep?.arrayIndex === idx;

                  let cardBackground = 'bg-slate-950 border-slate-800 text-slate-300';
                  let badgeLabel = `[${idx}]`;
                  let statusIcon = null;

                  if (state.isFound) {
                    cardBackground = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/20 scale-105 ring-2 ring-emerald-500/50';
                    badgeLabel = 'Trouvé !';
                    statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
                  } else if (state.isInspected) {
                    // Yellow/Amber inspection as explicitly requested
                    cardBackground = 'bg-amber-400/25 border-amber-400 text-amber-200 shadow-lg shadow-amber-400/20 scale-105 ring-2 ring-amber-400/60';
                    badgeLabel = 'Inspecté';
                    statusIcon = <Search className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />;
                  } else if (state.isPassed) {
                    cardBackground = 'bg-slate-900/60 border-slate-800/80 text-slate-500 opacity-60';
                    badgeLabel = `Passé [${idx}]`;
                    statusIcon = <XCircle className="w-3.5 h-3.5 text-slate-500" />;
                  }

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      {/* Top Pointer Indicator */}
                      <div className="h-6 flex items-center justify-center mb-1">
                        {isCurrentPointer && (
                          <div className="flex flex-col items-center animate-bounce">
                            <span className="text-[10px] font-bold text-amber-300 font-code tracking-tighter">
                              i = {idx}
                            </span>
                            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-amber-400" />
                          </div>
                        )}
                      </div>

                      {/* Cell Card */}
                      <div
                        className={`w-full aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-1 sm:p-2 transition-all duration-300 ${cardBackground}`}
                      >
                        <span className="text-[10px] sm:text-xs font-code font-medium opacity-70 mb-0.5">
                          {badgeLabel}
                        </span>
                        <span className="text-xl sm:text-2xl md:text-3xl font-extrabold font-code tabular-nums tracking-tight">
                          {value}
                        </span>
                      </div>

                      {/* Bottom Status Tag */}
                      <div className="h-5 flex items-center justify-center mt-1.5">
                        {statusIcon}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Live Step Explanation & Comparison */}
            <div className="mt-2 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Explication de l'étape :</span>
              </div>
              
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {currentStep ? currentStep.explanation : "L'algorithme est prêt. Cliquez sur 'Étape Suivante' pour commencer l'inspection séquentielle."}
              </p>

              {currentStep?.comparisonDetails && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-code">
                  <span className="text-slate-400">
                    Évaluation booléenne :
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300">
                      {currentStep.comparisonDetails.elementValue} == {currentStep.comparisonDetails.targetValue}
                    </span>
                    <span className="text-slate-600">→</span>
                    <span className={`font-bold px-2 py-0.5 rounded ${
                      currentStep.comparisonDetails.isEqual 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}>
                      {currentStep.comparisonDetails.isEqual ? 'VRAI (Égal)' : 'FAUX (Différent)'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Messages de fin */}
          {isFound && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div className="text-xs sm:text-sm">
                <strong className="font-bold text-emerald-200 block sm:inline mr-1">
                  Cible trouvée avec succès !
                </strong>
                La valeur <span className="font-code font-bold underline">{target}</span> a été localisée à la case d'indice <span className="font-code font-bold underline">{currentStep?.arrayIndex}</span>. L'algorithme s'arrête immédiatement.
              </div>
            </div>
          )}

          {isNotFound && (
            <div className="mt-4 p-4 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <XCircle className="w-6 h-6 text-amber-400 shrink-0" />
              <div className="text-xs sm:text-sm">
                <strong className="font-bold text-amber-200 block sm:inline mr-1">
                  Recherche terminée : Cible non trouvée.
                </strong>
                Toutes les 5 cases ont été testées. La valeur <span className="font-code font-bold underline">{target}</span> n'existe pas dans ce tableau.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Controls Section */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Required buttons: 'Étape Suivante' et 'Réinitialiser' */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleNextStep}
            disabled={isFinished}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 whitespace-nowrap cursor-pointer ${
              isFinished
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/20'
            }`}
          >
            <span>Étape Suivante</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="flex-1 sm:flex-none px-5 py-3 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Réinitialiser</span>
          </button>
        </div>

        {/* Auto-Play & Speed Controller */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
          <button
            onClick={() => {
              if (isFinished) handleReset();
              setIsRunningAuto(!isRunningAuto);
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border cursor-pointer ${
              isRunningAuto
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isRunningAuto ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunningAuto ? 'Pause' : 'Lecture Auto'}</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-500 px-2 select-none text-[11px]">Vitesse :</span>
            <button
              onClick={() => setAutoSpeedMs(1500)}
              className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${
                autoSpeedMs === 1500 ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              0.7x
            </button>
            <button
              onClick={() => setAutoSpeedMs(1000)}
              className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${
                autoSpeedMs === 1000 ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1x
            </button>
            <button
              onClick={() => setAutoSpeedMs(500)}
              className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${
                autoSpeedMs === 500 ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2x
            </button>
          </div>
        </div>
      </section>

      {/* Standalone HTML Modal */}
      {showStandaloneModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Code HTML Complet en Un Seul Fichier (Autonome)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fichier unique HTML intégrant le CSS, le DOM et le JavaScript sans dépendance externe.
                </p>
              </div>
              <button
                onClick={() => setShowStandaloneModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-code text-slate-300 mb-4 select-all">
              <pre>{standaloneHtmlString}</pre>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-400">
                Prêt à être ouvert directement dans Chrome, Firefox ou Safari.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copié !' : 'Copier'}</span>
                </button>
                <button
                  onClick={downloadStandaloneHtml}
                  className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger .html</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
