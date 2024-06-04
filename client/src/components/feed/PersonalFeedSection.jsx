import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchAllFeed } from "@/store/feed";

const PersonalFeedSectionBlock = styled.div``;

const PersonalFeedSection = () => {
  const dispatch = useDispatch();
  const { userNo } = useParams(); // URL에서 유저넘버 추출
  const targetUserNo = parseInt(userNo); // URL에서 받아온 유저넘버
  const [loading, setLoading] = useState(true);
  const feeds = useSelector((state) => state.feeds.feeds);
  // const [feeds, setFeeds] = useState([]);

  // useEffect(() => {
  //   const fetchTargetUserData = (targetUserNo) => {
  //     axios
  //       .get(`http://localhost:8001/auth/users?targetUserNo=${targetUserNo}`)
  //       .then((res) => {
  //         const data = res.data;
  //         setUser(data);
  //         setLoading(false);
  //       })
  //       .catch((err) => console.log(err));
  //   };

  //   fetchTargetUserData(targetUserNo);
  // }, [targetUserNo]);

  useEffect(() => {
    dispatch(fetchAllFeed(15));
    // setFeeds(feeds);
    setLoading(false);
    console.log("개인피드즈", feeds);
    console.log("개인피드즈", feeds);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <PersonalFeedSectionBlock>
      {feeds.map((feed) => (
        <div key={feed.postId}>
          <div>
            {feed.feedImages.length > 0 && (
              <img src={feed.feedImages[0].imageUrl} alt="" />
            )}
            <p>{feed.content}</p>
          </div>
        </div>
      ))}
    </PersonalFeedSectionBlock>
  );
};

export default PersonalFeedSection;