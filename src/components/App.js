import React from 'react';
import Select from 'react-select';
import { ipcRenderer } from 'electron';
import { getCitiesList } from '../data';
import { getIconClassFromId } from '../data/icons';
const cities = getCitiesList();

class App extends React.Component {
	constructor() {
		super();

		this.handleWeatherGetResultsSuccess = this.handleWeatherGetResultsSuccess.bind(this);
		this.handleWeatherGetResultsRequest = this.handleWeatherGetResultsRequest.bind(this);
		this.handleChangeCityClick = this.handleChangeCityClick.bind(this);
		this.handleCitySelect = this.handleCitySelect.bind(this);
		this.handleCancelCitySelect = this.handleCancelCitySelect.bind(this);
		this.handleSaveSelectedCity = this.handleSaveSelectedCity.bind(this);
		this.handleQuitClick = this.handleQuitClick.bind(this);
		this.handleWeatherGetResultsFail = this.handleWeatherGetResultsFail.bind(this);

		this.state = {
			getWeatherWorking: true,
			weather: {
				id: null,
				name: '',
				data: {
					description: '',
					icon: '',
					id: null,
					main: '',
					temp: '',
				},
			},
			selectedCityOption: null,
			isChangingCity: false,
		};
	}
	componentDidMount() {
		ipcRenderer.send('APP/READY');
		ipcRenderer.on('WEATHER/GET_RESULTS_REQUEST', this.handleWeatherGetResultsRequest);
		ipcRenderer.on('WEATHER/GET_RESULTS_SUCCESS', this.handleWeatherGetResultsSuccess);
		ipcRenderer.on('WEATHER/GET_RESULTS_FAIL', this.handleWeatherGetResultsFail);
	}

	render() {
		const { weather, getWeatherWorking, isChangingCity, selectedCityOption } = this.state;
		const iconClass = getIconClassFromId(weather.data.icon);
		return (
			<div className="App">
				{getWeatherWorking && <h1 className="App__h1">Loading...</h1>}

				{!getWeatherWorking &&
					!isChangingCity && (
						<div className="App__inner">
							<i className={`App__icon wi ${iconClass}`} />
							<h1 className="App__h1">{weather.name}</h1>
							<div className="App__temperature">{weather.data.temp}°C</div>
							<div className="App__description">{weather.data.description}</div>
							<div className="App__changeCity" onClick={this.handleChangeCityClick}>
								Change City
							</div>
							<div className="App__quit" onClick={this.handleQuitClick}>
								Quit
							</div>
						</div>
					)}

				{isChangingCity && (
					<div className="CitySelect">
						<Select
							isSearchable
							value={selectedCityOption}
							onChange={this.handleCitySelect}
							options={cities}
							autoFocus
							classNamePrefix="CitySelect"
						/>
						<div
							className="CitySelect__button CitySelect__button--cancel"
							onClick={this.handleCancelCitySelect}
						>
							<span className="CitySelect__button__inner">cancel</span>
						</div>
						{!!selectedCityOption && (
							<div className="CitySelect__button" onClick={this.handleSaveSelectedCity}>
								<span className="CitySelect__button__inner">save</span>
							</div>
						)}
					</div>
				)}
			</div>
		);
	}

	handleWeatherGetResultsRequest() {
		this.setState({
			getWeatherWorking: true,
		});
	}

	handleWeatherGetResultsFail() {
		this.setState({
			getWeatherWorking: false,
		});
	}

	handleWeatherGetResultsSuccess(e, results) {
		this.setState({
			getWeatherWorking: false,
			weather: {
				id: results.id,
				name: results.name,
				data: results.weather,
			},
		});
	}

	handleChangeCityClick() {
		this.setState({ isChangingCity: true });
	}

	handleCitySelect(option, type) {
		if (!type === 'select-option') return;

		this.setState({
			selectedCityOption: option,
		});
	}

	handleSaveSelectedCity() {
		this.setState({
			isChangingCity: false,
		});

		ipcRenderer.send('APP/CHANGE_CITY', { cityId: this.state.selectedCityOption.value });
	}

	handleCancelCitySelect() {
		this.setState({ isChangingCity: false });
	}

	handleQuitClick() {
		ipcRenderer.send('APP/QUIT');
	}
}

export default App;
