import { describe, it, expect, jest } from "@jest/globals";
import simulateKeyEvent from "./utils/simulateKeyEvent";
import * as Keyboard from "../src/keyboard";

const { A, B, LeftControl } = Keyboard;

describe("Predefined Keyboard Keys", () => {
  it('should detect "A" keydown and keyup events', () => {
    const keydownMock = jest.fn();
    const keyupMock = jest.fn();

    A.onPress((_, key) => {
      keydownMock(key);
    });

    A.onRelease((_, key) => {
      keyupMock(key);
    });

    simulateKeyEvent("keydown", A);
    simulateKeyEvent("keyup", A);

    expect(keydownMock).toHaveBeenCalledWith(A);
    expect(keyupMock).toHaveBeenCalledWith(A);
  });

  it('should detect "LeftControl" keydown and keyup events', () => {
    const keydownMock = jest.fn();
    const keyupMock = jest.fn();

    LeftControl.onPress((_, key) => {
      keydownMock(key);
    });

    LeftControl.onRelease((_, key) => {
      keyupMock(key);
    });

    simulateKeyEvent("keydown", LeftControl);
    simulateKeyEvent("keyup", LeftControl);

    expect(keydownMock).toHaveBeenCalledWith(LeftControl);
    expect(keyupMock).toHaveBeenCalledWith(LeftControl);
  });
});
