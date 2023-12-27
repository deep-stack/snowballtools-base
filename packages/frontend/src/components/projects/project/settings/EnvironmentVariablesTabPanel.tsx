import React, { useCallback, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Toaster } from 'react-hot-toast';

import {
  Typography,
  Collapse,
  Card,
  Button,
  Checkbox,
} from '@material-tailwind/react';

import AddEnvironmentVariableRow from './AddEnvironmentVariableRow';
import DisplayEnvironmentVariables from './DisplayEnvironmentVariables';
import environmentVariablesData from '../../../../assets/environment-variables.json';
import { EnvironmentVariable, Environments } from '../../../../types/project';

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
  const { handleSubmit, register, control } =
    useForm<EnvironmentVariablesFormValues>({
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
  });

  const getEnvironmentVariable = useCallback((environment: Environments) => {
    return (environmentVariablesData as EnvironmentVariable[]).filter((item) =>
      item.environments.includes(environment),
    );
  }, []);

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
          <Card className="bg-white">
            <form onSubmit={handleSubmit(() => {})}>
              {fields.map((field, index) => {
                return (
                  <AddEnvironmentVariableRow
                    key={field.id}
                    index={index}
                    register={register}
                    onDelete={() => remove(index)}
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
        <DisplayEnvironmentVariables
          environment={Environments.PREVIEW}
          variables={getEnvironmentVariable(Environments.PREVIEW)}
        />
        <DisplayEnvironmentVariables
          environment={Environments.DEVELOPMENT}
          variables={getEnvironmentVariable(Environments.DEVELOPMENT)}
        />
      </div>
      <Toaster position="bottom-center" />
    </>
  );
};
