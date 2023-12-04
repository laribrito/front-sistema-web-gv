import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userName: '',
    accessToken: '',
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.userName = action.payload.userName;
        },

        resetUser: () => initialState,
    }
})

const user = userSlice.reducer
export default user
export const { loginUser, resetUser } = userSlice.actions