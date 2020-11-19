import { configureStore } from "@reduxjs/toolkit";
import i18next from "i18next";
import { Store } from "redux";
import thunkMiddleware from "redux-thunk";

import { IAppState } from "./IAppState";
import { createMainReduce } from "./reducers";
import { initSocket } from "../socket/initSocket";

export const socket: SocketIOClient.Socket = initSocket();

export interface IExtraArguments {
  i18next: typeof i18next;
  socket: SocketIOClient.Socket;
}

const rootReducer = createMainReduce();

export const createSimpleStore = (preloadedState?: IAppState) => {
  const store: Store<IAppState, any> = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: [
      thunkMiddleware.withExtraArgument<IExtraArguments>({
        i18next,
        socket,
      }),
    ],
    devTools: process.env.NODE_ENV === "development",
  });

  return store;
};
