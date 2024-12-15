type TKey = { key: string };
type TCode = { code: string };

type KeyProps = (TKey & Partial<TCode>) | (TCode & Partial<TKey>);

export class Key {
  public key: string;
  public code: string;
  public readonly id: string;
  private onPressCallback?: (event: KeyboardEvent, key: Key) => void;
  private onReleaseCallback?: (event: KeyboardEvent, key: Key) => void;
  private onLongPressCallback?: (event: KeyboardEvent, key: Key) => void;
  private isPressed: boolean = false;
  private longPressTimer: NodeJS.Timeout | null = null;
  private longPressDuration: number = 500;
  private stateChangeListener?: (state: boolean) => void;
  private previousState: boolean = false;

  constructor({ key = "", code = "" }: KeyProps) {
    this.key = key;
    this.code = code;
    this.initListeners();
    this.id = `${key || code}:${code || key}`;
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
      (event.code === this.code || event.key === this.key) &&
      !this.isPressed
    ) {
      this.isPressed = true;
      this.longPressTimer = setTimeout(() => {
        this.onLongPressCallback?.(event, this);
      }, this.longPressDuration);
      this.onPressCallback?.(event, this);
    }
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    if (event.code === this.code || event.key === this.key) {
      this.isPressed = false;
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }
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

  toString(): string {
    return `Key(${this.key}, ${this.code})`;
  }

  static isEquals(key: Key, other: Key): boolean {
    return key.id === other.id;
  }

  equals(other: Key): boolean {
    return this.id === other.id;
  }

  onPress(callback: (event: KeyboardEvent, key: Key) => void) {
    this.onPressCallback = callback;
  }

  onRelease(callback: (event: KeyboardEvent, key: Key) => void) {
    this.onReleaseCallback = callback;
  }

  onLongPress(
    callback: (event: KeyboardEvent, key: Key) => void,
    duration: number = 500
  ) {
    this.onLongPressCallback = callback;
    this.longPressDuration = duration;
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
