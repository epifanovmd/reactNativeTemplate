export function assertNotNull<T>(
  item: T | null | undefined,
  message?: string,
): T {
  if (item === null || item === undefined) {
    throw new Error(`Object can not be null.${message}` ? message : "");
  }

  return item;
}
