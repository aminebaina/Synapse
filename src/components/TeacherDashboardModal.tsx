import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  Users, 
  Download, 
  Plus, 
  Share2, 
  Check, 
  Copy, 
  ExternalLink, 
  Search, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Sparkles,
  Tv,
  CheckCircle2
} from 'lucide-react';
import { 
  TeacherClass, 
  StudentRecord, 
  exportClassToCSV,
  saveClasses 
} from '../teacherStore';
import { CONCEPTS, ConceptId } from '../types';
import { LEVEL_1_CONCEPT_IDS } from '../progressionStore';

interface TeacherDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: TeacherClass[];
  onUpdateClasses: (classes: TeacherClass[]) => void;
  onSelectClassToJoin?: (code: string) => void;
  onToggleProjectorMode: () => void;
  isProjectorMode: boolean;
}

export default function TeacherDashboardModal({
  isOpen,
  onClose,
  classes,
  onUpdateClasses,
  onSelectClassToJoin,
  onToggleProjectorMode,
  isProjectorMode
}: TeacherDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<'roster' | 'create' | 'projector'>('roster');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [studentSearch, setStudentSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // New class form state
  const [newTitle, setNewTitle] = useState('');
  const [newProfName, setNewProfName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [selectedConcepts, setSelectedConcepts] = useState<ConceptId[]>(LEVEL_1_CONCEPT_IDS);
  const [createSuccess, setCreateSuccess] = useState(false);

  if (!isOpen) return null;

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Filter students based on search query
  const filteredStudents = currentClass
    ? currentClass.students.filter(
        (st) =>
          st.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
          (st.email && st.email.toLowerCase().includes(studentSearch.toLowerCase()))
      )
    : [];

  // Calculate class analytics
  const totalStudents = currentClass ? currentClass.students.length : 0;
  const avgCompleted = totalStudents > 0
    ? (currentClass.students.reduce((acc, s) => acc + s.completedConcepts.length, 0) / totalStudents).toFixed(1)
    : '0';
  const avgGrade = totalStudents > 0
    ? (currentClass.students.reduce((acc, s) => acc + s.scoreTwenty, 0) / totalStudents).toFixed(1)
    : '-';

  const handleCopyCode = () => {
    if (currentClass) {
      navigator.clipboard.writeText(currentClass.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCopyLink = () => {
    if (currentClass) {
      const link = `${window.location.origin}/?class=${currentClass.code}`;
      navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleDownloadCSV = () => {
    if (!currentClass) return;
    const csvContent = exportClassToCSV(currentClass);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Notes_${currentClass.code}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const generatedCode = newCode.trim().toUpperCase() || `CL-${Math.floor(Math.random() * 900 + 100)}`;
    const newClass: TeacherClass = {
      id: `class_${Date.now()}`,
      code: generatedCode,
      title: newTitle.trim(),
      professorName: newProfName.trim(),
      assignedConceptIds: selectedConcepts,
      students: [],
      createdAt: new Date().toLocaleDateString('fr-FR')
    };

    const updated = [newClass, ...classes];
    onUpdateClasses(updated);
    saveClasses(updated);
    setSelectedClassId(newClass.id);
    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      setActiveTab('roster');
    }, 1500);
  };

  const toggleConceptSelection = (id: ConceptId) => {
    if (selectedConcepts.includes(id)) {
      setSelectedConcepts(selectedConcepts.filter((c) => c !== id));
    } else {
      setSelectedConcepts([...selectedConcepts, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-tight">
                  Espace Enseignant & Émargement de Classe
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  Mode Professeur
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Suivez en direct l'avancement de vos étudiants et téléchargez vos feuilles de notes pour vos TPs.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/60 shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('roster')}
              className={`py-3 px-3.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'roster'
                  ? 'border-sky-400 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Tableau de Bord & Émargement</span>
            </button>

            <button
              onClick={() => setActiveTab('create')}
              className={`py-3 px-3.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'create'
                  ? 'border-sky-400 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Créer une Nouvelle Classe</span>
            </button>
          </div>

          {/* Quick projector mode trigger */}
          <button
            onClick={onToggleProjectorMode}
            className={`my-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
              isProjectorMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
            title="Agrandit les animations et masque les détails superflus pour projeter au tableau"
          >
            <Tv className="w-3.5 h-3.5 text-amber-400" />
            <span>Mode Vidéoprojecteur (Amphi) : {isProjectorMode ? 'Actif' : 'Inactif'}</span>
          </button>
        </div>

        {/* Tab 1: Live Class Roster & Grading Dashboard */}
        {activeTab === 'roster' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Class Selector & Quick Share Bar */}
            {currentClass && (
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Class selector */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Classe sélectionnée :
                  </span>
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-sky-500"
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} ({c.code})
                        </option>
                      ))}
                    </select>

                    {currentClass.professorName ? (
                      <div className="text-xs text-slate-400">
                        Enseignant : <strong className="text-slate-200">{currentClass.professorName}</strong>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Code to project & copy */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-2 rounded-xl border border-sky-500/30">
                    <span className="text-xs text-slate-400 font-semibold">Code de classe :</span>
                    <span className="font-mono text-base font-black text-sky-300 tracking-wider">
                      {currentClass.code}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="p-1 rounded text-slate-400 hover:text-white transition cursor-pointer"
                      title="Copier le code"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-sky-400" />}
                    <span>{copiedLink ? 'Lien Copié !' : 'Copier lien étudiant'}</span>
                  </button>

                  <button
                    onClick={handleDownloadCSV}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exporter les Notes (CSV)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Effectif de la classe</span>
                  <Users className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {totalStudents} <span className="text-xs font-normal text-slate-500">étudiants inscrits</span>
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Moyenne notions validées</span>
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {avgCompleted} <span className="text-xs font-normal text-slate-500">/ 13 notions</span>
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Note moyenne estimée</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-300 font-mono">
                  {avgGrade} <span className="text-xs font-normal text-slate-500">/ 20</span>
                </div>
              </div>
            </div>

            {/* Students Roster Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              
              {/* Search & Counter */}
              <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Registre des Étudiants & Émargement ({filteredStudents.length})
                  </h3>
                </div>

                <div className="relative min-w-[240px]">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Filtrer par nom ou email..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 font-bold sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Étudiant</th>
                      <th className="py-3 px-4">Progression (/13)</th>
                      <th className="py-3 px-4">Note (/20)</th>
                      <th className="py-3 px-4">Dernière Activité</th>
                      <th className="py-3 px-4">Statut TP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {currentClass.students.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400">
                          <div className="max-w-md mx-auto space-y-2">
                            <Users className="w-8 h-8 text-slate-600 mx-auto mb-1" />
                            <p className="text-sm font-semibold text-slate-300">
                              Aucun étudiant n'a encore rejoint cette classe
                            </p>
                            <p className="text-xs text-slate-500">
                              Transmettez le code <span className="font-mono font-bold text-sky-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">{currentClass.code}</span> ou le lien d'invitation direct à vos étudiants pour qu'ils s'enregistrent lors de leurs travaux pratiques.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          Aucun étudiant ne correspond à cette recherche.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((st) => {
                        const count = st.completedConcepts.length;
                        const pct = Math.round((count / LEVEL_1_CONCEPT_IDS.length) * 100);

                        return (
                          <tr key={st.id} className="hover:bg-slate-900/40 transition">
                            <td className="py-3 px-4">
                              <div className="font-bold text-white">{st.name}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{st.email}</div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-200">
                                  {count} / 13
                                </span>
                                <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-400 rounded-full"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="text-[10px] text-slate-500 font-mono">{pct}%</span>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                                st.scoreTwenty >= 16 
                                  ? 'bg-emerald-500/20 text-emerald-300' 
                                  : st.scoreTwenty >= 10 
                                  ? 'bg-sky-500/20 text-sky-300' 
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}>
                                {st.scoreTwenty.toFixed(1)} / 20
                              </span>
                            </td>

                            <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                              Il y a {st.lastActive}
                            </td>

                            <td className="py-3 px-4">
                              {count === 13 ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> TP Complet (Certifié)
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-400">
                                  En cours ({13 - count} restant{13 - count > 1 ? 's' : ''})
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Create Class Form */}
        {activeTab === 'create' && (
          <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full">
            <form onSubmit={handleCreateClass} className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  Configurer une nouvelle promotion / classe
                </h3>
                <p className="text-xs text-slate-400">
                  Créez un espace dédié pour suivre une nouvelle promotion d'étudiants (ex: L1 Informatique, DUT, Prépa, Lycée).
                </p>
              </div>

              {createSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Classe créée avec succès ! Redirection vers le tableau de bord...</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  1. Titre de la classe / Promotion *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Programmation Python & Algorithmes - L1 Groupe A"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    2. Nom de l'enseignant (optionnel)
                  </label>
                  <input
                    type="text"
                    value={newProfName}
                    onChange={(e) => setNewProfName(e.target.value)}
                    placeholder="Votre nom ou titre"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    3. Code de classe personnalisé (optionnel)
                  </label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="Ex: PY-2026 (ou généré auto)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Notions assignment */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  4. Notions assignées pour cette session ({selectedConcepts.length}/13) :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
                  {CONCEPTS.filter(c => LEVEL_1_CONCEPT_IDS.includes(c.id)).map((concept) => {
                    const isChecked = selectedConcepts.includes(concept.id);
                    return (
                      <label
                        key={concept.id}
                        className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer transition ${
                          isChecked ? 'bg-sky-500/10 text-white' : 'text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleConceptSelection(concept.id)}
                          className="rounded border-slate-700 text-sky-500 focus:ring-0"
                        />
                        <span className="truncate">{concept.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('roster')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enregistrer & Activer la Classe</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
