import { UseFormRegister } from 'react-hook-form';

import { Input } from 'components/shared/Input';

import { EnvironmentVariablesFormValues } from '../../../../types';
import { Button } from 'components/shared/Button';
import { TrashIcon } from 'components/shared/CustomIcon';

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
        <Input
          label="key"
          size="sm"
          {...register(`variables.${index}.key`, {
            required: 'Key field cannot be empty',
          })}
        />
      </div>
      <div>
        <Input
          size="sm"
          label="value"
          {...register(`variables.${index}.value`, {
            required: 'Value field cannot be empty',
          })}
        />
      </div>
      <div className="self-end">
        <Button
          size="sm"
          iconOnly
          onClick={() => onDelete()}
          disabled={isDeleteDisabled}
        >
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
};

export default AddEnvironmentVariableRow;
