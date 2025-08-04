/**
 * Time Picker Component - Handles time selection with duration and timezone options
 */
import { i18nUtils } from "../../utils/i18n.js";

export class TimePickerComponent {
  constructor(onTimeSelect) {
    this.onTimeSelect = onTimeSelect;
    this.isVisible = false;
    this.selectedTime = null;
    this.selectedDuration = null;
    this.selectedTimezone = "floating";
    this.selectedDate = null; // Store the selected date
    this.dropdownVisible = false;
    this.timeOptions = []; // Initialize empty, will be populated when date is set

    this.setupEventListeners();
  }

  /**
   * Generate time options for dropdown (15-minute intervals)
   * Filters out past times if the selected date is today
   */
  generateTimeOptions() {
    this.timeOptions = [];

    // If no date is selected, don't generate options yet
    if (!this.selectedDate) {
      return;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selectedDateOnly = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate()
    );

    const isToday = selectedDateOnly.getTime() === today.getTime();

    console.log("Generating time options:", {
      selectedDate: this.selectedDate,
      selectedDateOnly: selectedDateOnly,
      today: today,
      isToday: isToday,
      now: now,
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
        this.timeOptions.push(timeString);
      }
    }

    console.log(
      `Generated ${this.timeOptions.length} time options for ${
        isToday ? "today" : "other date"
      }`
    );
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
        this.selectedTimezone = timezoneSelect.value;
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

    // Clear and populate dropdown
    dropdownList.innerHTML = "";

    this.timeOptions.forEach((timeOption) => {
      const item = document.createElement("div");
      item.className = "time-picker__dropdown-item";
      item.textContent = timeOption;

      if (timeOption === timeInput.value) {
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
    const timeInput = document.getElementById("timeInput");
    if (timeInput) {
      timeInput.value = time;
      this.selectedTime = time;
    }
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

    // Store the selected date for time filtering
    this.selectedDate = options.date || new Date();

    // Set initial values
    const timeInput = document.getElementById("timeInput");
    const durationInput = document.getElementById("durationInput");
    const timezoneSelect = document.getElementById("timezoneSelect");

    if (timeInput) {
      timeInput.value = options.time || "15:00";
      this.selectedTime = timeInput.value;
    }

    if (durationInput) {
      const noDurationText =
        i18nUtils.getMessage("timePicker_noDuration") || "No duration";
      durationInput.value = options.duration || noDurationText;
      this.selectedDuration = options.duration || null;
    }

    if (timezoneSelect) {
      timezoneSelect.value = options.timezone || "floating";
      this.selectedTimezone = timezoneSelect.value;
    }

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
    this.isVisible = false;
  }

  /**
   * Save the selected time and call the callback
   */
  saveTime() {
    const timeData = {
      time: this.selectedTime,
      duration: this.selectedDuration,
      timezone: this.selectedTimezone,
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
    if (!this.selectedTime) {
      return null;
    }

    const [hours, minutes] = this.selectedTime.split(":").map(Number);
    const now = new Date();
    const timeObject = new Date(now);
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
      const durationInput = document.getElementById("durationInput");
      if (durationInput) {
        durationInput.value = duration;
        this.selectedDuration = duration;
      }
    }
  }

  /**
   * Get current time selection
   */
  getTimeData() {
    return {
      time: this.selectedTime,
      duration: this.selectedDuration,
      timezone: this.selectedTimezone,
      timestamp: this.createTimeObject(),
    };
  }

  /**
   * Set time data programmatically
   */
  setTimeData(timeData) {
    if (timeData.time) {
      this.selectedTime = timeData.time;
      const timeInput = document.getElementById("timeInput");
      if (timeInput) {
        timeInput.value = timeData.time;
      }
    }

    if (timeData.duration !== undefined) {
      this.selectedDuration = timeData.duration;
      const durationInput = document.getElementById("durationInput");
      if (durationInput) {
        durationInput.value = timeData.duration || "";
      }
    }

    if (timeData.timezone) {
      this.selectedTimezone = timeData.timezone;
      const timezoneSelect = document.getElementById("timezoneSelect");
      if (timezoneSelect) {
        timezoneSelect.value = timeData.timezone;
      }
    }

    // Update selected date if provided
    if (timeData.date) {
      this.selectedDate = timeData.date;
    }
  }

  /**
   * Update the selected date (useful when date changes in date picker)
   */
  updateSelectedDate(date) {
    this.selectedDate = date;
    // If dropdown is currently visible, refresh the options
    if (this.dropdownVisible) {
      this.showTimeDropdown();
    }
  }
}
