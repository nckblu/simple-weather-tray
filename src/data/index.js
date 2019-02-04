import cities from './cities.json';

export const getCitiesList = () =>
	cities.filter(city => city.country === "GB").map(city => ({
		label: city.name,
		value: city.id,
	}));
