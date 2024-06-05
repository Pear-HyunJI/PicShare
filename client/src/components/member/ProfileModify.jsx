import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; //회원탈퇴 추가해주세여
import { useSelector, useDispatch } from "react-redux"; // 회원탈퇴 추가
import styled from "styled-components";
import axios from "axios";
import { fetchUsers } from "@/store/member"; //회원탈퇴 추가

const ProfileModifyBlock = styled.div`
    max-width: 345px;
    margin: 100px auto;
    text-align: center;
  .setting {
    text-align: center;
    margin-bottom: 40px;
    font-size: 30px;
  }
  table {
    width: 100%;
    td {
      padding: 20px;
      text-align: center;
      img {
        border-radius: 50%;
        width: 150px;
        height: 150px;
      }
      .checkbox-label {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
        font-size: 13px;
        text-align: center;
        margin-bottom:10px;

        input[type="checkbox"] {
          display: none;
        }
      }
    }
    input {
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 4px;
      text-align: center;
    }
  }
  .btn {
    margin-top: 20px 0;
    button {
      margin-bottom: 20px;
      width: 88%;
      height: 40px;
      background: #ccc;
      color: #fff;
      border-radius: 5px;
      &:hover {
        background: gray;
      }
    }
    .textColor {
      color: #09fc52;
    }
  }
  .error {
    color: red;
    font-size: 0.875rem;
    margin-top: 5px;
  }
  .success {
    color: green;
    font-size: 0.875rem;
    margin-top: 5px;
  }
.delete {
  button{
    width: 88%;
      height: 40px;
      background: #f55;
      color: #fff;
      border-radius: 5px;
      &:hover {
        background: #f00;
      }
    }
  }  
`;

const ProfileModify = () => {
  const dispatch = useDispatch(); // 추가
  const navigate = useNavigate(); // 추가

  const userNicknameRef = useRef();
  const [userInfo, setUserInfo] = useState({
    userNickname: "",
    photo: "",
  });
  const [error, setError] = useState({});
  const [success, setSuccess] = useState({});
  const [useDefaultProfile, setUseDefaultProfile] = useState(true); // 기본은 기본프로필 사용
  const [profilePreview, setProfilePreview] = useState(
    "http://localhost:8001/uploads/defaultProfile.jpg"
  ); // 프로필프리뷰

  const user = useSelector((state) => state.members.user);

// 프로필프리뷰
const handleCheckboxChange = () => {
  setUseDefaultProfile((prevUseDefaultProfile) => {
    const newUseDefaultProfile = !prevUseDefaultProfile;
    console.log("체크박스 클릭시", newUseDefaultProfile);
    setProfilePreview(
      newUseDefaultProfile
        ? "http://localhost:8001/uploads/defaultProfile.jpg"
        : profilePreview
    );
    return newUseDefaultProfile;
  });
};

// 프로필사진 변경
const handleFileChange = (e) => {
  const file = e.target.files[0];
  setUserInfo((prevUserInfo) => ({ ...prevUserInfo, photo: file }));
  setProfilePreview(URL.createObjectURL(file)); // 사진을 등록하면 프로필프리뷰 변경
};

// 닉네임 중복체크
const handleChange = async (e) => {
  const { value, name } = e.target;
  setUserInfo((userInfo) => ({ ...userInfo, [name]: value }));
  setError((error) => ({ ...error, [name]: "" }));
  setSuccess((success) => ({ ...success, [name]: "" }));

  if (name === "userNickname" && value) {
    try {
      await axios.post("http://localhost:8001/auth/check-nickname", {
        userNickname: value,
      });
      setSuccess((success) => ({
        ...success,
        userNickname: "사용 가능한 닉네임입니다.",
      }));
    } catch (err) {
      if (err.response && err.response.data) {
        setError((error) => ({
          ...error,
          userNickname: err.response.data.message,
        }));
      }
    }
  }
};

// submit
const register = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("userNickname", userInfo.userNickname);
  if (useDefaultProfile || !userInfo.photo) {
    formData.append("photo", "defaultProfile.jpg");
  } else {
    formData.append("photo", userInfo.photo);
  }

  try {
    const res = await axios.put(
      "http://localhost:8001/auth/update",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (res.data.affectedRows === 1) {
      alert("회원수정이 완료되었습니다.");
      navigate("/feed");
    } else {
      alert("회원수정이 실패했습니다.");
    }
  } catch (err) {
    console.error("서버 오류:", err);
    if (err.response && err.response.data) {
      const { field, message } = err.response.data;
      setError((error) => ({ ...error, [field]: message }));
    } else {
      console.error(err);
    }
  }
};


 // 회원탈퇴기능 추가
 const handleDelete = (userNo) => {
  console.log("탈퇴회원", userNo);
  const confirmDelete = window.confirm(
    "정말 회원 탈퇴를 하시겠습니까?\n\n" +
      "회원 탈퇴 시, 귀하의 계정 및 모든 데이터가 영구적으로 삭제됩니다.\n"
  );

  if (confirmDelete) {
    axios
      .delete(`http://localhost:8001/auth/delete`, { params: { userNo } })
      .then((res) => {
        if (res) {
          console.log(res.data);
          dispatch(fetchUsers());
          alert("회원탈퇴가 완료되었습니다.");
          navigate("/login");
        } else {
          alert("삭제하지 못했습니다.");
        }
      })
      .catch((err) => console.log(err));
  }
};


  return (
    <ProfileModifyBlock>
      <form onSubmit={register}>
      <div >
          <p className="setting">프로필 설정</p>
          </div>
            <table>
              <tbody>
                <tr>
                <td>
                <img src={profilePreview} alt="프로필사진" />
              </td>
            </tr>
            <tr>
              <td>
                <div className="checkbox-label">
                  <p>프로필사진을 변경할까요?</p>
                  <label>
                    <input
                      type="checkbox"
                      checked={!useDefaultProfile}
                      onChange={handleCheckboxChange}
                    />
                    {useDefaultProfile ? (
                      <span
                        style={{
                          color: "#09fc52",
                          fontWeight: "bold",
                        }}
                      >
                        사진 추가하기
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#09fc52",
                          fontWeight: "bold",
                        }}
                      >
                        기본 이미지로 변경
                      </span>
                    )}
                  </label>
                </div>
                {!useDefaultProfile && (
                  <input
                    type="file"
                    name="photo"
                    id="photo"
                    onChange={handleFileChange}
                    placeholder="Profile Image"
                  />
                )}
              </td>
            </tr>
            <tr>
              <td>
                <input
                  type="text"
                  name="userNickname"
                  id="userNickname"
                  ref={userNicknameRef}
                  value={userInfo.userNickname}
                  onChange={handleChange}
                  placeholder="Usernickname"
                  required
                />
                {error.userNickname && (
                  <p className="error">{error.userNickname}</p>
                )}
                {success.userNickname && (
                  <p className="success">{success.userNickname}</p>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="btn">
          <button type="submit">변경하기</button>
        </div>
      </form>
       {/* 회원탈퇴버튼 추가 */}
       <div className="delete">
        <button onClick={() => handleDelete(user.userNo)}>회원탈퇴</button>
      </div>

    </ProfileModifyBlock>
  );
};

export default ProfileModify;



