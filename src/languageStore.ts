import { useState, useEffect } from 'react';

export type CodeLanguage = 'python' | 'pseudocode';

const STORAGE_KEY_LANGUAGE = 'algo_code_language_v1';

export function getStoredLanguage(): CodeLanguage {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LANGUAGE);
    if (saved === 'pseudocode' || saved === 'python') return saved;
    // Default to Python to support the 120 Python students immediately!
    return 'python';
  } catch {
    return 'python';
  }
}

export function useCodeLanguage() {
  const [language, setLanguageState] = useState<CodeLanguage>(() => getStoredLanguage());

  const setLanguage = (lang: CodeLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY_LANGUAGE, lang);
    } catch (e) {
      console.error('Erreur sauvegarde langage', e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'python' ? 'pseudocode' : 'python');
  };

  return {
    language,
    setLanguage,
    toggleLanguage,
    isPython: language === 'python'
  };
}
