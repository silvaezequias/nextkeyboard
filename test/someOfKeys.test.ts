import { describe, it, expect, jest } from "@jest/globals";
import { Key } from "../src/core/key";
import { SomeOfKeys } from "../src/core/someOfKeys";
import simulateKeyEvent from "./utils/simulateKeyEvent";

const A = new Key({ key: "A" });
const B = new Key({ key: "B" });

describe("SomeOfKeys Functionality", () => {
  it('should detect any key "A" or "B"', () => {
    const group = new SomeOfKeys([A, B]);
    const groupMock = jest.fn();

    group.onPress((_, key) => {
      groupMock(key);
    });

    simulateKeyEvent("keydown", A);
    expect(groupMock).toHaveBeenCalledWith(A);

    simulateKeyEvent("keydown", B);
    expect(groupMock).toHaveBeenCalledWith(B);

    simulateKeyEvent("keyup", A);
    simulateKeyEvent("keyup", B);
  });
});
