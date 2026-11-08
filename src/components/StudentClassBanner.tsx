import React, { useState } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  User, 
  X, 
  ChevronRight, 
  ExternalLink,
  Edit2
} from 'lucide-react';
import { TeacherClass } from '../teacherStore';

interface StudentClassBannerProps {
  currentClass: TeacherClass | null;
  learnerName: string;
  onUpdateLearnerName: (name: string) => void;
  completedCount: number;
  totalAssigned: number;
  onOpenJoinModal: () => void;
  onLeaveClass: () => void;
}

export default function StudentClassBanner({
  currentClass,
  learnerName,
  onUpdateLearnerName,
  completedCount,
  totalAssigned,
  onOpenJoinModal,
  onLeaveClass
}: StudentClassBannerProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(learnerName);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateLearnerName(tempName.trim());
      setIsEditingName(false);
    }
  };

  if (!currentClass) {
    return (
      <div className="bg-slate-900/40 border-b border-slate-800/60 px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <GraduationCap className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Vous suivez un cours avec un enseignant ?</span>
          </div>

          <button
            onClick={onOpenJoinModal}
            className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <span>Rejoindre une classe avec un code</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.round((completedCount / totalAssigned) * 100));

  return (
    <div className="bg-gradient-to-r from-sky-950/60 via-slate-900/90 to-emerald-950/40 border-b border-sky-500/30 px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        
        {/* Class details */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white truncate">
                {currentClass.title}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono text-[10px] font-bold border border-sky-500/30">
                Code : {currentClass.code}
              </span>
            </div>
            {currentClass.professorName ? (
              <div className="text-[11px] text-slate-400">
                Enseignant : <strong className="text-slate-300">{currentClass.professorName}</strong>
              </div>
            ) : null}
          </div>
        </div>

        {/* Student name & assignment completion */}
        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          
          {/* Student name badge */}
          {isEditingName ? (
            <form onSubmit={handleSaveName} className="flex items-center gap-1">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="bg-slate-950 border border-sky-500/50 rounded px-2 py-0.5 text-xs text-white"
                autoFocus
                placeholder="Votre Nom & Prénom"
              />
              <button
                type="submit"
                className="px-2 py-0.5 bg-sky-500 text-slate-950 rounded font-bold text-[10px]"
              >
                OK
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                setTempName(learnerName);
                setIsEditingName(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Modifier mon nom d'émargement"
            >
              <User className="w-3 h-3 text-sky-400" />
              <span className="font-medium truncate max-w-[120px]">{learnerName}</span>
              <Edit2 className="w-2.5 h-2.5 text-slate-500 ml-0.5" />
            </button>
          )}

          {/* TP Progress */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <span className="font-mono text-emerald-400 font-bold">
              {completedCount}/{totalAssigned} TP
            </span>
            <span className="text-slate-500 text-[11px]">({progressPercent}%)</span>
          </div>

          {/* Leave / switch */}
          <button
            onClick={onLeaveClass}
            className="p-1 rounded text-slate-500 hover:text-slate-300 transition"
            title="Quitter cette classe"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
