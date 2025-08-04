/**
 * State Service - Centralized state management for the ToDoBro application
 *
 * This service manages all shared state across components including:
 * - Selected date and date type
 * - Time data (time, duration, timezone)
 * - Repeat settings
 * - Priority selections
 * - Form attributes
 * - Component visibility states
 *
 * Components can subscribe to state changes and automatically update when state changes.
 *
 * @class StateService
 */
export class StateService {
  /**
   * Private constructor to ensure singleton pattern
   * @private
   */
  constructor() {
    // Prevent direct instantiation
    if (StateService.instance) {
      return StateService.instance;
    }

    console.log("StateService: Initializing state...");

    // Initialize state
    this.state = {
      // Date and time related state
      date: {
        selectedDate: null,
        dateType: "today", // 'today', 'tomorrow', 'weekend', 'custom', 'none'
        currentMonth: new Date(),
      },

      // Time picker state
      time: {
        selectedTime: null,
        duration: null,
        timezone: "floating",
        timeOptions: [],
      },

      // Repeat settings state
      repeat: {
        type: null, // null, 'daily', 'weekly', 'monthly', etc.
        interval: 1,
        endDate: null,
        customSettings: null,
      },

      // Task form state
      taskForm: {
        attributes: {
          today: true,
          priority: null, // null = no priority, 1-4 = priority levels
          reminders: false,
        },
        formData: {
          text: "",
          description: "",
        },
      },

      // Website form state
      websiteForm: {
        url: "",
        title: "",
        description: "",
      },

      // UI state
      ui: {
        currentView: "main",
        datePickerVisible: false,
        timePickerVisible: false,
        priorityPopupVisible: false,
        repeatDropdownVisible: false,
      },

      // Component interaction state
      components: {
        datePickerInitialized: false,
        timePickerInitialized: false,
        priorityPopupInitialized: false,
        repeatDropdownInitialized: false,
      },
    };

    console.log("StateService: Initial state created:", this.state);

    // Component registry for cross-component communication
    this.componentRegistry = {};

    // Event listeners for state changes
    this.listeners = new Map();

    // Event listener ID counter
    this.listenerIdCounter = 0;

    StateService.instance = this;
    console.log("StateService: Singleton instance created");
  }

  /**
   * Get the singleton instance of StateService
   * @returns {StateService} The singleton instance
   */
  static getInstance() {
    if (!StateService.instance) {
      StateService.instance = new StateService();
    }
    return StateService.instance;
  }

  /**
   * Get current state or a specific part of the state
   * @param {string} [path] - Optional path to specific state (e.g., 'date.selectedDate')
   * @returns {*} The state value
   */
  getState(path = null) {
    console.log(`StateService: getState called with path: "${path}"`);

    if (!path) {
      return { ...this.state };
    }

    const keys = path.split(".");
    let value = this.state;

    console.log(`StateService: Starting traversal from:`, value);

    for (const key of keys) {
      console.log(`StateService: Accessing key "${key}" on:`, value);
      if (value && typeof value === "object" && key in value) {
        value = value[key];
        console.log(`StateService: Found value:`, value);
      } else {
        console.log(
          `StateService: Key "${key}" not found, returning undefined`
        );
        return undefined;
      }
    }

    console.log(`StateService: Final value for path "${path}":`, value);
    return value;
  }

  /**
   * Set state value and notify listeners
   * @param {string} path - Path to the state property (e.g., 'date.selectedDate')
   * @param {*} value - New value to set
   * @param {Object} [options] - Options for state update
   * @param {boolean} [options.silent=false] - If true, don't notify listeners
   * @returns {boolean} True if state was updated
   */
  setState(path, value, options = {}) {
    const { silent = false } = options;

    const keys = path.split(".");
    let current = this.state;

    // Navigate to the parent object
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key];
    }

    const finalKey = keys[keys.length - 1];
    const oldValue = current[finalKey];

    // Only update if value actually changed
    if (oldValue !== value) {
      current[finalKey] = value;

      if (!silent) {
        this.notifyListeners(path, value, oldValue);
      }

      return true;
    }

    return false;
  }

  /**
   * Update multiple state properties at once
   * @param {Object} updates - Object with path-value pairs
   * @param {Object} [options] - Options for state update
   * @param {boolean} [options.silent=false] - If true, don't notify listeners
   */
  updateState(updates, options = {}) {
    const { silent = false } = options;
    const changedPaths = [];

    // Apply all updates
    for (const [path, value] of Object.entries(updates)) {
      if (this.setState(path, value, { silent: true })) {
        changedPaths.push(path);
      }
    }

    // Notify listeners for all changed paths
    if (!silent && changedPaths.length > 0) {
      for (const path of changedPaths) {
        const value = this.getState(path);
        this.notifyListeners(path, value);
      }
    }
  }

  /**
   * Subscribe to state changes
   * @param {string|Array<string>} paths - State path(s) to listen to
   * @param {Function} callback - Callback function to call when state changes
   * @param {Object} [options] - Subscription options
   * @param {boolean} [options.immediate=false] - Call callback immediately with current value
   * @returns {string} Listener ID for unsubscribing
   */
  subscribe(paths, callback, options = {}) {
    console.log(`StateService: subscribe called with paths:`, paths);
    try {
      const { immediate = false } = options;
      const listenerId = `listener_${++this.listenerIdCounter}`;

      const pathsArray = Array.isArray(paths) ? paths : [paths];
      console.log(`StateService: Processing paths array:`, pathsArray);

      this.listeners.set(listenerId, {
        paths: pathsArray,
        callback,
      });

      // Call callback immediately with current values if requested
      if (immediate) {
        console.log(
          `StateService: Calling immediate callbacks for paths:`,
          pathsArray
        );
        for (const path of pathsArray) {
          const currentValue = this.getState(path);
          callback(path, currentValue, undefined);
        }
      }

      console.log(`StateService: Subscription created with ID: ${listenerId}`);
      return listenerId;
    } catch (error) {
      console.error(`StateService: Error in subscribe:`, error);
      throw error;
    }
  }

  /**
   * Unsubscribe from state changes
   * @param {string} listenerId - The listener ID returned from subscribe
   * @returns {boolean} True if listener was found and removed
   */
  unsubscribe(listenerId) {
    return this.listeners.delete(listenerId);
  }

  /**
   * Notify all listeners of state changes
   * @param {string} changedPath - The path that changed
   * @param {*} newValue - The new value
   * @param {*} [oldValue] - The old value
   * @private
   */
  notifyListeners(changedPath, newValue, oldValue) {
    for (const [listenerId, { paths, callback }] of this.listeners) {
      // Check if any of the listener's paths match the changed path
      const shouldNotify = paths.some(
        (path) => changedPath === path || changedPath.startsWith(path + ".")
      );

      if (shouldNotify) {
        try {
          callback(changedPath, newValue, oldValue);
        } catch (error) {
          console.error(`Error in state listener ${listenerId}:`, error);
        }
      }
    }
  }

  /**
   * Reset state to initial values
   * @param {string} [section] - Optional section to reset (e.g., 'date', 'time')
   */
  resetState(section = null) {
    if (section) {
      const initialSectionState = this.getInitialState()[section];
      if (initialSectionState) {
        this.setState(section, initialSectionState);
      }
    } else {
      this.state = this.getInitialState();
      this.notifyListeners("*", this.state);
    }
  }

  /**
   * Get initial state values
   * @returns {Object} Initial state object
   * @private
   */
  getInitialState() {
    return {
      date: {
        selectedDate: null,
        dateType: "today",
        currentMonth: new Date(),
      },
      time: {
        selectedTime: null,
        duration: null,
        timezone: "floating",
        timeOptions: [],
      },
      repeat: {
        type: null,
        interval: 1,
        endDate: null,
        customSettings: null,
      },
      taskForm: {
        attributes: {
          today: true,
          priority: null,
          reminders: false,
        },
        formData: {
          text: "",
          description: "",
        },
      },
      websiteForm: {
        url: "",
        title: "",
        description: "",
      },
      ui: {
        currentView: "main",
        datePickerVisible: false,
        timePickerVisible: false,
        priorityPopupVisible: false,
        repeatDropdownVisible: false,
      },
      components: {
        datePickerInitialized: false,
        timePickerInitialized: false,
        priorityPopupInitialized: false,
        repeatDropdownInitialized: false,
      },
    };
  }

  // ============ Convenience Methods for Common Operations ============

  /**
   * Set selected date and update related state
   * @param {Date|null} date - The selected date
   * @param {string} dateType - Type of date selection
   * @param {Object} [timeData] - Optional time data
   */
  setSelectedDate(date, dateType = "custom", timeData = null) {
    const updates = {
      "date.selectedDate": date,
      "date.dateType": dateType,
      "taskForm.attributes.today": date !== null,
    };

    if (timeData) {
      updates["time.selectedTime"] = timeData.time;
      updates["time.duration"] = timeData.duration;
      updates["time.timezone"] = timeData.timezone;
    }

    this.updateState(updates);
  }

  /**
   * Set time data and update related state
   * @param {Object} timeData - Time data object
   */
  setTimeData(timeData) {
    const updates = {
      "time.selectedTime": timeData.time,
      "time.duration": timeData.duration,
      "time.timezone": timeData.timezone,
    };

    this.updateState(updates);
  }

  /**
   * Set repeat data
   * @param {Object} repeatData - Repeat data object
   */
  setRepeatData(repeatData) {
    this.setState("repeat", repeatData);
  }

  /**
   * Set repeat type
   * @param {string|null} type - Repeat type ('daily', 'weekly', 'monthly', etc.) or null
   */
  setRepeat(type) {
    this.setState("repeat.type", type);
  }

  /**
   * Set priority level
   * @param {number|null} priority - Priority level (1-4) or null
   */
  setPriority(priority) {
    this.setState("taskForm.attributes.priority", priority);
  }

  /**
   * Toggle reminders attribute
   * @param {boolean} [enabled] - Optional specific state, or toggle if not provided
   */
  toggleReminders(enabled = null) {
    const currentState = this.getState("taskForm.attributes.reminders");
    const newState = enabled !== null ? enabled : !currentState;
    this.setState("taskForm.attributes.reminders", newState);
  }

  /**
   * Set current view
   * @param {string} view - View name
   */
  setCurrentView(view) {
    this.setState("ui.currentView", view);
  }

  /**
   * Set component visibility
   * @param {string} component - Component name (datePickerVisible, timePickerVisible, etc.)
   * @param {boolean} visible - Visibility state
   */
  setComponentVisibility(component, visible) {
    this.setState(`ui.${component}`, visible);
  }

  /**
   * Get all date and time related data
   * @returns {Object} Combined date and time data
   */
  getDateTimeData() {
    return {
      date: this.getState("date.selectedDate"),
      dateType: this.getState("date.dateType"),
      time: this.getState("time.selectedTime"),
      duration: this.getState("time.duration"),
      timezone: this.getState("time.timezone"),
      repeat: this.getState("repeat"),
    };
  }

  /**
   * Get all task form data
   * @returns {Object} Complete task form data
   */
  getTaskFormData() {
    return {
      ...this.getState("taskForm"),
      ...this.getDateTimeData(),
    };
  }

  /**
   * Reset form-related state
   */
  resetFormState() {
    this.updateState({
      "date.selectedDate": null,
      "date.dateType": "today",
      "time.selectedTime": null,
      "time.duration": null,
      "time.timezone": "floating",
      "repeat.type": null,
      "repeat.interval": 1,
      "repeat.endDate": null,
      "repeat.customSettings": null,
      "taskForm.attributes.priority": null,
      "taskForm.attributes.reminders": false,
      "taskForm.attributes.today": true,
      "taskForm.formData.text": "",
      "taskForm.formData.description": "",
    });
  }

  /**
   * Register a component instance for cross-component communication
   * @param {string} name - Component name/identifier
   * @param {Object} component - Component instance
   */
  registerComponent(name, component) {
    this.componentRegistry[name] = component;
    console.log(`StateService: Registered component "${name}"`);
  }

  /**
   * Get a registered component instance
   * @param {string} name - Component name/identifier
   * @returns {Object|null} Component instance or null if not found
   */
  getComponent(name) {
    return this.componentRegistry[name] || null;
  }

  /**
   * Unregister a component
   * @param {string} name - Component name/identifier
   */
  unregisterComponent(name) {
    delete this.componentRegistry[name];
    console.log(`StateService: Unregistered component "${name}"`);
  }

  /**
   * Get repeat type
   * @returns {string|null} Current repeat type or null if not set
   */
  getRepeat() {
    return this.getState("repeat.type");
  }

  /**
   * Get priority level
   * @returns {number|null} Current priority level or null if not set
   */
  getPriority() {
    try {
      return this.getState("taskForm.attributes.priority");
    } catch (error) {
      console.error("Error getting priority from state:", error);
      return null;
    }
  }

  /**
   * Debug utility to inspect current state
   * @param {string} section - Optional specific section to inspect
   */
  debugState(section = null) {
    if (section) {
      console.log(`State [${section}]:`, this.getState(section));
    } else {
      console.log("Full State:", this.getState());
    }
  }
}

// Create and export singleton instance
export const stateService = StateService.getInstance();
