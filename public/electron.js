const { app, Menu, Tray, screen, BrowserWindow, nativeImage, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;
let tray = null;

function createWindow() {
  const display = screen.getPrimaryDisplay()
  const maxiSize = display.workAreaSize;
  mainWindow = new BrowserWindow({
    minWidth: 600, 
    minHeight: 750,
    height: maxiSize.height,
    width: maxiSize.width
  });
  mainWindow.maximize();
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
  mainWindow.on('minimize',function(event){
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('close', function (event) {
    if(!app.isQuiting){
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  tray = new Tray(path.join(__dirname, 'favicon.ico'));
  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    { 
      label: 'Exit', 
      click:  function(){
        app.isQuiting = true;
        app.quit();
      } 
    }
  ]);
  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.focus();
  });
  tray.setToolTip('RBChat');
  tray.setContextMenu(trayMenu);

  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  app.setLoginItemSettings({
      openAtLogin: true,
      path: app.getPath("exe")
  });

  app.setName("RBChat");

  app.on('ready', createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });

  ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
  });

  ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
  });

  autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update_available');
  });
  
  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
  });


}