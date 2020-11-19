import { IReduxData } from "../../store/IAppState";
import { INormalizeData } from "../../common/normalaizer";
import { IUser } from "../../api/dto/Users.g";
import { LoadState } from "../../common/loadState";

export interface IUsersState {
  users: IReduxData<INormalizeData<IUser, "id">>;
}

export const usersInitialState: IUsersState = {
  users: {
    data: {
      keys: [],
      values: {},
    },
    loadState: LoadState.needLoad,
  },
};
