# Electron Desktop Files

This directory contains the Electron configuration files for building desktop applications.

## Files

- **main.js** - Electron main process (window management, menus, IPC)
- **preload.js** - Preload script (secure bridge between main and renderer)
- **icon.png** - App icon (512x512 PNG) - **ADD THIS FILE**

## Required: Add App Icon

You need to add an app icon before building:

```bash
# Place your 512x512 PNG icon here:
electron/icon.png
```

### Quick Placeholder Icon

```bash
# Download Sui logo as placeholder
curl -o electron/icon.png https://avatars.githubusercontent.com/u/100925345?s=512
```

### Icon Requirements

- **Format:** PNG
- **Size:** 512x512 pixels
- **Transparent background:** Recommended
- **Square:** Must be square aspect ratio

The build process will automatically convert this to:
- `.ico` for Windows
- `.icns` for macOS (future)
- Various sizes for Linux

## Customization

### Change Window Size

Edit `main.js`:
```javascript
mainWindow = new BrowserWindow({
  width: 1600,  // Change width
  height: 1000, // Change height
  // ...
});
```

### Add Custom Menus

Edit the `createMenu()` function in `main.js`

### Add IPC Handlers

Add new handlers in `main.js`:
```javascript
ipcMain.handle('your-handler', async (event, arg) => {
  // Your code
  return result;
});
```

Then expose in `preload.js`:
```javascript
contextBridge.exposeInMainWorld('electron', {
  yourHandler: (arg) => ipcRenderer.invoke('your-handler', arg),
});
```

## Security

The preload script uses `contextBridge` to safely expose only specific APIs to the renderer process. This prevents security vulnerabilities.

**Never:**
- Set `nodeIntegration: true`
- Set `contextIsolation: false`
- Expose entire `ipcRenderer` to renderer

## Development

Test your changes:
```bash
npm run electron:dev
```

## Build

Build desktop apps:
```bash
npm run electron:build
```

See `DESKTOP_BUILD_GUIDE.md` for complete instructions.
