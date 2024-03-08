import React, { useCallback, useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from 'components/shared/Button';
import { CrossIcon, SearchIcon } from 'components/shared/CustomIcon';
import { Input } from 'components/shared/Input';
import { useGQLClient } from 'context/GQLClientContext';
import { Project } from 'gql-client';
import { useDebounce } from 'usehooks-ts';
import { ProjectSearchBarItem } from './ProjectSearchBarItem';
import { ProjectSearchBarEmpty } from './ProjectSearchBarEmpty';
import { useNavigate } from 'react-router-dom';
import { useCombobox } from 'downshift';

interface ProjectSearchBarDialogProps extends Dialog.DialogProps {
  open?: boolean;
  onClose?: () => void;
  onClickItem?: (data: Project) => void;
}

export const ProjectSearchBarDialog = ({
  onClose,
  onClickItem,
  ...props
}: ProjectSearchBarDialogProps) => {
  const [items, setItems] = useState<Project[]>([]);
  const [selectedItem, setSelectedItem] = useState<Project | null>(null);
  const client = useGQLClient();
  const navigate = useNavigate();

  const { getInputProps, getItemProps, inputValue, setInputValue } =
    useCombobox({
      items,
      itemToString(item) {
        return item ? item.name : '';
      },
      selectedItem,
      onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
        if (newSelectedItem) {
          setSelectedItem(newSelectedItem);
          onClickItem?.(newSelectedItem);
          navigate(
            `/${newSelectedItem.organization.slug}/projects/${newSelectedItem.id}`,
          );
        }
      },
    });

  const debouncedInputValue = useDebounce<string>(inputValue, 300);

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

  const handleClose = () => {
    setInputValue('');
    setItems([]);
    onClose?.();
  };

  return (
    <Dialog.Root {...props}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-base-bg fixed inset-0 md:hidden overflow-y-auto" />
        <Dialog.Content>
          <div className="h-full flex flex-col fixed top-0 inset-0">
            <div className="py-2.5 px-4 flex items-center justify-between border-b border-border-separator/[0.06]">
              <Input
                {...getInputProps()}
                leftIcon={<SearchIcon />}
                placeholder="Search"
                appearance="borderless"
                autoFocus
              />
              <Button iconOnly variant="ghost" onClick={handleClose}>
                <CrossIcon size={16} />
              </Button>
            </div>
            {/* Content */}
            <div className="flex flex-col gap-1 px-2 py-2">
              {items.length > 0
                ? items.map((item, index) => (
                    <>
                      <div className="px-2 py-2">
                        <p className="text-elements-mid-em text-xs font-medium">
                          Suggestions
                        </p>
                      </div>
                      <ProjectSearchBarItem
                        {...getItemProps({ item, index })}
                        key={item.id}
                        item={item}
                      />
                    </>
                  ))
                : inputValue && <ProjectSearchBarEmpty />}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
