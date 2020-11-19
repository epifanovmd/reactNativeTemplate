import { FC, memo } from "react";

export function customMemo<P>(component: FC<P>, keys: (keyof P)[]) {
  return memo(component, (prevProps, nextProps) => {
    for (const key of keys) {
      if (prevProps[key] !== nextProps[key]) {
        return false;
      }
    }

    return true;
  });
}
