import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "@/store/member";
import { fetchFollowingList } from "@/store/follow";
import styled from "styled-components";
import FollowButton from "@/components/follow/FollowButton";

const UserSearchSectionBlock = styled.div``;

const UserSearchSection = () => {
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.members.users);
  const currentUser = useSelector((state) => state.members.user);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchUsers());
      dispatch(fetchFollowingList(currentUser.userNo));
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (allUsers.length > 0) {
      setUsers(allUsers);
    }
  }, [allUsers]);

  return (
    <UserSearchSectionBlock>
      <h2>Users</h2>
      <ul>
        {users &&
          users.map((u) => (
            <li key={u.userNo}>
              <img src={u.photo} alt={u.userNickname} />
              <span>{u.userNickname}</span>
              <FollowButton userNo={u.userNo} />
            </li>
          ))}
      </ul>
    </UserSearchSectionBlock>
  );
};

export default UserSearchSection;
