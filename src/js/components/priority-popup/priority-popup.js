/**
 * Priority Popup Component - Handles priority selection popup
 */
import { i18nUtils } from "../../utils/i18n.js";
import { stateService } from "../../services/state.js";

export class PriorityPopupComponent {
  constructor(onPrioritySelect) {
    console.log("PriorityPopupComponent: Constructor called");
    try {
      this.onPrioritySelect = onPrioritySelect;
      this.isVisible = false;

      console.log("PriorityPopupComponent: Setting up state subscriptions...");
      // Subscribe to state changes
      this.setupStateSubscriptions();

      console.log("PriorityPopupComponent: Setting up event listeners...");
      this.setupEventListeners();

      console.log("PriorityPopupComponent: Constructor completed successfully");
    } catch (error) {
      console.error("PriorityPopupComponent: Error in constructor:", error);
      throw error;
    }
  }

  /**
   * Setup state subscriptions to react to state changes
   * @private
   */
  setupStateSubscriptions() {
    // Subscribe to priority state changes
    stateService.subscribe(
      ["taskForm.attributes.priority"],
      (path, newValue) => {
        console.log(`Priority popup: State changed: ${path} =`, newValue);
        if (this.isVisible) {
          this.updateSelection();
        }
      }
    );
  }

  setupEventListeners() {
    // Priority popup options
    const priorityOptions = document.querySelectorAll(".priority-option");
    priorityOptions.forEach((option) => {
      option.onclick = (e) => {
        e.stopPropagation();
        const priority = parseInt(option.dataset.priority);
        this.selectPriority(priority);
      };
    });

    // Close priority popup when clicking outside
    document.addEventListener("click", (e) => {
      const popup = document.getElementById("priorityPopup");
      const priorityBtn = document.getElementById("priorityAttribute");
      if (
        popup &&
        !popup.contains(e.target) &&
        priorityBtn &&
        !priorityBtn.contains(e.target)
      ) {
        this.hide();
      }
    });
  }

  /**
   * Toggle priority popup visibility
   */
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Show priority popup
   */
  show() {
    const popup = document.getElementById("priorityPopup");
    if (popup) {
      popup.style.display = "block";
      this.isVisible = true;
      this.updateSelection();
    }
  }

  /**
   * Hide priority popup
   */
  hide() {
    const popup = document.getElementById("priorityPopup");
    if (popup) {
      popup.style.display = "none";
      this.isVisible = false;
    }
  }

  /**
   * Select a priority level
   * @param {number} priority - Priority level (1-4)
   */
  selectPriority(priority) {
    stateService.setPriority(priority);
    this.hide();
  }

  /**
   * Set the current priority (for external updates)
   * @param {number|null} priority - Priority level (1-4) or null
   */
  setPriority(priority) {
    stateService.setPriority(priority);
  }

  /**
   * Update popup to show current selection
   */
  updateSelection() {
    try {
      const currentPriority = stateService.getPriority();
      const options = document.querySelectorAll(".priority-option");
      options.forEach((option) => {
        const priority = parseInt(option.dataset.priority);
        option.classList.toggle("is-selected", priority === currentPriority);
      });
    } catch (error) {
      console.error("Error updating priority selection:", error);
    }
  }

  /**
   * Get the currently selected priority
   * @returns {number|null} The selected priority level or null
   */
  getSelectedPriority() {
    return stateService.getPriority();
  }
}
