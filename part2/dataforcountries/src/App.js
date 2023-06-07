import { useState, useEffect } from 'react';

import axios from 'axios';

import SearchResult from './components/SearchResult';

const App = () => {
	const [countriesArray, setCountriesArray] = useState([]);
	const [filteredCountriesArray, setFilteredCountriesArray] = useState([]);

	useEffect(() => {
		axios
			.get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
			.then((res) => setCountriesArray(res.data))
			.catch((e) => setCountriesArray([]));
	}, []);

	const handleSearch = (e) => {
		setFilteredCountriesArray([
			...countriesArray.filter((c) =>
				c.name.common
					.toLocaleLowerCase()
					.includes(e.target.value.toLocaleLowerCase())
			),
		]);
	};

	return (
		<div>
			find countries <input onChange={handleSearch} />
			<SearchResult filteredCountries={filteredCountriesArray} />
		</div>
	);
};

export default App;
