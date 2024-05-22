import {
  ReactElement,
  isValidElement,
  Children,
  cloneElement as reactCloneElement,
  HTMLProps,
  ReactNode,
} from 'react';
import { ClassProp } from 'tailwind-variants';
import { cn } from './classnames';

interface cloneElement extends HTMLProps<ReactNode> {
  element: ReactNode;
  themeStyle?: (props: ClassProp) => string;
}

export const cloneElement = ({
  element,
  themeStyle,
  className,
  ...props
}: cloneElement) => {
  if (isValidElement(element)) {
    return (
      <>
        {Children.map(element, (child) => {
          const originalClassName = (child.props as HTMLProps<ReactNode>)
            ?.className;

          return reactCloneElement(child as ReactElement, {
            className: themeStyle
              ? themeStyle({
                  className: cn(originalClassName, className), // overriding icon classNames
                })
              : originalClassName,
            ...props,
          });
        })}
      </>
    );
  }
  return <></>;
};
