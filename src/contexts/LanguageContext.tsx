
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
    'logout.success': 'Logged out successfully',
    'logout.error': 'Error logging out',
    
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
    
    // Policy Page
    'policy.back': 'Back',
    'policy.status': 'Status',
    'policy.details': 'Policy Details',
    'policy.implementation': 'Implementation Guidelines',
    'policy.objectives': 'Objectives',
    'policy.metrics': 'Metrics & Measurements',
    'policies.title': 'Innovation Policies',
    'policies.subtitle': 'Browse and access policy documents and frameworks',
    
    // NotFound
    'notfound.title': '404',
    'notfound.message': 'Oops! Page not found',
    'notfound.button': 'Return to Home',
    
    // AuthPage
    'auth.login': 'Login',
    'auth.signup': 'Create Account',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.loading': 'Loading...',
    'auth.account.create': 'Create Account',
    'auth.account.login': 'Login',
    'auth.account.existing': 'Already have an account? Login',
    'auth.account.need': 'Need an account? Sign Up',
    
    // AddCategory
    'category.title': 'Add Category',
    'category.name': 'Category name',
    'category.description': 'Description (optional)',
    'category.add': 'Add Category',
    'category.cancel': 'Cancel',
    
    // Dashboard tabs
    'dashboard.tab': 'Dashboard',
    'funding.tab': 'Funding',
    'projects.tab': 'Projects',
    'analytics.tab': 'Analytics',
    'reports.tab': 'Reports',
    'policies.tab': 'Policies',
    'assistant.title': 'AI Assistant'
  },
  pt: {
    // Header
    'app.title': 'Espaço de Dados de Inovação GenAI',
    'language.toggle': 'PT | EN',
    'user.settings': 'Definições de Utilizador',
    'help': 'Ajuda',
    'login': 'Entrar',
    'logout': 'Sair',
    'logout.success': 'Sessão terminada com sucesso',
    'logout.error': 'Erro ao terminar sessão',
    
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
    
    // Policy Page
    'policy.back': 'Voltar',
    'policy.status': 'Estado',
    'policy.details': 'Detalhes da Política',
    'policy.implementation': 'Diretrizes de Implementação',
    'policy.objectives': 'Objetivos',
    'policy.metrics': 'Métricas e Medições',
    'policies.title': 'Políticas de Inovação',
    'policies.subtitle': 'Navegue e acesse documentos e estruturas de políticas',
    
    // NotFound
    'notfound.title': '404',
    'notfound.message': 'Ops! Página não encontrada',
    'notfound.button': 'Voltar para a Página Inicial',
    
    // AuthPage
    'auth.login': 'Entrar',
    'auth.signup': 'Criar Conta',
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.loading': 'Carregando...',
    'auth.account.create': 'Criar Conta',
    'auth.account.login': 'Entrar',
    'auth.account.existing': 'Já tem uma conta? Entre',
    'auth.account.need': 'Precisa de uma conta? Registe-se',
    
    // AddCategory
    'category.title': 'Adicionar Categoria',
    'category.name': 'Nome da categoria',
    'category.description': 'Descrição (opcional)',
    'category.add': 'Adicionar Categoria',
    'category.cancel': 'Cancelar',
    
    // Dashboard tabs
    'dashboard.tab': 'Painel',
    'funding.tab': 'Financiamento',
    'projects.tab': 'Projetos',
    'analytics.tab': 'Análises',
    'reports.tab': 'Relatórios',
    'policies.tab': 'Políticas',
    'assistant.title': 'Assistente IA'
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
