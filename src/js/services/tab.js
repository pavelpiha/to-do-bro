/**
 * Tab Service - Handles browser tab operations
 */
import { browserApi } from "../utils/browser-api.js";

export class TabService {
  static async getCurrentTab() {
    return new Promise((resolve) => {
      browserApi.getCurrentTab((tab) => {
        resolve(tab);
      });
    });
  }

  static async getCurrentUrl() {
    const tab = await this.getCurrentTab();
    return tab?.url || "";
  }

  static async getCurrentTitle() {
    const tab = await this.getCurrentTab();
    return tab?.title || "";
  }

  static async getCurrentTabInfo() {
    const tab = await this.getCurrentTab();
    return {
      url: tab?.url || "",
      title: tab?.title || "",
      id: tab?.id,
    };
  }
}
