import React, {
  ComponentPropsWithoutRef,
  MouseEvent,
  useCallback,
} from 'react';
import { ProjectCardTheme, projectCardTheme } from './ProjectCard.theme';
import { Project } from 'gql-client';
import { Button } from 'components/shared/Button';
import { WavyBorder } from 'components/shared/WavyBorder';
import {
  BranchIcon,
  ClockIcon,
  GitHubLogo,
  HorizontalDotIcon,
  WarningDiamondIcon,
} from 'components/shared/CustomIcon';
import { relativeTimeMs } from 'utils/time';
import { useNavigate } from 'react-router-dom';
import { Avatar } from 'components/shared/Avatar';
import { getInitials } from 'utils/geInitials';
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from '@material-tailwind/react';

export interface ProjectCardProps
  extends ComponentPropsWithoutRef<'div'>,
    ProjectCardTheme {
  project: Project;
}

// TODO: Update the whole component to use `Link` from `react-router-dom` and remove the `useNavigate` hook,
// currently it's not possible to use `Link` because the dot menu is not a direct child of the `Link` component
export const ProjectCard = ({
  className,
  project,
  status = 'failure',
  ...props
}: ProjectCardProps) => {
  const theme = projectCardTheme();
  const hasDeployment = project.deployments.length > 0;
  // TODO: Update this to use the actual status from the API
  const hasError = status === 'failure';

  const navigate = useNavigate();

  const handleOptionsClick = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    e.stopPropagation();
  };

  const handleClick = useCallback(() => {
    navigate(`projects/${project.id}`);
  }, [project.id, navigate]);

  return (
    <div
      {...props}
      className={theme.wrapper({ className })}
      onClick={handleClick}
    >
      {/* Upper content */}
      <div className={theme.upperContent()}>
        {/* Icon container */}
        <Avatar
          size={48}
          imageSrc={project.icon}
          initials={getInitials(project.name)}
        />
        {/* Title and website */}
        <div className={theme.content()}>
          <p className={theme.title()}>{project.name}</p>
          <p className={theme.description()}>
            {project.deployments[0]?.domain?.name ?? 'No domain'}
          </p>
        </div>
        {/* Icons */}
        <div className={theme.icons()}>
          {hasError && <WarningDiamondIcon className="text-elements-danger" />}
          <Menu placement="bottom-end">
            <MenuHandler>
              <Button
                shape="default"
                size="xs"
                variant="ghost"
                iconOnly
                onClick={handleOptionsClick}
              >
                <HorizontalDotIcon />
              </Button>
            </MenuHandler>
            <MenuList placeholder={''}>
              <MenuItem placeholder={''}>Project settings</MenuItem>
              <MenuItem className="text-red-500" placeholder={''}>
                Delete project
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
      {/* Wave */}
      <WavyBorder variant="stroke-and-fill" className={theme.wavyBorder()} />
      {/* Lower content */}
      <div className={theme.lowerContent()}>
        {/* Latest deployment */}
        <div className={theme.latestDeployment()}>
          {/* Dot icon */}
          <div className={theme.deploymentStatusContainer()}>
            <div className={theme.deploymentStatus({ status })} />
          </div>
          <p className={theme.deploymentText()}>
            {hasDeployment
              ? project.deployments[0]?.commitMessage
              : 'No production deployment'}
          </p>
        </div>
        {/* Deployment and branch name */}
        <div className={theme.deploymentText()}>
          {hasDeployment ? (
            <>
              <GitHubLogo />
              <span>{relativeTimeMs(project.deployments[0].createdAt)} on</span>
              <BranchIcon />
              <span>{project.deployments[0].branch}</span>
            </>
          ) : (
            <>
              <ClockIcon />
              <span>Created {relativeTimeMs(project.createdAt)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
