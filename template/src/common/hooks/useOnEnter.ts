import { DependencyList, KeyboardEvent, useCallback } from "react";

export function useOnEnter(callback: Function, dependencies: DependencyList) {
  return useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
