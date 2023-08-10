import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const notificationSlice = createSlice({
	name: 'notification',
	initialState,
	reducers: {
		createNotification(state, action) {
			return action.payload;
		},
		removeNotification(state, action) {
			return (state = null);
		},
	},
});

export const { createNotification, removeNotification } =
	notificationSlice.actions;

export const setNotification = (content, sec) => {
	return (dispatch) => {
		dispatch(createNotification(content));
		setTimeout(() => dispatch(removeNotification()), sec * 1000);
	};
};
export default notificationSlice.reducer;
