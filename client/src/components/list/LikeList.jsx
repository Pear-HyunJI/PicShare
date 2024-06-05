import React from 'react';
import styled from 'styled-components';
import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";

const LikeListBlock = styled.div`
display: flex;
flex-direction: column;
padding: 20px;
position: relative;
`
const Results = styled.div`
  margin-top: 20px;
`;

const UserResult = styled.div`
  // border: 1px solid red;
  // width: 300px;
  display: flex;
  // justify-content: space-between;
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

const LikeList = () => {
    const currentUser = useSelector((state) => state.members.user);

    return (
        <LikeListBlock>
           <div>
                {/* <Results>
                {filteredUsers.map((user) => (
                  <UserResult key={user.userNo}>
                    <Link to={`/personalpage/${user.userNo}`} className="imageBox"> */}
                      <img
                        src={`http://localhost:8001/uploads/${user.profilePicture}`}
                        alt={user.userNickname}
                      />
                      <span>@{user.userNickname}</span>
                    {/* </Link>
                    <FollowButton userNo={user.userNo} />
                  </UserResult>
                ))}
              </Results> */}
           </div>
        </LikeListBlock>
    );
};

export default LikeList;