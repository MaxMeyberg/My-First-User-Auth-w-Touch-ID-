const { app, BrowserWindow } = require('electron');
const path = require('path');
require('@electron/remote/main').initialize();

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
  });

  require('@electron/remote/main').enable(win.webContents);

  // Enable biometric permissions
  win.webContents.session.setPermissionCheckHandler((webContents, permission) => {
    if (permission === 'biometric') {
      return true;  // Allow biometric permission
    }
    return true;  // Allow other permissions for testing
  });

  win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'biometric') {
      callback(true);  // Allow biometric permission
    }
    callback(true);  // Allow other permissions for testing
  });

  // Wait for the window to be ready before opening DevTools
  win.webContents.on('did-finish-load', () => {
    win.webContents.openDevTools();
  });

  win.loadFile(path.join(__dirname, '../public/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
