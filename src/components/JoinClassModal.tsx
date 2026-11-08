import React, { useState } from 'react';
import { X, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TeacherClass } from '../teacherStore';

interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: TeacherClass[];
  onJoinSuccess: (classCode: string, studentName: string) => void;
  currentStudentName: string;
}

export default function JoinClassModal({
  isOpen,
  onClose,
  classes,
  onJoinSuccess,
  currentStudentName
}: JoinClassModalProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState(currentStudentName);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setError('Veuillez entrer un code de classe.');
      return;
    }
    if (!name.trim()) {
      setError('Veuillez renseigner votre Nom & Prénom pour l’émargement.');
      return;
    }

    // Verify code exists in classes
    const found = classes.find((c) => c.code === cleanCode);
    if (!found) {
      setError(`Code "${cleanCode}" introuvable. Demandez le code exact à votre enseignant.`);
      return;
    }

    onJoinSuccess(cleanCode, name.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Rejoindre une Classe d'Enseignement
            </h3>
            <p className="text-xs text-slate-400">
              Rattachez vos exercices au cours de votre professeur.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Code de classe (fourni par votre prof) *
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(null);
              }}
              placeholder="Ex: PY-120"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-base font-mono uppercase text-sky-300 placeholder-slate-600 focus:outline-none focus:border-sky-500 font-bold tracking-widest text-center"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Votre Nom & Prénom (pour l’émargement du prof) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="Votre Nom & Prénom"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-sky-500/20 cursor-pointer"
            >
              <span>Rejoindre la classe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
