/**
 * Internationalization Utilities
 * @module i18nUtils
 */
import { browserApi } from "./browser-api.js";

/**
 * Internationalization utilities for the ToDoBro extension
 * @namespace i18nUtils
 */
const i18nUtils = {
  /**
   * Localize HTML elements with data-message attributes
   * Iterates through all DOM elements and replaces text content
   * with translated text based on the user's locale language.
   *
   * @example
   * // HTML: <h6 data-message="errorMsg">Error</h6>
   * // After calling localizeHTML(), text will be replaced with localized version
   *
   * @function
   * @memberof i18nUtils
   */
  localizeHTML: function () {
    try {
      const elements = document.getElementsByTagName("*");
      for (let i = 0; i < elements.length; i++) {
        const elm = elements[i];
        if (elm.dataset && elm.dataset.message) {
          const msg = browserApi.getLocalizedMessage(elm.dataset.message);
          if (msg) {
            elm.textContent = msg;
          }
        }
      }
    } catch (error) {
      console.error("Error localizing HTML:", error);
    }
  },

  /**
   * Get a localized message by key
   * @param {string} messageName - The message key to look up
   * @param {string} [defaultMessage] - Default message if translation not found
   * @returns {string} - The localized message or default
   * @memberof i18nUtils
   */
  getMessage: function (messageName, defaultMessage = "") {
    try {
      return browserApi.getLocalizedMessage(messageName) || defaultMessage;
    } catch (error) {
      console.error("Error getting message:", error);
      return defaultMessage;
    }
  },

  /**
   * Get formatted message with substitutions
   * @param {string} messageName - The message key to look up
   * @param {Array} [substitutions] - Array of substitution values
   * @param {string} [defaultMessage] - Default message if translation not found
   * @returns {string} - The formatted localized message or default
   * @memberof i18nUtils
   */
  getFormattedMessage: function (
    messageName,
    substitutions = [],
    defaultMessage = ""
  ) {
    try {
      return (
        browserApi.getLocalizedMessage(messageName, substitutions) ||
        defaultMessage
      );
    } catch (error) {
      console.error("Error getting formatted message:", error);
      return defaultMessage;
    }
  },
};

export { i18nUtils };
