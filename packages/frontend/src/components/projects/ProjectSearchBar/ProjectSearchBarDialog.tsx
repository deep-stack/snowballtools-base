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

interface ProjectSearchBarDialogProps extends Dialog.DialogProps {
  onClose?: () => void;
}

export const ProjectSearchBarDialog = ({
  onClose,
  ...props
}: ProjectSearchBarDialogProps) => {
  const [items, setItems] = useState<Project[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const client = useGQLClient();

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

  const handleClose = () => {
    setInputValue('');
    setItems([]);
    onClose?.();
  };
  console.log(items);
  return (
    <Dialog.Root {...props}>
      <Dialog.Portal>
        <div className="bg-base-bg fixed inset-0 md:hidden overflow-y-auto">
          <Dialog.Content>
            <div className="py-2.5 px-4 w-full flex items-center justify-between border-b border-border-separator/[0.06]">
              <Input
                leftIcon={<SearchIcon />}
                placeholder="Search"
                appearance="borderless"
                value={inputValue}
                autoFocus
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button iconOnly variant="ghost" onClick={handleClose}>
                <CrossIcon size={16} />
              </Button>
            </div>
            {/* Content */}
            <div className="flex flex-col gap-1 px-2 py-2">
              {items.length > 0
                ? items.map((item) => (
                    <>
                      <div className="px-2 py-2">
                        <p className="text-elements-mid-em text-xs font-medium">
                          Suggestions
                        </p>
                      </div>
                      <ProjectSearchBarItem key={item.id} item={item} />
                    </>
                  ))
                : inputValue && <ProjectSearchBarEmpty />}
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
