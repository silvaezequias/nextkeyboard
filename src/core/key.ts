import { C } from "@/keyboard";

export class Key {
  public key: string;
  public code: string;
  private onPressCallback?: (event: KeyboardEvent, key: Key) => void;
  private onReleaseCallback?: (event: KeyboardEvent, key: Key) => void;
  private isPressed: boolean = false;
  private stateChangeListener?: (state: boolean) => void;
  private previousState: boolean = false;

  constructor({ key, code }: { key: string; code: string }) {
    this.key = key;
    this.code = code;
    this.initListeners();
    this.previousState = this.getState();
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
    if (
      (event.key === this.key || event.code === this.code) &&
      !this.isPressed
    ) {
      this.isPressed = true;
      this.onPressCallback?.(event, this);
    }
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === this.key || event.code === this.code) {
      this.isPressed = false;
      this.onReleaseCallback?.(event, this);
    }
  };

  private initListeners() {
    const win = this._getWindow();
    win.addEventListener("keydown", this.handleKeyDown);
    win.addEventListener("keyup", this.handleKeyUp);
    this.initStateChangeListener();
  }

  private destroyListeners() {
    const win = this._getWindow();
    win.removeEventListener("keydown", this.handleKeyDown);
    win.removeEventListener("keyup", this.handleKeyUp);
    this.destroyStateChangeListener();
  }

  resetListeners() {
    this.destroyListeners();
    this.initListeners();
  }

  onPress(callback: (event: KeyboardEvent, key: Key) => void) {
    this.onPressCallback = callback;
  }

  onRelease(callback: (event: KeyboardEvent, key: Key) => void) {
    this.onReleaseCallback = callback;
  }

  isKeyPressed(): boolean {
    return this.isPressed;
  }

  getState(): boolean {
    const event = new KeyboardEvent("keydown");

    return event.getModifierState(this.key);
  }

  onStateChange(callback: (state: boolean) => void) {
    this.stateChangeListener = callback;
  }

  private initStateChangeListener() {
    const win = this._getWindow();
    const checkState = () => {
      const currentState = this.getState();
      if (currentState !== this.previousState) {
        this.previousState = currentState;
        this.stateChangeListener?.(currentState);
      }
    };
    win.addEventListener("keydown", checkState);
    win.addEventListener("keyup", checkState);
  }

  private destroyStateChangeListener() {
    const win = this._getWindow();
    win.removeEventListener("keydown", () => {});
    win.removeEventListener("keyup", () => {});
  }
}
