import { Key } from "../../src/core/key";

export default function simulateKeyEvent(type: "keydown" | "keyup", key: Key) {
  const event = new KeyboardEvent(type, {
    key: key.key,
    code: key.code || key.key,
    bubbles: true,
    cancelable: true,
    composed: true,
  });

  document.dispatchEvent(event);
}
