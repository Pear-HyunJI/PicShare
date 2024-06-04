import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchAllFeed } from "@/store/feed";

const PersonalFeedSectionBlock = styled.div`
  margin-bottom: 20px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  flex-wrap: wrap;
  .personalfeed {
    padding: 10px;
    flex: 0 0 32%;
    text-align: center;
    img {
      display: inline-block;
      height: 200px;
      border-radius: 6px;
      cursor: pointer;
    }
  }
`;

const PersonalFeedSection = ({ setFilteredFeeds, filteredFeeds }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userNo } = useParams();
  const targetUserNo = parseInt(userNo);
  const { feeds, loading, error } = useSelector((state) => state.feeds);
  // const [filteredFeeds, setFilteredFeeds] = useState([]);

  useEffect(() => {
    dispatch(fetchAllFeed());
  }, [dispatch]);

  useEffect(() => {
    if (feeds) {
      const userFeeds = feeds.filter((feed) => feed.userNo === targetUserNo);
      setFilteredFeeds(userFeeds);
    }
  }, [feeds, targetUserNo]);

  const handleFeedClick = (postId) => {
    navigate(`/personaldetailfeed/${postId}`, {
      state: { filteredFeeds },
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PersonalFeedSectionBlock>
      {filteredFeeds.map((feed) => (
        <div
          key={feed.postId}
          className="personalfeed"
          onClick={() => handleFeedClick(feed.postId)}
        >
          {feed.feedImages.length > 0 && (
            <img src={feed.feedImages[0].imageUrl} alt="" />
          )}
        </div>
      ))}
    </PersonalFeedSectionBlock>
  );
};

export default PersonalFeedSection;
