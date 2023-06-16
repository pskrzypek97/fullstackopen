import axios from 'axios';

const baseUrl = '/api/persons';

const getPersons = async () => {
	const req = axios.get(baseUrl);

	return req.then((res) => res.data);
};

const addPerson = async (newObject) => {
	const req = axios.post(baseUrl, newObject);

	return req.then((res) => res.data);
};

const updatePersons = async (id, newObject) => {
	const req = axios.put(`${baseUrl}/${id}`, newObject);

	return req.then((res) => res.data);
};

const deletePerson = async (id) => axios.delete(`${baseUrl}/${id}`);

export default { getPersons, addPerson, updatePersons, deletePerson };
