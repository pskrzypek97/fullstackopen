const WeatherInfo = ({ weather }) => {
	if (!weather) return <p>Unable to fetch weather info</p>;

	return (
		<>
			<p>temperature {weather.main.temp} Celcius</p>
			<img
				src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
				alt={weather.weather[0].description}
			/>
			<p>wind {weather.wind.speed} m/s</p>
		</>
	);
};

export default WeatherInfo;
