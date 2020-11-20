import {createSlice} from "@reduxjs/toolkit";
import {IUser} from "../../api/dto/Users.g";
import {createNormalize} from "../../common/normalizer";
import {IUsersState, usersInitialState} from "./UsersState";
import {LoadState} from "../../common/loadState";
import {fetchUsers} from "./UsersActions";

const {fromResponse, reducers} = createNormalize<IUser, IUsersState>();

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
