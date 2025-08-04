/**
 * Time Picker Component - Handles time selection with duration and timezone options
 */
import { i18nUtils } from "../../utils/i18n.js";
import { stateService } from "../../services/state.js";

export class TimePickerComponent {
  constructor(onTimeSelect) {
    this.onTimeSelect = onTimeSelect;
    this.isVisible = false;
    this.dropdownVisible = false;

    // Subscribe to state changes
    this.setupStateSubscriptions();
    this.setupEventListeners();
  }

  /**
   * Setup state subscriptions to react to state changes
   * @private
   */
  setupStateSubscriptions() {
    // Subscribe to date changes to regenerate time options
    stateService.subscribe(["date.selectedDate"], (path, newValue) => {
      console.log(`Time picker: Date changed to`, newValue);
      this.generateTimeOptions();

      // If dropdown is currently visible, refresh the options
      if (this.dropdownVisible) {
        this.showTimeDropdown();
      }
    });

    // Subscribe to time state changes
    stateService.subscribe(["time"], (path, newValue) => {
      console.log(`Time picker: Time state changed: ${path} =`, newValue);

      // Update UI elements if they exist
      if (path === "time.selectedTime") {
        const timeInput = document.getElementById("timeInput");
        if (timeInput && newValue) {
          timeInput.value = newValue;
        }
      } else if (path === "time.duration") {
        const durationInput = document.getElementById("durationInput");
        if (durationInput) {
          const noDurationText =
            i18nUtils.getMessage("timePicker_noDuration") || "No duration";
          durationInput.value = newValue || noDurationText;
        }
      } else if (path === "time.timezone") {
        const timezoneSelect = document.getElementById("timezoneSelect");
        if (timezoneSelect && newValue) {
          timezoneSelect.value = newValue;
        }
      }
    });
  }

  /**
   * Generate time options for dropdown (15-minute intervals)
   * Filters out past times if the selected date is today
   */
  generateTimeOptions() {
    const selectedDate = stateService.getState("date.selectedDate");
    const timeOptions = [];

    // If no date is selected, don't generate options yet
    if (!selectedDate) {
      stateService.setState("time.timeOptions", timeOptions);
      return;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selectedDateOnly = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );

    const isToday = selectedDateOnly.getTime() === today.getTime();

    console.log("Generating time options:", {
      selectedDate,
      selectedDateOnly,
      today,
      isToday,
      now,
    });

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;

        // If it's today, skip times that have already passed
        if (isToday) {
          const timeDate = new Date();
          timeDate.setHours(hour, minute, 0, 0);
          if (timeDate <= now) {
            continue; // Skip past times for today
          }
        }

        // For any other date (future or past), show all times
        timeOptions.push(timeString);
      }
    }

    console.log(
      `Generated ${timeOptions.length} time options for ${
        isToday ? "today" : "other date"
      }`
    );

    // Update state with generated options
    stateService.setState("time.timeOptions", timeOptions);
  }

  setupEventListeners() {
    // Cancel button
    const cancelBtn = document.getElementById("timeCancelBtn");
    if (cancelBtn) {
      cancelBtn.onclick = () => {
        this.hide();
      };
    }

    // Save button
    const saveBtn = document.getElementById("timeSaveBtn");
    if (saveBtn) {
      saveBtn.onclick = () => {
        this.saveTime();
      };
    }

    // Duration button - for future implementation
    const durationBtn = document.getElementById("durationBtn");
    if (durationBtn) {
      durationBtn.onclick = () => {
        this.toggleDurationPicker();
      };
    }

    // Time input click to show dropdown
    const timeInput = document.getElementById("timeInput");
    if (timeInput) {
      timeInput.onclick = () => {
        this.toggleTimeDropdown();
      };
      timeInput.onfocus = () => {
        this.showTimeDropdown();
      };
    }

    // Timezone select change
    const timezoneSelect = document.getElementById("timezoneSelect");
    if (timezoneSelect) {
      timezoneSelect.onchange = () => {
        stateService.setState("time.timezone", timezoneSelect.value);
      };
    }

    // Modal overlay click to close
    const modal = document.getElementById("timePickerModal");
    if (modal) {
      modal.onclick = (e) => {
        if (
          e.target === modal ||
          e.target.classList.contains("time-picker__overlay")
        ) {
          this.hide();
        }
      };
    }

    // Prevent clicks inside container from closing modal (but allow dropdown close logic)
    const container = document.querySelector(".time-picker__container");
    if (container) {
      container.onclick = (e) => {
        // First check if we should close dropdown
        const dropdown = document.getElementById("timeDropdown");
        const timeInput = document.getElementById("timeInput");

        if (dropdown && timeInput && this.dropdownVisible) {
          // Hide dropdown if clicked outside the dropdown or input
          if (!dropdown.contains(e.target) && !timeInput.contains(e.target)) {
            this.hideTimeDropdown();
          }
        }

        // Then prevent modal from closing
        e.stopPropagation();
      };
    }

    // Click outside dropdown to close it
    document.addEventListener("click", (e) => {
      const dropdown = document.getElementById("timeDropdown");
      const timeInput = document.getElementById("timeInput");

      if (dropdown && timeInput && this.dropdownVisible) {
        // Hide dropdown if clicked outside the dropdown or input
        if (!dropdown.contains(e.target) && !timeInput.contains(e.target)) {
          this.hideTimeDropdown();
        }
      }
    });

    // ESC key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isVisible) {
        if (this.dropdownVisible) {
          this.hideTimeDropdown();
        } else {
          this.hide();
        }
      }
    });
  }

  /**
   * Show time dropdown with options
   */
  showTimeDropdown() {
    if (this.dropdownVisible) return;

    const dropdown = document.getElementById("timeDropdown");
    const dropdownList = document.getElementById("timeDropdownList");
    const timeInput = document.getElementById("timeInput");

    if (!dropdown || !dropdownList || !timeInput) return;

    // Regenerate time options based on current selected date
    this.generateTimeOptions();

    // Get time options from state
    const timeOptions = stateService.getState("time.timeOptions") || [];
    const selectedTime = stateService.getState("time.selectedTime");

    // Clear and populate dropdown
    dropdownList.innerHTML = "";

    timeOptions.forEach((timeOption) => {
      const item = document.createElement("div");
      item.className = "time-picker__dropdown-item";
      item.textContent = timeOption;

      if (timeOption === selectedTime) {
        item.classList.add("selected");
      }

      item.onclick = () => {
        this.selectTime(timeOption);
      };

      dropdownList.appendChild(item);
    });

    // Show dropdown
    dropdown.style.display = "block";
    this.dropdownVisible = true;

    // Scroll to selected item
    const selectedItem = dropdownList.querySelector(".selected");
    if (selectedItem) {
      selectedItem.scrollIntoView({ block: "nearest" });
    }
  }

  /**
   * Hide time dropdown
   */
  hideTimeDropdown() {
    const dropdown = document.getElementById("timeDropdown");
    if (dropdown) {
      dropdown.style.display = "none";
    }
    this.dropdownVisible = false;
  }

  /**
   * Toggle time dropdown visibility
   */
  toggleTimeDropdown() {
    if (this.dropdownVisible) {
      this.hideTimeDropdown();
    } else {
      this.showTimeDropdown();
    }
  }

  /**
   * Select a time from dropdown
   */
  selectTime(time) {
    stateService.setState("time.selectedTime", time);
    this.hideTimeDropdown();
  }

  /**
   * Show the time picker modal
   * @param {Object} options - Initial time options
   * @param {string} options.time - Initial time in HH:MM format
   * @param {string} options.duration - Initial duration
   * @param {string} options.timezone - Initial timezone setting
   * @param {Date} options.date - The selected date for filtering times
   */
  show(options = {}) {
    const modal = document.getElementById("timePickerModal");
    if (!modal) {
      console.error("Time picker modal not found");
      return;
    }

    // Update state with provided data and selected date for time filtering
    if (options.date) {
      stateService.setState("date.selectedDate", options.date);
    }

    // Update time state
    const timeUpdates = {};
    if (options.time) timeUpdates["time.selectedTime"] = options.time;
    if (options.duration !== undefined)
      timeUpdates["time.duration"] = options.duration;
    if (options.timezone) timeUpdates["time.timezone"] = options.timezone;

    if (Object.keys(timeUpdates).length > 0) {
      stateService.updateState(timeUpdates);
    }

    // Set initial values in UI elements
    const timeInput = document.getElementById("timeInput");
    const durationInput = document.getElementById("durationInput");
    const timezoneSelect = document.getElementById("timezoneSelect");

    if (timeInput) {
      const selectedTime =
        stateService.getState("time.selectedTime") || options.time || "15:00";
      timeInput.value = selectedTime;
      stateService.setState("time.selectedTime", selectedTime);
    }

    if (durationInput) {
      const noDurationText =
        i18nUtils.getMessage("timePicker_noDuration") || "No duration";
      const duration =
        stateService.getState("time.duration") || options.duration || null;
      durationInput.value = duration || noDurationText;
    }

    if (timezoneSelect) {
      const timezone =
        stateService.getState("time.timezone") ||
        options.timezone ||
        "floating";
      timezoneSelect.value = timezone;
      stateService.setState("time.timezone", timezone);
    }

    // Update visibility state
    stateService.setComponentVisibility("timePickerVisible", true);
    modal.style.display = "block";
    this.isVisible = true;

    // Focus on time input
    if (timeInput) {
      timeInput.focus();
    }
  }

  /**
   * Hide the time picker modal
   */
  hide() {
    const modal = document.getElementById("timePickerModal");
    if (modal) {
      modal.style.display = "none";
    }
    stateService.setComponentVisibility("timePickerVisible", false);
    this.isVisible = false;
  }

  /**
   * Save the selected time and call the callback
   */
  saveTime() {
    const timeData = {
      time: stateService.getState("time.selectedTime"),
      duration: stateService.getState("time.duration"),
      timezone: stateService.getState("time.timezone"),
      timestamp: this.createTimeObject(),
    };

    if (this.onTimeSelect) {
      this.onTimeSelect(timeData);
    }

    this.hide();
  }

  /**
   * Create a complete time object with the selected date and time
   */
  createTimeObject() {
    const selectedTime = stateService.getState("time.selectedTime");
    if (!selectedTime) {
      return null;
    }

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const selectedDate =
      stateService.getState("date.selectedDate") || new Date();
    const timeObject = new Date(selectedDate);
    timeObject.setHours(hours, minutes, 0, 0);

    return timeObject;
  }

  /**
   * Toggle duration picker (placeholder for future implementation)
   */
  toggleDurationPicker() {
    // TODO: Implement duration picker functionality
    console.log("Duration picker not yet implemented");

    // For now, just show a simple prompt
    const duration = prompt('Enter duration (e.g., "2h", "30m", "1h 30m"):');
    if (duration) {
      stateService.setState("time.duration", duration);
    }
  }

  /**
   * Get current time selection
   */
  getTimeData() {
    return {
      time: stateService.getState("time.selectedTime"),
      duration: stateService.getState("time.duration"),
      timezone: stateService.getState("time.timezone"),
      timestamp: this.createTimeObject(),
    };
  }

  /**
   * Set time data programmatically
   */
  setTimeData(timeData) {
    const updates = {};

    if (timeData.time) {
      updates["time.selectedTime"] = timeData.time;
    }

    if (timeData.duration !== undefined) {
      updates["time.duration"] = timeData.duration;
    }

    if (timeData.timezone) {
      updates["time.timezone"] = timeData.timezone;
    }

    // Update selected date if provided
    if (timeData.date) {
      updates["date.selectedDate"] = timeData.date;
    }

    stateService.updateState(updates);
  }

  /**
   * Update the selected date (useful when date changes in date picker)
   */
  updateSelectedDate(date) {
    stateService.setState("date.selectedDate", date);
    // Time options will be regenerated automatically via state subscription
  }
}
