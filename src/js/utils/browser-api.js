/**
 * Browser API wrapper for Chrome Extension compatibility
 * Provides a consistent interface for Chrome extension APIs
 * @module browserApi
 */

/**
 * Browser API utilities for Chrome extension development
 * @namespace browserApi
 */
const browserApi = {
  /**
   * Execute action with the currently active tab
   * @param {Function} action - Callback function to execute with active tab
   * @memberof browserApi
   */
  withActiveTab: function (action) {
    try {
      this.tabsQuery({ active: true, currentWindow: true }, function (tabs) {
        if (tabs && tabs.length > 0) {
          action(tabs[0]);
        }
      });
    } catch (error) {
      console.error("Error getting active tab:", error);
    }
  },

  /**
   * Query tabs with given criteria
   * @param {Object} query - Query parameters for tab search
   * @param {Function} action - Callback function for tab results
   * @memberof browserApi
   */
  tabsQuery: function (query, action) {
    try {
      if (chrome.tabs?.query) {
        chrome.tabs.query(query, action);
      } else {
        console.warn("Chrome tabs API not available");
        action([]);
      }
    } catch (error) {
      console.error("Error querying tabs:", error);
      action([]);
    }
  },

  /**
   * Update tab properties
   * @param {number} id - Tab ID to update
   * @param {Object} data - Update data for the tab
   * @memberof browserApi
   */
  tabsUpdate: function (id, data) {
    try {
      if (chrome.tabs?.update) {
        chrome.tabs.update(id, data);
      } else {
        console.warn("Chrome tabs update API not available");
      }
    } catch (error) {
      console.error("Error updating tab:", error);
    }
  },

  /**
   * Get the Chrome tabs API
   * @returns {Object} - Chrome tabs API object
   * @memberof browserApi
   */
  getTabs: function () {
    return chrome.tabs;
  },

  /**
   * Get current active tab information
   * @param {Function} callback - Callback function to receive tab info
   * @memberof browserApi
   */
  getCurrentTab: function (callback) {
    try {
      if (!chrome.tabs?.query) {
        console.warn("Chrome tabs API not available");
        if (callback) callback(null);
        return;
      }

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (callback && tabs && tabs.length > 0) {
          callback(tabs[0]);
        } else if (callback) {
          callback(null);
        }
      });
    } catch (error) {
      console.error("Failed to get current tab:", error);
      if (callback) callback(null);
    }
  },

  /**
   * Send message to extension runtime
   * @param {Object} message - Message to send
   * @param {Function} [callback] - Optional callback function
   * @memberof browserApi
   */
  sendRequest: function (message, callback) {
    try {
      if (!chrome.runtime?.sendMessage) {
        console.warn("Chrome runtime messaging API not available");
        if (callback) callback(null);
        return;
      }

      if (callback) {
        chrome.runtime.sendMessage(message, callback);
      } else {
        chrome.runtime.sendMessage(message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      if (callback) callback(null);
    }
  },

  /**
   * Add message listener for extension communication
   * @param {Function} listener - Listener function for messages
   * @memberof browserApi
   */
  addRequestListener: function (listener) {
    try {
      if (chrome.runtime?.onMessage) {
        chrome.runtime.onMessage.addListener(listener);
      } else {
        console.warn("Chrome runtime onMessage API not available");
      }
    } catch (error) {
      console.error("Error adding message listener:", error);
    }
  },

  /**
   * Get localized message from extension messages
   * @param {string} message - Message key to get
   * @param {Array} [substitutions] - Optional substitution values
   * @returns {string} - Localized message
   * @memberof browserApi
   */
  getLocalizedMessage: function (message, substitutions) {
    try {
      if (chrome.i18n?.getMessage) {
        return chrome.i18n.getMessage(message, substitutions);
      } else {
        console.warn("Chrome i18n API not available");
        return message; // Return the key as fallback
      }
    } catch (error) {
      console.error("Error getting localized message:", error);
      return message; // Return the key as fallback
    }
  },

  /**
   * Create notification
   * @param {string} notificationId - Unique ID for the notification
   * @param {Object} options - Notification options
   * @param {Function} [callback] - Optional callback function
   * @memberof browserApi
   */
  createNotification: function (notificationId, options, callback) {
    try {
      if (chrome.notifications?.create) {
        chrome.notifications.create(notificationId, options, callback);
      } else {
        console.warn("Chrome notifications API not available");
        if (callback) callback(null);
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      if (callback) callback(null);
    }
  },

  /**
   * Open options page
   * @param {Function} [callback] - Optional callback function
   * @memberof browserApi
   */
  openOptionsPage: function (callback) {
    try {
      if (chrome.runtime?.openOptionsPage) {
        chrome.runtime.openOptionsPage(callback);
      } else {
        console.warn("Chrome runtime openOptionsPage API not available");
        if (callback) callback();
      }
    } catch (error) {
      console.error("Error opening options page:", error);
      if (callback) callback();
    }
  },
};

export { browserApi };
