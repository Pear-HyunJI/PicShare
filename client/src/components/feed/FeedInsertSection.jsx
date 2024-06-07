import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useSelector } from "react-redux";
import { IoIosArrowBack } from "react-icons/io";

const serverUrl = import.meta.env.VITE_API_URL;

const FeedInsertSectionBlock = styled.form`
  max-width: 600px;
  margin: 0 auto 150px;
  display: flex;
  flex-direction: column;
  gap: 30px;

  input,
  textarea,
  button {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  button {
    background: #ccc;
    color: #fff;
    border-radius: 10px;
    &:hover {
      background: gray;
    }
  }

  textarea {
    resize: none;
    height: 150px;
  }

  .top {
    margin: 10px 0;
    display: flex;
    // justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin: 20px 0 30px;
    color: #0d0d0d;
    h2 {
      flex: 0 0 80%;
      text-align: center;
      align-items: center;
    }
    button {
      background: none;
      border: none;
      color: black;
      font-size: 30px;
      font-weight: bold;
    }
  }

  .image-upload-section {
    display: flex;
    gap: 10px;

    .images {
      width: 380px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        padding: 4px;
      }

      span {
        font-size: 20px;
        color: #aaa;
      }
    }

    input {
      flex: 1;
    }
  }

  .hashtags {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 5px;
    margin: 20px 0;
    font-size: 20px;
    font-weight: bold;
    .hashtag {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 10px;

      input {
        width: 200px;
      }

      button {
        background-color: #ccc;
        border: none;
        cursor: pointer;
        padding: 10px 13px;
      }
    }
  }

  .scheduled-section,
  .location-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 20px 0;

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 10px;
      input[type="checkbox"] {
        display: none;
      }
    }

    .inputfield {
      width: 100%;
    }
  }
`;

const FeedInsertSection = () => {
  const API_KEY = "80870be1de28bf2e9c801995bec16bf2";

  const getWeatherByCoords = async (lat, lon) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    return response.data;
  };

  const getWeatherByLocationName = async (locationName) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&appid=${API_KEY}&units=metric`
    );
    return response.data;
  };

  const getLocationNameByCoords = async (lat, lon) => {
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );
    return response.data[0].name;
  };

  const user = useSelector((state) => state.members.user);
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [hashtags, setHashtags] = useState([""]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [showWeatherInfo, setShowWeatherInfo] = useState(false); // 체크박스 관련

  const [weather, setWeather] = useState(null); // 날씨 정보를 저장할 상태
  const [locationName, setLocationName] = useState(""); // 장소 이름 저장 상태
  const [latitude, setLatitude] = useState(null); // 위도 저장 상태
  const [longitude, setLongitude] = useState(null); // 경도 저장 상태

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setLatitude(latitude);
      setLongitude(longitude);
      const weatherData = await getWeatherByCoords(latitude, longitude);
      setWeather(weatherData);
      const locName = await getLocationNameByCoords(latitude, longitude);
      setLocationName(locName);
      fetchRecommendedHashtags(weatherData.weather[0].main.toLowerCase());
    });
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    console.log(images);
  };

  const handleHashtagChange = (index, value) => {
    const newHashtags = [...hashtags];
    newHashtags[index] = value;
    setHashtags(newHashtags);
  };

  const handleAddHashtag = () => {
    setHashtags([...hashtags, ""]);
  };

  const handleRemoveHashtag = (index) => {
    const newHashtags = [...hashtags];
    newHashtags.splice(index, 1);
    setHashtags(newHashtags);
  };

  const handleSave = async (isImmediate) => {
    const formData = new FormData();
    formData.append("userNo", user.userNo);
    formData.append("content", content);
    images.forEach((file) => {
      formData.append("images", file);
    });
    formData.append("hashtags", hashtags.join(" "));
    formData.append("weather", weather ? weather.weather[0].description : null); // 날씨 정보 추가
    formData.append("weathericon", weather ? weather.weather[0].icon : null); // 날씨 정보 추가
    formData.append("locationName", locationName); // 장소 이름 추가

    if (!isImmediate) {
      formData.append("scheduled_at", scheduledAt || null);
    }

    try {
      await axios.post(`${serverUrl}/feed/insert`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/feed");
    } catch (err) {
      console.error(err);
    }
  };

  const handleBack = () => {
    const confirmSave = window.confirm("임시저장하시겠어요?");
    if (confirmSave) {
      handleSave();
    } else {
      navigate(-1);
    }
  };

  const handleLocationChange = (e) => {
    setLocationName(e.target.value);
  };

  const handleGetWeatherByLocation = async () => {
    try {
      const weatherData = await getWeatherByLocationName(locationName);
      setLatitude(weatherData.coord.lat);
      setLongitude(weatherData.coord.lon);
      setWeather(weatherData);
    } catch (err) {
      console.error("Failed to fetch weather data:", err);
      alert("날씨 정보를 가져오는데 실패했습니다. 장소 이름을 확인해주세요.");
    }
  };

  useEffect(() => {
    if (latitude && longitude) {
      getWeatherByCoords(latitude, longitude).then((weatherData) => {});
    }
  }, [latitude, longitude]);

  return (
    <div>
      <FeedInsertSectionBlock
        onSubmit={(e) => {
          e.preventDefault();
          if (images.length > 0) {
            handleSave(!isScheduled); // 예약되지 않은 경우 바로 포스트함
          } else {
            alert("이미지를 하나 이상 업로드해주세요.");
          }
        }}
      >
        <div className="top">
          <button onClick={handleBack}>
            <IoIosArrowBack />
          </button>
          <h2>새 게시물</h2>
        </div>
        <div className="image-upload-section">
          {images.length > 0 ? (
            <div className="images">
              {images.slice(0, 3).map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt="upload preview"
                />
              ))}
              {images.length > 3 && <span>+{images.length - 3} more</span>}
            </div>
          ) : (
            <div
              className="images"
              style={{ border: "1px solid #ccc", borderRadius: "5px" }}
            >
              <p>photo</p>
            </div>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <textarea
          placeholder="피드 내용을 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="hashtags">
          {hashtags.map((hashtag, idx) => (
            <div className="hashtag" key={idx}>
              <span>#</span>
              <input
                type="text"
                placeholder={`${idx + 1}번째 해시태그를 입력하세요`}
                value={hashtag}
                onChange={(e) => handleHashtagChange(idx, e.target.value)}
              />
              {idx === hashtags.length - 1 && (
                <>
                  <button type="button" onClick={handleAddHashtag}>
                    +
                  </button>
                  {hashtags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHashtag(idx)}
                    >
                      -
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <div className="location-section">
          <div className="checkbox-label">
            <p>위치와 날씨 정보를 게시하시겠습니까?</p>
            <label>
              <input
                type="checkbox"
                checked={showWeatherInfo}
                onChange={() => setShowWeatherInfo(!showWeatherInfo)}
              />
              <span style={{ color: "#09fc52", fontWeight: "bold" }}>
                위치 및 날씨 정보 게시
              </span>
            </label>
          </div>
          {showWeatherInfo && (
            <div className="inputfield">
              <input
                type="text"
                placeholder="장소 이름을 입력하세요..."
                value={locationName}
                onChange={handleLocationChange}
              />
              <button type="button" onClick={handleGetWeatherByLocation}>
                날씨 정보 가져오기
              </button>
              <p>현재 위치: {locationName}</p>
              <p>현재 날씨: {weather.weather[0].description}</p>
              <p>온도: {weather.main.temp}°C</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                alt={weather.weather[0].description}
              />
            </div>
          )}
        </div>
        <div className="scheduled-section">
          <div className="checkbox-label">
            <p>지정된 시간에 게시물을 자동으로 올리시겠습니까?</p>
            <label>
              <input
                type="checkbox"
                checked={isScheduled}
                onChange={() => setIsScheduled(!isScheduled)}
              />
              <span style={{ color: "#09fc52", fontWeight: "bold" }}>
                포스팅 예약하기
              </span>
            </label>
          </div>
          {isScheduled && (
            <input
              className="inputfield"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          )}
        </div>

        <button type="submit">포스팅</button>
        {/* <button type="button" onClick={handleBack}>
          뒤로가기
        </button> */}
      </FeedInsertSectionBlock>
    </div>
  );
};

export default FeedInsertSection;
