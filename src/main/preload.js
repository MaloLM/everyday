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
  loadRpData: () => ipcRenderer.invoke('rp:load'),
  saveRpItem: (item) => ipcRenderer.invoke('rp:save-item', item),
  deleteRpItem: (itemId) => ipcRenderer.invoke('rp:delete-item', itemId),
  loadBudgetData: () => ipcRenderer.invoke('budget:load'),
  saveBudgetData: (data) => ipcRenderer.invoke('budget:save', data),
  loadRecipesData: () => ipcRenderer.invoke('recipes:load'),
  saveRecipe: (recipe) => ipcRenderer.invoke('recipes:save', recipe),
  deleteRecipe: (recipeId) => ipcRenderer.invoke('recipes:delete', recipeId),
  exportAllData: () => ipcRenderer.invoke('app:export-all'),
  importAllData: (data) => ipcRenderer.invoke('app:import-all', data),
});
