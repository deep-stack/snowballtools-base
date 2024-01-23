import React, { useState } from 'react';
import { Card, Collapse, Typography } from '@material-tailwind/react';

import { Environment, EnvironmentVariable } from 'gql-client/dist/src/types';

import EditEnvironmentVariableRow from './EditEnvironmentVariableRow';

interface DisplayEnvironmentVariablesProps {
  environment: Environment;
  variables: EnvironmentVariable[];
}

const DisplayEnvironmentVariables = ({
  environment,
  variables,
}: DisplayEnvironmentVariablesProps) => {
  const [openCollapse, setOpenCollapse] = useState(false);

  return (
    <>
      <div
        className="flex gap-4 p-2 "
        onClick={() => setOpenCollapse((cur) => !cur)}
      >
        <div>^</div>
        <div className="grow capitalize">{environment}</div>
        <div>{variables.length} variables</div>
      </div>
      <Collapse open={openCollapse}>
        {variables.length === 0 ? (
          <Card className="bg-gray-300 flex items-center p-4">
            <Typography variant="small" className="text-black">
              No environment variables added yet.
            </Typography>
            <Typography variant="small">
              Once you add them, they’ll show up here.
            </Typography>
          </Card>
        ) : (
          variables.map((variable: EnvironmentVariable, index: number) => {
            return (
              <EditEnvironmentVariableRow key={index} variable={variable} />
            );
          })
        )}
      </Collapse>
    </>
  );
};

export default DisplayEnvironmentVariables;
