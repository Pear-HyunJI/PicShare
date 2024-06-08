import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import FollowButton from "@/components/follow/FollowButton";
import { fetchFollowingList } from "@/store/follow";
import { fetchUsers } from "@/store/member";
import { fetchAllFeed } from "@/store/feed";
import { Link, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import Slider from "react-slick";
import { FaAt, FaHashtag } from "react-icons/fa";
import { MdPlace } from "react-icons/md";

const serverUrl = import.meta.env.VITE_API_URL;

const SearchSectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;

  .buttons {
    display: flex;
    justify-content: space-between;
    button {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      margin: 0px 10px 15px 0;
      border: none;
      border-radius: 25px;
      background-color: #fdfdfd;
      color: #ddd;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        color: #09dd52;
      }

      &.active {
        color: #09dd52;
      }

      svg {
        margin-right: 10px;
      }
    }
  }
`;

const SearchField = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 5px;
  border-radius: 50px;
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
  margin: 20px 10px 30px;
  .imageBox {
    display: flex;
    align-items: center;
    margin-right: 10px;
    width: 230px;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
`;

const FeedResult = styled.div`
  margin-bottom: 20px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  flex-wrap: wrap;
  .feedresult {
    padding-bottom: 20px;
    flex: 0 0 32%;
    text-align: center;
    position: relative;
    img {
      display: inline-block;
      height: 200px;
      border-radius: 6px;
    }
    .info {
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(255, 255, 255, 0.8);
      padding: 5px;
      border-radius: 5px;
    }
    .hashtag {
      padding-top: 5px;
    }
  }
`;

const SearchComponent = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = useSelector((state) => state.members.user);
  const allUsers = useSelector((state) => state.members.users);
  const allFeeds = useSelector((state) => state.feeds.feeds);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredFeeds, setFilteredFeeds] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchFollowingList(currentUser.userNo));
    }
    dispatch(fetchUsers());
    dispatch(fetchAllFeed());
  }, [dispatch, currentUser]);

  useEffect(() => {
    const userResults = allUsers.filter(
      (user) =>
        user.userNo !== currentUser.userNo &&
        user.userNickname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(userResults);

    const feedResults = allFeeds.filter((feed) =>
      feed.feedHashtags.some((hashtag) =>
        hashtag.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredFeeds(feedResults);
  }, [searchTerm, allUsers, allFeeds, currentUser]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    arrows: false,
    dots: false,
  };

  const goToSlide = (index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
    setCurrentSlide(index);
  };

  const handleFeedClick = (postId) => {
    navigate(`/tagsearchdetail/${postId}`, {
      state: { searchTerm, currentSlide },
    });
  };

  return (
    <SearchSectionBlock>
      <div className="buttons">
        <button
          className={currentSlide === 0 ? "active" : ""}
          onClick={() => goToSlide(0)}
        >
          <FaAt />
          사용자 검색
        </button>
        <button
          className={currentSlide === 1 ? "active" : ""}
          onClick={() => goToSlide(1)}
        >
          <FaHashtag />
          해시태그 검색
        </button>
        <button
          className={currentSlide === 2 ? "active" : ""}
          onClick={() => goToSlide(2)}
        >
          <MdPlace />
          위치 및 날씨 정보 검색
        </button>
      </div>
      <Slider {...settings} ref={sliderRef}>
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
                <Link to={`/personalpage/${user.userNo}`} className="imageBox">
                  <img
                    src={`${serverUrl}/uploads/${user.profilePicture}`}
                    alt={user.userNickname}
                  />
                  <span>@{user.userNickname}</span>
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
            <FeedResult>
              {filteredFeeds.map((feed) => (
                <div
                  className="feedresult"
                  key={feed.postId}
                  onClick={() => handleFeedClick(feed.postId)}
                >
                  <div className="info">
                    <div>{feed.feedHashtags.join(" ")}</div>
                  </div>
                  {feed.feedImages.length > 0 && (
                    <img
                      src={`${serverUrl}/uploads/${feed.feedImages[0].imageUrl}`}
                      alt=""
                    />
                  )}
                </div>
              ))}
            </FeedResult>
          </Results>
        </div>
        <div>
          <SearchField>
            <span>&</span>
            <input
              type="text"
              placeholder="위치 및 날씨 정보 검색어를 입력하세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchField>
          <Results>
            <FeedResult>
              {filteredFeeds.map((feed) => (
                <div
                  className="feedresult"
                  key={feed.postId}
                  onClick={() => handleFeedClick(feed.postId)}
                >
                  <div className="info">
                    <div>{feed.weatherInfo}</div>
                    <div>{feed.locationName}</div>
                  </div>
                  {feed.feedImages.length > 0 && (
                    <img
                      src={`${serverUrl}/uploads/${feed.feedImages[0].imageUrl}`}
                      alt=""
                    />
                  )}
                </div>
              ))}
            </FeedResult>
          </Results>
        </div>
      </Slider>
    </SearchSectionBlock>
  );
};

export default SearchComponent;
