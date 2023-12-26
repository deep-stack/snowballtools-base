import React from 'react';
import { UseFormRegister } from 'react-hook-form';

import { Typography, Input, IconButton } from '@material-tailwind/react';

import { EnvironmentVariablesFormValues } from './EnvironmentVariablesTabPanel';

interface EnvironmentVariableProps {
  onDelete: () => void;
  register: UseFormRegister<EnvironmentVariablesFormValues>;
  index: number;
}

const EnvironmentVariable = ({
  onDelete,
  register,
  index,
}: EnvironmentVariableProps) => {
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

export default EnvironmentVariable;
