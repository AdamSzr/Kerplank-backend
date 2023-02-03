
export interface useStorageInterface<T> {
    clear: () => void,
    getOrThrow: () => T,
    getOrDefault: () => T,
    tryGet: () => T | undefined,
    set: (value: T) => void
  }
  
  
  /**
   * 
   * @param variableKey 
   * @returns [previousItem, currentItem, tryGet]
   */
  export default function useStorage<T>(variableKey: string, defaultValue?: T) {
  
    const parseToT = (value: string) => JSON.parse(value) as T
    const getValue = () => localStorage.getItem(variableKey)
    const clear = () => localStorage.removeItem(variableKey)
    const tryParse = (text: string): string | T => {
      try {
        const value = parseToT(text)
        return value
      } catch (exception) {
        return text
      }
    }
  
    const tryGet = () => {
      if (typeof window == 'undefined')
        return null
  
      const item = getValue()
      if (!item)
        return null
  
      return tryParse(item)
    }
  
  
  
  
    const getOrThrow = () => {
      const item = getValue()
  
      if (!item && typeof window == 'undefined' && defaultValue)
      return defaultValue
  
      if (!item) throw Error(`Localstorage does not contain item with key = ${variableKey}`)
  
        return tryParse(item)
    }
  
  
  
  
  
    const set = (value: T | null) => {
      if (value == null) {
        throw Error(`Cannot set null value to localStorage.${variableKey}`)
      }
  
      if (typeof window == 'undefined') { return }
  
      const item = typeof value == 'object' ? JSON.stringify(value) : String(value)
  
      if (getValue() == item)
        return
  
      console.log(`[LOCAL-STORAGE] Setting [${variableKey}] to [${item}] `)
  
      localStorage.setItem(variableKey, item)
    }

    const getOrDefault = () => {
      const item = getValue()
  
      if (item == undefined)
        return defaultValue

      return tryParse(item)
    }
  
    if (defaultValue) {
      set(defaultValue)
    }
  
    return { getOrThrow, set, clear, tryGet, getOrDefault} as useStorageInterface<T>
  }