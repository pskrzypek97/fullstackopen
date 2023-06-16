import { useState, useEffect } from 'react';

import personsService from './services/persons';

import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Filter from './components/Filter';
import Notification from './components/Notification';

const App = () => {
	const [persons, setPersons] = useState(null);
	const [newName, setNewName] = useState('');
	const [newNumber, setNewNumber] = useState('');
	const [message, setMessage] = useState(null);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		personsService.getPersons().then((initialPersons) => {
			setPersons(initialPersons);
		});
	}, []);

	const setNotification = (error, message) => {
		setIsError(error);
		setMessage(message);
		setTimeout(() => setMessage(null), 5000);
	};

	const updateNumber = (newPerson) => {
		const { id } = persons.find((person) => newPerson.name === person.name);

		window.confirm(
			`${newPerson.name} is already added to phonebook, replace the old number with a new one?`
		) &&
			personsService
				.updatePersons(id, newPerson)
				.then((returnedPersons) => {
					setPersons(persons.map((p) => (p.id !== id ? p : returnedPersons)));
					setNotification(
						false,
						`Number of ${newPerson.name} has been changed to ${newPerson.number}`
					);
				})
				.catch((error) => {
					setNotification(true, error.response.data.error);
				});
	};

	const addPerson = (e) => {
		e.preventDefault();

		const newPerson = { name: newName, number: newNumber };

		if (persons.some((person) => person.name === newName))
			updateNumber(newPerson);
		else {
			personsService
				.addPerson(newPerson)
				.then((returnedPersons) => {
					setPersons(persons.concat(returnedPersons));
					setNotification(false, `Added ${newName}`);
				})
				.catch((error) => {
					setNotification(true, error.response.data.error);
				});
		}
	};

	const deletePerson = (name, id) => {
		if (window.confirm(`Delete ${name}?`)) {
			personsService.deletePerson(id);
			personsService.getPersons().then((initialPersons) => {
				setPersons(initialPersons);
			});
		}
	};

	const handleNewName = (e) => setNewName(e.target.value);

	const handleNewNumber = (e) => setNewNumber(e.target.value);

	const filterPersons = (e) => {
		const copyPersons = [...persons].filter((person) =>
			person.name
				.toLocaleLowerCase()
				.includes(e.target.value.toLocaleLowerCase())
		);

		setPersons(copyPersons);
	};

	if (!persons) return null;

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={message} error={isError} />

			<Filter filterPersons={filterPersons} />

			<h2>add a new</h2>
			<PersonForm
				addPerson={addPerson}
				handleNewName={handleNewName}
				handleNewNumber={handleNewNumber}
			/>

			<h3>Numbers</h3>

			<Persons persons={persons} deletePerson={deletePerson} />
		</div>
	);
};

export default App;
