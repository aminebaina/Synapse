import { useState, useEffect } from 'react';
import { ConceptId } from './types';

export const LEVEL_1_CONCEPT_IDS: ConceptId[] = [
  'logic-gates',
  'binary-hex',
  'memory-model',
  'sequential-exec',
  'loop-control',
  'call-stack',
  'modulo-arithmetic',
  'sets-venn',
  'linear-search',
  'find-extrema',
  'linked-list',
  'stack',
  'queue'
];

const STORAGE_KEY_COMPLETED = 'algo_completed_concepts_v1';
const STORAGE_KEY_LEARNER_NAME = 'algo_learner_name_v1';

export function getStoredCompleted(): ConceptId[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getStoredLearnerName(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_LEARNER_NAME) || 'Apprenant Curieux';
  } catch {
    return 'Apprenant Curieux';
  }
}

export function useProgression() {
  const [completed, setCompleted] = useState<ConceptId[]>(() => getStoredCompleted());
  const [learnerName, setLearnerNameState] = useState<string>(() => getStoredLearnerName());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(completed));
    } catch (e) {
      console.error('Erreur sauvegarde progression', e);
    }
  }, [completed]);

  const toggleConcept = (id: ConceptId) => {
    setCompleted((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const markCompleted = (id: ConceptId) => {
    setCompleted((prev) => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const setLearnerName = (name: string) => {
    setLearnerNameState(name);
    try {
      localStorage.setItem(STORAGE_KEY_LEARNER_NAME, name);
    } catch (e) {
      console.error('Erreur sauvegarde nom', e);
    }
  };

  const resetProgression = () => {
    setCompleted([]);
    try {
      localStorage.removeItem(STORAGE_KEY_COMPLETED);
    } catch {}
  };

  // Filter completed to only count Level 1 items
  const level1CompletedCount = completed.filter((id) => LEVEL_1_CONCEPT_IDS.includes(id)).length;
  const totalLevel1 = LEVEL_1_CONCEPT_IDS.length; // 13
  const percentage = Math.round((level1CompletedCount / totalLevel1) * 100);
  const isLevel1Complete = level1CompletedCount === totalLevel1;

  const exportJSON = () => {
    const data = {
      version: 1,
      learnerName,
      completed,
      exportedAt: new Date().toISOString(),
      stats: {
        completedCount: level1CompletedCount,
        total: totalLevel1,
        percentage
      }
    };
    return JSON.stringify(data, null, 2);
  };

  const importJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.completed)) {
        setCompleted(parsed.completed);
        if (parsed.learnerName) {
          setLearnerName(parsed.learnerName);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return {
    completed,
    isCompleted: (id: ConceptId) => completed.includes(id),
    toggleConcept,
    markCompleted,
    learnerName,
    setLearnerName,
    level1CompletedCount,
    totalLevel1,
    percentage,
    isLevel1Complete,
    resetProgression,
    exportJSON,
    importJSON
  };
}
