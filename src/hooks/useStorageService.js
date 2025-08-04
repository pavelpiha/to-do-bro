import { useCallback } from 'react';

const useStorageService = () => {
  const saveTodos = useCallback(async todos => {
    try {
      if (!chrome.storage?.local) {
        throw new Error('Chrome storage API not available');
      }

      await chrome.storage.local.set({ todos });
      return { success: true };
    } catch (error) {
      console.error('Error saving todos:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const loadTodos = useCallback(async () => {
    try {
      if (!chrome.storage?.local) {
        console.warn('Chrome storage API not available, returning empty array');
        return [];
      }

      const result = await chrome.storage.local.get(['todos']);
      return result.todos || [];
    } catch (error) {
      console.error('Error loading todos:', error);
      return [];
    }
  }, []);

  const saveSettings = useCallback(async settings => {
    try {
      if (!chrome.storage?.local) {
        throw new Error('Chrome storage API not available');
      }

      await chrome.storage.local.set({ settings });
      return { success: true };
    } catch (error) {
      console.error('Error saving settings:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      if (!chrome.storage?.local) {
        console.warn(
          'Chrome storage API not available, returning empty object'
        );
        return {};
      }

      const result = await chrome.storage.local.get(['settings']);
      return result.settings || {};
    } catch (error) {
      console.error('Error loading settings:', error);
      return {};
    }
  }, []);

  const clearAll = useCallback(async () => {
    try {
      if (!chrome.storage?.local) {
        throw new Error('Chrome storage API not available');
      }

      await chrome.storage.local.clear();
      return { success: true };
    } catch (error) {
      console.error('Error clearing storage:', error);
      return { success: false, error: error.message };
    }
  }, []);

  return {
    saveTodos,
    loadTodos,
    saveSettings,
    loadSettings,
    clearAll,
  };
};

export default useStorageService;
