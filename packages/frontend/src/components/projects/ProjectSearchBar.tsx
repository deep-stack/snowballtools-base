import React, { useState } from 'react';
import { useCombobox } from 'downshift';

import {
  List,
  ListItem,
  ListItemPrefix,
  Card,
  Typography,
} from '@material-tailwind/react';

import SearchBar from '../SearchBar';
import { ProjectDetails } from '../../types/project';

interface ProjectsSearchProps {
  projects: ProjectDetails[];
  onChange?: (data: ProjectDetails) => void;
}

const ProjectSearchBar = ({ projects, onChange }: ProjectsSearchProps) => {
  const [items, setItems] = useState<ProjectDetails[]>([]);
  const [selectedItem, setSelectedItem] = useState<ProjectDetails | null>(null);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
    inputValue,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      setItems(
        inputValue
          ? projects.filter((project) =>
              project.title.toLowerCase().includes(inputValue.toLowerCase()),
            )
          : [],
      );
    },
    items,
    itemToString(item) {
      return item ? item.title : '';
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
                      {item.title}
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      {item.organization}
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
