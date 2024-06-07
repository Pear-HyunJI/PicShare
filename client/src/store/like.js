import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const serverUrl = import.meta.env.VITE_API_URL;

const likeSlice = createSlice({
  name: "like",
  initialState: {
    likeList: [],
  },
  reducers: {
    initLikeList(state, action) {
      state.likeList = action.payload;
    },
  },
});

export const { initLikeList } = likeSlice.actions;

export const fetchLikeList = (userNo) => async (dispatch) => {
  try {
    const res = await axios.post(`${serverUrl}/other/post/likeList`, {
      userNo,
    });
    const data = res.data.map((post) => ({
      ...post,
      imageUrls: post.imageUrls ? post.imageUrls.split(",") : [],
    }));
    console.log("패치라이크리스트", data);
    dispatch(initLikeList(data));
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default likeSlice.reducer;
