
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'pt';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'app.title': 'GenAI Innovation Data Space',
    'language.toggle': 'PT | EN',
    'user.settings': 'User Settings',
    'help': 'Help',
    'login': 'Login',
    'logout': 'Logout',
    
    // Navigation
    'nav.funding': 'Funding',
    'nav.projects': 'Projects',
    'nav.analytics': 'Analytics',
    'nav.reports': 'Reports',
    'nav.policies': 'Policies',
    'nav.upload': 'Upload File',
    'nav.link': 'Add Link',
    'nav.category': 'Add Category',
    
    // Policies
    'policy.search.placeholder': 'Search policies...',
    'policy.notfound': 'No policies found matching your criteria.',
    'policy.category': 'Category',
    'policy.effective': 'Effective',
    'policy.review': 'Review',
    'policy.framework': 'Framework',
    'policy.view': 'View',
    'policy.download': 'PDF',
    'policy.download.title': 'Download Policy PDF',
    'policy.download.description': 'This will download the PDF document for this policy.',
    'policy.download.question': 'Are you sure you want to download the PDF for',
    'policy.download.cancel': 'Cancel',
    'policy.download.confirm': 'Download',
    'policy.download.success': 'Policy PDF downloaded',
    'policy.download.description.success': 'has been downloaded successfully.',
  },
  pt: {
    // Header
    'app.title': 'Espaço de Dados de Inovação GenAI',
    'language.toggle': 'PT | EN',
    'user.settings': 'Definições de Utilizador',
    'help': 'Ajuda',
    'login': 'Entrar',
    'logout': 'Sair',
    
    // Navigation
    'nav.funding': 'Financiamento',
    'nav.projects': 'Projetos',
    'nav.analytics': 'Análises',
    'nav.reports': 'Relatórios',
    'nav.policies': 'Políticas',
    'nav.upload': 'Carregar Ficheiro',
    'nav.link': 'Adicionar Link',
    'nav.category': 'Adicionar Categoria',
    
    // Policies
    'policy.search.placeholder': 'Pesquisar políticas...',
    'policy.notfound': 'Nenhuma política encontrada que corresponda aos seus critérios.',
    'policy.category': 'Categoria',
    'policy.effective': 'Efetiva',
    'policy.review': 'Revisão',
    'policy.framework': 'Estrutura',
    'policy.view': 'Ver',
    'policy.download': 'PDF',
    'policy.download.title': 'Transferir PDF da Política',
    'policy.download.description': 'Isto irá transferir o documento PDF desta política.',
    'policy.download.question': 'Tem certeza que deseja transferir o PDF para',
    'policy.download.cancel': 'Cancelar',
    'policy.download.confirm': 'Transferir',
    'policy.download.success': 'PDF da Política transferido',
    'policy.download.description.success': 'foi transferido com sucesso.',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Load language preference from localStorage on initial load
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pt')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
