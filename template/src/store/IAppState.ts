import { LoadState } from "../common/loadState";
import { IUsersState } from "../pages/users/UsersState";

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
