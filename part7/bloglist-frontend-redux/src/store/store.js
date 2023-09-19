import { configureStore } from '@reduxjs/toolkit';

import notificationReducer from './reducers/notificationReducer';
import blogReducers from './reducers/blogReducers';
import userReducers from './reducers/userReducers';

const store = configureStore({
    reducer: {
        notification: notificationReducer,
        blog: blogReducers,
        user: userReducers,
    },
});

export default store;
