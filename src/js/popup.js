/**
 * Popup Entry Point - Initializes the ToDoBro extension popup
 */
import { TodoApp } from "./components/todo-app.js";

console.log("Popup.js loaded!");

// Global debug function for visible debugging
window.updateDebug = function (message) {
  const debugElement = document.getElementById("debug");
  if (debugElement) {
    debugElement.innerHTML = `Debug: ${message}`;
  }
  console.log(`DEBUG: ${message}`);
};

window.updateDebug("Popup.js loaded!");

// Initialize the app when the popup loads
document.addEventListener("DOMContentLoaded", () => {
  window.updateDebug("DOMContentLoaded fired, initializing TodoApp...");
  try {
    new TodoApp();
    window.updateDebug("TodoApp initialized successfully!");
  } catch (error) {
    window.updateDebug(`Error initializing TodoApp: ${error.message}`);
    console.error("Error initializing TodoApp:", error);
  }
});
