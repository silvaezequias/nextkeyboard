import { Key } from "./key";

export class SomeOfKeys {
  private keys: Key[];
  private onPressCallback?: (event: KeyboardEvent) => void;
  private onReleaseCallback?: (event: KeyboardEvent) => void;

  constructor(keys: Key[]) {
    this.keys = keys;
    this.initListeners();
  }

  private initListeners() {
    this.keys.forEach((key) => {
      key.onPress((event) => {
        this.onPressCallback?.(event);
      });

      key.onRelease((event) => {
        this.onReleaseCallback?.(event);
      });
    });
  }

  resetListeners() {
    this.keys.forEach((key) => key.resetListeners());
    this.initListeners();
  }

  onPress(callback: (event: KeyboardEvent) => void) {
    this.onPressCallback = callback;
  }

  onRelease(callback: (event: KeyboardEvent) => void) {
    this.onReleaseCallback = callback;
  }

  isPressed(): boolean {
    return this.keys.some((key) => key.isKeyPressed());
  }
}
