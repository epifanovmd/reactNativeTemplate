import { combineReducers, Reducer } from "redux";

import { IAppState } from "../IAppState";
import { usersSlice } from "../../modules/users/reduxToolKit";

export type Reducers<T> = {
  [P in keyof T]: Reducer<T[P]>;
};

export function createMainReduce(): Reducer<IAppState> {
  const _reducers: Reducers<IAppState> = { usersPage: usersSlice.reducer };

  return combineReducers(_reducers);
}
