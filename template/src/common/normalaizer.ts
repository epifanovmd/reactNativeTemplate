import { Draft, PayloadAction } from "@reduxjs/toolkit";

export interface INormalizeData<T, K extends keyof T> {
  values: { [key in number]?: T };
  keys: T[K][];
}

export const createNormalize = <T extends object, S>() => {
  const merge = <K extends keyof T>(
    oldData: INormalizeData<T, K>,
    newData: INormalizeData<T, K>,
  ): INormalizeData<T, K> => ({
    values: { ...oldData.values, ...newData.values },
    keys: [...oldData.keys, ...newData.keys],
  });
  const fromResponse = <K extends keyof T>(
    array: T[],
    key: K,
  ): INormalizeData<T, K> => {
    const keys: Set<T[K]> = new Set();
    const values: { [key in number]?: T } = {};

    array &&
    array.forEach(item => {
      keys.add(item[key]);
      if (values[item[key] as any]) {
        console.error(
          `createNormalize: The key by which you group is not unique: "fromResponse(array, "${key}" <---)"`,
        );
      }
      values[item[key] as any] = item;
    });

    return {
      values,
      keys: Array.from(keys.keys()),
    };
  };

  const reducers = <K extends keyof Draft<S>>(key: K) => ({
    remove: (state: Draft<S>, { payload }: PayloadAction<string | number>) => {
      (state[key] as any).data.keys = (state[key] as any).data.keys.filter(
        (item: any) => item !== payload,
      );
      delete (state[key] as any).data.values[payload];
    },
    set: <
      F extends { key: string | number; value: (values: T) => T },
      V extends { key: string | number; value: T }
      >(
      state: Draft<S>,
      { payload }: PayloadAction<F | V>,
    ) => {
      (state[key] as any).data.keys = Array.from(
        new Set([...(state[key] as any).data.keys, payload.key]),
      );
      (state[key] as any).data.values[payload.key] =
        typeof payload.value === "function"
          ? (payload.value as any)((state[key] as any).data.values)
          : payload.value;
    },
  });

  return {
    fromResponse,
    reducers,
    merge,
  };
};
