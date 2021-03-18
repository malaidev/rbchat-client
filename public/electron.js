const { app, Menu, Tray, screen, BrowserWindow, ipcMain, shell, globalShortcut } = require('electron');

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const Badge = require('electron-windows-badge');

let mainWindow;
let tray = null;
const app_icon = "favicon.ico";
const tray_normal = "favicon16.png";
const tray_highlighted = "favicon16-h.png";

function createWindow() {
  const display = screen.getPrimaryDisplay()
  const maxiSize = display.workAreaSize;
  mainWindow = new BrowserWindow({
    minWidth: 400, 
    minHeight: 750,
    width: 400,
    height: 750,
    icon: path.join(__dirname, app_icon),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + '/preload.js',
      contextIsolation: false
    }
  });
  //mainWindow.maximize();
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

  tray = new Tray(path.join(__dirname, tray_normal));
  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click: () => {
        mainWindow.show();
      }
    },
    { 
      label: 'Restart', 
      click:  function(){
        app.relaunch();
        app.isQuiting = true;
        app.quit();
      } 
    },
    { 
      type: 'separator'
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
  });
  tray.setToolTip('RBChat');
  tray.setContextMenu(trayMenu);
  
  globalShortcut.register('f5', function() {
    mainWindow.reload()
	})
  // const badgeOptions = {
  //   color: 'red',
  //   font: '12px arial'
  // }
  // new Badge(mainWindow, badgeOptions);
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      mainWindow.show();
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


  ipcMain.on('show', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
  
  ipcMain.on('runlink', (event, arg) => {
    shell.openExternal(arg);
  });
  
  ipcMain.on('highlight', (event, arg) => {
    if (tray)
      tray.setImage(path.join(__dirname, arg?tray_highlighted:tray_normal));
  });
  
  ipcMain.on('reload', (event, arg) => {
    if (mainWindow)
		  mainWindow.reload()
  });

}