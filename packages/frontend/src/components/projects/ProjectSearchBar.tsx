import React, { useCallback, useState } from 'react';
import { useCombobox } from 'downshift';
import { Project } from 'gql-client';

import {
  List,
  ListItem,
  ListItemPrefix,
  Card,
  Typography,
} from '@material-tailwind/react';

import SearchBar from '../SearchBar';
import { useGQLClient } from '../../context/GQLClientContext';

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
    onInputValueChange({ inputValue }) {
      if (inputValue) {
        // TODO: Use debounce
        fetchProjects(inputValue);
      }
    },
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

  const fetchProjects = useCallback(
    async (inputValue: string) => {
      const { searchProjects } = await client.searchProjects(inputValue);
      setItems(searchProjects);
    },
    [client],
  );

  return (
    <div className="relative">
      <SearchBar {...getInputProps()} />
      <Card
        className={`absolute w-1/2 max-h-52 -mt-1 overflow-y-auto ${
          (!inputValue || !isOpen) && 'hidden'
        }`}
      >
        <List {...getMenuProps()}>
          {items.length ? (
            <>
              <div className="p-3">
                <Typography variant="small" color="gray">
                  Suggestions
                </Typography>
              </div>
              {items.map((item, index) => (
                <ListItem
                  selected={highlightedIndex === index || selectedItem === item}
                  key={item.id}
                  {...getItemProps({ item, index })}
                >
                  <ListItemPrefix>
                    <i>^</i>
                  </ListItemPrefix>
                  <div>
                    <Typography variant="h6" color="blue-gray">
                      {item.name}
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      {item.organization.name}
                    </Typography>
                  </div>
                </ListItem>
              ))}
            </>
          ) : (
            <div className="p-3">
              <Typography>^ No projects matching this name</Typography>
            </div>
          )}
        </List>
      </Card>
    </div>
  );
};

export default ProjectSearchBar;
