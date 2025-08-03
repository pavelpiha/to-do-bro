/**
 * Website Form Component - Handles website task creation
 */
import { StorageService } from "../../services/storage.js";
import { NotificationService } from "../../services/notification.js";
import { TabService } from "../../services/tab.js";

export class WebsiteFormComponent {
  constructor(viewManager) {
    this.viewManager = viewManager;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Back button
    const backBtn = document.getElementById("backToMainBtn2");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        this.viewManager.showView("main");
      });
    }

    // Cancel button
    const cancelBtn = document.getElementById("cancelWebsiteBtn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        this.viewManager.showView("main");
      });
    }

    // Form submission
    const websiteForm = document.getElementById("websiteForm");
    if (websiteForm) {
      websiteForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }
  }

  async populateForm() {
    try {
      const tabInfo = await TabService.getCurrentTabInfo();

      const titleInput = document.getElementById("websiteTitle");
      const urlInput = document.getElementById("websiteUrl");

      if (titleInput && tabInfo.title) {
        titleInput.value = tabInfo.title;
      }

      if (urlInput && tabInfo.url) {
        urlInput.value = tabInfo.url;
      }
    } catch (error) {
      console.error("Error populating website form:", error);
    }
  }

  resetForm() {
    const titleInput = document.getElementById("websiteTitle");
    const urlInput = document.getElementById("websiteUrl");

    if (titleInput) titleInput.value = "";
    if (urlInput) urlInput.value = "";
  }

  async handleSubmit() {
    const titleInput = document.getElementById("websiteTitle");
    const urlInput = document.getElementById("websiteUrl");

    const title = titleInput?.value.trim() || "";
    const url = urlInput?.value.trim() || "";

    if (!title || !url) {
      if (!title) titleInput?.focus();
      return;
    }

    // Create website task object
    const websiteTask = {
      id: Date.now(),
      text: title,
      url: url,
      completed: false,
      createdAt: new Date().toISOString(),
      type: "website",
    };

    try {
      // Load existing todos and add new website task
      const todos = await StorageService.loadTodos();
      todos.push(websiteTask);

      // Save updated todos
      const result = await StorageService.saveTodos(todos);

      if (result.success) {
        // Show success notification
        await NotificationService.showWebsiteAdded(title);

        // Reset form and go back
        this.resetForm();
        this.viewManager.showView("main");
      } else {
        await NotificationService.showError("Failed to save website task");
      }
    } catch (error) {
      console.error("Error creating website task:", error);
      await NotificationService.showError(
        "An error occurred while creating the website task"
      );
    }
  }
}
