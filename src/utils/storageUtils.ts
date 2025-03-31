
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
 * Storage keys used in the application
 */
export const STORAGE_KEYS = {
  FUNDING_PROGRAMS: 'ani_funding_programs',
};
