import { LoadState } from "../common/loadState";
import { IUsersState } from "../modules/users/IUsersState";

export interface IReduxData<T> {
  loadState: LoadState;
  count?: number;
  page?: number;
  limit?: number;
  data: T;
}

export interface IAppState {
  usersPage: IUsersState;
}
