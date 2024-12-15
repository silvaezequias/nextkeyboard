import { describe, it, expect, jest } from "@jest/globals";
import { Key } from "../src/core/key";
import { Hotkeys } from "../src/core/hotkeys";
import simulateKeyEvent from "./utils/simulateKeyEvent";

const ctrl = new Key({ key: "Control" });
const a = new Key({ key: "A" });

describe("Hotkeys Combinations", () => {
  it('should detect "Control + A" combination', () => {
    const hotkey = new Hotkeys([ctrl, a]);
    const hotkeyMock = jest.fn();

    hotkey.onPress(() => {
      hotkeyMock();
    });

    simulateKeyEvent("keydown", ctrl);
    simulateKeyEvent("keydown", a);

    expect(hotkeyMock).toHaveBeenCalledTimes(1);

    simulateKeyEvent("keyup", a);
    simulateKeyEvent("keyup", ctrl);
  });
});
