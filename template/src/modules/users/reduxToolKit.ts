import { createSlice } from "@reduxjs/toolkit";
import { callApiToolkit } from "../../store/common/apiActionsAsync";
import { IUser } from "../../api/dto/Users.g";
import { RequestType } from "../../common/requestType";
import { createNormalize } from "../../common/normalizer";
import { IUsersState, usersInitialState } from "./IUsersState";
import { LoadState } from "../../common/loadState";

export const fetchUsers = callApiToolkit<IUser[]>({
  url: "users",
  method: RequestType.GET,
  actionType: "USERS/GET_USERS",
});

const { fromResponse, reducers } = createNormalize<IUser, IUsersState>();

export const usersSlice = createSlice({
  name: "users",
  initialState: usersInitialState,
  reducers: {
    ...reducers("users"),
  },
  extraReducers: builder => {
    builder.addCase(fetchUsers.pending, state => {
      state.users.loadState = LoadState.refreshing;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users.data = fromResponse(action.payload.data, "id");
    });
    builder.addCase(fetchUsers.rejected, (state, res) => {
      state.users.loadState = LoadState.error;
      console.log("Error", res);
    });
  },
});

export const UsersActions = usersSlice.actions;
