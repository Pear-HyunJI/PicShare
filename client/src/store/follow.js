import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const followSlice = createSlice({
  name: "follow",
  initialState: {
    followingList: [],
    followerList: [],
  },
  reducers: {
    initFollowingList(state, action) {
      state.followingList = action.payload;
    },
    initFollowerList(state, action) {
      state.followerList = action.payload;
    },
  },
});

export const { initFollowingList, initFollowerList } = followSlice.actions;

//팔로잉 유저 리스트 요청하기
export const fetchFollowingList = (userNo) => async (dispatch) => {
  try {
    const res = await axios.get(
      `http://localhost:8001/follow/followinglist?userNo=${userNo}`
    );
    console.log("팔로잉유저리스트", res);
    const data = res.data;
    console.log("팔로잉유저데이터", data);
    dispatch(initFollowingList(data));
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// 팔로우 유저 리스트 요청하기
export const fetchFollowerList = (userNo) => (dispatch) => {
  axios
    .get(`http://localhost:8001/follow/followerlist?userNo=${userNo}`)
    .then((res) => {
      console.log("팔로워유저리스트", res);
      const data = res.data;
      console.log("팔로워유저데이터", data);
      dispatch(initFollowerList(data));
    })
    .catch((err) => console.log(err));
};

export default followSlice.reducer;
