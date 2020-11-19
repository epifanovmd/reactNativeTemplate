import querystring from "query-string";
import { IEmpty } from "../common/IEmpty";
import { RequestType } from "../common/requestType";
import { api_url } from "../../app.json";

export interface IResponse<R> {
  data: R;
  status: number;
  error?: Error;
  message?: string;
}

export const baseFetch = async <R, P>(
  url: string,
  params: P | IEmpty = {},
  method: RequestType = RequestType.GET,
  headers: { [key: string]: string } = {},
): Promise<IResponse<R>> => {
  const body =
    method !== RequestType.GET ? { body: JSON.stringify(params) } : {};

  const hasParams = Object.keys(params).length > 0;
  const urlResult =
    method !== RequestType.GET
      ? `${url}`
      : `${url}${hasParams ? "?" : ""}${querystring.stringify(params as any)}`;

  try {
    const res = await fetch(api_url + urlResult, {
      method,
      ...body,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
      },
    });

    const json = (await res?.json()) || {};
    const status = res.status;

    return { data: json as any, status };
  } catch (error) {
    return {
      data: {} as R,
      status: 500,
      error: error as Error,
      message: error.message,
    };
  }
};
