import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { Environment, EnvironmentVariable } from 'gql-client';

import { Collapse } from '@snowballtools/material-tailwind-react-fork';

import AddEnvironmentVariableRow from 'components/projects/project/settings/AddEnvironmentVariableRow';
import DisplayEnvironmentVariables from 'components/projects/project/settings/DisplayEnvironmentVariables';
import { useGQLClient } from '../../../../../context/GQLClientContext';
import { EnvironmentVariablesFormValues } from '../../../../../types';
import HorizontalLine from 'components/HorizontalLine';
import { Heading } from 'components/shared/Heading';
import { Button } from 'components/shared/Button';
import { Checkbox } from 'components/shared/Checkbox';
import { PlusIcon } from 'components/shared/CustomIcon';
import { InlineNotification } from 'components/shared/InlineNotification';

export const EnvironmentVariablesTabPanel = () => {
  const { id } = useParams();
  const client = useGQLClient();

  const [environmentVariables, setEnvironmentVariables] = useState<
    EnvironmentVariable[]
  >([]);

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
  const [createNewVariable, setCreateNewVariable] = useState(false);

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
  }, [isSubmitSuccessful, reset, id]);

  const getEnvironmentVariables = useCallback(
    (environment: Environment) => {
      return environmentVariables.filter(
        (item) => item.environment === environment,
      );
    },
    [environmentVariables, id],
  );

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
  }, [fields, errors.variables, id]);

  const fetchEnvironmentVariables = useCallback(
    async (id: string | undefined) => {
      if (id) {
        const { environmentVariables } =
          await client.getEnvironmentVariables(id);
        setEnvironmentVariables(environmentVariables);
      }
    },
    [],
  );

  useEffect(() => {
    fetchEnvironmentVariables(id);
  }, [id]);

  const createEnvironmentVariablesHandler = useCallback(
    async (createFormData: EnvironmentVariablesFormValues) => {
      const environmentVariables = createFormData.variables.map((variable) => {
        return {
          key: variable.key,
          value: variable.value,
          environments: Object.entries(createFormData.environment)
            .filter(([, value]) => value === true)
            .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)),
        };
      });

      const { addEnvironmentVariables: isEnvironmentVariablesAdded } =
        await client.addEnvironmentVariables(id!, environmentVariables);

      if (isEnvironmentVariablesAdded) {
        reset();
        setCreateNewVariable((cur) => !cur);

        fetchEnvironmentVariables(id);

        toast.success(
          createFormData.variables.length > 1
            ? `${createFormData.variables.length} variables added`
            : `Variable added`,
        );
      } else {
        toast.error('Environment variables not added');
      }
    },
    [id, client],
  );

  return (
    <div className="space-y-3 px-2">
      <Heading className="text-sky-950 text-lg font-medium leading-normal">
        Environment variables
      </Heading>
      <p className="text-slate-600 text-sm font-normal leading-tight">
        A new deployment is required for your changes to take effect.
      </p>
      <div className="bg-slate-100 rounded-xl flex-col">
        <Heading
          onClick={() => setCreateNewVariable((cur) => !cur)}
          className="p-4"
        >
          <div className="flex gap-2 items-center">
            <PlusIcon />
            <span>Create new variable</span>
          </div>
        </Heading>
        <Collapse open={createNewVariable}>
          <div className="p-4 bg-slate-100">
            <form onSubmit={handleSubmit(createEnvironmentVariablesHandler)}>
              {fields.map((field, index) => {
                return (
                  <AddEnvironmentVariableRow
                    key={field.id}
                    index={index}
                    register={register}
                    onDelete={() => remove(index)}
                    isDeleteDisabled={fields.length === 1}
                  />
                );
              })}
              <div className="flex gap-1 p-2">
                <Button
                  size="md"
                  onClick={() =>
                    append({
                      key: '',
                      value: '',
                    })
                  }
                >
                  + Add variable
                </Button>
                {/* TODO: Implement import environment varible functionality */}
                <Button size="md" disabled>
                  Import .env
                </Button>
              </div>
              {isFieldEmpty && (
                <InlineNotification
                  title="Please ensure no fields are empty before saving."
                  variant="danger"
                  size="md"
                />
              )}
              <div className="flex gap-2 p-2">
                <Checkbox
                  label="Production"
                  {...register(`environment.production`)}
                  color="blue"
                />
                <Checkbox
                  label="Preview"
                  {...register(`environment.preview`)}
                  color="blue"
                />
                <Checkbox
                  label="Development"
                  {...register(`environment.development`)}
                  color="blue"
                />
              </div>
              <div className="p-2">
                <Button size="md" type="submit">
                  Save changes
                </Button>
              </div>
            </form>
          </div>
        </Collapse>
      </div>
      <div className="p-2">
        <DisplayEnvironmentVariables
          environment={Environment.Production}
          variables={getEnvironmentVariables(Environment.Production)}
          onUpdate={async () => {
            await fetchEnvironmentVariables(id);
          }}
        />
        <HorizontalLine />
        <DisplayEnvironmentVariables
          environment={Environment.Preview}
          variables={getEnvironmentVariables(Environment.Preview)}
          onUpdate={async () => {
            await fetchEnvironmentVariables(id);
          }}
        />
        <HorizontalLine />
        <DisplayEnvironmentVariables
          environment={Environment.Development}
          variables={getEnvironmentVariables(Environment.Development)}
          onUpdate={async () => {
            await fetchEnvironmentVariables(id);
          }}
        />
      </div>
    </div>
  );
};
