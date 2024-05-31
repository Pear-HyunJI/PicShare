import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "@/store/member";
import styled from "styled-components";

const UserSearchSectionBlock = styled.div``;

const UserSearchSection = () => {
  const dispatch = useDispatch();
  const allusers = useSelector((state) => state.members.users);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (allusers.length > 0) {
      setUsers(allusers);
    }
  }, [allusers]);

  return (
    <UserSearchSectionBlock>
      <h2>Users</h2>
      <ul>
        {users &&
          users.map((u) => (
            <li key={u.userNo}>
              <img src={u.photo} alt={u.userNickname} />
              <span>{u.userNickname}</span>
            </li>
          ))}
      </ul>
    </UserSearchSectionBlock>
  );
};

export default UserSearchSection;
