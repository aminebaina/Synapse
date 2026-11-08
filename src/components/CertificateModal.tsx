import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Check, 
  Award, 
  Sparkles, 
  Calendar, 
  ShieldCheck, 
  Edit3,
  ExternalLink,
  Copy
} from 'lucide-react';
import { LEVEL_1_CONCEPT_IDS } from '../progressionStore';
import { CONCEPTS } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  learnerName: string;
  onUpdateLearnerName: (name: string) => void;
  completedCount: number;
}

export default function CertificateModal({
  isOpen,
  onClose,
  learnerName,
  onUpdateLearnerName,
  completedCount
}: CertificateModalProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(learnerName);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen) return null;

  const issueDate = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const certId = `ALGO-N1-${Math.abs(
    learnerName.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  ).toString(16).toUpperCase().padStart(6, '0')}-2026`;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateLearnerName(tempName.trim());
      setIsEditingName(false);
    }
  };

  const handleShareLinkedIn = () => {
    const text = encodeURIComponent(
      `🎓 Fier d'avoir validé l'intégralité du Niveau 1 (Fondations Déterministes & Discrètes) sur AlgoAcadémie ! 13 notions informatiques et mathématiques maîtrisées par la pratique interactive : Modèle RAM, Algèbre de Boole, Call Stack, Listes Chaînées, Piles & Files.\n\nIdentifiant de certification : ${certId}`
    );
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `🏆 Je viens de valider les 13 fondations du Niveau 1 sur @AlgoAcademie ! Mémoire RAM, Call Stack, Arithmétique Modulo et Structures Linéaires. Comprendre la machine par les premiers principes change tout 💡`
    );
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleCopyText = () => {
    const text = `CERTIFICAT D'ACCOMPLISSEMENT — NIVEAU 1
Décerné à : ${learnerName}
Organisme : AlgoAcadémie — Institut d'Algorithmique & Mathématiques Discrètes
Notions validées : 13/13 (Algèbre de Boole, Modulo, Ensembles & Venn, RAM, Binaire/Hex, if/else séquentiel, Boucles while/for, Call Stack, Recherche Linéaire, Extrema, Listes Chaînées, Piles LIFO, Files FIFO)
Identifiant de vérification : ${certId}
Date de délivrance : ${issueDate}`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Generate ultra high resolution 1920x1080 PNG on HTML5 Canvas
  const handleDownloadPNG = () => {
    setIsDownloading(true);
    const canvas = canvasRef.current;
    if (!canvas) {
      setIsDownloading(false);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsDownloading(false);
      return;
    }

    const w = 1920;
    const h = 1080;
    canvas.width = w;
    canvas.height = h;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#020617'); // slate-950
    bgGrad.addColorStop(0.5, '#0f172a'); // slate-900
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Decorative Guilloche Gold Border
    ctx.strokeStyle = '#f59e0b'; // amber-500
    ctx.lineWidth = 14;
    ctx.strokeRect(40, 40, w - 80, h - 80);

    ctx.strokeStyle = '#78350f'; // amber-900
    ctx.lineWidth = 2;
    ctx.strokeRect(58, 58, w - 116, h - 116);

    ctx.strokeStyle = '#fef3c7'; // amber-100
    ctx.lineWidth = 1;
    ctx.strokeRect(70, 70, w - 140, h - 140);

    // Top Header
    ctx.fillStyle = '#38bdf8'; // sky-400
    ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ALGOACADÉMIE · INSTITUT D’ALGORITHMIQUE & MATHÉMATIQUES DISCRÈTES', w / 2, 140);

    // Main Certificate Title
    ctx.fillStyle = '#f8fafc'; // slate-50
    ctx.font = '900 68px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CERTIFICAT D’ACCOMPLISSEMENT', w / 2, 230);

    ctx.fillStyle = '#fbbf24'; // amber-400
    ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('NIVEAU 1 : LES FONDATIONS DÉTERMINISTES & DISCRÈTES', w / 2, 285);

    // Subtitle phrase
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.font = 'italic 24px Georgia, serif';
    ctx.fillText('Ce certificat d’excellence atteste formellement que :', w / 2, 360);

    // Learner Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(learnerName, w / 2, 450);

    // Underline below name
    const nameWidth = ctx.measureText(learnerName).width;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w / 2 - nameWidth / 2 - 40, 475);
    ctx.lineTo(w / 2 + nameWidth / 2 + 40, 475);
    ctx.stroke();

    // Citation paragraph
    ctx.fillStyle = '#cbd5e1'; // slate-300
    ctx.font = '22px "Plus Jakarta Sans", sans-serif';
    const line1 = 'a assimilé et validé par l’expérimentation interactive l’intégralité des 13 piliers de la programmation';
    const line2 = 'impérative et des structures linéaires sans aucun raccourci : Algèbre de Boole, Modèle RAM & Pointeurs,';
    const line3 = 'Codage Binaire & Hexadécimal, Exécution Séquentielle, Boucles & Accumulateur, Call Stack,';
    const line4 = 'Arithmétique Modulo, Ensembles & Venn, Recherche Linéaire & Extrema, Listes Chaînées, Piles LIFO et Files FIFO.';
    ctx.fillText(line1, w / 2, 540);
    ctx.fillText(line2, w / 2, 575);
    ctx.fillText(line3, w / 2, 610);
    ctx.fillText(line4, w / 2, 645);

    // 13 Badges representation
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(w / 2 - 600, 690, 1200, 75);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(w / 2 - 600, 690, 1200, 75);

    ctx.fillStyle = '#10b981'; // emerald-500
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('✓ 13/13 NOTIONS DÉBUTANTES MAÎTRISÉES SELON LA MÉTHODE PAR PREMIERS PRINCIPES', w / 2, 737);

    // Footer columns: Date, Seal, Signature
    // Date (Left)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = '18px "JetBrains Mono", monospace';
    ctx.fillText(`DÉLIVRÉ LE : ${issueDate.toUpperCase()}`, 120, 920);
    ctx.fillText(`ID VÉRIFICATION : ${certId}`, 120, 955);
    ctx.fillText('PLATEFORME OPEN-LEARNING LOCAL-FIRST', 120, 990);

    // Gold Seal (Center)
    ctx.beginPath();
    ctx.arc(w / 2, 920, 60, 0, Math.PI * 2);
    ctx.fillStyle = '#78350f';
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCEAU OFFICIEL', w / 2, 915);
    ctx.fillText('NIVEAU 1 ACQUIS', w / 2, 935);

    // Signature (Right)
    ctx.textAlign = 'right';
    ctx.font = 'italic bold 28px Georgia, serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('La Direction Pédagogique', w - 120, 920);
    ctx.font = '18px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('AlgoAcadémie Research & Learning', w - 120, 955);

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w - 380, 935);
    ctx.lineTo(w - 120, 935);
    ctx.stroke();

    // Trigger Download
    setTimeout(() => {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Certificat_Niveau_1_AlgoAcademie_${learnerName.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsDownloading(false);
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Hidden high-res canvas used for instant PNG generation */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Top bar with actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm text-white">
              Votre Certificat Officiel · Niveau 1
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Visual Body */}
        <div className="p-6 sm:p-10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative">
          
          {/* Subtle gold glow & frame */}
          <div className="border border-amber-500/30 rounded-2xl p-6 sm:p-8 bg-slate-900/40 relative overflow-hidden text-center shadow-inner">
            
            {/* Guilloche effect */}
            <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              ALGOACADÉMIE · PREMIERS PRINCIPES
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
              CERTIFICAT D’ACCOMPLISSEMENT
            </h2>
            <p className="text-amber-400 font-semibold text-sm sm:text-base uppercase tracking-wider mb-6">
              Niveau 1 : Les Fondations Déterministes & Discrètes
            </p>

            <div className="my-6">
              <span className="text-slate-400 text-xs sm:text-sm italic block mb-2 font-serif">
                Ce titre d'excellence est décerné avec les félicitations du jury à :
              </span>

              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center justify-center gap-2 max-w-sm mx-auto">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Votre Nom & Prénom"
                    className="bg-slate-950 border border-amber-500/50 rounded-xl px-4 py-2 text-white text-base font-bold text-center focus:outline-none focus:ring-2 focus:ring-amber-400"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition cursor-pointer"
                  >
                    Valider
                  </button>
                </form>
              ) : (
                <div className="inline-flex items-center gap-2 group">
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white underline decoration-amber-500 decoration-2 underline-offset-8">
                    {learnerName}
                  </h3>
                  <button
                    onClick={() => {
                      setTempName(learnerName);
                      setIsEditingName(true);
                    }}
                    className="p-1 rounded-lg text-slate-500 hover:text-amber-400 transition cursor-pointer"
                    title="Modifier mon nom"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed mt-4 font-sans">
              Pour avoir validé et manipulé de manière interactive l’ensemble des <strong>13 piliers fondamentaux</strong> de l’informatique et des mathématiques discrètes : Algèbre de Boole, Modèle RAM & Pointeurs, Binaire & Hexadécimal, Exécution séquentielle `if/else`, Boucles & Accumulateur, Call Stack, Modulo, Ensembles & Venn, Recherche Linéaire & Extrema, Listes Chaînées, Piles LIFO et Files FIFO.
            </p>

            {/* Badges Grid summary */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium flex items-center gap-1">
                <Check className="w-3 h-3" /> 13/13 Notions Validées
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                ID : {certId}
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                Délivré le {issueDate}
              </span>
            </div>

          </div>

          {/* Social Proof & Sharing Actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="text-xs text-slate-400 text-center sm:text-left">
              <strong className="text-slate-200">Preuve de compétence vérifiée :</strong> Téléchargez l'image HD ou partagez-la sur vos réseaux pour enrichir votre profil.
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={handleDownloadPNG}
                disabled={isDownloading}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Génération...' : 'Télécharger (PNG HD)'}
              </button>

              <button
                onClick={handleShareLinkedIn}
                className="px-3.5 py-2.5 rounded-xl bg-[#0a66c2] hover:bg-[#095196] text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                title="Partager sur LinkedIn"
              >
                <Share2 className="w-3.5 h-3.5" />
                LinkedIn
              </button>

              <button
                onClick={handleShareTwitter}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
                title="Partager sur X (Twitter)"
              >
                X (Twitter)
              </button>

              <button
                onClick={handleCopyText}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
                title="Copier le texte"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {isCopied ? 'Copié !' : 'Copier'}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
