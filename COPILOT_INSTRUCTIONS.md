# Copilot Instructions for ToDoBro Chrome Extension

## Project Overview

This is a Chrome extension project using Manifest V3, vanilla JavaScript (ES6 modules), and CSS. The extension provides a to-do list functionality with internationalization support for 20+ languages.

## Code Architecture & Structure

### File Organization

- Keep each component in a separate file
- Use ES6 modules for JavaScript files
- Organize files by functionality (components, services, utils)
- Maintain clear separation between CSS files by component

### Directory Structure Rules

```

```

src/
├── css/ # Global styles only
│ ├── main.css # Imports all component CSS
│ └── base.css # Base styles and variables
├── js/
│ ├── components/ # UI components (reusable)
│ │ ├── component-name/
│ │ │ ├── component-name.js # Component logic
│ │ │ ├── component-name.html # Component template
│ │ │ └── component-name.css # Component styles
│ │ └── popup-name/
│ │ ├── popup-name.js # Popup logic
│ │ ├── popup-name.html # Popup template
│ │ └── popup-name.css # Popup styles
│ ├── services/ # Business logic services
│ └── utils/ # Utility functions

```

**Key principles:**
- Each component folder contains .js, .html, and .css files
- Import all component CSS in src/css/main.css using relative paths
- Use kebab-case for all file and folder names
- Only global styles (base.css, main.css) remain in src/css/
```

**Key principles:**

- One component = one folder with .js and .html files
- One CSS file per component in src/css/
- Import all CSS files in main.css
- Use kebab-case for all file and folder names

## JavaScript Coding Standards

### ES6 Modules

- Always use ES6 import/export syntax
- Use named exports for utilities and services
- Use default exports for main component classes
- Import only what you need

```javascript
// ✅ Good
import { i18nUtils } from "../utils/i18n.js";
import { StorageService } from "../services/storage.js";

// ❌ Avoid
import * as utils from "../utils/index.js";
```

### Class Structure

- Use ES6 classes for components
- Include constructor with clear initialization
- Add comprehensive JSDoc comments
- Group methods logically (public methods first, private methods last)

```javascript
/**
 * Component description
 * @class ComponentName
 */
export class ComponentName {
  /**
   * @param {ViewManager} viewManager - The view manager instance
   */
  constructor(viewManager) {
    this.viewManager = viewManager;
    this.init();
  }

  /**
   * Initialize the component
   * @private
   */
  async init() {
    // Implementation
  }
}
```

### Error Handling

- Always use try-catch blocks for async operations
- Log errors appropriately for debugging
- Provide user-friendly error messages
- Never let errors crash the extension

```javascript
try {
  const result = await someAsyncOperation();
  return result;
} catch (error) {
  console.error("Operation failed:", error);
  // Handle error gracefully
}
```

### Chrome Extension APIs

- Use chrome.\* APIs appropriately for Manifest V3
- Always check for API availability before use
- Handle permissions gracefully
- Use async/await with chrome APIs that support promises

```javascript
// ✅ Good - Check availability and handle errors
if (chrome.storage?.local) {
  try {
    const data = await chrome.storage.local.get(key);
    return data;
  } catch (error) {
    console.error("Storage operation failed:", error);
  }
}
```

## CSS Coding Standards

### BEM Methodology

- Use Block Element Modifier (BEM) naming convention
- Keep CSS class names descriptive and semantic
- Avoid nesting more than 3 levels deep

```css
/* Block */
.todo-app {
}

/* Element */
.todo-app__header {
}
.todo-app__task-list {
}
.todo-app__task-item {
}

/* Modifier */
.todo-app__task-item--completed {
}
.todo-app__task-item--high-priority {
}

/* State classes (prefixed with 'is-' or 'has-') */
.todo-app__task-item.is-hidden {
}
.todo-app__form.has-error {
}
```

### CSS File Organization

- One CSS file per component
- Import all component styles in main.css
- Use CSS custom properties (variables) for consistent theming
- Group related properties together

```css
/* Component: Task Form */
.task-form {
  /* Layout */
  display: flex;
  flex-direction: column;

  /* Spacing */
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);

  /* Visual */
  background: var(--color-surface);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}
```

### CSS Custom Properties

- Define CSS variables in base.css
- Use semantic naming for colors and spacing
- Group variables by category

```css
:root {
  /* Colors */
  --color-primary: #007bff;
  --color-surface: #ffffff;
  --color-text: #333333;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;

  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
}
```

## Internationalization (i18n)

### Message Keys

- Use descriptive, hierarchical message keys
- Keep messages in English locale file as the source
- Update all locale files when adding new messages
- **AVOID creating multiple similar keys** - use dynamic concatenation instead

```json
// ✅ Good - Use single base message with dynamic values
{
  "priority": { "message": "Priority" },
  "status": { "message": "Status" }
}
// In code: `${i18nUtils.getMessage("priority")} ${priorityNumber}`

// ❌ Avoid - Don't create multiple similar keys
{
  "priority1": { "message": "Priority 1" },
  "priority2": { "message": "Priority 2" },
  "priority3": { "message": "Priority 3" },
  "priority4": { "message": "Priority 4" }
}
```

### Using i18n in Code

- Always use i18n utility functions for text content
- Never hardcode user-facing strings
- Provide fallback text for missing translations

```javascript
// ✅ Good
const placeholder = i18nUtils.getMessage("taskForm_placeholder");

// ❌ Avoid
const placeholder = "Enter your task...";
```

## Component Development

### Component Responsibilities

- Each component should have a single responsibility
- Components should be loosely coupled
- Use dependency injection for services
- Implement proper cleanup in components

### When to Create Separate Components

**ALWAYS create a separate component for:**

- Features with their own UI elements (popups, modals, forms)
- Reusable functionality across different parts of the app
- Features that would add >50 lines to the parent component
- Features with their own state management
- Features requiring dedicated CSS styling

**Component Creation Checklist:**

1. Create new folder in `src/js/components/component-name/`
2. Create `component-name.js` (logic) and `component-name.html` (template)
3. Create `component-name.css` in `src/css/` directory
4. Add CSS import to `src/css/main.css`
5. Add template mapping in `template-loader.js`
6. Update imports in parent components

**❌ DON'T put everything in existing components** - this violates separation of concerns

### Component File Structure

```
src/js/components/
├── component-name/
│   ├── component-name.js    # Component logic
│   └── component-name.html  # Component template
└── src/css/
    └── component-name.css   # Component styles
```

### Event Handling

- Use event delegation where appropriate
- Remove event listeners on component destruction
- Use descriptive event handler names

```javascript
class TaskComponent {
  constructor() {
    this.handleTaskClick = this.handleTaskClick.bind(this);
    this.handleTaskDelete = this.handleTaskDelete.bind(this);
  }

  attachEventListeners() {
    this.element.addEventListener("click", this.handleTaskClick);
    this.deleteButton.addEventListener("click", this.handleTaskDelete);
  }

  destroy() {
    this.element.removeEventListener("click", this.handleTaskClick);
    this.deleteButton.removeEventListener("click", this.handleTaskDelete);
  }
}
```

## Performance Guidelines

### DOM Manipulation

- Minimize DOM queries by caching elements
- Use DocumentFragment for multiple DOM insertions
- Batch DOM updates to avoid layout thrashing

### Memory Management

- Remove event listeners when components are destroyed
- Clear timers and intervals
- Avoid memory leaks in closures

### Chrome Extension Performance

- Use chrome.storage.local for data persistence
- Implement proper data caching strategies
- Minimize background script activity

## Security Guidelines

### Content Security Policy

- Follow CSP rules defined in manifest.json
- Avoid inline scripts and styles
- Use nonce or hash for any required inline content

### Data Handling

- Validate all user input
- Sanitize data before storing or displaying
- Use chrome.storage APIs for secure data persistence

## Testing & Debugging

### Console Logging

- Use descriptive log messages
- Include relevant context in logs
- Use different log levels appropriately

```javascript
// Development logging
console.log("TaskComponent initialized with", { taskCount, viewMode });
console.warn("Task validation failed:", validationErrors);
console.error("Failed to save task:", error);
```

### Error Boundaries

- Implement error handling at component level
- Provide graceful degradation for failures
- Log errors for debugging while maintaining UX

## Documentation Standards

### JSDoc Comments

- Document all public methods and classes
- Include parameter types and descriptions
- Document return values and exceptions

```javascript
/**
 * Creates a new task with the provided data
 * @param {Object} taskData - The task data object
 * @param {string} taskData.title - The task title
 * @param {Date} [taskData.dueDate] - Optional due date
 * @returns {Promise<Object>} The created task object
 * @throws {ValidationError} When task data is invalid
 */
async createTask(taskData) {
  // Implementation
}
```

### CSS Comments

- Comment complex CSS rules and calculations
- Explain browser-specific hacks or workarounds
- Document component states and variations

```css
/* Task item hover state - increases opacity and adds subtle shadow */
.todo-app__task-item:hover {
  opacity: 0.9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px); /* Subtle lift effect */
}
```

## Code Review Checklist

Before submitting code, ensure:

- [ ] All components are in separate files
- [ ] BEM naming convention is used consistently
- [ ] All user-facing text uses i18n
- [ ] Error handling is implemented
- [ ] JSDoc comments are complete
- [ ] No console.log statements in production code
- [ ] Event listeners are properly cleaned up
- [ ] CSS follows the established patterns
- [ ] Chrome extension APIs are used correctly
- [ ] Code follows the project's architectural patterns

## Common Mistakes to Avoid

### ❌ Architecture Mistakes

**Don't embed complex UI in existing components:**

```javascript
// ❌ Wrong - Adding popup HTML directly to task-form.html
<div class="task-form">
  <!-- task form content -->
  <div class="priority-popup">...</div> <!-- This should be separate -->
</div>
```

```javascript
// ✅ Correct - Create separate component
src/js/components/priority-popup/
├── priority-popup.js
├── priority-popup.html
└── (CSS in src/css/priority-popup.css)
```

**Don't put all logic in one component:**

```javascript
// ❌ Wrong - Handling popup logic in task form
class TaskFormComponent {
  togglePriorityPopup() {
    /* popup logic */
  }
  showPriorityPopup() {
    /* popup logic */
  }
  selectPriority() {
    /* popup logic */
  }
  // ... lots of popup code mixed with form code
}
```

```javascript
// ✅ Correct - Separate components
class TaskFormComponent {
  constructor() {
    this.priorityPopup = new PriorityPopupComponent(callback);
  }
}

class PriorityPopupComponent {
  // All popup logic here
}
```

### ❌ i18n Mistakes

**Don't create multiple similar keys:**

```json
// ❌ Wrong
{
  "priority1": { "message": "Priority 1" },
  "priority2": { "message": "Priority 2" },
  "priority3": { "message": "Priority 3" },
  "priority4": { "message": "Priority 4" }
}
```

```json
// ✅ Correct
{
  "priority": { "message": "Priority" }
}
// Use: `${i18nUtils.getMessage("priority")} ${number}`
```

### ❌ CSS Organization Mistakes

**Don't put component CSS in wrong files:**

```css
/* ❌ Wrong - Priority popup styles in task-form.css */
.task-form {
}
.priority-popup {
} /* This belongs in priority-popup.css */
```

```css
/* ✅ Correct - Separate CSS files */
/* task-form.css */
.task-form {
}

/* priority-popup.css */
.priority-popup {
}
```

## Maintenance Guidelines

### Refactoring

- Keep refactoring changes small and focused
- Maintain backward compatibility when possible
- Update documentation when changing APIs
- Test thoroughly after refactoring

### Adding New Features

- Follow established patterns and conventions
- **Create separate components for UI features** - don't embed everything in existing components
- Create new components in appropriate directories
- Add corresponding CSS files for new components
- Import CSS in main.css
- Update i18n files for new user-facing text (use dynamic values, not multiple similar keys)
- Add template mappings in template-loader.js
- Consider performance impact of new features

### Feature Implementation Best Practices

**✅ DO:**

- Create separate component folders for popup/modal features
- Use single i18n keys with dynamic values
- Follow the established component structure
- Create dedicated CSS files for new components
- Use proper event delegation and cleanup

**❌ DON'T:**

- Add complex UI logic directly to existing components
- Create multiple similar i18n keys (priority1, priority2, etc.)
- Put all CSS in existing component files
- Hardcode UI elements in JavaScript files
- Skip template loader configuration

### Dependencies

- Avoid adding external dependencies when possible
- Use native browser APIs over polyfills
- Keep the extension lightweight and fast
- Document any new dependencies and their purpose
