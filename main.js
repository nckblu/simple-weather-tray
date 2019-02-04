const { app } = require('electron');
const MainController = require('./controllers/MainController');
const { ipcMain } = require('electron');

let dev = false;
if (
	process.defaultApp ||
	/[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
	/[\\/]electron[\\/]/.test(process.execPath)
) {
	dev = true;
}

const mainController = new MainController(dev);
if (!dev) {
	app.dock.hide();
}
ipcMain.on('APP/READY', mainController.onAppReady);
ipcMain.on('APP/CHANGE_CITY', mainController.onAppChangeCity);
ipcMain.on('APP/QUIT', () => app.quit());

app.on('ready', () => mainController.init());
