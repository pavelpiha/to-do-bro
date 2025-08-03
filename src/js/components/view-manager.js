/**
 * View Manager - Handles navigation between different views
 * @class ViewManager
 */
import { TemplateLoader } from "../utils/template-loader.js";

export class ViewManager {
  /**
   * Initialize the view manager
   * @constructor
   */
  constructor() {
    this.currentView = "main";
    this.views = new Map();
    this.templatesLoaded = false;
    this.setupViewEventListeners();
  }

  /**
   * Load all view templates dynamically
   * @async
   * @returns {Promise<void>}
   */
  async loadTemplates() {
    if (this.templatesLoaded) {
      return;
    }

    try {
      const templateNames = [
        "main-view",
        "add-task-view",
        "date-picker-view",
        "add-website-view",
        "priority-popup",
      ];

      console.log("Loading view templates...");
      const templates = await TemplateLoader.loadTemplates(templateNames);

      // Get the main container
      const container = document.body;

      // Inject all templates
      for (const [templateName, templateContent] of Object.entries(templates)) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = templateContent;
        const templateElement = tempDiv.firstElementChild;

        if (templateElement) {
          container.appendChild(templateElement);
        }
      }

      this.templatesLoaded = true;
      console.log("All view templates loaded successfully");
    } catch (error) {
      console.error("Error loading view templates:", error);
      throw error;
    }
  }

  /**
   * Register a view for management
   * @param {string} viewName - The name of the view
   * @param {HTMLElement} viewElement - The DOM element for the view
   */
  registerView(viewName, viewElement) {
    this.views.set(viewName, viewElement);
  }

  /**
   * Show a specific view and hide others
   * @param {string} viewName - The name of the view to show
   * @returns {Promise<boolean>} - True if view was shown successfully, false otherwise
   */
  async showView(viewName) {
    try {
      // Ensure templates are loaded first
      await this.loadTemplates();

      // Hide all views
      document.querySelectorAll(".to-do-bro__view").forEach((view) => {
        view.classList.remove("to-do-bro__view--active");
      });

      // Show target view
      const targetView = document.getElementById(viewName + "View");
      if (targetView) {
        targetView.classList.add("to-do-bro__view--active");
        this.currentView = viewName;

        // Dispatch custom event for view change
        document.dispatchEvent(
          new CustomEvent("viewChanged", {
            detail: { view: viewName, previousView: this.currentView },
          })
        );

        return true;
      }

      console.warn(`View "${viewName}" not found`);
      return false;
    } catch (error) {
      console.error("Error showing view:", error);
      return false;
    }
  }

  /**
   * Get the currently active view
   * @returns {string} - The name of the current view
   */
  getCurrentView() {
    return this.currentView;
  }

  /**
   * Navigate back to the main view
   */
  goBack() {
    // Simple back navigation - go to main view
    this.showView("main");
  }

  /**
   * Setup global view event listeners
   * @private
   */
  setupViewEventListeners() {
    // Auto-focus handling when views change
    document.addEventListener("viewChanged", (e) => {
      const view = e.detail.view;

      // Auto-focus logic for different views
      setTimeout(() => {
        switch (view) {
          case "addTask":
            const taskTitle = document.getElementById("taskTitle");
            if (taskTitle) taskTitle.focus();
            break;
          case "addWebsite":
            const websiteTitle = document.getElementById("websiteTitle");
            if (websiteTitle) websiteTitle.focus();
            break;
        }
      }, 100);
    });
  }
}
