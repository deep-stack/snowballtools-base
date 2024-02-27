/**
 * Construct a type by excluding common keys from one type to another.
 * @template T - The type from which to omit properties.
 * @template U - The type whose properties to omit from T.
 * @param {T} - The source type.
 * @param {U} - The target type.
 * @returns A new type that includes all properties from T except those that are common with U.
 */
export type OmitCommon<T, U> = Pick<T, Exclude<keyof T, keyof U>>;
