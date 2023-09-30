import { createContext, useReducer, useContext } from 'react';

const userReducer = (state, action) => {
	switch (action.type) {
		case 'SET_USER':
			return action.payload;
		default:
			return state;
	}
};

const UserContext = createContext();

export const useUserValue = () => {
	const userDispatch = useContext(UserContext);
	return userDispatch[0];
};

export const useUserDispatch = () => {
	const userDispatch = useContext(UserContext);
	return userDispatch[1];
};

export const UserContextProvider = (props) => {
	const [user, userDispatcher] = useReducer(userReducer, null);

	return (
		<UserContext.Provider value={[user, userDispatcher]}>
			{props.children}
		</UserContext.Provider>
	);
};

export default UserContext;
