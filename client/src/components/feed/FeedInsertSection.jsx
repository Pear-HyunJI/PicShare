import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useSelector } from "react-redux";
import { IoIosArrowBack } from "react-icons/io";
import { MdPlace } from "react-icons/md";

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
    margin: 10px 0 0 0;

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 10px;
      input[type="checkbox"] {
        display: none;
      }
    }

    .scheduleinputfield {
      width: 100%;
    }
    .weatherinputfield {
      padding: 15px 10px 10px;
      display: flex;

      .infowrap {
        width: 140px;

        dispaly: flex;
        flex-direction: column;
        p {
        }
        .weatherinfo {
          img {
            width: 60px;
          }
          font-size: 25px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
      }
      .inputwrap {
        margin: auto;

        span {
          font-size: 12px;
        }
        .locationinput {
          input {
            margin-right: 5px;
          }
        }
      }
    }
    // .weatherinputfield {
    //   padding: 15px 10px 10px;
    //   .infowrap {
    //     // border: 1px solid red;
    //     align-items: center;
    //     display: flex;
    //     .locationinfo {
    //       // border: 1px solid green;
    //       font-size: 20px;
    //       margin-bottom: 14px;
    //       width: 150px;
    //     }
    //     .inputwrap {
    //       span {
    //         font-size: 10px;
    //       }
    //       .locationinput {
    //       }
    //     }
    //   }
    //   .weatherinfo {
    //     display: flex;
    //     align-items: center;
    //   }
    // }
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
  const [recommendedHashtags, setRecommendedHashtags] = useState([]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [showWeatherInfo, setShowWeatherInfo] = useState(false);

  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

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

  const fetchRecommendedHashtags = (weatherCondition) => {
    let recommendedHashtags = [];
    switch (weatherCondition) {
      case "clear":
        recommendedHashtags = ["#맑음", "#햇빛", "#화창한날"];
        break;
      case "clouds":
        recommendedHashtags = ["#구름", "#흐림", "#잔잔한날"];
        break;
      case "rain":
        recommendedHashtags = ["#비", "#우산", "#촉촉한날"];
        break;
      case "snow":
        recommendedHashtags = ["#눈", "#눈오는날", "#추운날"];
        break;
      // 추가 날씨 조건에 따른 해시태그를 추가할 수 있습니다.
      default:
        recommendedHashtags = ["#오늘날씨"];
    }
    setRecommendedHashtags(recommendedHashtags);
  };

  const handleRecommendedHashtagClick = (hashtag) => {
    const firstEmptyIndex = hashtags.findIndex((ht) => ht === "");
    if (firstEmptyIndex !== -1) {
      handleHashtagChange(firstEmptyIndex, hashtag);
    } else {
      setHashtags([...hashtags, hashtag]);
    }
  };

  const handleSave = async (isImmediate) => {
    const formData = new FormData();
    formData.append("userNo", user.userNo);
    formData.append("content", content);
    images.forEach((file) => {
      formData.append("images", file);
    });
    formData.append("hashtags", hashtags.join(" "));
    formData.append("weather", weather ? weather.weather[0].description : null);
    formData.append("weathericon", weather ? weather.weather[0].icon : null);
    formData.append("locationName", locationName);

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
      fetchRecommendedHashtags(weatherData.weather[0].main.toLowerCase());
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
            handleSave(!isScheduled);
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
            <>
              <div className="location-input">
                <MdPlace />
                <input
                  type="text"
                  placeholder="장소를 입력해주세요..."
                  value={locationName}
                  onChange={handleLocationChange}
                />
                <button
                  type="button"
                  onClick={handleGetWeatherByLocation}
                  style={{ marginLeft: "10px" }}
                >
                  위치 검색
                </button>
              </div>
              {weather && (
                <div className="weather-info">
                  <p>날씨: {weather.weather[0].description}</p>
                  <p>온도: {weather.main.temp}°C</p>
                  <div className="recommended-hashtags">
                    {recommendedHashtags.map((hashtag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleRecommendedHashtagClick(hashtag)}
                        style={{
                          margin: "0 5px",
                          background: "#f0f0f0",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          padding: "5px 10px",
                        }}
                      >
                        {hashtag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="schedule-section">
          <div className="checkbox-label">
            <p>게시물을 예약하시겠습니까?</p>
            <label>
              <input
                type="checkbox"
                checked={isScheduled}
                onChange={() => setIsScheduled(!isScheduled)}
              />
              <span style={{ color: "#09fc52", fontWeight: "bold" }}>예약</span>
            </label>
          </div>
          {isScheduled && (
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          )}
        </div>
        <button type="submit">게시</button>
      </FeedInsertSectionBlock>
    </div>
  );
};

export default FeedInsertSection;
