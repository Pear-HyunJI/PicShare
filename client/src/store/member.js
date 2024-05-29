import { createSlice } from "@reduxjs/toolkit";

const memberSlice = createSlice({
  name: "member",
  initialState: {
    user: null, // {userNo, email, userName, userNickname, password, profilePicture, created_at}
  },
  reducers: {
    userLogin(state, action) {
      const {
        userNo,
        email,
        userName,
        userNickname,
        password,
        profilePicture,
        created_at,
      } = action.payload;
      state.user = {
        userNo,
        email,
        userName,
        userNickname,
        password,
        profilePicture,
        created_at,
      };
      localStorage.loging = JSON.stringify({ userNo: userNo, email: email });
    },
    localUser(state, action) {
      state.user = action.payload;
    },
    userLogout(state, action) {
      state.user = null;
      localStorage.clear();
    },
  },
});

export const { userLogin, userLogout, localUser } = memberSlice.actions;

export default memberSlice.reducer;
