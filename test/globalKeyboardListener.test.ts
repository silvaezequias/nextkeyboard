import { describe, it, expect, jest } from "@jest/globals";
import simulateKeyEvent from "./utils/simulateKeyEvent";
import { GlobalKeyboardListener } from "../src/core/globalKeyboardListener";
import * as Keyboard from "../src/keyboard";

const { A } = Keyboard;

describe("GlobalKeyboardListener", () => {
  it("should track keydown and keyup events globally", () => {
    const listener = new GlobalKeyboardListener();
    const keydownMock = jest.fn();
    const keyupMock = jest.fn();

    listener.onKeydown((_, key) => {
      keydownMock(key.code);
    });

    listener.onKeyup((_, key) => {
      keyupMock(key.code);
    });

    simulateKeyEvent("keydown", A);
    simulateKeyEvent("keyup", A);

    expect(keydownMock).toHaveBeenCalledWith(A.code);
    expect(keyupMock).toHaveBeenCalledWith(A.code);
  });
});
