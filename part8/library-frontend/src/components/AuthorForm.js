import { useState } from 'react';

import { useMutation } from '@apollo/client';
import Select from 'react-select';

import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries';

const AuthorForm = ({ authors }) => {
	const [name, setName] = useState('');
	const [born, setBorn] = useState('');

	const [editAuthor] = useMutation(EDIT_AUTHOR, {
		refetchQueries: [{ query: ALL_AUTHORS }],
	});

	const options =
		authors &&
		authors.map((a) => {
			return { value: a.name, label: a.name };
		});

	const submit = (e) => {
		e.preventDefault();

		editAuthor({ variables: { name: name.value, setBornTo: +born } });

		setName('');
		setBorn('');
	};

	return (
		<div>
			<h2>Set birthyear</h2>
			<form onSubmit={submit}>
				<div>
					<Select defaultValue={name} onChange={setName} options={options} />
				</div>
				<div>
					born
					<input
						value={born}
						onChange={({ target }) => setBorn(target.value)}
					/>
				</div>
				<button type="submit">update author</button>
			</form>
		</div>
	);
};

export default AuthorForm;
