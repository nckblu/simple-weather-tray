// TODO: get dotenv working with electron
let API_URL;

if (
	process.defaultApp ||
	/[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
	/[\\/]electron[\\/]/.test(process.execPath)
) {
	API_URL = 'http://localhost:3000/';
} else {
	API_URL = 'https://swt-api.boardee.uk/';
}

const config = {
	API_URL,
};

module.exports = config;
