const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const url = require('url');
const ApiController = require('./ApiController');
const Store = require('electron-store');

class MainController {
	constructor(isDev) {
		this.POLL_INTERVAL = 20000;
		this.isDev = isDev;
		this.toggleWindow = this.toggleWindow.bind(this);
		this.onAppReady = this.onAppReady.bind(this);
		this.onAppChangeCity = this.onAppChangeCity.bind(this);
		this.store = new Store();
		if (!this.store.get('cityId')) {
			this.store.set('cityId', 2643741);
		}
	}

	init() {
		this.initWindow();
		this.initTray();
	}

	initTray() {
		this.tray = new Tray(path.join(__dirname, '../src/assets/images/icons/icon-09d-Template.png'));
		this.tray.setTitle('°-C');
		this.tray.on('click', () => {
			this.toggleWindow();
		});
	}

	updateTray(data) {
		this.tray.setTitle(`${Math.floor(data.weather.temp)}°C`);
		const newIcon = path.join(__dirname, `../src/assets/images/icons/icon-${data.weather.icon}-Template.png`);
		this.tray.setImage(newIcon);
	}

	initWindow() {
		this.mainWindow = new BrowserWindow({
			width: 250,
			height: 310,
			show: false,
			frame: false,
			fullscreenable: false,
			resizable: false,
			'node-integration': false,
			icon: __dirname + '../dock.png',
		});

		this.mainWindow.setVisibleOnAllWorkspaces(true);

		let indexPath;
		if (this.isDev && process.argv.indexOf('--noDevServer') === -1) {
			indexPath = url.format({
				protocol: 'http:',
				host: 'localhost:8080',
				pathname: 'index.html',
				slashes: true,
			});
		} else {
			indexPath = url.format({
				protocol: 'file:',
				pathname: path.join(__dirname, '../dist', 'index.html'),
				slashes: true,
			});
		}
		this.mainWindow.loadURL(indexPath);

		this.mainWindow.once('ready-to-show', () => {
			if (this.isDev) {
				this.mainWindow.webContents.openDevTools({ mode: 'detach' });
			}
		});

		this.mainWindow.on('blur', () => {
			this.mainWindow.hide();
			if (!this.mainWindow.webContents.isDevToolsOpened()) {
				this.mainWindow.hide();
			}
		});
	}

	showWindow() {
		const position = this.getWindowPosition();
		this.mainWindow.setPosition(position.x, position.y, false);
		this.mainWindow.show();
		this.mainWindow.focus();
	}

	toggleWindow() {
		if (this.mainWindow.isVisible()) {
			this.mainWindow.hide();
		} else {
			this.showWindow();
		}
	}

	onAppReady() {
		this.pollWeather();
	}

	onAppChangeCity(e, data) {
		this.mainWindow.webContents.send('WEATHER/GET_RESULTS_REQUEST');
		const { cityId } = data;
		ApiController.getWeather(cityId)
			.then(res => {
				this.changeCityInStorage(cityId);
				this.updateTray(res.data);
				this.mainWindow.webContents.send('WEATHER/GET_RESULTS_SUCCESS', res.data);
			})
			.catch(e => {
				this.mainWindow.webContents.send('WEATHER/GET_RESULTS_FAIL');
			});
	}

	changeCityInStorage(cityId) {
		this.store.set('cityId', cityId);
	}

	pollWeather() {
		ApiController.getWeather(this.store.get('cityId'))
			.then(res => {
				this.updateTray(res.data);
				this.mainWindow.webContents.send('WEATHER/GET_RESULTS_SUCCESS', res.data);
			})
			.catch(e => {
				this.mainWindow.webContents.send('WEATHER/GET_RESULTS_FAIL');
			});

		setTimeout(() => {
			this.pollWeather();
		}, this.POLL_INTERVAL);
	}

	getWindowPosition() {
		const windowBounds = this.mainWindow.getBounds();
		const trayBounds = this.tray.getBounds();
		const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);
		const y = Math.round(trayBounds.y + trayBounds.height + 3);
		return { x: x, y: y };
	}
}

module.exports = MainController;
