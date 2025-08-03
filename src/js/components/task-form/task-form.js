/**
 * Task Form Component - Handles task creation form
 */
import { StorageService } from "../../services/storage.js";
import { NotificationService } from "../../services/notification.js";
import { i18nUtils } from "../../utils/i18n.js";
import { PriorityPopupComponent } from "../priority-popup/priority-popup.js";

export class TaskFormComponent {
  constructor(viewManager) {
    this.viewManager = viewManager;
    this.datePickerView = null; // Will be set by TodoApp
    this.priorityPopup = null; // Priority popup component
    this.attributes = {
      today: true,
      priority: null, // null = no priority, 1-4 = priority levels
      reminders: false,
    };
    this.selectedDate = new Date(); // Default to today
    this.dateType = "today"; // 'today', 'tomorrow', 'weekend', 'custom', or 'none'
    this.timeData = null; // Store time information (time, duration, timezone)

    // Set up event listeners
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

  // Method to set the date picker view from TodoApp
  setDatePickerView(datePickerView) {
    this.datePickerView = datePickerView;
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
    this.priorityPopup.setPriority(this.attributes.priority);
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

    if (this.datePickerView) {
      this.datePickerView.show(this.selectedDate);
    } else {
      console.error("datePickerView is not initialized!");
    }
  }

  setDateAttribute(date, type, timeData = null) {
    this.selectedDate = date;
    this.dateType = type;
    this.timeData = timeData; // Store time data

    // Update the today attribute state
    this.attributes.today = date !== null;

    this.updateAttributeUI();
    this.updateDateAttributeDisplay();
  }

  updateDateAttributeDisplay() {
    const todayAttribute = document.getElementById("todayAttribute");
    if (!todayAttribute) return;

    const textSpan = todayAttribute.querySelector(
      "span:not(.attribute-icon):not(.remove-btn)"
    );
    const removeTodayBtn = document.getElementById("removeTodayBtn");

    if (!this.selectedDate) {
      // No date selected
      if (textSpan) textSpan.textContent = "Add Date";
      if (removeTodayBtn) removeTodayBtn.style.display = "none";
      return;
    }

    // Show remove button
    if (removeTodayBtn) removeTodayBtn.style.display = "inline";

    // Update text based on date type
    let displayText = "";
    switch (this.dateType) {
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
        displayText = this.formatDateForDisplay(this.selectedDate);
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
    this.attributes.priority = priority;
    this.updatePriorityDisplay();
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
