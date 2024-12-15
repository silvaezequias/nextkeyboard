import { describe, it, expect } from "@jest/globals";
import { Key } from "../src/core/key";
import * as Keyboard from "../src/keyboard";
import simulateKeyEvent from "./utils/simulateKeyEvent";

const { A } = Keyboard;

describe("Key Class", () => {
  it("should generate a unique id based on key and code", () => {
    const keyA = new Key({ key: "A", code: "KeyA" });
    const keyB = new Key({ key: "A", code: "KeyA" });

    expect(keyA.id).toBe("A:KeyA");
    expect(keyB.id).toBe("A:KeyA");
    expect(keyA.id).toEqual(keyB.id);
  });

  it("should differentiate unique ids for different keys", () => {
    const keyA = new Key({ key: "A", code: "KeyA" });
    const keyB = new Key({ key: "B", code: "KeyB" });

    expect(keyA.id).not.toBe(keyB.id);
  });

  it("should correctly compare keys using equals", () => {
    const keyA = new Key({ key: "A", code: "KeyA" });
    const keyB = new Key({ key: "A", code: "KeyA" });
    const keyC = new Key({ key: "B", code: "KeyB" });

    expect(keyA.equals(keyB)).toBe(true);
    expect(keyA.equals(keyC)).toBe(false);
  });

  it("should correctly compare keys using isEquals", () => {
    const keyA = new Key({ key: "A", code: "KeyA" });
    const keyB = new Key({ key: "A", code: "KeyA" });
    const keyC = new Key({ key: "C", code: "KeyC" });

    expect(Key.isEquals(keyA, keyB)).toBe(true);
    expect(Key.isEquals(keyA, keyC)).toBe(false);
  });

  it("should return a readable string representation with toString", () => {
    const keyA = new Key({ key: "A", code: "KeyA" });
    const keyB = new Key({ key: "Control", code: "ControlLeft" });

    expect(keyA.toString()).toBe("Key(A, KeyA)");
    expect(keyB.toString()).toBe("Key(Control, ControlLeft)");
  });

  it("should handle key press and release callbacks", () => {
    const keyA = new Key({ key: "A", code: "KeyA" });
    const pressMock = jest.fn();
    const releaseMock = jest.fn();

    keyA.onPress((_, key) => {
      pressMock(key);
    });

    keyA.onRelease((_, key) => {
      releaseMock(key);
    });

    simulateKeyEvent("keydown", A);
    simulateKeyEvent("keyup", A);

    expect(pressMock).toHaveBeenCalledWith(keyA);
    expect(releaseMock).toHaveBeenCalledWith(keyA);
  });

  it("should handle long press events correctly", () => {
    jest.useFakeTimers();
    const keyA = new Key({ key: "A", code: "KeyA" });
    const longPressMock = jest.fn();

    keyA.onLongPress((_, key) => {
      longPressMock(key);
    }, 500);

    simulateKeyEvent("keydown", A);

    jest.advanceTimersByTime(500);

    expect(longPressMock).toHaveBeenCalledWith(keyA);

    simulateKeyEvent("keyup", A);

    jest.useRealTimers();
  });
});
