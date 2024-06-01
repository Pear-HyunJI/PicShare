import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    feed: [],
    feeds: [],
    loading: false,
    error: null,
  },
  reducers: {
    initFeedStart(state) {
      state.loading = true;
      state.error = null;
    },
    initFeedSuccess(state, action) {
      state.feeds = action.payload;
      state.loading = false;
    },
    initFeedFail(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { initFeedStart, initFeedSuccess, initFeedFail } =
  feedSlice.actions;

export const fetchAllFeed = () => (dispatch) => {
  dispatch(initFeedStart());
  axios
    .get("http://localhost:8001/feed/all")
    .then((res) => {
      console.log("올피드 응답", res);
      const data = res.data;
      console.log("올피드 응답 데이터", data);
      dispatch(initFeedSuccess(data));
    })
    .catch((err) => dispatch(initFeedFail(err)));
};

export default feedSlice.reducer;
