import { Key } from "./key";
import { SomeOfKeys } from "./someOfKeys";

type HotkeyItem = Key | SomeOfKeys;

export class Hotkeys {
  private items: HotkeyItem[];
  private onPressCallback?: (event: KeyboardEvent, keysInOrder: Key[]) => void;
  private onReleaseCallback?: (
    event: KeyboardEvent,
    keysInOrder: Key[]
  ) => void;
  private onLongPressCallback?: (
    event: KeyboardEvent,
    keysInOrder: Key[]
  ) => void;
  private pressedKeys: Key[] = [];
  private longPressTimer: NodeJS.Timeout | null = null;
  private longPressDuration: number = 500;

  constructor(items: HotkeyItem[]) {
    this.items = items;
    this.initListeners();
  }

  private handleKeyDown = (event: KeyboardEvent, key?: Key) => {
    if (key && !this.pressedKeys.includes(key)) {
      this.pressedKeys.push(key);
    }

    if (this.areAllConditionsMet()) {
      if (!this.longPressTimer) {
        this.longPressTimer = setTimeout(() => {
          this.onLongPressCallback?.(event, [...this.pressedKeys]);
        }, this.longPressDuration);
      }
      this.onPressCallback?.(event, [...this.pressedKeys]);
    }
  };

  private handleKeyUp = (event: KeyboardEvent, key?: Key) => {
    if (key) {
      this.pressedKeys = this.pressedKeys.filter(
        (pressedKey) => pressedKey !== key
      );
    }

    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    if (!this.areAllConditionsMet()) {
      this.onReleaseCallback?.(event, [...this.pressedKeys]);
    }
  };

  private initListeners() {
    this.items.forEach((item) => {
      if (item instanceof Key) {
        item.onPress((event, key) => this.handleKeyDown(event, key));
        item.onRelease((event, key) => this.handleKeyUp(event, key));
      } else if (item instanceof SomeOfKeys) {
        item.onPress((event, key) => this.handleKeyDown(event, key));
        item.onRelease((event, key) => this.handleKeyUp(event, key));
      }
    });
  }

  resetListeners() {
    this.items.forEach((item) => {
      if (item instanceof Key) {
        item.resetListeners();
      } else if (item instanceof SomeOfKeys) {
        item.resetListeners();
      }
    });
    this.initListeners();
  }

  onPress(callback: (event: KeyboardEvent, keysInOrder: Key[]) => void) {
    this.onPressCallback = callback;
  }

  onRelease(callback: (event: KeyboardEvent, keysInOrder: Key[]) => void) {
    this.onReleaseCallback = callback;
  }

  onLongPress(
    callback: (event: KeyboardEvent, keysInOrder: Key[]) => void,
    duration: number = 500
  ) {
    this.onLongPressCallback = callback;
    this.longPressDuration = duration;

    return {
      after: (afterCallback: () => void): this => {
        const wrappedCallback = this.onLongPressCallback;
        this.onLongPressCallback = (event, keysInOrder) => {
          wrappedCallback?.(event, keysInOrder);
          afterCallback();
        };
        return this;
      },
    };
  }

  private areAllConditionsMet(): boolean {
    return this.items.every((item) =>
      item instanceof Key ? item.isKeyPressed() : item.isPressed()
    );
  }

  cleanup() {
    this.items.forEach((item) => {
      if (item instanceof Key || item instanceof SomeOfKeys) {
        item.resetListeners();
      }
    });
  }
}
