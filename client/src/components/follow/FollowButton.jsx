import React from 'react';
import axios from 'axios';
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: skyblue;
  border: none;
  color: #fff;
  padding: 10px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 15px;
  margin: 20px 21px;
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    background-color: #fff;
    color:skyblue;
  }
`;

const FollowButton = ({ userId, followerId }) => {
  const handleFollow = () => {
    axios.post('/followers', { userId, followerId })
      .then(response => {
        console.log(response.data);
        // 상태를 업데이트하여 팔로워 수를 증가시키는 로직을 추가함
      })
      .catch(error => console.error('Error following user:', error));
  };

  return <StyledButton onClick={handleFollow}>Follow</StyledButton>;
};

export default FollowButton;