/**
 * Priority Popup Component - Handles priority selection popup
 */
import { i18nUtils } from "../../utils/i18n.js";

export class PriorityPopupComponent {
  constructor(onPrioritySelect) {
    this.onPrioritySelect = onPrioritySelect;
    this.selectedPriority = null;
    this.isVisible = false;

    this.setupEventListeners();
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
    this.selectedPriority = priority;
    this.hide();

    // Notify parent component about the selection
    if (this.onPrioritySelect) {
      this.onPrioritySelect(priority);
    }
  }

  /**
   * Set the current priority (for external updates)
   * @param {number|null} priority - Priority level (1-4) or null
   */
  setPriority(priority) {
    this.selectedPriority = priority;
    if (this.isVisible) {
      this.updateSelection();
    }
  }

  /**
   * Update popup to show current selection
   */
  updateSelection() {
    const options = document.querySelectorAll(".priority-option");
    options.forEach((option) => {
      const priority = parseInt(option.dataset.priority);
      option.classList.toggle(
        "is-selected",
        priority === this.selectedPriority
      );
    });
  }

  /**
   * Get the currently selected priority
   * @returns {number|null} The selected priority level or null
   */
  getSelectedPriority() {
    return this.selectedPriority;
  }
}
