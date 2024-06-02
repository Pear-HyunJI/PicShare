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
      // (sessionStorage) 새로고침-> 로그인 유지 || 페이지 닫기-> 로그인 유지안되게
      sessionStorage.loging = JSON.stringify({ userNo: userNo, email: email });
    },
    localUser(state, action) {
      state.user = action.payload;
    },
    userLogout(state, action) {
      state.user = null;
      // (sessionStorage) 새로고침-> 로그인 유지 || 페이지 닫기-> 로그인 유지안되게
      sessionStorage.clear();
    },
    initUsers(state, action) {
      state.users = action.payload;
    },
  },
});

export const { userLogin, userLogout, localUser, initUsers } =
  memberSlice.actions;

// 모든 유저 정보 요청하기
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
