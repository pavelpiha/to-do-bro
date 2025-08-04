/**
 * Date Picker Component - Handles the date picker popup UI and interactions
 */
import { TimePickerComponent } from "../time-picker/time-picker.js";
import { RepeatDropdownComponent } from "../repeat-dropdown/repeat-dropdown.js";
import { stateService } from "../../services/state.js";

export class DatePickerView {
  constructor(viewManager) {
    this.viewManager = viewManager;
    this.today = new Date();
    this.isVisible = false;

    // Initialize time picker component (uses state service)
    this.timePicker = new TimePickerComponent();

    // Initialize repeat dropdown component (uses state service)
    this.repeatDropdown = new RepeatDropdownComponent();

    // Subscribe to state changes
    this.setupStateSubscriptions();
    this.setupEventListeners();
  }

  /**
   * Setup state subscriptions to react to state changes
   * @private
   */
  setupStateSubscriptions() {
    // Subscribe to date state changes
    stateService.subscribe(
      ["date.selectedDate", "date.dateType", "date.currentMonth"],
      (path, newValue) => {
        console.log(`Date picker state changed: ${path} =`, newValue);

        if (path === "date.selectedDate" || path === "date.dateType") {
          this.updateSelectedDateDisplay();
          this.updateQuickDateSelection();
          this.renderCalendar();
        } else if (path === "date.currentMonth") {
          this.renderCalendar();
        }
      }
    );

    // Subscribe to time state changes
    stateService.subscribe(["time"], (path, newValue) => {
      console.log(`Time state changed in date picker: ${path} =`, newValue);
    });

    // Subscribe to repeat state changes
    stateService.subscribe(["repeat"], (path, newValue) => {
      console.log(`Repeat state changed in date picker: ${path} =`, newValue);
    });
  }

  setupEventListeners() {
    // Overlay click to close
    const overlay = document.getElementById("datePickerOverlay");
    if (overlay) {
      overlay.onclick = () => {
        this.hide();
      };
    }

    // Time picker button
    const timeBtn = document.getElementById("timePickerBtn");
    if (timeBtn) {
      timeBtn.onclick = () => {
        this.showTimePicker();
      };
    }

    // Repeat button
    const repeatBtn = document.getElementById("repeatBtn");
    if (repeatBtn) {
      repeatBtn.onclick = (e) => {
        e.stopPropagation();
        this.showRepeatDropdown(e);
      };
    }

    // Quick date options
    const quickOptions = document.querySelectorAll(
      ".date-picker__quick-option"
    );
    quickOptions.forEach((option) => {
      option.onclick = () => {
        const dateType = option.dataset.date;
        this.selectQuickDate(dateType);
      };
    });

    // Escape key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isVisible) {
        this.hide();
      }
    });

    // Infinite scroll for calendar
    this.setupInfiniteScroll();
  }

  setupInfiniteScroll() {
    const calendarElement = document.querySelector(".date-picker__calendar");
    if (calendarElement) {
      calendarElement.addEventListener("scroll", (e) => {
        if (!this.isVisible) return;

        const { scrollTop, scrollHeight, clientHeight } = e.target;

        // If user scrolled to within 100px of the bottom, load more months
        if (scrollTop + clientHeight >= scrollHeight - 100) {
          this.loadMoreMonths();
        }
      });
    }
  }

  loadMoreMonths() {
    const daysElement = document.getElementById("calendarDays");
    if (!daysElement) return;

    // Get the current number of months rendered
    const currentMonthContainers = daysElement.querySelectorAll(
      ".date-picker__month-container"
    );
    const monthsRendered = currentMonthContainers.length;

    // Month names for display
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

    // Get current month from state
    const currentMonth =
      stateService.getState("date.currentMonth") || new Date();

    // Add 3 more months
    for (let i = 0; i < 3; i++) {
      const monthOffset = monthsRendered + i;
      const displayMonth = new Date(currentMonth);
      displayMonth.setMonth(displayMonth.getMonth() + monthOffset);

      this.renderSingleMonth(displayMonth, monthNames, daysElement);
    }
  }

  renderSingleMonth(displayMonth, monthNames, daysElement) {
    // Create month container
    const monthContainer = document.createElement("div");
    monthContainer.className = "date-picker__month-container";

    // Add month title
    const monthTitle = document.createElement("div");
    monthTitle.className = "date-picker__month-title";
    monthTitle.textContent = `${
      monthNames[displayMonth.getMonth()]
    } ${displayMonth.getFullYear()}`;
    monthContainer.appendChild(monthTitle);

    // Add weekdays header for this month
    const weekdaysHeader = document.createElement("div");
    weekdaysHeader.className = "date-picker__weekdays";
    const dayNames = ["M", "T", "W", "T", "F", "S", "S"];
    dayNames.forEach((dayName) => {
      const dayElement = document.createElement("div");
      dayElement.textContent = dayName;
      weekdaysHeader.appendChild(dayElement);
    });
    monthContainer.appendChild(weekdaysHeader);

    // Create month grid
    const monthGrid = document.createElement("div");
    monthGrid.className = "date-picker__month-grid";

    // Get first day of the display month
    const firstDay = new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth(),
      1
    );

    // Adjust for Monday start (European style)
    const startDate = new Date(firstDay);
    const dayOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    startDate.setDate(startDate.getDate() - dayOffset);

    // Get selected date from state
    const selectedDate = stateService.getState("date.selectedDate");

    // Generate calendar days for this month (6 weeks = 42 days)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayButton = document.createElement("button");
      dayButton.className = "date-picker__day";
      dayButton.textContent = date.getDate();

      // Add classes for styling
      if (date.getMonth() !== displayMonth.getMonth()) {
        dayButton.classList.add("date-picker__day--other-month");
      }

      if (this.isSameDate(date, this.today)) {
        dayButton.classList.add("date-picker__day--today");
      }

      if (selectedDate && this.isSameDate(date, selectedDate)) {
        dayButton.classList.add("date-picker__day--selected");
      }

      if (date.getDay() === 0 || date.getDay() === 6) {
        dayButton.classList.add("date-picker__day--weekend");
      }

      // Add click handler
      dayButton.onclick = () => {
        this.selectCalendarDate(new Date(date));
      };

      monthGrid.appendChild(dayButton);
    }

    monthContainer.appendChild(monthGrid);
    daysElement.appendChild(monthContainer);
  }

  show(selectedDate = null) {
    // If no date is provided, use current state or default to today
    const currentSelectedDate = stateService.getState("date.selectedDate");
    const dateToShow = selectedDate || currentSelectedDate || new Date();

    // Update state if we have a different date
    if (selectedDate && selectedDate !== currentSelectedDate) {
      stateService.setSelectedDate(selectedDate, "custom");
    }

    // Update visibility state
    stateService.setComponentVisibility("datePickerVisible", true);
    this.isVisible = true;

    this.updateSelectedDateDisplay();
    this.updateQuickDateLabels();
    this.updateQuickDateSelection();
    this.renderCalendar();

    const popup = document.getElementById("datePickerView");
    if (popup) {
      popup.style.display = "flex";
    }
  }

  showTimePicker() {
    console.log("Opening time picker");

    // Get current time data from state
    const timeData = {
      time: stateService.getState("time.selectedTime") || "15:00",
      duration: stateService.getState("time.duration") || null,
      timezone: stateService.getState("time.timezone") || "floating",
      date: stateService.getState("date.selectedDate"), // Pass selected date for time filtering
    };

    this.timePicker.show(timeData);
  }

  hide() {
    this.isVisible = false;
    stateService.setComponentVisibility("datePickerVisible", false);

    const popup = document.getElementById("datePickerView");
    if (popup) {
      popup.style.display = "none";
    }
  }

  updateSelectedDateDisplay() {
    const display = document.getElementById("selectedDateDisplay");
    if (!display) return;

    const selectedDate = stateService.getState("date.selectedDate");

    if (!selectedDate) {
      display.textContent = "Select Date";
      return;
    }

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (this.isSameDate(selectedDate, today)) {
      const day = selectedDate.getDate();
      const month = selectedDate.toLocaleDateString("en-US", {
        month: "short",
      });
      display.textContent = `${day} ${month}`;
    } else if (this.isSameDate(selectedDate, tomorrow)) {
      display.textContent = "Tomorrow";
    } else {
      const day = selectedDate.getDate();
      const month = selectedDate.toLocaleDateString("en-US", {
        month: "short",
      });
      display.textContent = `${day} ${month}`;
    }
  }

  updateQuickDateLabels() {
    // Update Tomorrow date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowLabel = document.getElementById("tomorrowDate");
    if (tomorrowLabel) {
      const dayName = tomorrow.toLocaleDateString("en-US", {
        weekday: "short",
      });
      tomorrowLabel.textContent = dayName;
    }

    // Update Weekend date
    const weekend = this.getNextWeekend();
    const weekendLabel = document.getElementById("weekendDate");
    if (weekendLabel) {
      const dayName = weekend.toLocaleDateString("en-US", { weekday: "short" });
      const day = weekend.getDate();
      const month = weekend.toLocaleDateString("en-US", { month: "short" });
      weekendLabel.textContent = `${dayName} ${day} ${month}`;
    }
  }

  showTimePicker() {
    console.log("Opening time picker");

    // Prepare initial time data
    const initialTimeData = {
      time: this.timeData?.time || "15:00",
      duration: this.timeData?.duration || null,
      timezone: this.timeData?.timezone || "floating",
    };

    this.timePicker.show(initialTimeData);
  }

  selectQuickDate(dateType) {
    let date = null;

    switch (dateType) {
      case "tomorrow":
        date = new Date();
        date.setDate(date.getDate() + 1);
        break;
      case "weekend":
        date = this.getNextWeekend();
        break;
      case "none":
        date = null;
        break;
    }

    // Update state service with selected date
    const timeData = stateService.getDateTimeData();
    stateService.setSelectedDate(date, dateType, {
      time: timeData.time,
      duration: timeData.duration,
      timezone: timeData.timezone,
    });

    this.hide();
  }

  selectCalendarDate(date) {
    // Update state service with selected date
    const timeData = stateService.getDateTimeData();
    stateService.setSelectedDate(new Date(date), "custom", {
      time: timeData.time,
      duration: timeData.duration,
      timezone: timeData.timezone,
    });

    this.hide();
  }

  getNextWeekend() {
    const date = new Date();
    const daysUntilSaturday = (6 - date.getDay()) % 7;
    const nextSaturday = new Date(date);
    nextSaturday.setDate(
      date.getDate() + (daysUntilSaturday === 0 ? 7 : daysUntilSaturday)
    );
    return nextSaturday;
  }

  /**
   * Update quick date option selection display
   * @private
   */
  updateQuickDateSelection() {
    const options = document.querySelectorAll(".date-picker__quick-option");
    options.forEach((option) => {
      option.classList.remove("date-picker__quick-option--selected");
    });

    // Get selected date from state
    const selectedDate = stateService.getState("date.selectedDate");

    // Determine which quick option should be selected based on current date
    if (!selectedDate) {
      document
        .getElementById("quickNoDate")
        ?.classList.add("date-picker__quick-option--selected");
      return;
    }

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (this.isSameDate(selectedDate, tomorrow)) {
      document
        .getElementById("quickTomorrow")
        ?.classList.add("date-picker__quick-option--selected");
    } else if (this.isWeekend(selectedDate)) {
      document
        .getElementById("quickWeekend")
        ?.classList.add("date-picker__quick-option--selected");
    }
  }

  renderCalendar() {
    const daysElement = document.getElementById("calendarDays");

    if (!daysElement) return;

    // Month names for display
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

    // Clear previous days
    daysElement.innerHTML = "";

    // Get current month from state
    const currentMonth =
      stateService.getState("date.currentMonth") || new Date();

    // Render initial 6 months for scrolling: current month and 5 future months
    for (let monthOffset = 0; monthOffset <= 5; monthOffset++) {
      const displayMonth = new Date(currentMonth);
      displayMonth.setMonth(displayMonth.getMonth() + monthOffset);

      this.renderSingleMonth(displayMonth, monthNames, daysElement);
    }
  }

  isSameDate(date1, date2) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  isWeekend(date) {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
  }

  /**
   * Initialize repeat dropdown component after templates are loaded
   */
  initRepeatDropdown() {
    if (this.repeatDropdown) {
      this.repeatDropdown.init();
    }
  }

  /**
   * Show repeat dropdown positioned near the repeat button
   * @param {Event} e - Click event from repeat button
   */
  showRepeatDropdown(e) {
    if (!this.repeatDropdown) return;

    const button = e.target.closest("#repeatBtn");
    if (!button) return;

    // Get button position
    const rect = button.getBoundingClientRect();

    // Position dropdown above the button
    const x = rect.left;
    const y = rect.top - 8; // 8px gap above button

    this.repeatDropdown.show(x, y);
  }

  /**
   * Get current time and repeat data
   * @returns {Object} Combined time and repeat data
   */
  getCurrentData() {
    return stateService.getDateTimeData();
  }

  /**
   * Reset repeat selection
   */
  resetRepeat() {
    stateService.setRepeatData(null);
    if (this.repeatDropdown) {
      this.repeatDropdown.clearSelection();
    }
  }
}
