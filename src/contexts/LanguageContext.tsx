import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface Translations {
  [key: string]: string;
}

// Define a type for language dictionary
interface LanguageDictionary {
  [key: string]: Translations;
}

// Translations dictionary
const translations: LanguageDictionary = {
  en: {
    'app.title': 'ANI Innovation Platform',
    'dashboard.tab': 'Dashboard',
    'funding.tab': 'Funding',
    'projects.tab': 'Projects',
    'analytics.tab': 'Analytics',
    'reports.tab': 'Reports',
    'policies.tab': 'Policies',
    'index.welcome': 'Welcome to the ANI Innovation Portal',
    'index.choose': 'Choose where to go next',
    'index.view.dashboard': 'View Dashboard',
    'index.ai.assistant': 'AI Assistant',
    'search.placeholder': 'Search...',
    'data.loading': 'Loading data...',
    'assistant.title': 'AI Assistant',
    'assistant.show': 'Show Assistant',
    'assistant.hide': 'Hide Assistant',
    'table.no_data': 'No data available',
    'add_file.title': 'Add File',
    'add_file.description': 'Upload a new file to the system',
    'add_file.choose_file': 'Choose File',
    'add_file.upload': 'Upload',
    'add_link.title': 'Add Link',
    'add_link.description': 'Add a new link to the system',
    'add_link.url': 'URL',
    'add_link.title_label': 'Title',
    'add_link.add': 'Add Link',
    'add_category.title': 'Add Category',
    'add_category.description': 'Add a new category to the system',
    'add_category.name': 'Category Name',
    'add_category.add': 'Add Category',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.already_account': 'Already have an account?',
    'auth.no_account': 'Don\'t have an account?',
    'funding.title': 'Funding Programs',
    'projects.title': 'Active Projects',
    'analytics.title': 'Analytics Dashboard',
    'reports.title': 'Reports',
    'policies.title': 'Policies',
    'policy_detail.title': 'Policy Detail',
    'framework_detail.title': 'Framework Detail',
    'visualization_detail.title': 'Visualization Detail',
    'metric_detail.title': 'Metric Detail',
    'policy_guide.title': 'Policy Guide',
    'database_info.title': 'Database Information',
    'synthetic_data.title': 'Synthetic Data',
    'not_found.title': 'Page Not Found',
    'not_found.return': 'Return to Home',
    'header.logout': 'Logout',
    'header.profile': 'Profile',
    'header.settings': 'Settings',
    'header.admin': 'Admin Panel',
    'header.login': 'Login',
    'header.register': 'Register',
    'header.search': 'Search',
    'hamburger.menu': 'Menu',
  },
  pt: {
    'app.title': 'Plataforma de Inovação ANI',
    'dashboard.tab': 'Painel',
    'funding.tab': 'Financiamento',
    'projects.tab': 'Projetos',
    'analytics.tab': 'Análises',
    'reports.tab': 'Relatórios',
    'policies.tab': 'Políticas',
    'index.welcome': 'Bem-vindo ao Portal de Inovação ANI',
    'index.choose': 'Escolha para onde ir a seguir',
    'index.view.dashboard': 'Ver Painel',
    'index.ai.assistant': 'Assistente IA',
    'search.placeholder': 'Pesquisar...',
    'data.loading': 'Carregando dados...',
    'assistant.title': 'Assistente IA',
    'assistant.show': 'Mostrar Assistente',
    'assistant.hide': 'Ocultar Assistente',
    'table.no_data': 'Sem dados disponíveis',
    'add_file.title': 'Adicionar Arquivo',
    'add_file.description': 'Carregue um novo arquivo para o sistema',
    'add_file.choose_file': 'Escolher Arquivo',
    'add_file.upload': 'Carregar',
    'add_link.title': 'Adicionar Link',
    'add_link.description': 'Adicione um novo link ao sistema',
    'add_link.url': 'URL',
    'add_link.title_label': 'Título',
    'add_link.add': 'Adicionar Link',
    'add_category.title': 'Adicionar Categoria',
    'add_category.description': 'Adicione uma nova categoria ao sistema',
    'add_category.name': 'Nome da Categoria',
    'add_category.add': 'Adicionar Categoria',
    'auth.login': 'Entrar',
    'auth.register': 'Registar',
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.name': 'Nome',
    'auth.already_account': 'Já tem uma conta?',
    'auth.no_account': 'Não tem uma conta?',
    'funding.title': 'Programas de Financiamento',
    'projects.title': 'Projetos Ativos',
    'analytics.title': 'Painel de Análises',
    'reports.title': 'Relatórios',
    'policies.title': 'Políticas',
    'policy_detail.title': 'Detalhe da Política',
    'framework_detail.title': 'Detalhe do Framework',
    'visualization_detail.title': 'Detalhe da Visualização',
    'metric_detail.title': 'Detalhe da Métrica',
    'policy_guide.title': 'Guia de Políticas',
    'database_info.title': 'Informação da Base de Dados',
    'synthetic_data.title': 'Dados Sintéticos',
    'not_found.title': 'Página Não Encontrada',
    'not_found.return': 'Voltar para a Página Inicial',
    'header.logout': 'Sair',
    'header.profile': 'Perfil',
    'header.settings': 'Definições',
    'header.admin': 'Painel de Administração',
    'header.login': 'Entrar',
    'header.register': 'Registar',
    'header.search': 'Pesquisar',
    'hamburger.menu': 'Menu',
  }
};

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<string>(localStorage.getItem('language') || 'pt');

  // Load translations based on current language
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
