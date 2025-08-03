/**
 * Main Todo App - Entry point and app orchestration
 * @class TodoApp
 */
import { i18nUtils } from "../utils/i18n.js";
import { ViewManager } from "./view-manager.js";
import { TaskFormComponent } from "./task-form/task-form.js";
import { WebsiteFormComponent } from "./website-form/website-form.js";
import { DatePickerView } from "./date-picker/date-picker.js";

export class TodoApp {
  /**
   * Initialize the Todo App
   * @constructor
   */
  constructor() {
    this.viewManager = new ViewManager();
    this.taskForm = null;
    this.websiteForm = null;
    this.datePickerView = null;
    this.init();
  }

  /**
   * Initialize the app components and setup
   * @async
   * @private
   */
  async init() {
    try {
      // Initialize internationalization
      i18nUtils.localizeHTML();

      // Load view templates first
      await this.viewManager.loadTemplates();

      // Initialize components
      this.taskForm = new TaskFormComponent(this.viewManager);
      this.websiteForm = new WebsiteFormComponent(this.viewManager);

      // Initialize date picker view (will be used by task form)
      this.datePickerView = new DatePickerView(
        this.viewManager,
        (selectedDate, dateType, timeData) => {
          // Pass the date selection and time data back to the task form
          if (this.taskForm) {
            this.taskForm.setDateAttribute(selectedDate, dateType, timeData);
          }
        }
      );

      // Connect date picker view to task form
      this.taskForm.setDatePickerView(this.datePickerView);

      // Setup main menu event listeners
      this.setupMainMenuListeners();

      // Show main view
      await this.viewManager.showView("main");

      // Re-localize HTML after templates are loaded
      i18nUtils.localizeHTML();
    } catch (error) {
      console.error("Error initializing TodoApp:", error);
    }
  }

  /**
   * Setup main menu event listeners
   * @private
   */
  setupMainMenuListeners() {
    // Add task button
    const addTaskBtn = document.getElementById("addTaskBtn");
    if (addTaskBtn) {
      addTaskBtn.addEventListener("click", () => {
        this.viewManager.showView("addTask");
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
