import React, { useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

import { Checkbox } from '@snowballtools/material-tailwind-react-fork';

import { Button } from 'components/shared/Button';
import { InlineNotification } from 'components/shared/InlineNotification';
import AddEnvironmentVariableRow from 'components/projects/project/settings/AddEnvironmentVariableRow';
import { EnvironmentVariablesFormValues } from 'types/types';

interface EnvironmentVariablesFormProps {
  onSubmit: (data: EnvironmentVariablesFormValues, reset: () => void) => void;
}

const EnvironmentVariablesForm: React.FC<EnvironmentVariablesFormProps> = ({ onSubmit }) => {
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { isSubmitSuccessful, errors },
  } = useForm<EnvironmentVariablesFormValues>({
    defaultValues: {
      variables: [{ key: '', value: '' }],
      environment: {
        development: false,
        preview: false,
        production: false,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'variables',
    control,
    rules: {
      required: 'Add at least 1 environment variables',
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);
  
  const isFieldEmpty = useMemo(() => {
    if (errors.variables) {
      return fields.some((_, index) => {
        if (
          errors.variables![index]?.value?.type === 'required' ||
          errors.variables![index]?.key?.type === 'required'
        ) {
          return true;
        }
      });
    }

    return false;
  }, [fields, errors.variables]);

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data, reset))}>
      {fields.map((field, index) => (
        <AddEnvironmentVariableRow
          key={field.id}
          index={index}
          register={register}
          onDelete={() => remove(index)}
          isDeleteDisabled={fields.length === 1}
        />
      ))}
      <div className="flex gap-1 p-2">
        <Button size="md" onClick={() => append({ key: '', value: '' })}>
          + Add variable
        </Button>
      </div>
      {isFieldEmpty && (
        <InlineNotification
          title="Please ensure no fields are empty before saving."
          variant="danger"
        />
      )}
      <div className="flex gap-2 p-2">
        <Checkbox label="Production" {...register('environment.production')} />
        <Checkbox label="Preview" {...register('environment.preview')} />
        <Checkbox label="Development" {...register('environment.development')} />
      </div>
      <div className="p-2">
        <Button size="md" type="submit">
          Save changes
        </Button>
      </div>
    </form>
  );
};

export default EnvironmentVariablesForm;
