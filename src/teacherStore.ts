import { ConceptId } from './types';
import { LEVEL_1_CONCEPT_IDS } from './progressionStore';

export interface StudentRecord {
  id: string;
  name: string;
  email?: string;
  completedConcepts: ConceptId[];
  lastActive: string;
  scoreTwenty: number; // Note calculée sur 20
}

export interface TeacherClass {
  id: string;
  code: string; // e.g. PY-120
  title: string; // e.g. "Cours de Programmation Python"
  professorName: string;
  assignedConceptIds: ConceptId[]; // Notions demandées pour ce cours
  students: StudentRecord[];
  createdAt: string;
}

const STORAGE_KEY_CLASSES = 'algo_teacher_classes_v2';
const STORAGE_KEY_ACTIVE_CODE = 'algo_active_student_class_v1';
const STORAGE_KEY_STUDENT_ID = 'algo_student_profile_v1';

// Strict MVP: starts with an empty roster, real students register via class code or invite link
const DEFAULT_INITIAL_CLASS: TeacherClass = {
  id: 'class_py120',
  code: 'PY-120',
  title: 'Cours de Programmation Python',
  professorName: '',
  assignedConceptIds: LEVEL_1_CONCEPT_IDS,
  students: [],
  createdAt: new Date().toLocaleDateString('fr-FR')
};

export function getStoredClasses(): TeacherClass[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CLASSES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [DEFAULT_INITIAL_CLASS];
}

export function saveClasses(classes: TeacherClass[]) {
  try {
    localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
  } catch (e) {
    console.error('Erreur sauvegarde classes enseignant', e);
  }
}

export function getActiveStudentClassCode(): string | null {
  try {
    // Check URL first ?class=CODE
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get('class');
      if (urlCode) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_CODE, urlCode.toUpperCase());
        return urlCode.toUpperCase();
      }
    }
    return localStorage.getItem(STORAGE_KEY_ACTIVE_CODE);
  } catch {
    return null;
  }
}

export function setActiveStudentClassCode(code: string | null) {
  try {
    if (code) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_CODE, code.toUpperCase());
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_CODE);
    }
  } catch {}
}

// Generate clean CSV format compatible with Microsoft Excel and Google Sheets
export function exportClassToCSV(teacherClass: TeacherClass): string {
  const headers = [
    'Nom & Prénom',
    'Email Universitaire',
    'Notions Validées (/13)',
    'Taux de Réussite (%)',
    'Note Estimée (/20)',
    'Dernière Activité',
    'Détail des Notions'
  ];

  if (!teacherClass.students || teacherClass.students.length === 0) {
    return [headers.join(','), '# Aucun étudiant inscrit pour le moment'].join('\n');
  }

  const rows = teacherClass.students.map((st) => {
    const count = st.completedConcepts.length;
    const rate = Math.round((count / LEVEL_1_CONCEPT_IDS.length) * 100);
    const grade = st.scoreTwenty.toFixed(1);
    const details = st.completedConcepts.join(';');

    return [
      `"${st.name.replace(/"/g, '""')}"`,
      `"${(st.email || '').replace(/"/g, '""')}"`,
      count,
      `${rate}%`,
      grade,
      `"${st.lastActive}"`,
      `"${details}"`
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
