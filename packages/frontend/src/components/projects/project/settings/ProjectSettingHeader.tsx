import { PropsWithChildren } from 'react';

import { Heading } from 'components/shared/Heading';

export interface ProjectSettingHeaderProps extends PropsWithChildren {
  headingText: string;
  button?: React.ReactNode;
  badge?: React.ReactNode;
}

const ProjectSettingHeader: React.FC<ProjectSettingHeaderProps> = ({
  headingText,
  button,
  badge,
  ...props
}) => {
  return (
    <div className="flex justify-between items-center" {...props}>
      <div className="flex space-x-2 items-center">
        <Heading className="text-lg font-medium leading-normal">
          {headingText}
        </Heading>
        {badge}
      </div>
      {button ?? button}
    </div>
  );
};

export { ProjectSettingHeader };
