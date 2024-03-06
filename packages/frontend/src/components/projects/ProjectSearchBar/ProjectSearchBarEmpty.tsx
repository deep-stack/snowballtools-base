import { InfoRoundFilledIcon } from 'components/shared/CustomIcon';
import React, { ComponentPropsWithoutRef } from 'react';
import { cn } from 'utils/classnames';

interface ProjectSearchBarEmptyProps extends ComponentPropsWithoutRef<'div'> {}

export const ProjectSearchBarEmpty = ({
  className,
  ...props
}: ProjectSearchBarEmptyProps) => {
  return (
    <div
      {...props}
      className={cn('flex items-center px-2 py-2 gap-3', className)}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-50 text-elements-warning">
        <InfoRoundFilledIcon size={16} />
      </div>
      <p className="text-elements-low-em text-sm tracking-[-0.006em]">
        No projects matching this name
      </p>
    </div>
  );
};
