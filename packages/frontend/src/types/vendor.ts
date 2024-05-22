// Pulled from react-calendar/dist/cjs/shared/types
type ValuePiece = Date | null;
export type Range<T> = [T, T];
export type Value = ValuePiece | Range<ValuePiece>;
