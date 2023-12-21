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
import projectsData from '../../assets/projects.json';

interface ProjectsSearchProps {
  onChange?: (data: ProjectDetails) => void;
}

const ProjectSearch = ({ onChange }: ProjectsSearchProps) => {
  const [items, setItems] = useState<ProjectDetails[]>([]);
  const [selectedItem, setSelectedItem] = useState<ProjectDetails | null>(null);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      setItems(
        inputValue
          ? projectsData.filter((project) =>
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
        className={`absolute w-1/2 max-h-100 overflow-y-scroll ${
          !(isOpen && items.length) && 'hidden'
        }`}
      >
        <p>Suggestions</p>
        <List {...getMenuProps()}>
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
        </List>
      </Card>
    </div>
  );
};

export default ProjectSearch;
