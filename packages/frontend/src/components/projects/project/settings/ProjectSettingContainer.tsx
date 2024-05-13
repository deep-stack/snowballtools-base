import { PropsWithChildren } from 'react';

import { ProjectSettingHeader } from './ProjectSettingHeader';

export interface ProjectSettingContainerProps extends PropsWithChildren {
  headingText: string;
  className?: string;
  button?: React.ReactNode;
  badge?: React.ReactNode;
}

const ProjectSettingContainer: React.FC<ProjectSettingContainerProps> = ({
  headingText,
  className,
  button,
  children,
  badge,
  ...props
}: ProjectSettingContainerProps) => {
  return (
    <div className={'flex-col justify-start gap-8 space-y-3 px-2'} {...props}>
      <ProjectSettingHeader
        headingText={headingText}
        button={button}
        badge={badge}
      />
      {children}
    </div>
  );
};

export { ProjectSettingContainer };
