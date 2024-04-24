import { ComponentPropsWithoutRef } from 'react';
import { cn } from 'utils/classnames';

export interface DotBorderProps extends ComponentPropsWithoutRef<'div'> {}

export const DotBorder = ({ className, ...props }: DotBorderProps) => {
  const imageSrc = '/dot-border-line.svg';

  return (
    <div {...props} className={cn(className)}>
      <div
        className="h-1 w-full bg-repeat-x bg-top"
        style={{
          backgroundImage: `url(${imageSrc})`,
        }}
      />
    </div>
  );
};
