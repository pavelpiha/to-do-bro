/**
 * Storage Service - Handles all data persistence operations
 * @class StorageService
 */
export class StorageService {
  /**
   * Save todos to chrome storage
   * @param {Array} todos - Array of todo objects to save
   * @returns {Promise<Object>} - Result object with success status
   */
  static async saveTodos(todos) {
    try {
      if (!chrome.storage?.local) {
        throw new Error("Chrome storage API not available");
      }

      await chrome.storage.local.set({ todos });
      return { success: true };
    } catch (error) {
      console.error("Error saving todos:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Load todos from chrome storage
   * @returns {Promise<Array>} - Array of todo objects
   */
  static async loadTodos() {
    try {
      if (!chrome.storage?.local) {
        console.warn("Chrome storage API not available, returning empty array");
        return [];
      }

      const result = await chrome.storage.local.get(["todos"]);
      return result.todos || [];
    } catch (error) {
      console.error("Error loading todos:", error);
      return [];
    }
  }

  /**
   * Save settings to chrome storage
   * @param {Object} settings - Settings object to save
   * @returns {Promise<Object>} - Result object with success status
   */
  static async saveSettings(settings) {
    try {
      if (!chrome.storage?.local) {
        throw new Error("Chrome storage API not available");
      }

      await chrome.storage.local.set({ settings });
      return { success: true };
    } catch (error) {
      console.error("Error saving settings:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Load settings from chrome storage
   * @returns {Promise<Object>} - Settings object
   */
  static async loadSettings() {
    try {
      if (!chrome.storage?.local) {
        console.warn(
          "Chrome storage API not available, returning empty object"
        );
        return {};
      }

      const result = await chrome.storage.local.get(["settings"]);
      return result.settings || {};
    } catch (error) {
      console.error("Error loading settings:", error);
      return {};
    }
  }

  /**
   * Clear all data from chrome storage
   * @returns {Promise<Object>} - Result object with success status
   */
  static async clearAll() {
    try {
      if (!chrome.storage?.local) {
        throw new Error("Chrome storage API not available");
      }

      await chrome.storage.local.clear();
      return { success: true };
    } catch (error) {
      console.error("Error clearing storage:", error);
      return { success: false, error: error.message };
    }
  }
}
