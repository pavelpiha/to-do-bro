# ToDoBro Extension - Project Structure

This document explains the organized file structure of the ToDoBro Chrome Extension.

## 📁 Project Structure

```
to-do-bro/
├── 📄 manifest.json              # Extension manifest (Manifest V3)
├── 📄 popup.html                 # Main popup HTML (minimal, loads templates)
├── 📄 background.js             # Background service worker
├── 📄 README.md                 # Main project documentation
├── 📄 .gitignore               # Git ignore rules
├── 📄 LICENSE                  # Apache 2.0 License
│
├── 📁 src/                      # Source code (organized)
│   ├── 📁 css/                  # Stylesheets (modular)
│   │   ├── 📄 main.css         # Main CSS file (imports all modules)
│   │   ├── 📄 base.css         # Base styles & typography
│   │   ├── 📄 main-menu.css    # Main menu styling
│   │   ├── 📄 task-form.css    # Task creation form styles
│   │   ├── 📄 date-picker.css  # Date picker component styles
│   │   └── 📄 website-form.css # Website form styles
│   │
│   └── 📁 js/                   # JavaScript (modular architecture)
│       ├── 📄 popup.js         # Main entry point
│       │
│       ├── 📁 components/       # UI Components (each with its own folder)
│       │   ├── 📄 todo-app.js          # Main app orchestrator
│       │   ├── 📄 view-manager.js      # View navigation & template loading
│       │   │
│       │   ├── 📁 main-view/           # Main menu component
│       │   │   ├── 📄 main-view.js     # Main view logic
│       │   │   └── 📄 main-view.html   # Main view template
│       │   │
│       │   ├── 📁 task-form/           # Task creation component
│       │   │   ├── 📄 task-form.js     # Task form logic
│       │   │   └── 📄 task-form.html   # Task form template
│       │   │
│       │   ├── 📁 date-picker/         # Date picker component
│       │   │   ├── 📄 date-picker.js   # Date picker logic
│       │   │   └── 📄 date-picker.html # Date picker template
│       │   │
│       │   └── 📁 website-form/        # Website form component
│       │       ├── 📄 website-form.js  # Website form logic
│       │       └── 📄 website-form.html# Website form template
│       │
│       ├── 📁 services/         # Business Logic Services
│       │   ├── 📄 storage.js           # Data persistence service
│       │   ├── 📄 notification.js     # Chrome notifications
│       │   └── 📄 tab.js              # Browser tab operations
│       │
│       └── 📁 utils/            # Utilities & Helpers
│           ├── 📄 browser-api.js       # Chrome API wrapper
│           ├── 📄 i18n.js             # Internationalization utils
│           └── 📄 template-loader.js   # Dynamic template loading
│
├── 📁 assets/                   # Static Assets
│   └── 📁 icons/               # Extension icons
│       ├── 📄 todobro_16.png   # 16x16 icon
│       ├── 📄 todobro_48.png   # 48x48 icon
│       ├── 📄 todobro_128.png  # 128x128 icon
│       ├── 📄 todobro_256.png  # 256x256 icon
│       └── 📄 todobro_512.png  # 512x512 icon
│
├── 📁 _locales/                # Internationalization (20+ languages)
│   ├── 📁 en/                  # English
│   ├── 📁 es/                  # Spanish
│   ├── 📁 fr/                  # French
│   ├── 📁 de/                  # German
│   └── 📄 ... (20+ languages)
│
└── 📁 legacy/                  # Legacy files (cleaned up)
    ├── 📄 browserApi.js        # Old browser API (moved to src/js/utils/)
    └── 📄 i18nUtils.js         # Old i18n utils (moved to src/js/utils/)
```

## 🏗️ Architecture Principles

### **Separation of Concerns**

- **HTML**: Pure structure, no inline styles
- **CSS**: Modular stylesheets by component
- **JavaScript**: Component-based architecture

### **Modular Design**

- **Components**: Reusable UI components
- **Services**: Business logic and external API calls
- **Utils**: Helper functions and utilities

### **Scalability**

- **ES6 Modules**: Import/export for dependency management
- **Single Responsibility**: Each file has one clear purpose
- **Clean Dependencies**: Clear service boundaries

## 📦 Component Breakdown

### **🎨 CSS Modules**

- `base.css` - Typography, layout, common elements
- `main-menu.css` - Main menu styling
- `task-form.css` - Task creation form
- `website-form.css` - Website task form

### **⚙️ JavaScript Components**

- `TodoApp` - Main application controller
- `ViewManager` - Handles navigation between views
- `TaskFormComponent` - Task creation functionality
- `WebsiteFormComponent` - Website task creation

### **🔧 Services**

- `StorageService` - Chrome storage operations
- `NotificationService` - Chrome notifications
- `TabService` - Browser tab operations

### **🛠️ Utilities**

- `browserApi` - Chrome extension API wrapper
- `i18nUtils` - Internationalization helpers

## 🚀 Development Benefits

### **Maintainability**

- Clear file organization
- Single-purpose modules
- Easy to locate and modify code

### **Scalability**

- Easy to add new features
- Component reusability
- Clean dependency management

### **Testing**

- Isolated components
- Mockable services
- Clear interfaces

### **Performance**

- Modular loading
- Tree-shaking friendly
- Clean separation of concerns

## 📝 Usage

### **Adding New Features**

1. Create component in `src/js/components/`
2. Add styles in `src/css/`
3. Import in main app
4. Update HTML structure if needed

### **Modifying Styles**

1. Edit specific CSS module
2. Changes automatically apply via `main.css`

### **Adding Services**

1. Create service in `src/js/services/`
2. Export class with static methods
3. Import in components that need it

## 🔄 Migration from Legacy

The project has been migrated to a modular structure:

- Legacy monolithic `popup.html` (with inline CSS) → modern `popup.html` (with external CSS)
- `popup.js` → `src/js/popup.js` + components
- `browserApi.js` → `src/js/utils/browser-api.js`
- `i18nUtils.js` → `src/js/utils/i18n.js`

All functionality is preserved while improving maintainability.
