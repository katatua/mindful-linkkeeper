
/**
 * Utility functions for persistent data storage in the browser
 */

/**
 * Save data to localStorage
 * @param key Storage key
 * @param data Data to store
 */
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    console.log(`Saved data to localStorage with key: ${key}`);
  } catch (error) {
    console.error(`Error saving data to localStorage with key ${key}:`, error);
  }
};

/**
 * Load data from localStorage
 * @param key Storage key
 * @param defaultValue Default value to return if no data exists
 * @returns The stored data or defaultValue if none exists
 */
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      console.log(`No data found in localStorage with key: ${key}, using default value`);
      return defaultValue;
    }
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error(`Error loading data from localStorage with key ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Clear data from localStorage
 * @param key Storage key to clear
 */
export const clearFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
    console.log(`Cleared data from localStorage with key: ${key}`);
  } catch (error) {
    console.error(`Error clearing data from localStorage with key ${key}:`, error);
  }
};

/**
 * Storage keys used in the application
 */
export const STORAGE_KEYS = {
  // Funding data
  FUNDING_PROGRAMS: 'ani_funding_programs',
  FUNDING_APPLICATIONS: 'ani_funding_applications',
  
  // Research and innovation data
  PROJECTS: 'ani_projects',
  METRICS: 'ani_metrics',
  RESEARCHERS: 'ani_researchers',
  INSTITUTIONS: 'ani_institutions',
  PATENT_HOLDERS: 'ani_patent_holders',
  
  // Policy and collaboration data
  POLICY_FRAMEWORKS: 'ani_policy_frameworks',
  INTERNATIONAL_COLLABORATIONS: 'ani_international_collaborations',
};

/**
 * Initialize local storage with dummy data if it doesn't exist
 * @returns A promise that resolves when all data is initialized
 */
export const initializeDummyDataIfNeeded = async (): Promise<void> => {
  try {
    const { 
      sampleFundingPrograms, 
      sampleProjects, 
      sampleMetrics,
      sampleResearchers,
      sampleInstitutions,
      samplePatentHolders,
      samplePolicyFrameworks,
      sampleCollaborations,
      sampleFundingApplications
    } = await import('../scripts/sampleData');

    // Força a inicialização dos dados, independentemente se já existem ou não
    console.log('Inicializando todos os dados de amostra no localStorage');
    
    // Salvando dados no localStorage um por um para garantir que tudo seja salvo
    saveToLocalStorage(STORAGE_KEYS.FUNDING_PROGRAMS, sampleFundingPrograms);
    console.log(`Salvos ${sampleFundingPrograms.length} programas de financiamento`);
    
    saveToLocalStorage(STORAGE_KEYS.PROJECTS, sampleProjects);
    console.log(`Salvos ${sampleProjects.length} projetos`);
    
    saveToLocalStorage(STORAGE_KEYS.METRICS, sampleMetrics);
    console.log(`Salvos ${sampleMetrics.length} métricas`);
    
    saveToLocalStorage(STORAGE_KEYS.RESEARCHERS, sampleResearchers);
    console.log(`Salvos ${sampleResearchers.length} pesquisadores`);
    
    saveToLocalStorage(STORAGE_KEYS.INSTITUTIONS, sampleInstitutions);
    console.log(`Salvos ${sampleInstitutions.length} instituições`);
    
    saveToLocalStorage(STORAGE_KEYS.PATENT_HOLDERS, samplePatentHolders);
    console.log(`Salvos ${samplePatentHolders.length} titulares de patentes`);
    
    saveToLocalStorage(STORAGE_KEYS.POLICY_FRAMEWORKS, samplePolicyFrameworks);
    console.log(`Salvos ${samplePolicyFrameworks.length} estruturas de políticas`);
    
    saveToLocalStorage(STORAGE_KEYS.INTERNATIONAL_COLLABORATIONS, sampleCollaborations);
    console.log(`Salvos ${sampleCollaborations.length} colaborações internacionais`);
    
    saveToLocalStorage(STORAGE_KEYS.FUNDING_APPLICATIONS, sampleFundingApplications);
    console.log(`Salvos ${sampleFundingApplications.length} aplicações de financiamento`);
    
    console.log('Local storage inicializado com dados de amostra');
  } catch (error) {
    console.error('Erro ao inicializar dados de amostra:', error);
    throw error;
  }
};
