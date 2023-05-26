import { isAstNodeKind } from "./typeKinds";

export type ImmutableMap<K, V> = Omit<Map<K, V>, "set" | "delete" | "clear">;

type nonEmptyList<T> = [T, ...T[]];

export function notUndefined(val: unknown): boolean {
  return val !== undefined;
}

export function isKeyOfObject<T extends object>(
  key: string | number | symbol,
  obj: T
): key is keyof T {
  return key in obj;
}

export function notEmpty<T>(list: T[]): list is nonEmptyList<T> {
  return list.length > 0;
}

export function isInList(val: unknown, list: readonly string[]) {
  if (!isAstNodeKind(val)) return false;
  return list.includes(val.type);
}
