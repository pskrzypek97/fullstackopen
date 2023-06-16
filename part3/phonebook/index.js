require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/persons');

const app = express();

morgan.token('body', (req) => {
	return JSON.stringify(req.body);
});

app.use(express.json());
app.use(
	morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
app.use(cors());
app.use(express.static('build'));

// let persons = [
// 	{
// 		id: 1,
// 		name: 'Arto Hellas',
// 		number: '040-123456',
// 	},
// ];

//get info
app.get('/info', (req, res) => {
	Person.find({}).then((persons) => {
		const numberOfEntries = `<p>Phonebook has info for ${persons.length} people</p>`;
		const date = `<p>${new Date()}</p>`;

		res.send(`<div>${numberOfEntries}${date}</div>`);
	});
});

//get persons
app.get('/api/persons', (req, res, next) => {
	Person.find({})
		.then((persons) => {
			res.json(persons);
		})
		.catch((error) => next(error));
});

//get one person
app.get('/api/persons/:id', (req, res, next) => {
	// const id = Number(req.params.id);
	// const person = persons.find((p) => p.id === id);
	// if (!person) res.status(404).end();
	// res.json(person);

	Person.findById(req.params.id)
		.then((person) => {
			if (person) res.json(person);
			else res.status(404).end();
		})
		.catch((error) => next(error));
});

//add one person
app.post('/api/persons', (req, res, next) => {
	const body = req.body;

	// if (body.name === '')
	// 	return res.status(404).json({ error: 'name is missing' });
	// if (body.number === '')
	// 	return res.status(404).json({ error: 'number is missing' });
	// if (persons.find((p) => p.id === body.id))
	// 	return res.status(404).json({ error: 'name must be unique' });

	const person = new Person({
		name: body.name,
		number: body.number,
		// id: Math.floor(Math.random() * 1000),
	});

	// persons = persons.concat(person);

	person
		.save()
		.then((savedPerson) => res.json(savedPerson))
		.catch((error) => next(error));
});

//delete one person
app.delete('/api/persons/:id', (req, res, next) => {
	// const id = Number(req.params.id);
	// persons = persons.filter((p) => p.id !== id);
	// res.status(204).end();

	Person.findByIdAndRemove(req.params.id)
		.then(() => {
			res.status(204).end();
		})
		.catch((error) => next(error));
});

//modify one person
app.put('/api/persons/:id', (req, res, next) => {
	const { name, number } = req.body;

	Person.findByIdAndUpdate(
		req.params.id,
		{ name, number },
		{ new: true, runValidators: true, context: 'query' }
	)
		.then((updatedPerson) => {
			res.json(updatedPerson);
		})
		.catch((error) => next(error));
});

//non-existent routes
const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
	if (error.name === 'CastError')
		res.status(400).send({ error: 'malformatted id' });
	else if (error.name === 'ValidationError')
		res.status(400).json({ error: error.message });

	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}`);
});
