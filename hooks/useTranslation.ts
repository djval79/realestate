
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Language } from '../types';

type Translations = { [key: string]: any };

interface TranslationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

interface TranslationProviderProps {
  children: ReactNode;
}

const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['en', 'es'].includes(savedLang)) {
      setLanguageState(savedLang);
    } else {
        const browserLang = navigator.language.split('-')[0];
        setLanguageState(browserLang === 'es' ? 'es' : 'en');
    }
  }, []);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`/locales/${language}.json`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error(`Could not load translations for ${language}`, error);
        // Fallback to English
        const response = await fetch(`/locales/en.json`);
        const data = await response.json();
        setTranslations(data);
      }
    };
    fetchTranslations();
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = useCallback((key: string, options?: { [key: string]: string | number }) => {
    let translation = getNestedValue(translations, key) || key;
    if (options) {
      Object.keys(options).forEach(optionKey => {
        translation = translation.replace(`{${optionKey}}`, String(options[optionKey]));
      });
    }
    return translation;
  }, [translations]);

  const value = { language, setLanguage, t };

  return React.createElement(TranslationContext.Provider, { value }, children);
};
