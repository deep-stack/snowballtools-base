import { UseFormRegister } from 'react-hook-form';

import {
  Typography,
  Input,
  IconButton,
} from '@snowballtools/material-tailwind-react-fork';

import { EnvironmentVariablesFormValues } from '../../../../types/types';

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
        <Typography variant="small">Key</Typography>
        <Input
          {...register(`variables.${index}.key`, {
            required: 'Key field cannot be empty',
          })}
        />
      </div>
      <div>
        <Typography variant="small">Value</Typography>
        <Input
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
        >
          {'>'}
        </IconButton>
      </div>
    </div>
  );
};

export default AddEnvironmentVariableRow;
