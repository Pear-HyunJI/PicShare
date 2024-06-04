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

export const fetchAllFeed = (filter) => (dispatch) => {
  dispatch(initFeedStart());

  // filter가 all일때는 요청할대 filter를 보내지 않았음.
  if (!filter || filter.length === 0) {
    const url = "http://localhost:8001/feed/all";
    axios
      .get(url)
      .then((res) => {
        const data = res.data;
        console.log("올피드 응답 데이터", data);
        dispatch(initFeedSuccess(data));
      })
      .catch((err) => dispatch(initFeedFail(err)));
    return;
  }

  // filter : {type: "following", userNos: [10],[11]}
  // filter에서 userNos 추출
  const { userNos } = filter;

  if (!userNos || userNos.length === 0) {
    // userNos가 없는 경우 빈 배열로 초기화
    dispatch(initFeedSuccess([]));
    return;
  }

  // 각 userNo에 대한 fetch 요청을 생성하여 배열에 담기
  const requests = userNos.map((userNo) => {
    const url = `http://localhost:8001/feed/all?userNo=${userNo}`;
    return axios.get(url);
  });

  // 모든 fetch 요청이 완료될 때까지 기다린 후 결과 합치기
  Promise.all(requests)
    .then((responses) => {
      // 모든 응답 데이터를 합쳐서 단일 배열로 만듦
      const data = responses.flatMap((response) => response.data);
      console.log("올피드 응답 데이터", data);
      dispatch(initFeedSuccess(data));
    })
    .catch((err) => dispatch(initFeedFail(err)));
};

export default feedSlice.reducer;