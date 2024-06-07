import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import axios from "axios";
import { fetchUsers, userLogout } from "@/store/member";

const serverUrl = import.meta.env.VITE_API_URL;

const ProfileModifyBlock = styled.div`
  max-width: 345px;
  margin: 50px auto;
  text-align: center;
  .setting {
    text-align: center;
    margin-bottom: 30px;
    font-size: 30px;
  }
  table {
    width: 100%;
    .modify {
      font-weight: bold;
      text-align: left;
      padding: 20px;
      // color: red;
    }
    td {
      padding: 5px 20px;
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
        margin-bottom: 10px;
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
    margin-top: 50px;
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
      color: #fff;
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
    button {
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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userNicknameRef = useRef();
  const [userInfo, setUserInfo] = useState({
    userNickname: "",
    currentPassword: "",
    newPassword: "",
    photo: "",
  });
  const [error, setError] = useState({});
  const [success, setSuccess] = useState({});
  const [useDefaultProfile, setUseDefaultProfile] = useState(false);
  const [profilePreview, setProfilePreview] = useState("");

  const user = useSelector((state) => state.members.user);

  useEffect(() => {
    if (user) {
      setProfilePreview(`${serverUrl}/uploads/${user.profilePicture}`);
      setUserInfo((prevState) => ({
        ...prevState,
        userNickname: user.userNickname,
      }));
    }
  }, [user]);

  const handleCheckboxChange = () => {
    setUseDefaultProfile((prevUseDefaultProfile) => {
      const newUseDefaultProfile = !prevUseDefaultProfile;
      setProfilePreview(
        newUseDefaultProfile
          ? `${serverUrl}/uploads/defaultProfile.jpg`
          : `${serverUrl}/uploads/${user.profilePicture}`
      );
      return newUseDefaultProfile;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUserInfo((prevUserInfo) => ({ ...prevUserInfo, photo: file }));
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleChange = async (e) => {
    const { value, name } = e.target;
    setUserInfo((userInfo) => ({ ...userInfo, [name]: value }));
    setError((error) => ({ ...error, [name]: "" }));
    setSuccess((success) => ({ ...success, [name]: "" }));

    // 닉네임 중복 체크
    if (name === "userNickname" && value) {
      try {
        await axios.post(`${serverUrl}/auth/check-nickname`, {
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

  // const updateprofile = (e) => {
  //   console.log("업데이트포토 유저인포", userInfo.userNickname);
  //   console.log("업데이트프로필의 포토", userInfo.photo);
  //   // console.log("업데이트프로필의 포토네임", userInfo.photo.File.name);
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("userNo", user.userNo);
  //   formData.append("userNickname", userInfo.userNickname);
  //   formData.append("currentPassword", userInfo.currentPassword);
  //   formData.append("newPassword", userInfo.newPassword);

  //   formData.append("photo", userInfo.photo);

  //   console.log("폼데이터", formData);
  //   try {
  //     const res = axios.put(
  //       `${serverUrl}/auth/update-profile`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     if (res.data.affectedRows === 1) {
  //       alert("회원수정이 완료되었습니다.");
  //       navigate(-1);
  //     } else {
  //       alert("회원수정이 실패했습니다.");
  //     }
  //   } catch (err) {
  //     console.error("서버 오류:", err);
  //     if (err.response && err.response.data) {
  //       const { field, message } = err.response.data;
  //       setError((error) => ({ ...error, [field]: message }));
  //     } else {
  //       console.error(err);
  //     }
  //   }
  // };

  const updateprofile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userNo", user.userNo);
    formData.append("userNickname", userInfo.userNickname);
    formData.append("currentPassword", userInfo.currentPassword);
    formData.append("newPassword", userInfo.newPassword);
    if (!useDefaultProfile && userInfo.photo) {
      formData.append("photo", userInfo.photo);
    }

    try {
      const res = await axios.put(
        `${serverUrl}/auth/update-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.affectedRows >= 1) {
        // 정보 수정후에 푸터랑 회원정보창의 정보가 업데이트가 바로 안됨
        alert(
          "회원정보가 수정되었습니다. 변경 사항을 적용하려면 로그아웃 후 다시 로그인해 주세요"
        );
        dispatch(userLogout(user.userNo));
        navigate("/login");
      } else {
        alert("회원수정이 실패했습니다.");
      }
    } catch (err) {
      console.error("서버 오류:", err);
      if (err.response && err.response.data) {
        const { field, message } = err.response.data;
        setError((prevError) => ({ ...prevError, [field]: message }));
      } else {
        console.error(err);
      }
    }
  };

  const handleDelete = (userNo) => {
    console.log("탈퇴회원", userNo);
    const confirmDelete = window.confirm(
      "정말 회원 탈퇴를 하시겠습니까?\n\n" +
        "회원 탈퇴 시, 귀하의 계정 및 모든 데이터가 영구적으로 삭제됩니다.\n"
    );

    if (confirmDelete) {
      axios
        .delete(`${serverUrl}/auth/delete`, { params: { userNo } })
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
      <form onSubmit={updateprofile}>
        <div>
          <p className="setting">프로필 설정</p>
        </div>
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="profileImg">
                  <img src={profilePreview} alt="프로필" />
                </label>
              </td>
            </tr>
            <tr>
              <td>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={useDefaultProfile}
                    onChange={handleCheckboxChange}
                  />
                  기본 이미지로 변경
                </label>
                <input
                  type="file"
                  id="profileImg"
                  accept="image/*"
                  name="photo"
                  onChange={handleFileChange}
                  disabled={useDefaultProfile}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label className="checkbox-label">이메일</label>
                <input type="text" value={user.email} disabled />
              </td>
            </tr>
            <p className="modify">* 닉네임 변경하기</p>
            <tr>
              <td>
                <label className="checkbox-label">새 닉네임 입력</label>
                <input
                  type="text"
                  ref={userNicknameRef}
                  value={userInfo.userNickname}
                  name="userNickname"
                  onChange={handleChange}
                  placeholder="변경할 닉네임"
                />
                {error.userNickname && (
                  <p className="error">{error.userNickname}</p>
                )}
                {success.userNickname && (
                  <p className="success">{success.userNickname}</p>
                )}
              </td>
            </tr>
            <p className="modify">* 비밀번호 변경하기</p>

            <tr>
              <td>
                <label className="checkbox-label">현재 비밀번호 입력</label>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="현재 비밀번호를 입력해주세요."
                  value={userInfo.currentPassword}
                  onChange={handleChange}
                />
                {error.currentPassword && (
                  <p className="error">{error.currentPassword}</p>
                )}
              </td>
            </tr>

            <tr>
              <td>
                <label className="checkbox-label">새 비밀번호 입력</label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="변경할 비밀번호을 입력해주세요."
                  value={userInfo.newPassword}
                  onChange={handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="btn">
          <button type="submit">
            <span className="textColor">회원정보 수정</span>
          </button>
        </div>
      </form>
      <div className="delete">
        <button onClick={() => handleDelete(user.userNo)}>회원탈퇴</button>
      </div>
    </ProfileModifyBlock>
  );
};

export default ProfileModify;
