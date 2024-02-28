import {
  type ElementType,
  type ComponentPropsWithoutRef,
  forwardRef,
} from 'react';

/**
 * Construct a type by excluding common keys from one type to another.
 * @template T - The type from which to omit properties.
 * @template U - The type whose properties to omit from T.
 * @param {T} - The source type.
 * @param {U} - The target type.
 * @returns A new type that includes all properties from T except those that are common with U.
 */
export type OmitCommon<T, U> = Pick<T, Exclude<keyof T, keyof U>>;

export type PolymorphicProps<Element extends ElementType, Props> = Props &
  Omit<ComponentPropsWithoutRef<Element>, 'as'> & {
    as?: Element;
  };

// taken from : https://github.com/total-typescript/react-typescript-tutorial/blob/main/src/08-advanced-patterns/72-as-prop-with-forward-ref.solution.tsx
type FixedForwardRef = <T, P = object>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode,
) => (props: P & React.RefAttributes<T>) => JSX.Element;

export const fixedForwardRef = forwardRef as FixedForwardRef;
