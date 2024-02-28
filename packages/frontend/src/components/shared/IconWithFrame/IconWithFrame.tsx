import React, { ReactNode } from 'react';
import { cn } from 'utils/classnames';

interface IconWithFrameProps {
  icon: ReactNode;
  bgClass?: string;
  hasHighlight?: boolean;
}

export const IconWithFrame = ({
  icon,
  bgClass = 'bg-controls-secondary ',
  hasHighlight = true,
}: IconWithFrameProps) => {
  return (
    <div
      className={cn(
        'relative justify-center items-center gap-2.5 inline-flex',
        'w-16 h-16 rounded-2xl shadow-inner',
        'border border-b-[3px] border-border-interactive border-opacity-10',
        {
          [bgClass]: true,
        },
      )}
    >
      {hasHighlight && (
        <div className="bottom-0 absolute w-[37px] h-px bg-gradient-to-r from-gray-0/0 via-gray-0/50 to-gray-0/0" />
      )}
      {icon}
    </div>
  );
};
