const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true,
      devTools: true  // Explicitly enable DevTools
    },
  });

  // Enable WebAuthn with more permissions
  win.webContents.session.setPermissionCheckHandler((webContents, permission) => {
    console.log('Permission check:', permission); // Debug log
    return true; // Allow all permissions for testing
  });

  win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    console.log('Permission request:', permission); // Debug log
    callback(true); // Allow all permissions for testing
  });

  // Wait for the window to be ready before opening DevTools
  win.webContents.on('did-finish-load', () => {
    win.webContents.openDevTools();
  });

  win.loadFile('index.html');
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
