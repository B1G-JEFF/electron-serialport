const { app, BrowserWindow, ipcMain } = require('electron');
const { SerialPort, ReadlineParser } = require('serialport');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar:true,
    icon:__dirname+"./arduino_22429.ico",
    webPreferences: {
      preload: __dirname + '/preload.js',
      contextIsolation: true,
      nodeIntegration: false
    },
  });

  mainWindow.loadFile('index.html');
});

ipcMain.handle('list-ports', async () => {
  try {
    const ports = await SerialPort.list();
    return ports.map((port) => port.path);
  } catch (error) {
    console.error('Erro ao listar portas:', error);
    return [];
  }
});

ipcMain.on('start-serial', (event, port) => {
  const serialPort = new SerialPort({
    path: port,
    baudRate: 9600
  });

  const parser = new ReadlineParser();
  serialPort.pipe(parser);

  parser.on('data', (data) => {
    console.log('Data received: ', data);
    mainWindow.webContents.send('serial-data', data);
  });

  serialPort.on('error', (err) => {
    console.error('Error: ', err.message);
  });
});
