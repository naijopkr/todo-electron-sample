const { app, BrowserWindow, Menu } = require('electron')

let mainWindow
let addWindow

const createAddWindow = () => {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add New Todo'
  })

  return addWindow.loadURL(`file://${__dirname}/add.html`)
}

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      { 
        label: 'New Todo',
        click: () => createAddWindow()
      },
      { 
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Alt+F4',
        click: () => app.quit()
      }
    ]
  }
]

if (process.platform === 'darwin') {
  menuTemplate.unshift({})
}

app.on('ready', () => {
  mainWindow = new BrowserWindow({})
  mainWindow.on('closed', () => app.quit())

  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)

  return mainWindow.loadURL(`file://${__dirname}/main.html`)
})