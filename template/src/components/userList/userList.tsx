import React, { FC, memo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { IUser } from "src/api/dto/Users.g";

import styled from "styled-components/native";
import { UsersActions } from "../../pages/users/UsersReducers";
import { INormalizeData } from "../../common/normalizer";

interface IProps {
  users: INormalizeData<IUser, "id">;
}

export const UserList: FC<IProps> = memo(({ users }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <List>
      {users &&
        (users.keys || []).map(key => {
          const item = users.values[key];

          return (
            item && (
              <Row
                key={item.id}
                onTouchStart={() => {
                  dispatch(UsersActions.remove(item.id));
                }}
              >
                <Item>{item.username}</Item>
                <Item>{item.email}</Item>
              </Row>
            )
          );
        })}
    </List>
  );
});

const List = styled.View``;
const Row = styled.View``;
const Item = styled.Text``;
