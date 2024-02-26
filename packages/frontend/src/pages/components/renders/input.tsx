import React from 'react';
import { Input } from 'components/shared/Input';
import { SearchIcon, CrossIcon } from 'components/shared/CustomIcon';

export const renderInputs = () => {
  return (
    <>
      <div className="flex w-full gap-10">
        <Input
          label="Label"
          description="Additional information or context"
          leftIcon={<SearchIcon />}
          rightIcon={<CrossIcon />}
          placeholder="Placeholder text"
        />
        <Input
          disabled
          label="Label"
          description="Additional information or context"
          placeholder="Placeholder text"
        />
        <Input
          state="error"
          label="Label"
          description="Additional information or context"
          placeholder="Placeholder text"
          helperText="The error goes here"
        />
      </div>
      <div className="flex w-full gap-10">
        <Input
          label="Label"
          leftIcon={<SearchIcon />}
          rightIcon={<CrossIcon />}
          description="Additional information or context"
          placeholder="Placeholder text"
          size="sm"
        />
        <Input
          disabled
          label="Label"
          description="Additional information or context"
          placeholder="Placeholder text"
          size="sm"
        />
        <Input
          state="error"
          label="Label"
          description="Additional information or context"
          placeholder="Placeholder text"
          size="sm"
          helperText="The error goes here"
        />
      </div>
    </>
  );
};
