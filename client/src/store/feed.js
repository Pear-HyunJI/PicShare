import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const serverUrl = import.meta.env.VITE_API_URL;

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
    initPostByPostid(state, action) {
      const post = action.payload;
      const index = state.feeds.findIndex(
        (feed) => feed.postId === post.postId
      );
      if (index === -1) {
        state.feeds.push(post);
      } else {
        state.feeds[index] = post;
      }
      state.loading = false;
    },
    initUpdateFeed(state, action) {
      const updatedPost = action.payload;
      const index = state.feeds.findIndex(
        (post) => post.postId === updatedPost.postId
      );
      if (index !== -1) {
        state.feeds[index] = updatedPost;
      }
    },
  },
});

export const {
  initFeedStart,
  initFeedSuccess,
  initFeedFail,
  initUpdateFeed,
  initPostByPostid,
} = feedSlice.actions;

export const fetchAllFeed = (filter) => (dispatch) => {
  dispatch(initFeedStart());

  // filter가 all일때는 요청할대 filter를 보내지 않았음.
  if (!filter || filter.length === 0) {
    const url = `${serverUrl}/feed/all`;
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
    const url = `${serverUrl}/feed/all?userNo=${userNo}`;
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

export const fetchPostByPostid = (postId) => (dispatch) => {
  dispatch(initFeedStart());
  axios
    .get(`${serverUrl}/feed/postbypostid?postId=${postId}`)
    .then((res) => {
      const post = res.data;
      console.log("포스트바이아이디", post);
      dispatch(initPostByPostid(post));
    })
    .catch((err) => {
      dispatch(initFeedFail(err));
    });
};

export const updateFeed = (postId, updatedData) => (dispatch) => {
  axios
    .put(`${serverUrl}/feed/update?postId=${postId}`, updatedData)
    .then((res) => {
      const updatedPost = res.data;
      console.log("업데이트 데이터", updatedPost);
      dispatch(initUpdateFeed(updatedPost));
    })
    .catch((err) => console.log(err));
};

export default feedSlice.reducer;
