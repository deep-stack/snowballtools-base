import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useOutletContext, useParams } from 'react-router-dom';

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
import {
  EnvironmentVariable,
  Environments,
  ProjectsOutletContext,
} from '../../../../types/project';
import HorizontalLine from '../../../HorizontalLine';

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

  const { projects } = useOutletContext<ProjectsOutletContext>();

  const currProject = useMemo(() => {
    return projects.find((data) => Number(data.id) === Number(id));
  }, [id]);

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
  }, [isSubmitSuccessful, reset]);

  const getEnvironmentVariable = useCallback((environment: Environments) => {
    return (currProject?.environmentVariables as EnvironmentVariable[]).filter(
      (item) => item.environments.includes(environment),
    );
  }, []);

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
            <form
              onSubmit={handleSubmit((data) => {
                toast.success(
                  data.variables.length > 1
                    ? `${data.variables.length} variables added`
                    : `Variable added`,
                );
                reset();
              })}
            >
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
          environment={Environments.PRODUCTION}
          variables={getEnvironmentVariable(Environments.PRODUCTION)}
        />
        <HorizontalLine />
        <DisplayEnvironmentVariables
          environment={Environments.PREVIEW}
          variables={getEnvironmentVariable(Environments.PREVIEW)}
        />
        <HorizontalLine />
        <DisplayEnvironmentVariables
          environment={Environments.DEVELOPMENT}
          variables={getEnvironmentVariable(Environments.DEVELOPMENT)}
        />
      </div>
    </>
  );
};
