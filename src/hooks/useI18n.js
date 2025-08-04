import { useCallback } from 'react';

const useI18n = () => {
  const t = useCallback((messageKey, ...args) => {
    if (typeof chrome === 'undefined' || !chrome.i18n) {
      // Fallback for development
      const fallbackMessages = {
        appName: 'ToDoBro',
        todayTitle: 'Today',
        addTask: 'Add task',
        addWebsiteAsTask: 'Add website as task',
        priority: 'Priority',
        taskAdded: 'Task added',
        websiteAdded: 'Website added',
        cancel: 'Cancel',
        save: 'Save',
        today: 'Today',
        tomorrow: 'Tomorrow',
        nextWeek: 'Next week',
        pickDate: 'Pick a date',
      };
      return fallbackMessages[messageKey] || messageKey;
    }

    try {
      return chrome.i18n.getMessage(messageKey, args) || messageKey;
    } catch (error) {
      console.warn(`Failed to get i18n message for key: ${messageKey}`, error);
      return messageKey;
    }
  }, []);

  const localizeElement = useCallback(
    element => {
      if (!element) {
        return;
      }

      // Handle data-message attributes
      const messageElements = element.querySelectorAll('[data-message]');
      messageElements.forEach(el => {
        const messageKey = el.getAttribute('data-message');
        if (messageKey) {
          el.textContent = t(messageKey);
        }
      });

      // Handle data-i18n attributes (legacy support)
      const i18nElements = element.querySelectorAll('[data-i18n]');
      i18nElements.forEach(el => {
        const messageKey = el.getAttribute('data-i18n');
        if (messageKey) {
          el.textContent = t(messageKey);
        }
      });

      // Handle placeholder attributes
      const placeholderElements = element.querySelectorAll(
        '[data-i18n-placeholder]'
      );
      placeholderElements.forEach(el => {
        const messageKey = el.getAttribute('data-i18n-placeholder');
        if (messageKey) {
          el.placeholder = t(messageKey);
        }
      });
    },
    [t]
  );

  return {
    t,
    localizeElement,
  };
};

export default useI18n;
