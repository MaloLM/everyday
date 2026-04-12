const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  requestData: () => ipcRenderer.send('request-data-channel'),
  sendData: (data) => ipcRenderer.invoke('write-data-channel', data),
  saveTAMForm: (data) => ipcRenderer.send('update-tam-config', data),
  onResponseData: (callback) => {
    ipcRenderer.on('response-data-channel', callback);
    return () => ipcRenderer.removeListener('response-data-channel', callback);
  },
  loadNetWorthData: () => ipcRenderer.invoke('nw:load'),
  saveNetWorthEntry: (entry) => ipcRenderer.invoke('nw:save-entry', entry),
  deleteNetWorthEntry: (entryId) => ipcRenderer.invoke('nw:delete-entry', entryId),
});
