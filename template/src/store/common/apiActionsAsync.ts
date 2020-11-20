import { createAsyncThunk } from "@reduxjs/toolkit";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { IAppState } from "../IAppState";
import { IExtraArguments } from "../store";
import { baseFetch, IResponse } from "../../api/baseFetch";
import { RequestType } from "../../common/requestType";

type TSuccessCallback<R> = (params: {
  getState: () => IAppState;
  dispatch: ThunkDispatch<IAppState, IExtraArguments, Action>;
  result: IResponse<R>;
  extraArguments: IExtraArguments;
}) => void;

export interface IFetchParams<R, QP, P> {
  url:
    | ((
        args: QP extends void
          ? P extends void
            ? void
            : P
          : P extends void
          ? { params: QP }
          : { params: QP } & P,
      ) => string)
    | string;
  method: RequestType;
  headers?: { [key: string]: string };
  actionType: string;
  transformData?: (result: R, getState: () => IAppState) => R;
  onSuccess?: TSuccessCallback<R>;
  onFail?: (params: {
    error?: Error;
    getState: () => IAppState;
    dispatch: ThunkDispatch<IAppState, IExtraArguments, Action>;
    extraArguments: IExtraArguments;
  }) => void;
}

type TCalcType<QP, P> = QP extends void
  ? {} & (P extends void ? void : { args: P })
  : P extends void
    ? { params: QP }
    : { args: P } & { params: QP };

export const callApiToolkit = <R, QP = void, P = void>({
  url,
  method,
  headers,
  actionType,
  transformData,
  onSuccess: _onSuccess,
  onFail,
}: IFetchParams<R, QP, P>) =>
  createAsyncThunk<
    IResponse<R>,
    QP extends void
      ? P extends void
      ? void
      : { onSuccess?: TSuccessCallback<R> } & TCalcType<QP, P>
      : { onSuccess?: TSuccessCallback<R> } & TCalcType<QP, P>,
    {
      dispatch: ThunkDispatch<IAppState, IExtraArguments, Action>;
      state: IAppState;
      extra: IExtraArguments;
    }
  >(actionType, async (args, { extra, getState, dispatch }) => {
    const { onSuccess, params, ...rest } = args || ({} as any);
    const { data, status, message, error } = await baseFetch<R, QP>(
      typeof url === "function" ? url({ params, ...rest } as any) : url,
      params || {},
      method,
      headers,
    );

    if (status >= 400 || data === null || error) {
      onFail &&
        onFail({
          error: new Error(
            (data as any)?.message || message || status.toString(),
          ),
          getState,
          dispatch,
          extraArguments: extra,
        });
      throw new Error((data as any)?.message || message || status.toString());
    } else {
      const transformedResult = transformData
        ? transformData(data, getState)
        : data;
      const payload = {
        getState,
        dispatch,
        result: { data: transformedResult, message, status },
        extraArguments: extra,
      };

      onSuccess && onSuccess(payload);
      _onSuccess && _onSuccess(payload);

      return { data: transformedResult, message, status };
    }
  });
