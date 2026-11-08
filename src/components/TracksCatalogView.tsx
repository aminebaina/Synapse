import React, { useState } from 'react';
import { 
  Cpu, 
  Terminal, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Award, 
  GraduationCap, 
  Layers, 
  Binary, 
  Database, 
  Code2, 
  LineChart, 
  X,
  FileCode,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ConceptId } from '../types';

export type TrackId = 'algo-maths' | 'python-dev' | 'data-analyst';

export interface TrackInfo {
  id: TrackId;
  number: number;
  title: string;
  subtitle: string;
  status: 'available' | 'in_development';
  statusLabel: string;
  icon: React.ReactNode;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  borderHover: string;
  description: string;
  highlightPoints: string[];
  modulesCount: string;
  prerequisites: string;
  targetAudience: string;
  fullSyllabus: {
    category: string;
    items: string[];
  }[];
}

interface TracksCatalogViewProps {
  onSelectTrack: (trackId: TrackId) => void;
  completedCount: number;
  totalCount: number;
  onOpenTeacherPortal: () => void;
  onOpenCertificate: () => void;
  onOpenJoinClass: () => void;
  activeClassCode: string | null;
}

export default function TracksCatalogView({
  onSelectTrack,
  completedCount,
  totalCount,
  onOpenTeacherPortal,
  onOpenCertificate,
  onOpenJoinClass,
  activeClassCode
}: TracksCatalogViewProps) {
  const [previewTrack, setPreviewTrack] = useState<TrackInfo | null>(null);
  const [notifySuccess, setNotifySuccess] = useState<string | null>(null);

  const tracks: TrackInfo[] = [
    {
      id: 'algo-maths',
      number: 1,
      title: 'Informatique, Algorithmique & Mathématiques',
      subtitle: 'Fondations déterministes & discrètes (Feynman / First Principles)',
      status: 'available',
      statusLabel: 'Disponible · Niveau 1 Opérationnel',
      icon: <Cpu className="w-6 h-6 text-sky-400" />,
      accentColor: 'from-sky-500/20 via-sky-500/5 to-transparent',
      badgeBg: 'bg-emerald-500/15 border border-emerald-500/30',
      badgeText: 'text-emerald-400',
      borderHover: 'hover:border-sky-500/60',
      description:
        'Comprendre le fonctionnement réel de la machine sans aucun présupposé : des portes logiques et du modèle physique de la RAM jusqu’aux structures de données linéaires et la pile d’exécution.',
      highlightPoints: [
        '13 notions interactives pas-à-pas avec visualisations mécaniques',
        'Double syntaxe synchronisée : Python 3 idiomatic & Pseudo-code',
        'Modèle physique de RAM (adresses hexadécimales, octets, pointeurs)',
        'Suivi de progression Local-First et certificat officiel de réussite'
      ],
      modulesCount: '13 modules disponibles',
      prerequisites: 'Aucun (zéro présupposé cognitif)',
      targetAudience: 'Étudiants L1/L2, CPGE, reconversion, lycéens et curieux',
      fullSyllabus: [
        {
          category: '1. Logique Symbolique & Arithmétique',
          items: [
            'Algèbre de Boole & Tables de vérité (ET, OU, NON, XOR)',
            'Arithmétique modulo & Ensembles finis (cadran d’horloge, périodicité)',
            'Théorie des ensembles & Diagrammes de Venn (appartenance, intersections)'
          ]
        },
        {
          category: '2. Systèmes & Modèle Mémoire Physique',
          items: [
            'Codage binaire (8 bits) & Conversion hexadécimale',
            'Modèle physique de RAM (adresses, cellules mémoire, pointeurs)',
            'Exécution séquentielle & Branchements conditionnels (if / else)',
            'Contrôle de boucles (while / for), compteur d’itération & accumulateur',
            'Pile d’appels de fonctions (Call Stack, frames & portée)'
          ]
        },
        {
          category: '3. Structures Linéaires & Algorithmes',
          items: [
            'Recherche linéaire pas-à-pas dans un tableau mémoire',
            'Recherche du maximum / minimum (algorithme du champion)',
            'Liste simplement chaînée vs Tableau contigu (pointeurs)',
            'Pile (Stack - LIFO) : empilage et dépilage vertical',
            'File d’attente (Queue - FIFO) : ordonnancement premier entré premier sorti'
          ]
        }
      ]
    },
    {
      id: 'python-dev',
      number: 2,
      title: 'Python Developer',
      subtitle: 'Du langage moderne à l’architecture logicielle robuste',
      status: 'in_development',
      statusLabel: 'En cours d’élaboration',
      icon: <Terminal className="w-6 h-6 text-amber-400" />,
      accentColor: 'from-amber-500/20 via-amber-500/5 to-transparent',
      badgeBg: 'bg-amber-500/15 border border-amber-500/30',
      badgeText: 'text-amber-400',
      borderHover: 'hover:border-amber-500/60',
      description:
        'Maîtriser Python au-delà des scripts basiques : programmation orientée objet avancée, gestion interne de la mémoire (CPython), programmation concurrente, tests automatisés et conception d’APIs.',
      highlightPoints: [
        'POO avancée : classes, héritage, polymorphisme & méthodes magiques (dunder)',
        'Fonctionnalités avancées : décorateurs dynamiques, générateurs & itérateurs',
        'Qualité de code professionnelle : typage statique (Type Hints & mypy)',
        'Projets réels : création d’outils CLI et développement d’APIs avec FastAPI'
      ],
      modulesCount: 'Programme en préparation',
      prerequisites: 'Notions de base du Parcours 1 (variables, boucles, fonctions)',
      targetAudience: 'Développeurs en herbe, étudiants préparant des projets applicatifs',
      fullSyllabus: [
        {
          category: '1. Programmation Orientée Objet (POO)',
          items: [
            'Classes, attributs d’instance vs attributs de classe',
            'Méthodes magiques (__init__, __repr__, __eq__, __enter__)',
            'Héritage, composition et principe d’encapsulation'
          ]
        },
        {
          category: '2. Mécanique Interne de Python & Paradigmes Avancés',
          items: [
            'Gestion de la mémoire sous CPython (compteur de références & GC)',
            'Décorateurs de fonctions et de classes',
            'Générateurs et mot-clé yield (gestion économe de mémoire)',
            'Gestionnaires de contexte personnalisés (with statement)'
          ]
        },
        {
          category: '3. Outillage & Écosystème Professionnel',
          items: [
            'Typage statique avec mypy et dataclasses',
            'Tests unitaires et tests d’intégration avec pytest',
            'Gestion d’environnements virtuels (uv / poetry / venv)',
            'Création d’une API REST moderne avec FastAPI'
          ]
        }
      ]
    },
    {
      id: 'data-analyst',
      number: 3,
      title: 'Data Analyst',
      subtitle: 'Ingénierie, exploration et valorisation des données réelles',
      status: 'in_development',
      statusLabel: 'En cours d’élaboration',
      icon: <BarChart3 className="w-6 h-6 text-violet-400" />,
      accentColor: 'from-violet-500/20 via-violet-500/5 to-transparent',
      badgeBg: 'bg-violet-500/15 border border-violet-500/30',
      badgeText: 'text-violet-400',
      borderHover: 'hover:border-violet-500/60',
      description:
        'Acquérir la boîte à outils indispensable de l’analyse de données : calcul vectoriel avec NumPy, manipulation de DataFrames avec Pandas, nettoyage de données volumineuses, dataviz et requêtes SQL analytiques.',
      highlightPoints: [
        'Calcul matriciel et vectorisation ultra-rapide avec NumPy',
        'Manipulation avancée de tables de données avec Pandas',
        'Nettoyage rigoureux : traitement des valeurs manquantes et anomalies',
        'Visualisation percutante (Matplotlib, Seaborn) & SQL analytique'
      ],
      modulesCount: 'Programme en préparation',
      prerequisites: 'Notions de base en programmation (Parcours 1 ou équivalent)',
      targetAudience: 'Futurs data analysts, économistes, chercheurs et ingénieurs',
      fullSyllabus: [
        {
          category: '1. Fondements du Calcul Scientifique (NumPy)',
          items: [
            'Tableaux multidimensionnels (ndarrays) et indexation avancée',
            'Vectorisation vs boucles Python (gains de performance x100)',
            'Opérations d’algèbre linéaire et broadcasting'
          ]
        },
        {
          category: '2. Manipulation & Nettoyage de Données (Pandas)',
          items: [
            'Séries temporelles et DataFrames structurés',
            'Filtrage, agrégations avancées et groupements (groupby)',
            'Jointures relationnelles (merge, concat, join)',
            'Stratégies de traitement des valeurs nulles (NaN) et typage'
          ]
        },
        {
          category: '3. Visualisation & Analyse Statistique',
          items: [
            'Visualisation statistique avec Seaborn et Matplotlib',
            'Statistiques descriptives (médiane, écart-type, quartiles, corrélations)',
            'SQL analytique : requêtes complexes et fonctions de fenêtrage (window functions)'
          ]
        }
      ]
    }
  ];

  const handleNotifyMe = (trackTitle: string) => {
    setNotifySuccess(`Votre intérêt pour « ${trackTitle} » a bien été enregistré sur votre appareil.`);
    setTimeout(() => setNotifySuccess(null), 3500);
  };

  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Banner for Class or Announcement */}
      {activeClassCode && (
        <div className="bg-sky-950/60 border-b border-sky-500/30 px-4 py-2 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-6xl mx-auto w-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">
              Connecté à la classe active : <strong className="text-white font-mono">{activeClassCode}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plateforme d'apprentissage sans présupposé · Local-First</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Choisissez votre parcours <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              d'apprentissage interactif
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Chaque notion est décomposée visuellement et mécaniquement. Aucun artifice : vous manipulez directement l'état de la machine et des données.
          </p>

          {/* Quick utility shortcuts for Teachers & Students */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenTeacherPortal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-sky-400" />
              <span>Espace Enseignant & Suivi de promotion</span>
            </button>

            <button
              onClick={onOpenJoinClass}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Rejoindre une classe avec un code</span>
            </button>

            <button
              onClick={onOpenCertificate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Certificat Niveau 1 ({completedCount}/{totalCount})</span>
            </button>
          </div>
        </div>

        {/* Global Notification Toast */}
        {notifySuccess && (
          <div className="mb-6 max-w-lg mx-auto p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notifySuccess}</span>
          </div>
        )}

        {/* The 3 Tracks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-12">
          {tracks.map((track) => {
            const isAvailable = track.status === 'available';

            return (
              <div
                key={track.id}
                className={`relative bg-slate-900/90 border rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 group shadow-xl ${
                  isAvailable
                    ? 'border-sky-500/40 ring-1 ring-sky-500/20 hover:border-sky-400 hover:shadow-2xl hover:shadow-sky-500/10'
                    : 'border-slate-800/80 hover:border-slate-700/90 opacity-95'
                }`}
              >
                {/* Track Number Badge */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="font-mono text-xs font-extrabold text-slate-400 tracking-wider uppercase">
                    Parcours #{track.number}
                  </span>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${track.badgeBg} ${track.badgeText}`}
                  >
                    {track.statusLabel}
                  </span>
                </div>

                {/* Track Icon & Title */}
                <div className="space-y-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {track.icon}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight group-hover:text-sky-300 transition-colors">
                      {track.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                      {track.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {track.description}
                  </p>
                </div>

                {/* Key highlights list */}
                <div className="space-y-2.5 py-4 border-t border-b border-slate-800/80 my-2 text-xs">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500">
                    Ce que vous allez maîtriser :
                  </span>
                  {track.highlightPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isAvailable ? 'text-sky-400' : 'text-slate-500'}`} />
                      <span className="leading-snug">{point}</span>
                    </div>
                  ))}
                </div>

                {/* Card Action & Status */}
                <div className="pt-4 space-y-3">
                  {isAvailable ? (
                    <div>
                      {/* Active progression indicator if already started */}
                      {completedCount > 0 && (
                        <div className="mb-3 flex items-center justify-between text-xs">
                          <span className="text-slate-400">Votre progression :</span>
                          <span className="font-mono font-bold text-emerald-400">
                            {completedCount} / {totalCount} TP ({progressPercent}%)
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => onSelectTrack(track.id)}
                        className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 cursor-pointer"
                      >
                        <span>
                          {completedCount > 0 ? 'Reprendre mon parcours' : 'Accéder au parcours (Niveau 1)'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => setPreviewTrack(track)}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition border border-slate-700/60 cursor-pointer"
                      >
                        <span>Découvrir le programme prévu</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> En cours de développement
                        </span>
                        <button
                          onClick={() => handleNotifyMe(track.title)}
                          className="text-sky-400 hover:underline cursor-pointer"
                        >
                          Être notifié
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pedagogy & Architecture Note */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Architecture Pédagogique & Indépendance des Parcours</span>
          </div>
          <p className="leading-relaxed">
            Le <strong>Parcours 1 (Info, Algorithmique & Mathématiques)</strong> constitue le socle fondamental commun recommandé avant d’aborder les architectures logicielles (Parcours 2) ou l'analyse matricielle et tabulaire (Parcours 3). Les parcours 2 et 3 sont actuellement en phase d’ingénierie pédagogique active.
          </p>
        </div>

      </div>

      {/* Track Preview Syllabus Modal (for Track 2 and Track 3) */}
      {previewTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col">
            <button
              onClick={() => setPreviewTrack(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                {previewTrack.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500 uppercase">
                    Parcours #{previewTrack.number}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${previewTrack.badgeBg} ${previewTrack.badgeText}`}>
                    {previewTrack.statusLabel}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {previewTrack.title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              {previewTrack.description}
            </p>

            {/* Syllabus breakdown */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Syllabus & Notions au programme :
              </h4>

              {previewTrack.fullSyllabus.map((cat, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-2">
                  <span className="font-bold text-xs text-sky-300 block">
                    {cat.category}
                  </span>
                  <ul className="space-y-1.5">
                    {cat.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-6 mt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400 text-center sm:text-left">
                En attendant, consolidez les fondations sur le Parcours 1.
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    handleNotifyMe(previewTrack.title);
                    setPreviewTrack(null);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                >
                  M'alerter à l'ouverture
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewTrack(null);
                    onSelectTrack('algo-maths');
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Démarrer Parcours 1</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
