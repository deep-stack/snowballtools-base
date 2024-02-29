import { Button } from 'components/shared/Button';
import {
  ArrowRightCircleIcon,
  ClockOutlineIcon,
  TemplateIcon,
  TemplateIconType,
} from 'components/shared/CustomIcon';
import { Tag } from 'components/shared/Tag';
import React, { ComponentPropsWithoutRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from 'components/shared/Toast';
import { cn } from 'utils/classnames';

export interface TemplateDetail {
  id: string;
  name: string;
  icon: string;
  repoFullName?: string;
  isComingSoon?: boolean;
}

export interface TemplateCardProps extends ComponentPropsWithoutRef<'div'> {
  template: TemplateDetail;
  isGitAuth: boolean;
}

export const TemplateCard = ({ template, isGitAuth }: TemplateCardProps) => {
  const { toast, dismiss } = useToast();
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    if (template?.isComingSoon) {
      return toast({
        id: 'coming-soon',
        title: 'This template is coming soon',
        variant: 'info',
        onDismiss: dismiss,
      });
    }
    if (isGitAuth) {
      return navigate(`/template?templateId=${template.id}`);
    }
    return toast({
      id: 'connect-git-account',
      title: 'Connect Git account to start with a template',
      variant: 'error',
      onDismiss: dismiss,
    });
  }, [isGitAuth, navigate, template, toast]);

  return (
    <button
      className={cn(
        'flex items-center gap-3 px-3 py-3 bg-base-bg-alternate hover:bg-base-bg-emphasized rounded-2xl group relative',
        {
          'cursor-default': template?.isComingSoon,
        },
      )}
      onClick={handleClick}
    >
      {/* Icon */}
      <div className="px-1 py-1 rounded-xl bg-base-bg border border-border-interactive/10 shadow-card-sm">
        <TemplateIcon type={template.icon as TemplateIconType} />
      </div>
      {/* Name */}
      <p className="flex-1 text-left text-sm tracking-tighter text-elements-high-em">
        {template.name}
      </p>
      {template?.isComingSoon ? (
        <Tag size="xs" type="neutral" leftIcon={<ClockOutlineIcon />}>
          Soon
        </Tag>
      ) : (
        <Button
          variant="tertiary"
          size="sm"
          iconOnly
          className="group-hover:flex hidden absolute right-3"
        >
          <ArrowRightCircleIcon />
        </Button>
      )}
    </button>
  );
};
