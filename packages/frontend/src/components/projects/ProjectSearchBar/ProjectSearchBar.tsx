import { useCallback, useEffect, useState } from 'react';
import { useCombobox } from 'downshift';
import { Project } from 'gql-client';
import { useDebounceValue } from 'usehooks-ts';

import SearchBar from 'components/SearchBar';
import { useGQLClient } from 'context/GQLClientContext';
import { cn } from 'utils/classnames';
import { ProjectSearchBarItem } from './ProjectSearchBarItem';
import { ProjectSearchBarEmpty } from './ProjectSearchBarEmpty';

interface ProjectSearchBarProps {
  onChange?: (data: Project) => void;
}

export const ProjectSearchBar = ({ onChange }: ProjectSearchBarProps) => {
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

  const [debouncedInputValue, _] = useDebounceValue<string>(inputValue, 300);

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
    <div className="relative w-full lg:w-fit">
      <SearchBar {...getInputProps()} />
      <div
        {...getMenuProps({}, { suppressRefError: true })}
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
              <ProjectSearchBarItem
                {...getItemProps({ item, index })}
                key={item.id}
                item={item}
                active={highlightedIndex === index || selectedItem === item}
              />
            ))}
          </>
        ) : (
          <ProjectSearchBarEmpty />
        )}
      </div>
    </div>
  );
};
