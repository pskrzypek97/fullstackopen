import { useState, useEffect } from 'react';

import axios from 'axios';

import WeatherInfo from './WeatherInfo';

const CountryInfo = ({ country }) => {
	const [weather, setWeather] = useState(null);

	useEffect(() => {
		axios
			.get(
				`http://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&units=metric&APPID=${process.env.REACT_APP_WEATHER_API}`
			)
			.then((res) => setWeather(res.data))
			.catch((e) => setWeather(null));
	}, []);

	const langArr = Object.values(country.languages);

	if (!country) return null;

	return (
		<div>
			<h1>{country.name.common}</h1>
			<p>capital {country.capital.join(', ')}</p>
			<p>area {country.area}</p>
			<br />
			<b>languages:</b>
			<ul>
				{langArr.map((lang) => (
					<li key={lang}>{lang}</li>
				))}
			</ul>
			<img src={country.flags.png} alt={country.flags.alt} />
			<h2>Weather in {country.capital[0]}</h2>
			<WeatherInfo weather={weather} />
		</div>
	);
};

export default CountryInfo;
