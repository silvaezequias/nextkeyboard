import { Key } from "./key";
import { getWindow } from "./browser";

export class GlobalKeyboardListener {
  private onKeydownCallback?: (
    event: KeyboardEvent,
    key: Key,
    keysInOrder: Key[]
  ) => void;
  private onKeyupCallback?: (
    event: KeyboardEvent,
    key: Key,
    keysInOrder: Key[]
  ) => void;
  private onLongPressCallback?: (
    event: KeyboardEvent,
    key: Key,
    keysInOrder: Key[]
  ) => void;
  private afterLongPressCallback?: () => void;

  private pressedKeys: Set<string> = new Set();
  private keyOrder: Key[] = [];
  private longPressTimers: Map<string, NodeJS.Timeout> = new Map();
  private longPressDuration: number = 500;

  constructor() {
    this.initListeners();
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    const { key, code } = event;
    const currentKey = new Key({ key, code });

    if (!this.pressedKeys.has(currentKey.id)) {
      this.pressedKeys.add(currentKey.id);
      this.keyOrder.push(currentKey);

      if (!this.longPressTimers.has(currentKey.id)) {
        const timer = setTimeout(() => {
          this.onLongPressCallback?.(event, currentKey, [...this.keyOrder]);
          this.afterLongPressCallback?.();
          this.longPressTimers.delete(currentKey.id);
        }, this.longPressDuration);
        this.longPressTimers.set(currentKey.id, timer);
      }

      this.onKeydownCallback?.(event, currentKey, [...this.keyOrder]);
    }
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    const { key, code } = event;
    const currentKey = new Key({ key, code });

    if (this.pressedKeys.has(currentKey.id)) {
      this.pressedKeys.delete(currentKey.id);
      this.keyOrder = this.keyOrder.filter((k) => k.id !== currentKey.id);

      if (this.longPressTimers.has(currentKey.id)) {
        clearTimeout(this.longPressTimers.get(currentKey.id)!);
        this.longPressTimers.delete(currentKey.id);
      }

      this.onKeyupCallback?.(event, currentKey, [...this.keyOrder]);
    }
  };

  private initListeners() {
    const win = getWindow();

    if (win) {
      win.addEventListener("keydown", this.handleKeyDown);
      win.addEventListener("keyup", this.handleKeyUp);
    }
  }

  private destroyListeners() {
    const win = getWindow();

    if (win) {
      win.removeEventListener("keydown", this.handleKeyDown);
      win.removeEventListener("keyup", this.handleKeyUp);
    }
  }

  resetListeners() {
    this.destroyListeners();
    this.initListeners();
  }

  onKeydown(
    callback: (event: KeyboardEvent, key: Key, keysInOrder: Key[]) => void
  ) {
    this.onKeydownCallback = callback;
  }

  onKeyup(
    callback: (event: KeyboardEvent, key: Key, keysInOrder: Key[]) => void
  ) {
    this.onKeyupCallback = callback;
  }

  onLongPress(
    callback: (event: KeyboardEvent, key: Key, keysInOrder: Key[]) => void,
    duration: number = 500
  ) {
    this.onLongPressCallback = callback;
    this.longPressDuration = duration;
    return {
      after: (afterCallback: () => void): this => {
        this.afterLongPressCallback = afterCallback;
        return this;
      },
    };
  }

  isKeyPressed(key: Key): boolean {
    return this.pressedKeys.has(key.id);
  }

  cleanup() {
    this.destroyListeners();
    this.pressedKeys.clear();
    this.keyOrder = [];
    this.longPressTimers.forEach((timer) => clearTimeout(timer));
    this.longPressTimers.clear();
  }
}
