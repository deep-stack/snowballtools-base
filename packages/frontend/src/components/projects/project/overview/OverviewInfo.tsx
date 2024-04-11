import { PropsWithChildren } from 'react';
import { cloneElement } from 'utils/cloneElement';

interface OverviewInfoProps {
  label: string;
  icon: React.ReactNode;
}

export const OverviewInfo = ({
  label,
  icon,
  children,
}: PropsWithChildren<OverviewInfoProps>) => {
  const styledIcon = cloneElement({
    element: icon,
    className: 'w-4 h-4',
  });

  return (
    <div className="flex justify-between gap-2 py-3 text-sm items-center">
      <div className="flex gap-2 items-center text-elements-high-em">
        {styledIcon}
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
};
