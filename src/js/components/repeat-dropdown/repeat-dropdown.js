/**
 * Repeat Dropdown Component - Handles repeat options for tasks
 */
import { i18nUtils } from "../../utils/i18n.js";
import { stateService } from "../../services/state.js";

export class RepeatDropdownComponent {
  /**
   * @param {Function} onRepeatSelect - Callback when repeat option is selected
   */
  constructor(onRepeatSelect) {
    this.onRepeatSelect = onRepeatSelect;
    this.dropdown = null;
    this.isVisible = false;

    // Subscribe to state changes
    this.setupStateSubscriptions();
    this.setupEventListeners();
  }

  /**
   * Setup state subscriptions to react to state changes
   * @private
   */
  setupStateSubscriptions() {
    // Subscribe to repeat state changes
    stateService.subscribe(["repeat"], (path, newValue) => {
      console.log(`Repeat dropdown: State changed: ${path} =`, newValue);
      this.updateSelectedOption();
    });
  }

  /**
   * Initialize the component after templates are loaded
   */
  init() {
    this.dropdown = document.getElementById("repeatDropdown");
    if (!this.dropdown) {
      console.error("Repeat dropdown element not found");
      return;
    }

    this.setupOptionListeners();
  }

  /**
   * Setup event listeners for dropdown options
   * @private
   */
  setupOptionListeners() {
    if (!this.dropdown) return;

    const options = this.dropdown.querySelectorAll(".repeat-dropdown__option");
    options.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        this.handleOptionSelect(option);
      });
    });
  }

  /**
   * Setup global event listeners
   * @private
   */
  setupEventListeners() {
    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (this.isVisible && !this.dropdown?.contains(e.target)) {
        this.hide();
      }
    });

    // Handle escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isVisible) {
        this.hide();
      }
    });
  }

  /**
   * Handle option selection
   * @param {HTMLElement} option - Selected option element
   * @private
   */
  handleOptionSelect(option) {
    const repeatType = option.dataset.repeat;

    // Update state with selected repeat
    stateService.setRepeat(repeatType);

    // Hide dropdown
    this.hide();
  }

  /**
   * Update visual selected state based on current repeat state
   * @private
   */
  updateSelectedOption() {
    if (!this.dropdown) return;

    const currentRepeat = stateService.getRepeat();

    // Remove previous selection
    const prevSelected = this.dropdown.querySelector('[data-selected="true"]');
    if (prevSelected) {
      prevSelected.removeAttribute("data-selected");
    }

    // Mark new selection if there is one
    if (currentRepeat) {
      const newSelected = this.dropdown.querySelector(
        `[data-repeat="${currentRepeat}"]`
      );
      if (newSelected) {
        newSelected.setAttribute("data-selected", "true");
      }
    }
  }

  /**
   * Show dropdown at specified position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate (top of button)
   */
  show(x, y) {
    if (!this.dropdown) return;

    // First make dropdown visible to calculate its height
    this.dropdown.style.display = "block";
    this.dropdown.style.visibility = "hidden";

    // Update dynamic content
    this.updateDynamicContent();

    // Get dropdown height
    const dropdownHeight = this.dropdown.offsetHeight;

    // Position dropdown above the button
    const finalY = y - dropdownHeight;

    this.dropdown.style.left = `${x}px`;
    this.dropdown.style.top = `${finalY}px`;
    this.dropdown.style.visibility = "visible";
    this.isVisible = true;
  }

  /**
   * Hide dropdown
   */
  hide() {
    if (!this.dropdown) return;

    this.dropdown.style.display = "none";
    this.isVisible = false;
  }

  /**
   * Toggle dropdown visibility
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  toggle(x, y) {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show(x, y);
    }
  }

  /**
   * Update dynamic content based on current date
   * @private
   */
  updateDynamicContent() {
    if (!this.dropdown) return;

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.toLocaleDateString("en-US", { month: "long" });

    // Update monthly option
    const monthlyOption = this.dropdown.querySelector(
      '[data-repeat="monthly"]'
    );
    if (monthlyOption) {
      const secondarySpan = monthlyOption.querySelector(
        ".repeat-dropdown__secondary"
      );
      if (secondarySpan) {
        const ordinal = this.getOrdinal(currentDay);
        secondarySpan.textContent = `the ${ordinal}`;
      }
    }

    // Update yearly option
    const yearlyOption = this.dropdown.querySelector('[data-repeat="yearly"]');
    if (yearlyOption) {
      const secondarySpan = yearlyOption.querySelector(
        ".repeat-dropdown__secondary"
      );
      if (secondarySpan) {
        secondarySpan.textContent = `${currentMonth} ${currentDay}${this.getOrdinalSuffix(
          currentDay
        )}`;
      }
    }
  }

  /**
   * Get ordinal number (1st, 2nd, 3rd, etc.)
   * @param {number} num - The number
   * @returns {string} Ordinal string
   * @private
   */
  getOrdinal(num) {
    return num + this.getOrdinalSuffix(num);
  }

  /**
   * Get ordinal suffix (st, nd, rd, th)
   * @param {number} num - The number
   * @returns {string} Ordinal suffix
   * @private
   */
  getOrdinalSuffix(num) {
    const ones = num % 10;
    const tens = Math.floor(num / 10) % 10;

    if (tens === 1) {
      return "th";
    }

    switch (ones) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  /**
   * Get currently selected repeat option
   * @returns {string|null} Selected repeat type
   */
  getSelectedRepeat() {
    return stateService.getRepeat();
  }

  /**
   * Set selected repeat option programmatically
   * @param {string} repeatType - The repeat type to select
   */
  setSelectedRepeat(repeatType) {
    stateService.setRepeat(repeatType);
  }

  /**
   * Clear selection
   */
  clearSelection() {
    stateService.setRepeat(null);
  }
}
