/**
 * Safely parse JSON from localStorage with type checking
 * @param key The localStorage key to retrieve
 * @param defaultValue Optional default value if item doesn't exist or is invalid
 * @returns The parsed item or defaultValue if not found/invalid
 */
export function getFromLocalStorage<T>(key: string, defaultValue?: T): T | undefined {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Safely get a property from an object stored in localStorage
 * @param key The localStorage key
 * @param property The property to extract
 * @param defaultValue Optional default value if property doesn't exist
 * @returns The property value or defaultValue if not found
 */
export function getPropertyFromLocalStorage<T, K extends keyof T>(
  key: string, 
  property: K, 
  defaultValue?: T[K]
): T[K] | undefined {
  const item = getFromLocalStorage<T>(key);
  return item ? item[property] : defaultValue;
}

/**
 * Get the user object from localStorage
 */
export function getUser() {
  return getFromLocalStorage('user');
}

/**
 * Get a specific user property from localStorage
 * @param property The user property to retrieve
 * @param defaultValue Optional default value
 */
export function getUserProperty<T, K extends keyof T>(
  property: K, 
  defaultValue?: T[K]
): T[K] | undefined {
  return getPropertyFromLocalStorage<T, K>('user', property, defaultValue);
} 