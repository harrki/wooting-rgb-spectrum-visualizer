const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getMediaStream: (callback) =>
        ipcRenderer.on('SET_SOURCE', async (event, sourceId) => {
            try {
                callback(sourceId);
            } catch (e) {
                console.log(e)
            }
        }),
    setSoundArray: (value) => ipcRenderer.send('GET_ARRAY', value)
})
