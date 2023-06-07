import { useState, useEffect } from 'react';

import CountryInfo from './CountryInfo';

const SearchResult = ({ filteredCountries }) => {
	const [isShown, setIsShown] = useState(false);
	const [shownCountry, setShownCountry] = useState(null);

	const length = filteredCountries.length;

	const handleShownCountry = (country) => {
		setIsShown(true);
		setShownCountry({ ...country });
	};

	useEffect(() => setIsShown(false), [length]);

	if (!length) return null;

	if (length > 10) return <div>Too many matches, specify another filter</div>;

	if (length < 11 && length > 1 && !isShown) {
		return (
			<div>
				{filteredCountries.map((c) => (
					<li key={c.population}>
						{c.name.common}{' '}
						<button onClick={() => handleShownCountry(c)}>show</button>
					</li>
				))}
			</div>
		);
	}

	if (length === 1) return <CountryInfo country={filteredCountries[0]} />;

	if (isShown) return <CountryInfo country={shownCountry} />;
};

export default SearchResult;
