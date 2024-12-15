import { Key } from "./key";
import { SomeOfKeys } from "./someOfKeys";

type HotkeyItem = Key | SomeOfKeys;

export class Hotkeys {
  private items: HotkeyItem[];
  private onPressCallback?: () => void;
  private onReleaseCallback?: () => void;

  constructor(items: HotkeyItem[]) {
    this.items = items;
    this.initListeners();
  }

  private handleKeyDown = () => {
    if (this.areAllConditionsMet()) {
      this.onPressCallback?.();
    }
  };

  private handleKeyUp = () => {
    if (!this.areAllConditionsMet()) {
      this.onReleaseCallback?.();
    }
  };

  private initListeners() {
    this.items.forEach((item) => {
      if (item instanceof Key) {
        item.onPress(() => this.handleKeyDown());
        item.onRelease(() => this.handleKeyUp());
      } else if (item instanceof SomeOfKeys) {
        item.onPress(() => this.handleKeyDown());
        item.onRelease(() => this.handleKeyUp());
      }
    });
  }

  private destroyListeners() {
    this.items.forEach((item) => {
      if (item instanceof Key) {
        item.resetListeners();
      } else if (item instanceof SomeOfKeys) {
        item.resetListeners();
      }
    });
  }

  resetListeners() {
    this.destroyListeners();
    this.initListeners();
  }

  onPress(callback: () => void) {
    this.onPressCallback = callback;
  }

  onRelease(callback: () => void) {
    this.onReleaseCallback = callback;
  }

  private areAllConditionsMet(): boolean {
    return this.items.every((item) =>
      item instanceof Key ? item.isKeyPressed() : item.isPressed()
    );
  }

  cleanup() {
    this.destroyListeners();
  }
}
