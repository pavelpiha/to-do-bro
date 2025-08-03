# Template Architecture Documentation

## Overview

The ToDoBro extension now uses a modular template architecture that separates view templates from the main popup.html file. This improves maintainability, reduces file size, and follows better separation of concerns.

## Architecture

### Before Refactoring

- All views were defined inline in `popup.html`
- Large, monolithic HTML file (~240 lines)
- Difficult to maintain and edit individual views
- No code reusability

### After Refactoring

- Views split into component-based architecture in `src/js/components/`
- Each component has its own folder with both logic (.js) and template (.html)
- Clean, minimal `popup.html` file (~10 lines)
- Dynamic template loading using fetch API
- Co-located files for better maintainability

## Template Files

### Component-Based Structure

```
src/js/components/
├── main-view/
│   ├── main-view.js        # Component logic
│   ├── main-view.html      # Template
│   └── main-view.css       # Component styles
├── task-form/
│   ├── task-form.js        # Component logic
│   ├── task-form.html      # Template (formerly add-task-view.html)
│   └── task-form.css       # Component styles
├── date-picker/
│   ├── date-picker.js      # Component logic
│   ├── date-picker.html    # Template (formerly date-picker-view.html)
│   └── date-picker.css     # Component styles
├── priority-popup/
│   ├── priority-popup.js   # Component logic
│   ├── priority-popup.html # Template
│   └── priority-popup.css  # Component styles
└── website-form/
    ├── website-form.js     # Component logic
    ├── website-form.html   # Template (formerly add-website-view.html)
    └── website-form.css    # Component styles
```

### Template Naming Convention

- Use kebab-case for template file names
- Template files contain only the view-specific HTML
- Each template includes its wrapper div with proper IDs and classes
- Templates are now co-located with their corresponding component logic

## Template Loader Utility

### Features

- **Template Caching**: Loaded templates are cached for performance
- **Async Loading**: Templates load asynchronously using fetch API
- **Error Handling**: Comprehensive error handling with fallbacks
- **Multiple Loading Methods**: Support for single template, multiple templates, and injection methods

### Usage Examples

```javascript
// Load a single template
const templateContent = await TemplateLoader.loadTemplate("main-view");

// Load multiple templates
const templates = await TemplateLoader.loadTemplates([
  "main-view",
  "add-task-view",
  "date-picker-view",
  "add-website-view",
  "priority-popup",
]);

// Templates are loaded from component folders:
// - main-view loads from src/js/components/main-view/main-view.html
// - add-task-view loads from src/js/components/task-form/task-form.html
// - date-picker-view loads from src/js/components/date-picker/date-picker.html
// - add-website-view loads from src/js/components/website-form/website-form.html
// - priority-popup loads from src/js/components/priority-popup/priority-popup.html
```

## ViewManager Integration

The ViewManager now handles template loading:

### Updated Responsibilities

1. **Template Loading**: Loads all templates on initialization
2. **View Management**: Manages view visibility and navigation
3. **Event Handling**: Handles view-specific event setup
4. **Internationalization**: Re-applies i18n after template loading

### Loading Process

1. Templates loaded once during app initialization
2. All templates injected into DOM body
3. ViewManager manages visibility using CSS classes
4. Components set up event listeners after templates load

## Benefits

### Maintainability

- **Separation of Concerns**: Each component has its own folder with both logic and template
- **Co-located Files**: Related files are kept together for easier maintenance
- **Better Organization**: Clear component boundaries and self-contained features
- **Easier Editing**: Modify component logic and template in the same location

### Performance

- **Template Caching**: Loaded once, reused multiple times
- **Async Loading**: Non-blocking template loading
- **Reduced Bundle Size**: Main HTML file is significantly smaller

### Developer Experience

- **Better Code Navigation**: Jump directly to component folder with both logic and template
- **Simplified Debugging**: Easier to isolate component-specific issues
- **Component Encapsulation**: Self-contained components with clear boundaries
- **Consistent Structure**: All components follow the same folder/file pattern

## Implementation Guidelines

### Creating New Components

1. Create new folder in `src/js/components/` directory
2. Use kebab-case naming convention for folder and files
3. Create three files with same base name:
   - `.js` (component logic)
   - `.html` (template)
   - `.css` (component styles)
4. Include wrapper div with proper ID and classes in template
5. Add template path mapping in `template-loader.js`
6. Update component imports in `todo-app.js`
7. Import the CSS file in `src/css/main.css` (use relative path)

### CSS File Organization

- Each component has its own CSS file in the component folder
- Import all component CSS files in `src/css/main.css`
- Use relative paths: `@import url("../js/components/component-name/component-name.css");`
- Only `base.css` and `main.css` remain in `src/css/` directory

### When to Create Separate Components

**Always create a separate component when:**

- The feature has its own UI elements (popup, modal, form section)
- The functionality is reusable across different parts of the app
- The code would exceed ~50 lines in the parent component
- The feature has its own state management
- The feature requires its own CSS styling

**Examples of separate components:**

- ✅ Priority popup (has UI, reusable, own state)
- ✅ Date picker (complex UI, reusable)
- ✅ Task form (main feature, lots of logic)
- ❌ Simple button click handlers (too simple)
- ❌ Inline validation messages (part of parent form)

### Component Template Structure

```html
<!-- Component template should include wrapper div -->
<div id="componentNameView" class="to-do-bro__view">
  <!-- Component content here -->
</div>
```

### Popup/Overlay Components

For popup or overlay components (like priority-popup, date-picker), the template structure is simpler:

```html
<!-- Popup components don't need view wrapper -->
<div class="popup-name" id="popupId" style="display: none;">
  <!-- Popup content here -->
</div>
```

**Key differences for popup components:**

- No `to-do-bro__view` class (they're not full views)
- Include `style="display: none;"` by default
- Use semantic class names for the popup type
- Should be positioned using CSS (`position: absolute` or `fixed`)

### Component JavaScript Structure

```javascript
/**
 * Component Name - Component description
 */
import { ServiceName } from "../../services/service-name.js";

export class ComponentNameComponent {
  constructor(viewManager) {
    this.viewManager = viewManager;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Component-specific event listeners
  }
}
```

### Event Listener Setup

- Set up event listeners after templates are loaded
- Use `viewChanged` event to reinitialize listeners
- Handle async nature of template loading in components

## Migration Notes

### Component-Based Architecture Benefits

- Co-located component files (logic + template in same folder)
- Clear component boundaries and responsibilities
- Easier maintenance and development workflow
- Self-contained features with minimal dependencies

### Changes Made

- Moved templates from `src/templates/` to component folders
- Updated template loader to use component-specific paths
- Maintained backward compatibility with template naming
- No changes to CSS classes or IDs
- Component JavaScript updated with correct import paths

### Testing Considerations

- Test component loading in different environments
- Verify event listeners work after dynamic template loading
- Check internationalization still functions properly
- Ensure component isolation and proper encapsulation

## Future Improvements

### Potential Enhancements

- ✅ **CSS Co-location**: Component-specific CSS files are now co-located in component folders
- **Component Hot Reloading**: Development mode with component hot reloading
- **Component Validation**: Validate component structure and required elements
- **Lazy Loading**: Load components only when needed
- **Component Composition**: Support for component inheritance and composition
- **TypeScript Support**: Add TypeScript for better component type safety

### Completed Improvements

- ✅ **CSS Co-location**: All component CSS files moved to respective component folders
- ✅ **Component Structure**: Each component folder contains `.js`, `.html`, and `.css` files
- ✅ **Centralized CSS Import**: All component styles imported through `main.css` with relative paths
