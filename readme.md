# NextKeyboard: Simplified Keyboard Event Handling

## **Introduction**

**NextKeyboard** is a flexible and robust library designed to simplify keyboard event handling in React and JavaScript/TypeScript projects. It supports monitoring individual keys, key combinations, and global listeners, with a focus on extensibility and developer experience.

---

## **Installation**

Install the library using npm or yarn:

```bash
npm install nextkeyboard
```

```bash
yarn add nextkeyboard
```

---

## **Features**

- Monitor individual keys, combinations, or groups of keys.
- Supports global listeners for all keyboard events.
- Handles modifiers like **Command**, **Control**, **Alt**, and **Meta**.
- Predefined keys for easy usage via `Keyboard`.
- Simple integration with React and TypeScript.

---

## **Usage**

### **Basic Key Monitoring**

Monitor when a key is pressed or released:

```typescript
import { Keyboard } from "nextkeyboard";

const { LeftShift } = Keyboard;

LeftShift.onPress((event) => {
  console.log("LeftShift key pressed!");
});

LeftShift.onRelease((event) => {
  console.log("LeftShift key released!");
});
```

---

### **Hotkeys (Key Combinations)**

Monitor combinations of keys such as `Command + A`:

```typescript
import { Hotkeys, Keyboard } from "nextkeyboard";

const { A, LeftCommand } = Keyboard;

const commandAndA = new Hotkeys([LeftCommand, A]);

commandAndA.onPress(() => {
  console.log("Command + A was pressed!");
});

commandAndA.onRelease(() => {
  console.log("Command + A was released!");
});
```

---

### **SomeOfKeys (Any Key in a Group)**

Monitor when any key in a group is pressed or released:

```typescript
import { SomeOfKeys, Keyboard } from "nextkeyboard";

const { LeftCommand, RightCommand } = Keyboard;

const commandKeys = new SomeOfKeys([LeftCommand, RightCommand]);

commandKeys.onPress(() => {
  console.log("Either Command key was pressed!");
});

commandKeys.onRelease(() => {
  console.log("Either Command key was released!");
});
```

---

### **Integration: SomeOfKeys with Hotkeys**

Monitor combinations involving key groups and specific keys:

#### Example: Command (Left or Right) + Win (Meta) + "B"

```typescript
import { Hotkeys, SomeOfKeys, Keyboard } from "nextkeyboard";

const { LeftCommand, RightCommand, LeftMeta, RightMeta, B } = Keyboard;

const commandKeys = new SomeOfKeys([LeftCommand, RightCommand]);
const metaKeys = new SomeOfKeys([LeftMeta, RightMeta]);

const commandMetaB = new Hotkeys([commandKeys, metaKeys, B]);

commandMetaB.onPress(() => {
  console.log(
    "Command (Left or Right) + Meta (Left or Right) + B was pressed!"
  );
});

commandMetaB.onRelease(() => {
  console.log(
    "Command (Left or Right) + Meta (Left or Right) + B was released!"
  );
});
```

---

### **Global Keyboard Listener**

The `GlobalKeyboardListener` monitors all keys globally and allows handling both `keydown` and `keyup` events for any key.

```typescript
import { GlobalKeyboardListener, Keyboard } from "nextkeyboard";

const { A, LeftCommand } = Keyboard;

const listener = new GlobalKeyboardListener();

// Handle keydown globally
listener.onKeydown((event, key) => {
  console.log(`${key.key} was pressed globally!`);
});

// Handle keyup globally
listener.onKeyup((event, key) => {
  console.log(`${key.key} was released globally!`);
});

// Cleanup listeners when no longer needed
listener.cleanup();
```

---

## **API Reference**

### Class `GlobalKeyboardListener`

Monitors all keys globally.

| Method                         | Description                                               |
| ------------------------------ | --------------------------------------------------------- |
| `onKeydown(callback)`          | Registers a global callback for all `keydown` events.     |
| `onKeyup(callback)`            | Registers a global callback for all `keyup` events.       |
| `setCallbackOf(key, callback)` | Registers a callback for a specific key.                  |
| `cleanup()`                    | Removes all global listeners configured for the instance. |

---

### Class `Key`

Represents an individual key.

| Method                | Description                                                        |
| --------------------- | ------------------------------------------------------------------ |
| `onPress(callback)`   | Registers a callback for when the key is pressed.                  |
| `onRelease(callback)` | Registers a callback for when the key is released.                 |
| `isKeyPressed()`      | Returns `true` if the key is currently pressed.                    |
| `getState()`          | Returns `true` if the key is in an active state (e.g., Caps Lock). |
| `resetListeners()`    | Removes and reinitializes listeners for the key.                   |

---

### Class `Hotkeys`

Manages key combinations.

| Method                | Description                                                |
| --------------------- | ---------------------------------------------------------- |
| `onPress(callback)`   | Registers a callback for when the combination is pressed.  |
| `onRelease(callback)` | Registers a callback for when the combination is released. |
| `resetListeners()`    | Removes and reinitializes listeners for the combination.   |

---

### Class `SomeOfKeys`

Monitors any key in a group.

| Method                | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| `onPress(callback)`   | Registers a callback for when any key in the group is pressed.  |
| `onRelease(callback)` | Registers a callback for when any key in the group is released. |
| `resetListeners()`    | Removes and reinitializes listeners for the group.              |

---

## **Predefined Keys**

The library includes predefined constants for common keys, accessible via `Keyboard`:

- **Letters**: `A`, `B`, ..., `Z`.
- **Numbers**: `Zero`, `One`, ..., `Nine`.
- **Modifiers**: `Shift`, `Control`, `Alt`, `Meta`, `Command`.
- **Navigation**: `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home`, `End`, etc.
- **Function Keys**: `F1`, `F2`, ..., `F12`.
- **State Keys**: `CapsLock`, `NumLock`, `ScrollLock`, etc.

Example usage:

```typescript
import { Keyboard } from "nextkeyboard";

const { A, LeftCommand, F1 } = Keyboard;

A.onPress(() => console.log("A was pressed!"));
LeftCommand.onPress(() => console.log("Left Command was pressed!"));
F1.onPress(() => console.log("F1 was pressed!"));
```

---

## **Contributing**

### Steps to Contribute

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/nextkeyboard.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the project in development mode:

   ```bash
   npm run dev
   ```

4. Make your changes and submit a pull request!

---

## **License**

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

This version includes the updated usage for importing predefined keys via `Keyboard`. Let me know if you need additional adjustments! 😊
