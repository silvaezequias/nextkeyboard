import { Key } from "./key";

export class SomeOfKeys {
  private keys: Key[];
  private onPressCallback?: (event: KeyboardEvent, key: Key) => void;
  private onReleaseCallback?: (event: KeyboardEvent, key: Key) => void;
  private onLongPressCallback?: (event: KeyboardEvent, key: Key) => void;
  private longPressTimers: Map<Key, NodeJS.Timeout> = new Map();
  private longPressDuration: number = 500;

  constructor(keys: Key[]) {
    this.keys = keys;
    this.initListeners();
  }

  private initListeners() {
    this.keys.forEach((key) => {
      key.onPress((event, pressedKey) => {
        if (!this.longPressTimers.has(pressedKey)) {
          const timer = setTimeout(() => {
            this.onLongPressCallback?.(event, pressedKey);
            this.longPressTimers.delete(pressedKey);
          }, this.longPressDuration);
          this.longPressTimers.set(pressedKey, timer);
        }
        this.onPressCallback?.(event, pressedKey);
      });

      key.onRelease((event, releasedKey) => {
        if (this.longPressTimers.has(releasedKey)) {
          clearTimeout(this.longPressTimers.get(releasedKey)!);
          this.longPressTimers.delete(releasedKey);
        }
        this.onReleaseCallback?.(event, releasedKey);
      });
    });
  }

  resetListeners() {
    this.keys.forEach((key) => key.resetListeners());
    this.initListeners();
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
    return {
      after: (afterCallback: () => void): this => {
        const wrappedCallback = this.onLongPressCallback;
        this.onLongPressCallback = (event, key) => {
          wrappedCallback?.(event, key);
          afterCallback();
        };
        return this;
      },
    };
  }

  isPressed(): boolean {
    return this.keys.some((key) => key.isKeyPressed());
  }
}
