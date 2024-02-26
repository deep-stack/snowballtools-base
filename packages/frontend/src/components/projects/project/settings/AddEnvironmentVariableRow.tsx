import React from 'react';
import { UseFormRegister } from 'react-hook-form';

import { Typography, Input, IconButton } from '@material-tailwind/react';

import { EnvironmentVariablesFormValues } from '../../../../types';

interface AddEnvironmentVariableRowProps {
  onDelete: () => void;
  register: UseFormRegister<EnvironmentVariablesFormValues>;
  index: number;
  isDeleteDisabled: boolean;
}

const AddEnvironmentVariableRow = ({
  onDelete,
  register,
  index,
  isDeleteDisabled,
}: AddEnvironmentVariableRowProps) => {
  return (
    <div className="flex gap-1 p-2">
      <div>
        <Typography variant="small" placeholder={''}>
          Key
        </Typography>
        <Input
          crossOrigin={undefined}
          {...register(`variables.${index}.key`, {
            required: 'Key field cannot be empty',
          })}
        />
      </div>
      <div>
        <Typography variant="small" placeholder={''}>
          Value
        </Typography>
        <Input
          crossOrigin={undefined}
          {...register(`variables.${index}.value`, {
            required: 'Value field cannot be empty',
          })}
        />
      </div>
      <div className="self-end">
        <IconButton
          size="sm"
          onClick={() => onDelete()}
          disabled={isDeleteDisabled}
          placeholder={''}
        >
          {'>'}
        </IconButton>
      </div>
    </div>
  );
};

export default AddEnvironmentVariableRow;
