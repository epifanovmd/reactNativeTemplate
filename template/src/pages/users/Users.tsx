import React, { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { IAppState } from "../../store/IAppState";
import { UserList } from "../../components/userList/userList";
import styled from "styled-components/native";
import {fetchUsers} from "./UsersActions";

interface IProps {}

const Users: FC<IProps> = () => {
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);

    await dispatch(
      fetchUsers({
        onSuccess: ({ result }) => {
          console.log("-------", result.data);
        },
      }),
    );
    setRefreshing(false);
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchUsers({
        onSuccess: ({ result }) => {
          console.log("-------", result.data);
        },
      }),
    );
  }, [dispatch]);
  const { t } = useTranslation();
  const users = useSelector((state: IAppState) => state.usersPage.users);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <UserList users={users.data} />
    </ScrollView>
  );
};

export default Users;

const RefreshControl = styled.RefreshControl``;
const ScrollView = styled.ScrollView``;
