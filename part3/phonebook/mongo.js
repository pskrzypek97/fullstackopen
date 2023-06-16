const mongoose = require('mongoose');
if (process.argv.length < 3) {
	console.log('give password as argument');
	process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://przemek:${password}@fullstackopen.sdidxmh.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 4) {
	Person.find({}).then((result) => {
		console.log('phonebook:');

		result.forEach((entry) => {
			console.log(`${entry.name} ${entry.number}`);
		});

		mongoose.connection.close();
		process.exit(1);
	});
}

if (process.argv.length > 3) {
	const name = process.argv[3];
	const number = process.argv[4];

	const entry = new Person({
		name,
		number,
	});

	entry.save().then((result) => {
		console.log(`added ${result.name} number ${result.number} to phonebook`);
		mongoose.connection.close();
	});
}
