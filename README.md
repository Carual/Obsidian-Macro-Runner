# Obsidian Macro Runner

Chain multiple Obsidian commands into a single macro and assign it a custom hotkey.

## Features

- Create unlimited macros from the settings panel
- Search and add any command available in the Command Palette
- Reorder or remove commands within a macro
- Configure the delay between commands (useful for commands that need rendering time)
- Each macro is registered as an Obsidian command, assignable to any hotkey

## Installation

### Manual

1. Run `npm install` and `npm run build`
2. Copy `main.js` and `manifest.json` into `.obsidian/plugins/obsidian-macro-runner/`
3. Enable the plugin in Settings → Community Plugins

### Development

```bash
npm install
npm run dev   # watch mode, outputs main.js
npm run build # production build
```

## Usage

1. Go to **Settings → Macro Runner**
2. Click **+ New Macro** and give it a name
3. Click **+ Add Command** to search and add commands in sequence
4. Adjust the delay between commands if needed (default 150ms)
5. Go to **Settings → Hotkeys**, search for your macro name and assign a key

> **Note:** Newly created macros appear in Hotkeys only after restarting Obsidian.

## Example: Joplin-style Split Edit View

| Order | Command |
|-------|---------|
| 1 | `Split right` |
| 2 | `Toggle Live Preview / Source mode` |

## License

MIT