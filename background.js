// Background script for To-Do Bro Chrome Extension

// Install event - runs when extension is first installed
chrome.runtime.onInstalled.addListener((details) => {
  console.log("To-Do Bro extension installed");

  if (details.reason === "install") {
    // Set default data on first install
    chrome.storage.local.set({
      todos: [],
      settings: {
        theme: "default",
        notifications: true,
      },
    });
  }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getTodos") {
    chrome.storage.local.get(["todos"], (result) => {
      sendResponse({ todos: result.todos || [] });
    });
    return true; // Will respond asynchronously
  }

  if (request.action === "saveTodos") {
    chrome.storage.local.set({ todos: request.todos }, () => {
      sendResponse({ success: true });
    });
    return true; // Will respond asynchronously
  }
});

// Optional: Add context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addToTodo",
    title: chrome.i18n.getMessage("addToDoBro") || "Add to ToDoBro",
    contexts: ["selection"],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "addToTodo" && info.selectionText) {
    // Add selected text as a new todo
    chrome.storage.local.get(["todos"], (result) => {
      const todos = result.todos || [];
      const newTodo = {
        id: Date.now(),
        text: info.selectionText.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        source: "context-menu",
      };

      todos.push(newTodo);
      chrome.storage.local.set({ todos: todos });

      // Show notification
      chrome.notifications.create({
        type: "basic",
        iconUrl: "assets/icons/todobro_48.png",
        title: chrome.i18n.getMessage("appName") || "ToDoBro",
        message: `${chrome.i18n.getMessage("addToDoBro") || "Added"}: "${
          newTodo.text
        }"`,
      });
    });
  }
});

// Badge text to show number of incomplete todos
function updateBadge() {
  chrome.storage.local.get(["todos"], (result) => {
    const todos = result.todos || [];
    const incompleteTodos = todos.filter((todo) => !todo.completed).length;

    chrome.action.setBadgeText({
      text: incompleteTodos > 0 ? incompleteTodos.toString() : "",
    });

    chrome.action.setBadgeBackgroundColor({
      color: "#667eea",
    });
  });
}

// Update badge when storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.todos) {
    updateBadge();
  }
});

// Update badge on startup
chrome.runtime.onStartup.addListener(() => {
  updateBadge();
});

// Update badge when extension is installed/enabled
chrome.runtime.onInstalled.addListener(() => {
  updateBadge();
});
