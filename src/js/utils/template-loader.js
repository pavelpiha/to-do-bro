/**
 * Template Loader Utility - Loads HTML templates dynamically
 * @module TemplateLoader
 */

/**
 * Template loader for managing HTML view templates
 * @namespace TemplateLoader
 */
export const TemplateLoader = {
  /**
   * Cache for loaded templates
   * @private
   */
  _templateCache: new Map(),

  /**
   * Load a template from the component directories
   * @param {string} templateName - The name of the template (e.g., 'main-view', 'task-form', etc.)
   * @returns {Promise<string>} - The HTML content of the template
   */
  async loadTemplate(templateName) {
    // Check cache first
    if (this._templateCache.has(templateName)) {
      return this._templateCache.get(templateName);
    }

    try {
      // Map template names to their component paths
      const templatePaths = {
        "main-view": "src/js/components/main-view/main-view.html",
        "add-task-view": "src/js/components/task-form/task-form.html",
        "date-picker-view": "src/js/components/date-picker/date-picker.html",
        "add-website-view": "src/js/components/website-form/website-form.html",
        "priority-popup":
          "src/js/components/priority-popup/priority-popup.html",
        "time-picker": "src/js/components/time-picker/time-picker.html",
        "repeat-dropdown":
          "src/js/components/repeat-dropdown/repeat-dropdown.html",
      };

      const templatePath = templatePaths[templateName];
      if (!templatePath) {
        throw new Error(`Unknown template: ${templateName}`);
      }

      const response = await fetch(templatePath);

      if (!response.ok) {
        throw new Error(
          `Failed to load template: ${templateName} (${response.status})`
        );
      }

      const templateContent = await response.text();

      // Cache the template
      this._templateCache.set(templateName, templateContent);

      return templateContent;
    } catch (error) {
      console.error(`Error loading template "${templateName}":`, error);
      throw error;
    }
  },

  /**
   * Load multiple templates at once
   * @param {string[]} templateNames - Array of template names to load
   * @returns {Promise<Object>} - Object with template names as keys and HTML content as values
   */
  async loadTemplates(templateNames) {
    try {
      const templatePromises = templateNames.map((name) =>
        this.loadTemplate(name).then((content) => ({ name, content }))
      );

      const templates = await Promise.all(templatePromises);

      return templates.reduce((acc, { name, content }) => {
        acc[name] = content;
        return acc;
      }, {});
    } catch (error) {
      console.error("Error loading multiple templates:", error);
      throw error;
    }
  },

  /**
   * Inject a template into a container element
   * @param {string} templateName - The name of the template to inject
   * @param {HTMLElement|string} container - The container element or selector
   * @returns {Promise<HTMLElement>} - The injected template element
   */
  async injectTemplate(templateName, container) {
    try {
      const templateContent = await this.loadTemplate(templateName);

      const containerElement =
        typeof container === "string"
          ? document.querySelector(container)
          : container;

      if (!containerElement) {
        throw new Error(`Container not found: ${container}`);
      }

      // Create a temporary div to parse the HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = templateContent;

      // Get the first child (the actual template element)
      const templateElement = tempDiv.firstElementChild;

      if (!templateElement) {
        throw new Error(`No template element found in: ${templateName}`);
      }

      // Append to container
      containerElement.appendChild(templateElement);

      return templateElement;
    } catch (error) {
      console.error(`Error injecting template "${templateName}":`, error);
      throw error;
    }
  },

  /**
   * Replace container content with template
   * @param {string} templateName - The name of the template to inject
   * @param {HTMLElement|string} container - The container element or selector
   * @returns {Promise<HTMLElement>} - The replaced template element
   */
  async replaceWithTemplate(templateName, container) {
    try {
      const containerElement =
        typeof container === "string"
          ? document.querySelector(container)
          : container;

      if (!containerElement) {
        throw new Error(`Container not found: ${container}`);
      }

      // Clear container
      containerElement.innerHTML = "";

      // Inject template
      return await this.injectTemplate(templateName, containerElement);
    } catch (error) {
      console.error(`Error replacing with template "${templateName}":`, error);
      throw error;
    }
  },

  /**
   * Clear template cache
   */
  clearCache() {
    this._templateCache.clear();
  },

  /**
   * Pre-load templates for better performance
   * @param {string[]} templateNames - Array of template names to preload
   * @returns {Promise<void>}
   */
  async preloadTemplates(templateNames) {
    try {
      await this.loadTemplates(templateNames);
      console.log(`Preloaded ${templateNames.length} templates`);
    } catch (error) {
      console.error("Error preloading templates:", error);
    }
  },
};
