import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username: string;
  accessToken: string;
}

const initialState: UserState = {
  username: '',
  accessToken: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<UserState>) => {
      state.username = action.payload.username;
      state.accessToken = action.payload.accessToken;
    },
    
    resetUser: () => initialState,
  },
});

export default userSlice.reducer;
export const { loginUser, resetUser } = userSlice.actions;
