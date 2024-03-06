import { Avatar } from 'components/shared/Avatar';
import { Overwrite, UseComboboxGetItemPropsReturnValue } from 'downshift';
import { Project } from 'gql-client';
import React, { ComponentPropsWithoutRef, forwardRef } from 'react';
import { OmitCommon } from 'types/common';
import { cn } from 'utils/classnames';
import { getInitials } from 'utils/geInitials';

/**
 * Represents a type that merges ComponentPropsWithoutRef<'li'> with certain exclusions.
 * @type {MergedComponentPropsWithoutRef}
 */
type MergedComponentPropsWithoutRef = OmitCommon<
  ComponentPropsWithoutRef<'button'>,
  Omit<
    Overwrite<UseComboboxGetItemPropsReturnValue, Project[]>,
    'index' | 'item'
  >
>;

interface ProjectSearchBarItemProps extends MergedComponentPropsWithoutRef {
  item: Project;
  active?: boolean;
}

const ProjectSearchBarItem = forwardRef<
  HTMLButtonElement,
  ProjectSearchBarItemProps
>(({ item, active, ...props }, ref) => {
  return (
    <button
      {...props}
      ref={ref}
      key={item.id}
      className={cn(
        'px-2 py-2 flex items-center gap-3 rounded-lg text-left hover:bg-base-bg-emphasized',
        {
          'bg-base-bg-emphasized': active,
        },
      )}
    >
      <Avatar
        size={32}
        imageSrc={item.icon}
        initials={getInitials(item.name)}
      />
      <div className="flex flex-col flex-1">
        <p className="text-sm tracking-[-0.006em] text-elements-high-em">
          {item.name}
        </p>
        <p className="text-xs text-elements-low-em">{item.organization.name}</p>
      </div>
    </button>
  );
});

ProjectSearchBarItem.displayName = 'ProjectSearchBarItem';

export { ProjectSearchBarItem };
