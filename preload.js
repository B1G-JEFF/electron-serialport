const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('serialAPI', {
  listPorts: () => ipcRenderer.invoke('list-ports'),
  startSerial: (port) => ipcRenderer.send('start-serial', port),
  onSerialData: (callback) => ipcRenderer.on('serial-data', (_, data) => callback(data)),
});
