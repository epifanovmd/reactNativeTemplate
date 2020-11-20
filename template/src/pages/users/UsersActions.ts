import {callApiToolkit} from "../../store/common/apiActionsAsync";
import {IUser} from "../../api/dto/Users.g";
import {RequestType} from "../../common/requestType";

export const fetchUsers = callApiToolkit<IUser[]>({
  url: "users",
  method: RequestType.GET,
  actionType: "USERS/GET_USERS",
});

