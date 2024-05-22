import { useState } from 'react';
import { Collapse } from '@snowballtools/material-tailwind-react-fork';

import EditEnvironmentVariableRow from './EditEnvironmentVariableRow';
import { Environment, EnvironmentVariable } from 'gql-client';
import {
  ChevronDownSmallIcon,
  ChevronUpSmallIcon,
} from 'components/shared/CustomIcon';

interface DisplayEnvironmentVariablesProps {
  environment: Environment;
  variables: EnvironmentVariable[];
  onUpdate: () => Promise<void>;
}

const DisplayEnvironmentVariables = ({
  environment,
  variables,
  onUpdate,
}: DisplayEnvironmentVariablesProps) => {
  const [openCollapse, setOpenCollapse] = useState(false);

  return (
    <>
      <div
        className="flex gap-4 p-2"
        onClick={() => setOpenCollapse((cur) => !cur)}
      >
        {openCollapse ? <ChevronUpSmallIcon /> : <ChevronDownSmallIcon />}
        <div className="grow capitalize">{environment}</div>
        <div>{variables.length} variables</div>
      </div>
      <Collapse open={openCollapse}>
        {variables.length === 0 ? (
          <div className="bg-slate-100 rounded-xl flex-col p-4">
            No environment variables added yet. Once you add them, they'll show
            up here.
          </div>
        ) : (
          variables.map((variable: EnvironmentVariable) => {
            return (
              <EditEnvironmentVariableRow
                onUpdate={onUpdate}
                key={variable.id}
                variable={variable}
              />
            );
          })
        )}
      </Collapse>
    </>
  );
};

export default DisplayEnvironmentVariables;
