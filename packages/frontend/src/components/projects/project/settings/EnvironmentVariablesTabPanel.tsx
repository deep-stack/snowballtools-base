import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { Environment, EnvironmentVariable } from 'gql-client';

import {
  Typography,
  Collapse,
  Card,
  Button,
  Checkbox,
  Chip,
} from '@material-tailwind/react';

import AddEnvironmentVariableRow from './AddEnvironmentVariableRow';
import DisplayEnvironmentVariables from './DisplayEnvironmentVariables';
import HorizontalLine from '../../../HorizontalLine';
import { useGQLClient } from '../../../../context/GQLClientContext';

export type EnvironmentVariablesFormValues = {
  variables: {
    key: string;
    value: string;
  }[];
  environment: {
    development: boolean;
    preview: boolean;
    production: boolean;
  };
};

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
    <>
      <Typography variant="h6">Environment variables</Typography>
      <Typography variant="small" className="font-medium text-gray-800">
        A new deployment is required for your changes to take effect.
      </Typography>
      <div className="bg-gray-300 rounded-lg p-2">
        <div
          className="text-black"
          onClick={() => setCreateNewVariable((cur) => !cur)}
        >
          + Create new variable
        </div>
        <Collapse open={createNewVariable}>
          <Card className="bg-white p-2">
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
                  variant="outlined"
                  size="sm"
                  onClick={() =>
                    append({
                      key: '',
                      value: '',
                    })
                  }
                >
                  + Add variable
                </Button>
                <Button variant="outlined" size="sm">
                  ^ Import .env
                </Button>
              </div>
              {isFieldEmpty && (
                <Chip
                  value="^ Please ensure no fields are empty before saving."
                  variant="outlined"
                  color="red"
                  size="sm"
                />
              )}
              <div>
                <Checkbox
                  crossOrigin={undefined}
                  label="Production"
                  {...register(`environment.production`)}
                  color="blue"
                />
                <Checkbox
                  crossOrigin={undefined}
                  label="Preview"
                  {...register(`environment.preview`)}
                  color="blue"
                />
                <Checkbox
                  crossOrigin={undefined}
                  label="Development"
                  {...register(`environment.development`)}
                  color="blue"
                />
              </div>
              <div className="p-2">
                <Button size="lg" color="blue" type="submit">
                  Save changes
                </Button>
              </div>
            </form>
          </Card>
        </Collapse>
      </div>
      <div className="p-2">
        <DisplayEnvironmentVariables
          environment={Environment.Production}
          variables={getEnvironmentVariables(Environment.Production)}
        />
        <HorizontalLine />
        <DisplayEnvironmentVariables
          environment={Environment.Preview}
          variables={getEnvironmentVariables(Environment.Preview)}
        />
        <HorizontalLine />
        <DisplayEnvironmentVariables
          environment={Environment.Development}
          variables={getEnvironmentVariables(Environment.Development)}
        />
      </div>
    </>
  );
};
