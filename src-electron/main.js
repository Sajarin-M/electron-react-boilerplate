const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = !app.isPackaged;

let mainWindow;

if (isDev) {
  require("electron-reloader")(module);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.removeMenu();
  }

  mainWindow.loadFile(path.join(__dirname, "..", "index.html"));

  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
