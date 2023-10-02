import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => (token = `bearer ${newToken}`);

const getAll = async () => {
	const request = await axios.get(baseUrl);
	return request.data;
};

const create = async (newObject) => {
	const config = {
		headers: { Authorization: token },
	};

	const request = await axios.post(baseUrl, newObject, config);
	return request.data;
};

const update = async (newObject) => {
	const request = await axios.put(`${baseUrl}/${newObject.id}`, newObject);
	return request.data;
};

const comment = async (newObject) => {
	const request = await axios.post(
		`${baseUrl}/${newObject.id}/comments`,
		newObject
	);
	return request.data;
};

const deleteBlog = async (id) => {
	const config = {
		headers: { Authorization: token },
	};

	await axios.delete(`${baseUrl}/${id}`, config);
};

export default { getAll, create, update, deleteBlog, setToken, comment };
