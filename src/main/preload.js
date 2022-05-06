const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    createBot(config) {
      ipcRenderer.send('createBot', config);
    },
    getBots() {
      ipcRenderer.send('getBots');
    },
    getBot(nome) {
      ipcRenderer.send('getBot', nome);
    },
    saveCommand(arg) {
      ipcRenderer.send('saveCommand', arg);
    },
    createCommand(arg) {
      ipcRenderer.send('createCommand', arg);
    },
    deleteCommand(arg) {
      ipcRenderer.send('deleteCommand', arg);
    },
    exportBot(arg) {
      ipcRenderer.send('exportBot', arg);
    },
    saveConfig(arg) {
      ipcRenderer.send('saveConfig', arg);
    },
    deleteBot(arg) {
      ipcRenderer.send('deleteBot', arg);
    },
    saveApis(arg) {
      ipcRenderer.send('saveApis', arg);
    },
    saveEvent(arg) {
      ipcRenderer.send('saveEvent', arg);
    },
    on(channel, func) {
      const validChannels = ['ipc-example', 'createBot', 'getBots', 'getBot', 'saveCommand', 'createCommand', 'deleteCommand', 'exportBot', 'saveConfig', 'deleteBot', 'saveApis', 'saveEvent'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example', 'createBot', 'getBots', 'getBot', 'saveCommand', 'createCommand', 'deleteCommand', 'exportBot', 'saveConfig', 'deleteBot', 'saveApis', 'saveEvent'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
