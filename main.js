const { app, BrowserWindow, desktopCapturer, ipcMain, powerSaveBlocker } = require('electron/main');
const path = require('node:path');
const Color = require('color');
const WootingRGB = require('simple-javascript-wooting-rgb');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 256,
        height: 128,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        alwaysOnTop: true,
        autoHideMenuBar: true,
        titleBarStyle: 'hiddenInset'
    })

    mainWindow.loadFile('index.html').then(() => {
        desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
            for (const source of sources) {
                if (source.id === 'screen:0:0') {
                    mainWindow.webContents.send('SET_SOURCE', source.id);
                    return;
                }
            }
        })
    });
}

app.commandLine.appendSwitch('disable-renderer-backgrounding');

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    let maxVol = 0;
    let col = 0;

    ipcMain.on('GET_ARRAY', (_event, value) => {
        if (!WootingRGB.connectDevice()) {
            return;
        }

        let aveVol = 0;
        for (let i = 0; i < value.length; i++) {
            aveVol += value[i];
        }
        aveVol /= value.length;

        let arrRGB = Array.from(new Array(14), _ => new Array(5).fill(0));
        for (let i = 0; i < arrRGB.length; i++) {
            if (maxVol < value[(i + 1) * 3]) {
                maxVol = value[(i + 1) * 3];
            }
            col = (aveVol / maxVol) * 360;
            const color = Color.hsv([col, 100, 100]);
            for (let j = 0; j < arrRGB[0].length; j++) {
                if (value[(i + 1) * 3] > ((maxVol - 1) * (j / arrRGB[0].length))) {
                    arrRGB[i][j] = [Math.trunc(color.red()), Math.trunc(color.green()), Math.trunc(color.blue())];
                } else {
                    arrRGB[i][j] = [0, 0, 0];
                }
            }
        }

        const transpose = a => a[0].map((_, c) => a.map(r => r[c]));

        const tmp1 = transpose(arrRGB);
        const tmp2 = tmp1.reverse();
        const tmp3 = tmp2.flat(2);

        let rowArrRGB = Array(WootingRGB.MAX_COLS * WootingRGB.MAX_ROWS * 3).fill(0);
        let step = 0;
        for (let j = 0; j < rowArrRGB.length; j++) {
            //Wooting 60 HE
            if ((63 <= j && j < 105) || (126 <= j && j < 168) || (189 <= j && j < 231) || (252 <= j && j < 294) || (315 <= j && j < 357)) {
                rowArrRGB[j] = tmp3[step];
                step++;
            }
        }

        WootingRGB.setArrayRGB(rowArrRGB);
        WootingRGB.updateArrayRGB();
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
    WootingRGB.resetRGB();
});