import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import {
  Typography,
  Collapse,
  Card,
  Button,
  Checkbox,
} from '@material-tailwind/react';

import EnvironmentVariable from './EnvironmentVariable';

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
                  <div key={field.id}>
                    <EnvironmentVariable
                      index={index}
                      register={register}
                      onDelete={() => remove(index)}
                    />
                  </div>
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
    </>
  );
};
