import { useCallback } from 'react';

const useTabService = () => {
  const getCurrentTab = useCallback(() => {
    return new Promise(resolve => {
      if (typeof chrome === 'undefined' || !chrome.tabs) {
        resolve(null);
        return;
      }

      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        resolve(tabs[0] || null);
      });
    });
  }, []);

  const getCurrentUrl = useCallback(async () => {
    const tab = await getCurrentTab();
    return tab?.url || '';
  }, [getCurrentTab]);

  const getCurrentTitle = useCallback(async () => {
    const tab = await getCurrentTab();
    return tab?.title || '';
  }, [getCurrentTab]);

  const getCurrentTabInfo = useCallback(async () => {
    const tab = await getCurrentTab();
    return {
      url: tab?.url || '',
      title: tab?.title || '',
      id: tab?.id,
    };
  }, [getCurrentTab]);

  return {
    getCurrentTab,
    getCurrentUrl,
    getCurrentTitle,
    getCurrentTabInfo,
  };
};

export default useTabService;
