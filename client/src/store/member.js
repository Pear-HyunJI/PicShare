import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const memberSlice = createSlice({
  name: "member",
  initialState: {
    user: null, // {userNo, email, userName, userNickname, password, profilePicture, created_at}
    users: [],
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
    initUsers(state, action) {
      state.users = action.payload;
    },
  },
});

export const { userLogin, userLogout, localUser, initUsers } =
  memberSlice.actions;

// export const fetchUsers = () => {
//   return (dispatch) => {
//     axios
//       .get("http://localhost:8001/auth/users")
//       .then((res) => {
//         console.log("유저목록", res);
//         const data = res.data;
//         console.log("유저데이터", data);
//         dispatch(initUsers(data));
//       })
//       .catch((err) => console.log(err));
//   };
// };

export const fetchUsers = () => (dispatch) => {
  axios
    .get("http://localhost:8001/auth/users")
    .then((res) => {
      console.log("유저목록", res);
      const data = res.data;
      console.log("유저데이터", data);
      dispatch(initUsers(data));
    })
    .catch((err) => console.log(err));
};

export default memberSlice.reducer;
