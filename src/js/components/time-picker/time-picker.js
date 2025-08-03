/**
 * Time Picker Component - Handles time selection with duration and timezone options
 */
export class TimePickerComponent {
  constructor(onTimeSelect) {
    this.onTimeSelect = onTimeSelect;
    this.isVisible = false;
    this.selectedTime = null;
    this.selectedDuration = null;
    this.selectedTimezone = "floating";

    this.setupEventListeners();
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

    // Time input change
    const timeInput = document.getElementById("timeInput");
    if (timeInput) {
      timeInput.onchange = () => {
        this.selectedTime = timeInput.value;
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

    // Prevent clicks inside container from closing modal
    const container = document.querySelector(".time-picker__container");
    if (container) {
      container.onclick = (e) => {
        e.stopPropagation();
      };
    }

    // ESC key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isVisible) {
        this.hide();
      }
    });
  }

  /**
   * Show the time picker modal
   * @param {Object} options - Initial time options
   * @param {string} options.time - Initial time in HH:MM format
   * @param {string} options.duration - Initial duration
   * @param {string} options.timezone - Initial timezone setting
   */
  show(options = {}) {
    const modal = document.getElementById("timePickerModal");
    if (!modal) {
      console.error("Time picker modal not found");
      return;
    }

    // Set initial values
    const timeInput = document.getElementById("timeInput");
    const durationInput = document.getElementById("durationInput");
    const timezoneSelect = document.getElementById("timezoneSelect");

    if (timeInput) {
      timeInput.value = options.time || "15:00";
      this.selectedTime = timeInput.value;
    }

    if (durationInput) {
      durationInput.value = options.duration || "";
      durationInput.placeholder =
        durationInput.getAttribute("data-i18n-placeholder") || "No duration";
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
  }
}
