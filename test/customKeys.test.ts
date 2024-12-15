import { describe, it, expect, jest } from "@jest/globals";
import { Key } from "../src/core/key";
import simulateKeyEvent from "./utils/simulateKeyEvent";

describe("Custom Keyboard Keys", () => {
  it('should detect custom key "Z"', () => {
    const Z = new Key({ key: "Z", code: "KeyZ" });
    const keydownMock = jest.fn();
    const keyupMock = jest.fn();

    Z.onPress((_, key) => {
      keydownMock(key);
    });

    Z.onRelease((_, key) => {
      keyupMock(key);
    });

    simulateKeyEvent("keydown", Z);
    simulateKeyEvent("keyup", Z);

    expect(keydownMock).toHaveBeenCalledWith(Z);
    expect(keyupMock).toHaveBeenCalledWith(Z);
  });
});
