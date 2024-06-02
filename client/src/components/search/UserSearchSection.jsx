import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import FollowButton from "@/components/follow/FollowButton";
import { fetchFollowingList } from "@/store/follow";
import { fetchUsers } from "@/store/member";
import { fetchAllFeed } from "@/store/feed";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import Slider from "react-slick";

const SearchSectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const SearchField = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 10px;
  background-color: #f7f7f7;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  input {
    border: none;
    font-size: 16px;
    padding: 10px;
    margin-left: 10px;
    flex: 1;
    background: none;
  }

  span {
    font-size: 16px;
    padding: 10px;
    border-right: 1px solid #e8ecf2;
  }
`;

const Results = styled.div`
  margin-top: 20px;
`;

const UserResult = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
`;

const FeedResult = styled.div`
  margin-bottom: 20px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
`;

const ArrowButton = styled.div`
  display: block;
  background: gray;
  cursor: pointer;
  padding: 10px;
  color: white;
  text-align: center;
  border-radius: 5px;
`;

// const HashtagArrow = ({ onClick }) => (
//   <ArrowButton onClick={onClick}>#해시태그 검색하기</ArrowButton>
// );

// const UserArrow = ({ onClick }) => (
//   <ArrowButton onClick={onClick}>@사용자 검색하기</ArrowButton>
// );

const SearchComponent = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const currentUser = useSelector((state) => state.members.user);
  const allUsers = useSelector((state) => state.members.users);
  const allFeeds = useSelector((state) => state.feeds.feeds);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredFeeds, setFilteredFeeds] = useState([]);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchFollowingList(currentUser.userNo));
    }
    dispatch(fetchUsers());
    dispatch(fetchAllFeed());
  }, [dispatch, currentUser]);

  useEffect(() => {
    const userResults = allUsers.filter((user) =>
      user.userNickname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(userResults);

    const feedResults = allFeeds.filter((feed) =>
      feed.feedHashtags.some((hashtag) =>
        hashtag.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredFeeds(feedResults);
  }, [searchTerm, allUsers, allFeeds]);

  const handleBeforeChange = (current, next) => {
    setCurrentSlide(next);
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    // beforeChange: handleBeforeChange,
    // nextArrow: <HashtagArrow />,
    // prevArrow: <UserArrow />,
  };

  return (
    <SearchSectionBlock>
      <Slider {...settings}>
        <div>
          <SearchField>
            <span>@</span>
            <input
              type="text"
              placeholder="사용자 검색어를 입력하세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchField>
          <Results>
            {filteredUsers.map((user) => (
              <UserResult key={user.userNo}>
                <Link to={`/personalpage/${user.userNo}`}>
                  <img
                    src={`http://localhost:8001/uploads/${user.profilePicture}`}
                    alt={user.userNickname}
                  />
                  <span>{user.userNickname}</span>
                </Link>
                <FollowButton userNo={user.userNo} />
              </UserResult>
            ))}
          </Results>
        </div>
        <div>
          <SearchField>
            <span>#</span>
            <input
              type="text"
              placeholder="해시태그 검색어를 입력하세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchField>
          <Results>
            {filteredFeeds.map((feed) => (
              <FeedResult key={feed.postId}>
                <div>{feed.content}</div>
                <div>Hashtags: {feed.feedHashtags.join(", ")}</div>
              </FeedResult>
            ))}
          </Results>
        </div>
      </Slider>
    </SearchSectionBlock>
  );
};

export default SearchComponent;
