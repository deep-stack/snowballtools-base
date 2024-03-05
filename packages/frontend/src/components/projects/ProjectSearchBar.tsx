import React, { useCallback, useEffect, useState } from 'react';
import { useCombobox } from 'downshift';
import { Project } from 'gql-client';
import { useDebounce } from 'usehooks-ts';

import SearchBar from 'components/SearchBar';
import { useGQLClient } from 'context/GQLClientContext';
import { cn } from 'utils/classnames';
import { InfoRoundFilledIcon } from 'components/shared/CustomIcon';
import { Avatar } from 'components/shared/Avatar';
import { getInitials } from 'utils/geInitials';

interface ProjectsSearchProps {
  onChange?: (data: Project) => void;
}

const ProjectSearchBar = ({ onChange }: ProjectsSearchProps) => {
  const [items, setItems] = useState<Project[]>([]);
  const [selectedItem, setSelectedItem] = useState<Project | null>(null);
  const client = useGQLClient();

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
    inputValue,
  } = useCombobox({
    items,
    itemToString(item) {
      return item ? item.name : '';
    },
    selectedItem,
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      if (newSelectedItem) {
        setSelectedItem(newSelectedItem);

        if (onChange) {
          onChange(newSelectedItem);
        }
      }
    },
  });

  const debouncedInputValue = useDebounce<string>(inputValue, 500);

  const fetchProjects = useCallback(
    async (inputValue: string) => {
      const { searchProjects } = await client.searchProjects(inputValue);
      setItems(searchProjects);
    },
    [client],
  );

  useEffect(() => {
    if (debouncedInputValue) {
      fetchProjects(debouncedInputValue);
    }
  }, [fetchProjects, debouncedInputValue]);

  return (
    <div className="relative">
      <SearchBar {...getInputProps()} />
      <div
        {...getMenuProps()}
        className={cn(
          'flex flex-col shadow-dropdown rounded-xl bg-surface-card absolute w-[459px] max-h-52 overflow-y-auto px-2 py-2 gap-1 z-50',
          { hidden: !inputValue || !isOpen },
        )}
      >
        {items.length ? (
          <>
            <div className="px-2 py-2">
              <p className="text-elements-mid-em text-xs font-medium">
                Suggestions
              </p>
            </div>
            {items.map((item, index) => (
              <div
                {...getItemProps({ item, index })}
                key={item.id}
                className={cn(
                  'px-2 py-2 flex items-center gap-3 rounded-lg hover:bg-base-bg-emphasized',
                  {
                    'bg-base-bg-emphasized':
                      highlightedIndex === index || selectedItem === item,
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
                  <p className="text-xs text-elements-low-em">
                    {item.organization.name}
                  </p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="flex items-center px-2 py-2 gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-50 text-elements-warning">
              <InfoRoundFilledIcon size={16} />
            </div>
            <p className="text-elements-low-em text-sm tracking-[-0.006em]">
              No projects matching this name
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSearchBar;
