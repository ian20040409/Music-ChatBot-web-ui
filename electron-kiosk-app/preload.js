const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('kiosk', {
  version: process.versions.electron,
});
