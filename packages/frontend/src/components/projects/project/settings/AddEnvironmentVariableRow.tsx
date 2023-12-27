import React from 'react';
import { UseFormRegister } from 'react-hook-form';

import { Typography, Input, IconButton } from '@material-tailwind/react';

import { EnvironmentVariablesFormValues } from './EnvironmentVariablesTabPanel';

interface AddEnvironmentVariableRowProps {
  onDelete: () => void;
  register: UseFormRegister<EnvironmentVariablesFormValues>;
  index: number;
}

const AddEnvironmentVariableRow = ({
  onDelete,
  register,
  index,
}: AddEnvironmentVariableRowProps) => {
  return (
    <div className="flex gap-1 p-2">
      <div>
        <Typography variant="small">Key</Typography>
        <Input
          crossOrigin={undefined}
          {...register(`variables.${index}.key`)}
        />
      </div>
      <div>
        <Typography variant="small">Value</Typography>
        <Input
          crossOrigin={undefined}
          {...register(`variables.${index}.value`)}
        />
      </div>
      <div className="self-end">
        <IconButton size="sm" onClick={() => onDelete()}>
          {'>'}
        </IconButton>
      </div>
    </div>
  );
};

export default AddEnvironmentVariableRow;
