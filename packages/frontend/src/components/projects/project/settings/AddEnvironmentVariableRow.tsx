import { UseFormRegister } from 'react-hook-form';

import { EnvironmentVariablesFormValues } from '../../../../types';
import { Button } from 'components/shared/Button';
import { TrashIcon } from 'components/shared/CustomIcon';
import { Input } from 'components/shared/Input';

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
    <div className="flex gap-2 py-1 self-stretch items-end">
      <Input
        size="md"
        {...register(`variables.${index}.key`, {
          required: 'Key field cannot be empty',
        })}
        label={index === 0 ? 'Key' : undefined}
      />
      <Input
        size="md"
        label={index === 0 ? 'Value' : undefined}
        {...register(`variables.${index}.value`, {
          required: 'Value field cannot be empty',
        })}
      />
      <Button size="md" iconOnly onClick={onDelete} disabled={isDeleteDisabled}>
        <TrashIcon />
      </Button>
    </div>
  );
};

export default AddEnvironmentVariableRow;
