const config = require('../config');
const axios = require('axios');

axios.defaults.baseURL = config.API_URL;

class ApiController {
	static getWeather(cityId) {
		return axios.get(`weather/${cityId}`);
	}
}

module.exports = ApiController;
