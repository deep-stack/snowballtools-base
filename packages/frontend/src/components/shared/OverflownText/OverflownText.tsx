import { cn } from 'utils/classnames';
import { Tooltip, TooltipProps } from 'components/shared/Tooltip';
import { debounce } from 'lodash';
import {
  ComponentPropsWithRef,
  PropsWithChildren,
  useRef,
  useState,
  useEffect,
} from 'react';
import { PolymorphicProps } from 'types/common';

interface OverflownTextProps extends ComponentPropsWithRef<'span'> {
  tooltipProps?: TooltipProps;
  content?: string;
}

type ElementType = 'span' | 'div';

// This component is used to truncate text and show a tooltip if the text is overflown.
export const OverflownText = <Element extends ElementType>({
  tooltipProps,
  children,
  content,
  className,
  as,
  ...props
}: PropsWithChildren<PolymorphicProps<Element, OverflownTextProps>>) => {
  const ref = useRef(null);
  const [isOverflown, setIsOverflown] = useState(false);

  useEffect(() => {
    const element = ref.current as HTMLElement | null;
    if (!element) return;

    setIsOverflown(element.scrollWidth > element.clientWidth);

    const handleResize = () => {
      const isOverflown = element.scrollWidth > element.clientWidth;
      setIsOverflown(isOverflown);
    };

    window.addEventListener('resize', debounce(handleResize, 500));

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const Component = as || 'span';

  return (
    <Tooltip
      content={content ?? children}
      delayDuration={500}
      contentProps={{
        className: 'text-xs',
      }}
      open={isOverflown ? undefined : false}
      {...tooltipProps}
    >
      <Component
        ref={ref}
        className={cn('truncate block', className)} // line-clamp-1 won't work here
        {...props}
      >
        {children}
      </Component>
    </Tooltip>
  );
};
