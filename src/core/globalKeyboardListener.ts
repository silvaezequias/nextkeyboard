import { Key } from "./key";

export class GlobalKeyboardListener {
  private onKeydownCallback?: (event: KeyboardEvent, key: Key) => void;
  private onKeyupCallback?: (event: KeyboardEvent, key: Key) => void;
  private pressedKeys: Set<Key> = new Set();

  constructor() {
    this.initListeners();
  }

  private _getWindow(): Window {
    if (typeof window === "undefined") {
      throw new Error(
        "The 'nextkeyboard' library can only be used in a browser environment. Ensure your Next.js component is client-side by adding 'use client' at the top of your file."
      );
    }
    return window;
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    const { key, code } = event;
    const currentKey = new Key({ key, code });

    if (!this.pressedKeys.has(currentKey)) {
      this.pressedKeys.add(currentKey);
      this.onKeydownCallback?.(event, currentKey);
    }
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    const { key, code } = event;
    const currentKey = new Key({ key, code });

    if (this.pressedKeys.has(currentKey)) {
      this.pressedKeys.delete(currentKey);
      this.onKeyupCallback?.(event, currentKey);
    }
  };

  private initListeners() {
    const win = this._getWindow();
    win.addEventListener("keydown", this.handleKeyDown);
    win.addEventListener("keyup", this.handleKeyUp);
  }

  private destroyListeners() {
    const win = this._getWindow();
    win.removeEventListener("keydown", this.handleKeyDown);
    win.removeEventListener("keyup", this.handleKeyUp);
  }

  resetListeners() {
    this.destroyListeners();
    this.initListeners();
  }

  onKeydown(callback: (event: KeyboardEvent, key: Key) => void) {
    this.onKeydownCallback = callback;
  }

  onKeyup(callback: (event: KeyboardEvent, key: Key) => void) {
    this.onKeyupCallback = callback;
  }

  isKeyPressed(key: Key): boolean {
    return this.pressedKeys.has(key);
  }

  cleanup() {
    this.destroyListeners();
    this.pressedKeys.clear();
  }
}
