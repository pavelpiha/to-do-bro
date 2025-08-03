/**
 * Popup Entry Point - Initializes the ToDoBro extension popup
 */
import { TodoApp } from "./components/todo-app.js";

// Initialize the app when the popup loads
document.addEventListener("DOMContentLoaded", () => {
  new TodoApp();
});
