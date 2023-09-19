import { createSlice } from '@reduxjs/toolkit';

import blogService from '../../services/blogs';

const initialState = [];

const blogSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        setBlogs(state, action) {
            return action.payload;
        },
        appendBlogs(state, action) {
            state.push(action.payload);
        },
        updateVote(state, action) {
            const id = action.payload;
            const blogToVote = state.find((b) => b.id === id);
            const upvotedBlog = {
                ...blogToVote,
                likes: blogToVote.likes + 1,
            };
            return state.map((b) => (b.id !== id ? b : upvotedBlog));
        },
        removeBlog(state, action) {
            const id = action.payload;
            return state.filter((b) => b.id !== id);
        },
    },
});

export const { setBlogs, appendBlogs, updateVote, removeBlog } =
    blogSlice.actions;

export const initializeBlogs = () => {
    return async (dispatch) => {
        const blogs = await blogService.getAll();
        dispatch(setBlogs(blogs));
    };
};

export const createBlog = (content) => {
    return async (dispatch) => {
        const newBlog = await blogService.create(content);
        dispatch(appendBlogs(newBlog));
    };
};

export const voteBlog = (blog) => {
    return async (dispatch) => {
        dispatch(updateVote(blog.id));

        await blogService.update(blog.id, {
            ...blog,
            likes: blog.likes + 1,
        });
    };
};

export const deleteBlog = (id) => {
    return async (dispatch) => {
        dispatch(removeBlog(id));

        await blogService.deleteBlog(id);
    };
};

export default blogSlice.reducer;
