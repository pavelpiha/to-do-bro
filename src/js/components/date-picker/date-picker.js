/**
 * Date Picker Component - Handles the date picker view UI and interactions
 */
export class DatePickerView {
  constructor(viewManager, onDateSelect) {
    this.viewManager = viewManager;
    this.onDateSelect = onDateSelect;
    this.selectedDate = null;
    this.currentMonth = new Date();
    this.today = new Date();

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Back button
    const backBtn = document.getElementById("backFromDatePickerBtn");
    if (backBtn) {
      backBtn.onclick = () => {
        this.viewManager.showView("addTask");
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

    // Calendar navigation
    const prevBtn = document.getElementById("prevMonthBtn");
    const nextBtn = document.getElementById("nextMonthBtn");

    if (prevBtn) {
      prevBtn.onclick = () => {
        this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
        this.renderCalendar();
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
        this.renderCalendar();
      };
    }
  }

  show(selectedDate = null) {
    this.selectedDate = selectedDate;
    this.updateQuickDateSelection();
    this.renderCalendar();
    this.viewManager.showView("datePicker");
  }

  selectQuickDate(dateType) {
    let date = null;

    switch (dateType) {
      case "today":
        date = new Date();
        break;
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

    this.onDateSelect(date, dateType);
    this.viewManager.showView("addTask");
  }

  selectCalendarDate(date) {
    this.onDateSelect(date, "custom");
    this.viewManager.showView("addTask");
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

    // Determine which quick option should be selected based on current date
    if (!this.selectedDate) {
      document
        .getElementById("quickNoDate")
        ?.classList.add("date-picker__quick-option--selected");
      return;
    }

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (this.isSameDate(this.selectedDate, today)) {
      document
        .getElementById("quickToday")
        ?.classList.add("date-picker__quick-option--selected");
    } else if (this.isSameDate(this.selectedDate, tomorrow)) {
      document
        .getElementById("quickTomorrow")
        ?.classList.add("date-picker__quick-option--selected");
    } else if (this.isWeekend(this.selectedDate)) {
      document
        .getElementById("quickWeekend")
        ?.classList.add("date-picker__quick-option--selected");
    }
  }

  renderCalendar() {
    const monthElement = document.getElementById("calendarMonth");
    const daysElement = document.getElementById("calendarDays");

    if (!monthElement || !daysElement) return;

    // Update month display
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    monthElement.textContent = `${
      monthNames[this.currentMonth.getMonth()]
    } ${this.currentMonth.getFullYear()}`;

    // Clear previous days
    daysElement.innerHTML = "";

    // Get first day of month and number of days
    const firstDay = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth(),
      1
    );
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    // Generate calendar days
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayButton = document.createElement("button");
      dayButton.className = "date-picker__day";
      dayButton.textContent = date.getDate();

      // Add classes for styling
      if (date.getMonth() !== this.currentMonth.getMonth()) {
        dayButton.classList.add("date-picker__day--other-month");
      }

      if (this.isSameDate(date, this.today)) {
        dayButton.classList.add("date-picker__day--today");
      }

      if (this.selectedDate && this.isSameDate(date, this.selectedDate)) {
        dayButton.classList.add("date-picker__day--selected");
      }

      if (date.getDay() === 0 || date.getDay() === 6) {
        dayButton.classList.add("date-picker__day--weekend");
      }

      // Add click handler
      dayButton.onclick = () => {
        this.selectCalendarDate(new Date(date));
      };

      daysElement.appendChild(dayButton);
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
}
