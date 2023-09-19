import { createSlice } from '@reduxjs/toolkit';

import loginService from '../../services/login';
import blogService from '../../services/blogs';

const initialState = null;

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            return action.payload;
        },
    },
});

export const { setUser } = userSlice.actions;

export const loginUser = (credentials) => {
    return async (dispatch) => {
        const user = await loginService.login(credentials);

        dispatch(setUser(user));

        window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
        blogService.setToken(user.token);
    };
};

export default userSlice.reducer;
