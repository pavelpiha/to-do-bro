# Copilot Instructions for ToDoBro Chrome Extension

## Project Overview

This is a Chrome extension project using Manifest V3, **React 18.3.1**, and modern CSS. The extension provides a to-do list functionality with internationalization support for 20+ languages.

**✅ Successfully migrated from vanilla JavaScript to React 18.3.1**

## Code Architecture & Structure

### File Organization

- Keep each component in a separate file
- Use React JSX components for UI elements
- Organize files by functionality (components, hooks, services, utils)
- Maintain clear separation between CSS files by component

### Directory Structure Rules

```
src/
├── components/         # React components (.jsx files)
│   ├── MainView.jsx   # Main todo list view component
│   ├── TaskForm.jsx   # Task creation form component
│   ├── WebsiteForm.jsx # Website task form component
│   ├── DatePicker.jsx # Date selection component
│   └── PriorityPopup.jsx # Priority selection popup component
├── hooks/             # Custom React hooks
│   ├── useI18n.js     # Internationalization hook
│   ├── useStorageService.js # Chrome storage integration hook
│   └── useTabService.js # Chrome tabs API hook
├── styles/            # CSS modules (one per component)
│   ├── base.css       # Base styles and CSS variables
│   ├── main.css       # Main CSS imports
│   ├── main-view.css  # Main view styles
│   ├── task-form.css  # Task form styles
│   ├── website-form.css # Website form styles
│   ├── date-picker.css # Date picker styles
│   └── priority-popup.css # Priority popup styles
├── App.jsx            # Main React application component
└── main.jsx           # React entry point
```

**Key principles:**

- React components use .jsx extension
- Custom hooks for Chrome API integrations
- CSS modules organized by component
- Import all component CSS in src/styles/main.css
- Use kebab-case for CSS file names, PascalCase for React components

## JavaScript Coding Standards

### React Components

- Use functional components with hooks (React 18.3.1)
- Use ES6 import/export syntax
- Use named exports for utilities and services
- Use default exports for React components
- Import only what you need

```javascript
// ✅ Good - React functional component
import React, { useState, useEffect } from 'react';
import { useI18n } from '../hooks/useI18n';
import { useStorageService } from '../hooks/useStorageService';

const TaskForm = ({ onSubmit, onCancel }) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({});

  return <div className='task-form'>{/* Component JSX */}</div>;
};

export default TaskForm;
```

### Custom Hooks

- Create custom hooks for Chrome API integrations
- Use React hooks (useState, useEffect, useCallback) appropriately
- Follow React hooks rules (only call at top level)
- Provide consistent return patterns

```javascript
// ✅ Good - Custom hook for Chrome storage
import { useCallback } from 'react';

export const useStorageService = () => {
  const saveTodos = useCallback(async todos => {
    try {
      if (!chrome.storage?.local) {
        throw new Error('Chrome storage API not available');
      }
      await chrome.storage.local.set({ todos });
      return { success: true };
    } catch (error) {
      console.error('Error saving todos:', error);
      return { success: false, error: error.message };
    }
  }, []);

  return { saveTodos, loadTodos, saveSettings, loadSettings };
};
```

### Error Handling

- Always use try-catch blocks for async operations
- Log errors appropriately for debugging
- Provide user-friendly error messages
- Never let errors crash the extension
- Handle React component errors gracefully

```javascript
// ✅ Good - Error handling in React hooks
const { storageService } = useStorageService();

const handleSubmit = async taskData => {
  try {
    const result = await storageService.saveTodos(todos);
    if (result.success) {
      // Handle success
    } else {
      // Handle error gracefully
      console.error('Save failed:', result.error);
    }
  } catch (error) {
    console.error('Operation failed:', error);
    // Handle error gracefully without crashing
  }
};
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
    console.error('Storage operation failed:', error);
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

### Using i18n in Code

- Always use the useI18n hook for text content
- Never hardcode user-facing strings
- Provide fallback text for missing translations

```javascript
// ✅ Good - React component with i18n
import { useI18n } from '../hooks/useI18n';

const TaskForm = () => {
  const { t } = useI18n();

  return (
    <input
      placeholder={t('taskForm_placeholder')}
      aria-label={t('taskForm_inputLabel')}
    />
  );
};

// ❌ Avoid
const placeholder = 'Enter your task...';
```

## Component Development

### Component Responsibilities

- Each component should have a single responsibility
- Components should be loosely coupled
- Use props for data flow and event handlers
- Implement proper React patterns (hooks, state management)
- Use custom hooks for Chrome API integrations

### When to Create Separate Components

**ALWAYS create a separate component for:**

- Features with their own UI elements (popups, modals, forms)
- Reusable functionality across different parts of the app
- Features that would add >50 lines to the parent component
- Features with their own state management
- Features requiring dedicated CSS styling

**Component Creation Checklist:**

1. Create new `.jsx` file in `src/components/`
2. Create corresponding CSS file in `src/styles/`
3. Add CSS import to `src/styles/main.css`
4. Use React functional component with hooks
5. Implement proper prop types and error boundaries
6. Update imports in parent components

**❌ DON'T put everything in existing components** - this violates separation of concerns

### Component File Structure

```
src/
├── components/
│   ├── ComponentName.jsx    # React component
├── styles/
│   └── component-name.css   # Component styles
```

## Performance Guidelines

### React Performance

- Use React.memo() for components that don't need frequent re-renders
- Use useCallback and useMemo appropriately to prevent unnecessary re-renders
- Avoid creating objects/functions in render methods
- Use React DevTools to identify performance bottlenecks

### DOM Manipulation

- Let React handle DOM updates (avoid direct DOM manipulation)
- Use React refs (useRef) only when necessary
- Batch state updates to avoid multiple re-renders

### Memory Management

- Use useEffect cleanup functions for subscriptions and timers
- Avoid memory leaks in closures and event listeners
- Clean up resources in component unmount

```javascript
// ✅ Good - Proper cleanup in React
const MyComponent = () => {
  useEffect(() => {
    const timer = setInterval(() => {
      // Some periodic task
    }, 1000);

    // Cleanup function
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <div>Component content</div>;
};
```

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
- Remove console.log statements in production builds

```javascript
// Development logging in React components
const TaskForm = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    console.log('TaskForm: Component mounted with', {
      taskCount: tasks.length,
    });
  }, []);

  const handleSubmit = taskData => {
    try {
      // Process task
      console.log('TaskForm: Task submitted', taskData);
    } catch (error) {
      console.error('TaskForm: Failed to submit task', error);
    }
  };
};
```

### Error Boundaries

- Implement React error boundaries for graceful error handling
- Provide fallback UI for failed components
- Log errors for debugging while maintaining UX

```javascript
// ✅ Good - React Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please try again.</div>;
    }

    return this.props.children;
  }
}
```

## Documentation Standards

### JSDoc Comments

- Document all React components and custom hooks
- Include parameter types and descriptions for props
- Document return values and hook behaviors

```javascript
/**
 * Task creation form component
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Callback when task is submitted
 * @param {Function} props.onCancel - Callback when form is cancelled
 * @returns {JSX.Element} The task form component
 */
const TaskForm = ({ onSubmit, onCancel }) => {
  // Component implementation
};

/**
 * Custom hook for Chrome storage operations
 * @returns {Object} Storage service methods
 * @returns {Function} returns.saveTodos - Save todos to Chrome storage
 * @returns {Function} returns.loadTodos - Load todos from Chrome storage
 */
export const useStorageService = () => {
  // Hook implementation
};
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

- [ ] All components are React functional components with hooks
- [ ] BEM naming convention is used consistently in CSS
- [ ] All user-facing text uses the useI18n hook
- [ ] Error handling is implemented in components and hooks
- [ ] JSDoc comments are complete for components and hooks
- [ ] No console.log statements in production code
- [ ] React hooks rules are followed (no conditional calls)
- [ ] CSS follows the established patterns
- [ ] Chrome extension APIs are used correctly in custom hooks
- [ ] Code follows React and extension best practices

## Common Mistakes to Avoid

### ❌ Architecture Mistakes

**Don't embed complex UI in existing components:**

```javascript
// ❌ Wrong - Adding popup JSX directly to task form
const TaskForm = () => {
  return (
    <div className='task-form'>
      {/* task form content */}
      <div className='priority-popup'>...</div> {/* This should be separate */}
    </div>
  );
};
```

```javascript
// ✅ Correct - Create separate component
// src/components/PriorityPopup.jsx
const PriorityPopup = ({ onSelect, onClose }) => {
  // Popup logic and JSX
};

// src/components/TaskForm.jsx
const TaskForm = () => {
  const [showPriorityPopup, setShowPriorityPopup] = useState(false);

  return (
    <div className='task-form'>
      {/* task form content */}
      {showPriorityPopup && (
        <PriorityPopup
          onSelect={handlePrioritySelect}
          onClose={() => setShowPriorityPopup(false)}
        />
      )}
    </div>
  );
};
```

**Don't put all logic in one component:**

```javascript
// ❌ Wrong - Handling popup logic in task form
const TaskForm = () => {
  const [showPriorityPopup, setShowPriorityPopup] = useState(false);

  const togglePriorityPopup = () => {
    /* popup logic */
  };
  const showPriorityPopup = () => {
    /* popup logic */
  };
  const selectPriority = () => {
    /* popup logic */
  };
  // ... lots of popup code mixed with form code
};
```

```javascript
// ✅ Correct - Separate components with clear responsibilities
const TaskForm = () => {
  // Only form-related logic
  const [formData, setFormData] = useState({});

  return (
    <div className='task-form'>
      <PriorityPopup onSelect={handlePrioritySelect} />
    </div>
  );
};

const PriorityPopup = ({ onSelect }) => {
  // All popup logic here
  const [selectedPriority, setSelectedPriority] = useState(null);
  // popup-specific methods
};
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

- Follow established React patterns and conventions
- **Create separate React components for UI features** - don't embed everything in existing components
- Create new `.jsx` components in `src/components/`
- Add corresponding CSS files in `src/styles/`
- Import CSS in `src/styles/main.css`
- Update i18n files for new user-facing text (use dynamic values, not multiple similar keys)
- Use custom hooks for Chrome API integrations
- Consider performance impact of new features

### Feature Implementation Best Practices

**✅ DO:**

- Create separate React components for popup/modal features
- Use single i18n keys with dynamic values
- Follow the established React component structure
- Create dedicated CSS files for new components
- Use React hooks (useState, useEffect, useCallback) appropriately
- Implement proper prop passing and event handling

**❌ DON'T:**

- Add complex UI logic directly to existing React components
- Create multiple similar i18n keys (priority1, priority2, etc.)
- Put all CSS in existing component files
- Use direct DOM manipulation instead of React patterns
- Violate React hooks rules (conditional calls, etc.)

### Dependencies

- Keep React and related dependencies up to date
- Avoid adding external dependencies when possible
- Use native browser APIs over polyfills
- Keep the extension lightweight and fast
- Document any new dependencies and their purpose
