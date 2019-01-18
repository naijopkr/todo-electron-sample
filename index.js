const { app, BrowserWindow, Menu, ipcMain } = require('electron')

let mainWindow
let addWindow

const isDarwin = process.platform === 'darwin'

const createAddWindow = () => {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add New Todo'
  })
  addWindow.on('closed', () => addWindow = null)

  return addWindow.loadURL(`file://${__dirname}/add.html`)
}

const clearTodos = () => mainWindow.webContents.send('todo:clear')

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      { 
        label: 'Add Todo',
        click: () => createAddWindow()
      },
      {
        label: 'Clear Todos',
        click: () => clearTodos()
      },
      { 
        label: 'Quit',
        accelerator: isDarwin ? 'Command+Q' : 'Alt+F4',
        click: () => app.quit()
      }
    ]
  }
]

if (isDarwin) {
  menuTemplate.unshift({})
}

if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'Dev',
    submenu: [
      { role: 'reload' },
      {
        label: 'Toggle Developer Tools',
        accelerator: isDarwin ? 'Comand+Alt+I' : 'Ctrl+Shift+I',
        click: (item, focusedWindow) => {
          return focusedWindow.toggleDevTools()
        }
      }
    ]
  })
}

app.on('ready', () => {
  mainWindow = new BrowserWindow({})
  mainWindow.on('closed', () => app.quit())

  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)

  return mainWindow.loadURL(`file://${__dirname}/main.html`)
})

ipcMain.on('todo:add', (evt, todo) => {
  mainWindow.webContents.send('todo:add', todo)
  return addWindow.close()
})