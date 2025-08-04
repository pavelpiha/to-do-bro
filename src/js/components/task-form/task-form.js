/**
 * Task Form Component - Handles task creation form
 */
import { StorageService } from "../../services/storage.js";
import { NotificationService } from "../../services/notification.js";
import { i18nUtils } from "../../utils/i18n.js";
import { PriorityPopupComponent } from "../priority-popup/priority-popup.js";
import { stateService } from "../../services/state.js";

export class TaskFormComponent {
  constructor(viewManager) {
    this.viewManager = viewManager;
    this.priorityPopup = null; // Priority popup component

    // Initialize attributes
    this.attributes = {
      today: true,
      priority: null,
      reminders: false,
    };

    // Subscribe to state changes
    this.setupStateSubscriptions();
    this.setupEventListeners();

    // Listen for view changes to re-initialize event listeners when task form is shown
    document.addEventListener("viewChanged", (e) => {
      if (e.detail.view === "addTask") {
        setTimeout(() => {
          this.setupEventListeners();
          this.initializePriorityPopup();
          this.updateDateAttributeDisplay();
          this.updatePriorityDisplay();
        }, 50);
      }
    });

    this.updateDateAttributeDisplay();
    this.updatePriorityDisplay();
  }

  /**
   * Setup state subscriptions to react to state changes
   * @private
   */
  setupStateSubscriptions() {
    // Subscribe to date and time state changes
    stateService.subscribe(["date", "time"], (path, newValue) => {
      console.log(`Task form: State changed: ${path} =`, newValue);

      if (path.startsWith("date.")) {
        this.updateDateAttributeDisplay();
      }
    });

    // Subscribe to task form attributes changes
    stateService.subscribe(["taskForm.attributes"], (path, newValue) => {
      console.log(`Task form: Attributes changed: ${path} =`, newValue);

      if (path === "taskForm.attributes.priority") {
        this.updatePriorityDisplay();
      }
    });

    // Subscribe to repeat state changes
    stateService.subscribe(["repeat"], (path, newValue) => {
      console.log(`Task form: Repeat state changed: ${path} =`, newValue);
    });
  }

  /**
   * Initialize priority popup component
   */
  initializePriorityPopup() {
    if (!this.priorityPopup) {
      this.priorityPopup = new PriorityPopupComponent((priority) => {
        this.selectPriority(priority);
      });

      // Move the priority popup to the correct container
      const popup = document.getElementById("priorityPopup");
      const container = document.getElementById("priorityPopupContainer");
      if (popup && container) {
        container.appendChild(popup);
      }
    }
    // Set priority from state
    const currentPriority = stateService.getState(
      "taskForm.attributes.priority"
    );
    this.priorityPopup.setPriority(currentPriority);
  }

  setupEventListeners() {
    // Close button
    const closeBtn = document.getElementById("closeTaskBtn");
    if (closeBtn) {
      closeBtn.onclick = () => {
        this.viewManager.showView("main");
      };
    }

    // Remove today attribute button
    const removeTodayBtn = document.getElementById("removeTodayBtn");
    if (removeTodayBtn) {
      removeTodayBtn.onclick = (e) => {
        e.stopPropagation();
        this.setDateAttribute(null, "none");
      };
    }

    // Today attribute - show date picker
    const todayAttribute = document.getElementById("todayAttribute");
    if (todayAttribute) {
      todayAttribute.onclick = (e) => {
        // Prevent the remove button from triggering this
        if (
          e.target.id === "removeTodayBtn" ||
          e.target.classList.contains("task-form__remove-btn")
        ) {
          return;
        }
        console.log("Today attribute clicked, showing date picker");
        this.showDatePicker();
      };
    }

    // Priority attribute
    const priorityAttribute = document.getElementById("priorityAttribute");
    if (priorityAttribute) {
      priorityAttribute.onclick = (e) => {
        e.stopPropagation();
        if (this.priorityPopup) {
          this.priorityPopup.toggle();
        }
      };
    }

    // Reminders attribute
    const remindersAttribute = document.getElementById("remindersAttribute");
    if (remindersAttribute) {
      remindersAttribute.onclick = () => {
        this.toggleAttribute("reminders");
      };
    }

    // Auto-resize description textarea
    const descTextarea = document.getElementById("taskDescription");
    if (descTextarea) {
      descTextarea.addEventListener("input", this.autoResizeTextarea);
    }

    // Form submission
    const taskForm = document.getElementById("taskForm");
    if (taskForm) {
      taskForm.onsubmit = (e) => {
        e.preventDefault();
        this.handleSubmit();
      };
    }
  }

  /**
   * Toggle attribute state and update UI
   * @param {string} attributeName - The attribute name (today, priority, reminders)
   * @param {boolean|null} forceState - Force a specific state, or null to toggle
   */
  toggleAttribute(attributeName, forceState = null) {
    const element = document.getElementById(attributeName + "Attribute");

    if (element) {
      if (forceState !== null) {
        this.attributes[attributeName] = forceState;
        element.classList.toggle("task-form__attribute--active", forceState);
      } else {
        this.attributes[attributeName] = !this.attributes[attributeName];
        element.classList.toggle(
          "task-form__attribute--active",
          this.attributes[attributeName]
        );
      }
    }
  }

  resetForm() {
    // Clear inputs
    const titleInput = document.getElementById("taskTitle");
    const descInput = document.getElementById("taskDescription");

    if (titleInput) titleInput.value = "";
    if (descInput) descInput.value = "";

    // Reset attributes to default
    this.attributes = { today: true, priority: null, reminders: false };
    this.selectedDate = new Date();
    this.dateType = "today";
    this.updateAttributeUI();
    this.updateDateAttributeDisplay();
    this.updatePriorityDisplay();
    if (this.priorityPopup) {
      this.priorityPopup.hide();
      this.priorityPopup.setPriority(null);
    }
  }

  showDatePicker() {
    console.log("showDatePicker called");

    const datePickerView = stateService.getComponent("datePicker");
    if (datePickerView) {
      const currentDate = stateService.getState("date.selectedDate");
      datePickerView.show(currentDate);
    } else {
      console.error("datePickerView is not registered in state service!");
    }
  }

  setDateAttribute(date, type, timeData = null) {
    // Update state service instead of local variables
    stateService.setSelectedDate(date, type, timeData);
  }

  updateDateAttributeDisplay() {
    const todayAttribute = document.getElementById("todayAttribute");
    if (!todayAttribute) return;

    const textSpan = todayAttribute.querySelector(
      "span:not(.attribute-icon):not(.remove-btn)"
    );
    const removeTodayBtn = document.getElementById("removeTodayBtn");

    // Get data from state service
    const selectedDate = stateService.getState("date.selectedDate");
    const dateType = stateService.getState("date.dateType");

    if (!selectedDate) {
      // No date selected
      if (textSpan) textSpan.textContent = "Add Date";
      if (removeTodayBtn) removeTodayBtn.style.display = "none";
      return;
    }

    // Show remove button
    if (removeTodayBtn) removeTodayBtn.style.display = "inline";

    // Update text based on date type
    let displayText = "";
    switch (dateType) {
      case "today":
        displayText = "Today";
        break;
      case "tomorrow":
        displayText = "Tomorrow";
        break;
      case "weekend":
        displayText = "Next weekend";
        break;
      case "custom":
        displayText = this.formatDateForDisplay(selectedDate);
        break;
      default:
        displayText = "Today";
    }

    if (textSpan) textSpan.textContent = displayText;
  }

  formatDateForDisplay(date) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (this.isSameDate(date, today)) {
      return "Today";
    } else if (this.isSameDate(date, tomorrow)) {
      return "Tomorrow";
    } else {
      const day = date.getDate();
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${day} ${monthNames[date.getMonth()]}`;
    }
  }

  isSameDate(date1, date2) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  /**
   * Update attribute UI to reflect current state
   * @private
   */
  updateAttributeUI() {
    Object.keys(this.attributes).forEach((attr) => {
      const element = document.getElementById(attr + "Attribute");
      if (element) {
        element.classList.toggle(
          "task-form__attribute--active",
          this.attributes[attr]
        );
      }
    });
  }

  autoResizeTextarea(event) {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.max(20, textarea.scrollHeight) + "px";
  }

  /**
   * Handle priority selection from popup
   * @param {number} priority - Selected priority level (1-4)
   */
  selectPriority(priority) {
    stateService.setPriority(priority);
  }

  /**
   * Update priority button display based on selected priority
   */
  updatePriorityDisplay() {
    const priorityAttribute = document.getElementById("priorityAttribute");
    const removePriorityBtn = document.getElementById("removePriorityBtn");
    const priorityIcon = priorityAttribute?.querySelector(".priority-icon");
    const priorityText = priorityAttribute?.querySelector(
      "span:not(.attribute-icon):not(.remove-btn)"
    );

    const priority = stateService.getState("taskForm.attributes.priority");

    if (!priority) {
      // No priority selected
      if (priorityText) priorityText.textContent = "Priority";
      if (priorityIcon) priorityIcon.textContent = "🏷️";
      if (removePriorityBtn) removePriorityBtn.style.display = "none";
      if (priorityAttribute) {
        priorityAttribute.classList.remove(
          "priority-1",
          "priority-2",
          "priority-3",
          "priority-4"
        );
      }
      return;
    }

    // Show remove button and update display
    if (removePriorityBtn) removePriorityBtn.style.display = "inline";

    // Priority icons and text
    const priorityConfig = {
      1: { icon: "🔴", text: "Priority 1" },
      2: { icon: "🟠", text: "Priority 2" },
      3: { icon: "🟡", text: "Priority 3" },
      4: { icon: "🔵", text: "Priority 4" },
    };

    const config = priorityConfig[priority];
    if (config) {
      if (priorityIcon) priorityIcon.textContent = config.icon;
      if (priorityText) priorityText.textContent = config.text;
      if (priorityAttribute) {
        // Remove all priority classes and add the current one
        priorityAttribute.classList.remove(
          "priority-1",
          "priority-2",
          "priority-3",
          "priority-4"
        );
        priorityAttribute.classList.add(`priority-${priority}`);
      }
    }
  }
  /**
   * Update priority button display based on selected priority
   */
  updatePriorityDisplay() {
    const priorityIcon = document.getElementById("priorityIcon");
    const priorityText = document.getElementById("priorityText");
    const priorityAttribute = document.getElementById("priorityAttribute");

    if (!priorityIcon || !priorityText || !priorityAttribute) return;

    if (this.attributes.priority) {
      // Priority is selected
      priorityAttribute.classList.add("task-form__attribute--active");
      priorityText.textContent = `${i18nUtils.getMessage("priority")} ${
        this.attributes.priority
      }`;

      // Update icon color based on priority level
      switch (this.attributes.priority) {
        case 1:
          priorityIcon.style.color = "#d32f2f"; // Red
          break;
        case 2:
          priorityIcon.style.color = "#f57c00"; // Orange
          break;
        case 3:
          priorityIcon.style.color = "#1976d2"; // Blue
          break;
        case 4:
          priorityIcon.style.color = "#666"; // Gray
          break;
      }
    } else {
      // No priority selected
      priorityAttribute.classList.remove("task-form__attribute--active");
      priorityText.textContent = i18nUtils.getMessage("priority");
      priorityIcon.style.color = ""; // Reset to default
    }
  }

  async handleSubmit() {
    const titleInput = document.getElementById("taskTitle");
    const descriptionInput = document.getElementById("taskDescription");

    const title = titleInput?.value.trim() || "";
    const description = descriptionInput?.value.trim() || "";

    if (!title) {
      titleInput?.focus();
      return;
    }

    // Create task object
    const task = {
      id: Date.now(),
      text: title,
      description: description,
      completed: false,
      createdAt: new Date().toISOString(),
      type: "task",
      attributes: { ...this.attributes },
      dueDate: this.selectedDate ? this.selectedDate.toISOString() : null,
      dateType: this.dateType,
    };

    try {
      // Load existing todos and add new task
      const todos = await StorageService.loadTodos();
      todos.push(task);

      // Save updated todos
      const result = await StorageService.saveTodos(todos);

      if (result.success) {
        // Show success notification
        await NotificationService.showTaskAdded(title);

        // Reset form and go back
        this.resetForm();
        this.viewManager.showView("main");
      } else {
        await NotificationService.showError("Failed to save task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      await NotificationService.showError(
        "An error occurred while creating the task"
      );
    }
  }
}
