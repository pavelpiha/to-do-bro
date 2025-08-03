/**
 * Notification Service - Handles Chrome notifications
 */
export class NotificationService {
  static async show(title, message, iconUrl = "assets/icons/todobro_48.png") {
    try {
      const notification = await chrome.notifications.create({
        type: "basic",
        iconUrl,
        title,
        message,
      });
      return { success: true, notificationId: notification };
    } catch (error) {
      console.error("Error showing notification:", error);
      return { success: false, error };
    }
  }

  static async showTaskAdded(taskText) {
    return this.show("ToDoBro", `Task added: "${taskText}"`);
  }

  static async showWebsiteAdded(websiteTitle) {
    return this.show("ToDoBro", `Website added: "${websiteTitle}"`);
  }

  static async showError(message) {
    return this.show("ToDoBro - Error", message);
  }
}
