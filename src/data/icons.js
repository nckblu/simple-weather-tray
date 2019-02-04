export const getIconClassFromId = iconId => {
	if (!iconId) return null;

	switch (iconId) {
		case '01d':
			return 'wi-day-sunny';
		case '01n':
			return 'wi-night-clear';
		case '02d':
			return 'wi-day-cloudy';
		case '02n':
			return 'wi-night-cloudy';
		case '03d':
		case '03n':
			return 'wi-cloudy';
		case '04d':
		case '04n':
			return 'wi-cloud';
		case '09d':
			return 'wi-day-rain-mix';
		case '09n':
			return 'wi-night-alt-rain-mix';
		case '10d':
			return 'wi-day-rain';
		case '10n':
			return 'wi-night-rain';
		case '11d':
			return 'wi-day-thunderstorm';
		case '11n':
			return 'wi-night-thunderstorm';
		case '13d':
			return 'wi-day-alt-snow';
		case '13n':
			return 'wi-night-alt-snow';
		case '50d':
			return 'wi-day-fog';
		case '50n':
			return 'wi-night-fog';
	}
};
