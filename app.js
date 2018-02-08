const {app, BrowserWindow, ipcMain, autoUpdater} = require('electron')
const path = require('path')
const url = require('url')
const ElectronTitlebarWindows = require('electron-titlebar-windows')
const isDev = require('electron-is-dev')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let index = isDev ? "index.dev.html" : "index.html";

if (!isDev) {
  const server = 'http://updater.apolloverlay.com'
  const feed = `${server}/update/${process.platform}/${app.getVersion()}`

  autoUpdater.setFeedURL(feed)

  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 60 * 1000)
}

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts, (response) => {
    if (response === 0) autoUpdater.quitAndInstall()
  })
})

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 450, height: 500, alwaysOnTop: false, frame: false, transparent: true, 
    webPreferences: {
      devTools: isDev
    }
  });
  win.setMenu(null)
  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, index),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
    
  })  
}

// Listen for async message from renderer process
ipcMain.on('overlay', (event, arg) => {  
  // Print 1  
  win.setAlwaysOnTop(arg)  
});

ipcMain.on('reize', (event, arg) => {
  win.setSize(arg.width, arg.height);
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
