/**
 * Main Todo App - Entry point and app orchestration
 * @class TodoApp
 */
import { i18nUtils } from "../utils/i18n.js";
import { ViewManager } from "./view-manager.js";
import { TaskFormComponent } from "./task-form/task-form.js";
import { WebsiteFormComponent } from "./website-form/website-form.js";
import { DatePickerView } from "./date-picker/date-picker.js";
import { stateService } from "../services/state.js";

export class TodoApp {
  /**
   * Initialize the Todo App
   * @constructor
   */
  constructor() {
    console.log("TodoApp constructor called!");
    this.updateDebug("TodoApp constructor called!");
    this.viewManager = new ViewManager();
    this.taskForm = null;
    this.websiteForm = null;
    this.datePickerView = null;
    this.init();
  }

  updateDebug(message) {
    if (window.updateDebug) {
      window.updateDebug(message);
    } else {
      const debugElement = document.getElementById("debug");
      if (debugElement) {
        debugElement.innerHTML = `Debug: ${message}`;
      }
      console.log(`DEBUG: ${message}`);
    }
  }

  /**
   * Initialize the app components and setup
   * @async
   * @private
   */
  async init() {
    try {
      this.updateDebug("Starting init...");

      // Initialize internationalization
      this.updateDebug("Initializing i18n...");
      i18nUtils.localizeHTML();

      // Load view templates first
      this.updateDebug("Loading templates...");
      await this.viewManager.loadTemplates();

      // Initialize state service
      this.updateDebug("Initializing state service...");
      console.log("TodoApp: Initializing state service");

      // Initialize components
      this.updateDebug("Initializing task form...");
      this.taskForm = new TaskFormComponent(this.viewManager);

      this.updateDebug("Initializing website form...");
      this.websiteForm = new WebsiteFormComponent(this.viewManager);

      // Initialize date picker view (uses state service for communication)
      this.updateDebug("Initializing date picker...");
      this.datePickerView = new DatePickerView(this.viewManager);

      // Register date picker with state service for cross-component access
      this.updateDebug("Registering date picker...");
      stateService.registerComponent("datePicker", this.datePickerView);

      // Initialize repeat dropdown component after templates are loaded
      this.updateDebug("Initializing repeat dropdown...");
      this.datePickerView.initRepeatDropdown();

      // Show main view first
      this.updateDebug("Showing main view...");
      await this.viewManager.showView("main");

      // Setup main menu event listeners after view is shown
      // Add a small delay to ensure DOM is fully ready
      this.updateDebug("Setting up listeners with delay...");
      setTimeout(() => {
        this.setupMainMenuListeners();
      }, 100);

      // Re-localize HTML after templates are loaded
      this.updateDebug("Re-localizing HTML...");
      i18nUtils.localizeHTML();

      this.updateDebug("Init completed successfully!");
    } catch (error) {
      this.updateDebug(`Error in init: ${error.message}`);
      console.error("Error initializing TodoApp:", error);
    }
  }

  /**
   * Setup event listeners for main menu buttons
   * @private
   */
  setupMainMenuListeners() {
    this.updateDebug("Setting up main menu listeners...");
    // Add task button
    const addTaskBtn = document.getElementById("addTaskBtn");
    console.log("Setup: addTaskBtn found:", addTaskBtn);
    console.log(
      "Setup: All elements with 'addTaskBtn' ID:",
      document.querySelectorAll("#addTaskBtn")
    );
    console.log(
      "Setup: All buttons in document:",
      document.querySelectorAll("button")
    );

    if (addTaskBtn) {
      this.updateDebug("addTaskBtn found, adding click listener");
      addTaskBtn.addEventListener("click", () => {
        this.updateDebug(
          "addTaskBtn clicked - attempting to show addTask view"
        );
        console.log("addTaskBtn clicked - attempting to show addTask view");
        this.viewManager.showView("addTask");
      });
    } else {
      this.updateDebug("addTaskBtn NOT found during setup");
      console.warn("addTaskBtn not found during setup");
      // Try to find it with a more general selector
      const allButtons = document.querySelectorAll("button");
      console.log("All buttons found:", allButtons);
      allButtons.forEach((btn, index) => {
        console.log(`Button ${index}:`, btn.id, btn.textContent, btn);
      });
    }

    // Add website button
    const addWebsiteBtn = document.getElementById("addWebsiteBtn");
    if (addWebsiteBtn) {
      addWebsiteBtn.addEventListener("click", async () => {
        try {
          await this.websiteForm.populateForm();
          this.viewManager.showView("addWebsite");
        } catch (error) {
          console.error("Error populating website form:", error);
        }
      });
    }
  }
}
