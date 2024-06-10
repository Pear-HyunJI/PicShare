import React from "react";
import styled from "styled-components";

const serverUrl = import.meta.env.VITE_API_URL;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  max-height: 80vh;
  overflow-y: auto;

  ul {
    list-style: none;
    padding: 20px 0;

    li {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      img {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }
    }
  }

  button {
    margin-top: 20px;
    padding: 10px 20px;
    background: #09dd52;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #09bd52;
    }
  }
`;

const LikedUsersModal = ({ likedUsers, onClose }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h3>좋아요 누른 사용자</h3>
        <ul>
          {likedUsers.map((user) => (
            <li key={user.userNo}>
              <img
                src={`${serverUrl}/uploads/${user.profilePicture}`}
                alt={`${user.userNickname} 프로필`}
              />
              <span>{user.userNickname}</span>
            </li>
          ))}
        </ul>
        <button onClick={onClose}>닫기</button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LikedUsersModal;
