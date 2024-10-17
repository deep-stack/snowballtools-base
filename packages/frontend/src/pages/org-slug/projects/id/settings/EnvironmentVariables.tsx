import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Collapse } from '@snowballtools/material-tailwind-react-fork';

import DisplayEnvironmentVariables from 'components/projects/project/settings/DisplayEnvironmentVariables';
import { useGQLClient } from 'context/GQLClientContext';
import { EnvironmentVariablesFormValues } from '../../../../../types';
import HorizontalLine from 'components/HorizontalLine';
import { Heading } from 'components/shared/Heading';
// import { Checkbox } from 'components/shared/Checkbox';
import { PlusIcon } from 'components/shared/CustomIcon';
import { ProjectSettingContainer } from 'components/projects/project/settings/ProjectSettingContainer';
import { useToast } from 'components/shared/Toast';
import { Environment, EnvironmentVariable } from 'gql-client';
import EnvironmentVariablesForm from './EnvironmentVariablesForm';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { Button } from 'components/shared';

export const EnvironmentVariablesTabPanel = () => {
  const { id } = useParams();
  const client = useGQLClient();
  const { toast, dismiss } = useToast();

  const [environmentVariables, setEnvironmentVariables] = useState<
    EnvironmentVariable[]
  >([]);

  const [createNewVariable, setCreateNewVariable] = useState(false);

  const methods = useForm<EnvironmentVariablesFormValues>({
    defaultValues: {
      variables: [{ key: '', value: '' }],
      environment: {
        development: false,
        preview: false,
        production: false,
      },
    },
  });

  const getEnvironmentVariables = useCallback(
    (environment: Environment) => {
      return environmentVariables.filter(
        (item) => item.environment === environment,
      );
    },
    [environmentVariables, id],
  );

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
    async (createFormData: FieldValues) => {
      const environmentVariables = createFormData.variables.map((variable: any) => {
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
        // reset();
        setCreateNewVariable((cur) => !cur);

        fetchEnvironmentVariables(id);

        toast({
          id:
            createFormData.variables.length > 1
              ? 'env_variable_added'
              : 'env_variables_added',
          title:
            createFormData.variables.length > 1
              ? `${createFormData.variables.length} variables added`
              : `Variable added`,
          variant: 'success',
          onDismiss: dismiss,
        });
      } else {
        toast({
          id: 'env_variables_not_added',
          title: 'Environment variables not added',
          variant: 'error',
          onDismiss: dismiss,
        });
      }
    },
    [id, client],
  );

  return (
    <ProjectSettingContainer headingText="Environment variables">
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
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit((data) => createEnvironmentVariablesHandler(data))}>
              <div className="p-4 bg-slate-100">
                <EnvironmentVariablesForm />
              </div>
              <div className="p-2">
                <Button size="md" type="submit">
                  Save changes
                </Button>
              </div>
            </form>
          </FormProvider>
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
    </ProjectSettingContainer>
  );
};
