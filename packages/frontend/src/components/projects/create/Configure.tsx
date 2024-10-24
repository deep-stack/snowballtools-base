import { useCallback, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FormProvider, FieldValues } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMediaQuery } from 'usehooks-ts';
import {
  AddEnvironmentVariableInput,
  AuctionParams,
  Deployer,
} from 'gql-client';

import { Select, MenuItem, FormControl, FormHelperText } from '@mui/material';

import {
  ArrowRightCircleFilledIcon,
  LoadingIcon,
} from 'components/shared/CustomIcon';
import { Heading } from '../../shared/Heading';
import { Button } from '../../shared/Button';
import { Input } from 'components/shared/Input';
import { useToast } from 'components/shared/Toast';
import { useGQLClient } from '../../../context/GQLClientContext';
import EnvironmentVariablesForm from 'pages/org-slug/projects/id/settings/EnvironmentVariablesForm';
import { EnvironmentVariablesFormValues } from 'types/types';
import { useWalletConnectClient } from 'context/WalletConnectContext';

type ConfigureDeploymentFormValues = {
  option: string;
  lrn?: string;
  numProviders?: number;
  maxPrice?: string;
};

type ConfigureFormValues = ConfigureDeploymentFormValues &
  EnvironmentVariablesFormValues;

const Configure = () => {
  const { onConnect } = useWalletConnectClient()

  const [isLoading, setIsLoading] = useState(false);
  const [deployers, setDeployers] = useState<Deployer[]>([]);

  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('templateId');
  const queryParams = new URLSearchParams(location.search);

  const owner = queryParams.get('owner');
  const name = queryParams.get('name');
  const defaultBranch = queryParams.get('defaultBranch');
  const fullName = queryParams.get('fullName');
  const orgSlug = queryParams.get('orgSlug');
  const templateOwner = queryParams.get('templateOwner');
  const templateRepo = queryParams.get('templateRepo');
  const isPrivate = queryParams.get('isPrivate') === 'true';

  const navigate = useNavigate();
  const { toast, dismiss } = useToast();
  const client = useGQLClient();

  const methods = useForm<ConfigureFormValues>({
    defaultValues: { option: 'Auction' },
  });

  const selectedOption = methods.watch('option');

  const isTabletView = useMediaQuery('(min-width: 720px)'); // md:
  const buttonSize = isTabletView ? { size: 'lg' as const } : {};

  const createProject = async (
    data: FieldValues,
    envVariables: AddEnvironmentVariableInput[],
    senderAddress: string,
    txHash: string
  ): Promise<string> => {
    setIsLoading(true);
    let projectId: string | null = null;

    try {
      let lrn: string | undefined;
      let auctionParams: AuctionParams | undefined;

      if (data.option === 'LRN') {
        lrn = data.lrn;
      } else if (data.option === 'Auction') {
        auctionParams = {
          numProviders: Number(data.numProviders!),
          maxPrice: data.maxPrice!.toString(),
        };
      }

      if (templateId) {
        const projectData: any = {
          templateOwner,
          templateRepo,
          owner,
          name,
          isPrivate,
          paymentAddress: senderAddress,
          txHash
        };

        const { addProjectFromTemplate } = await client.addProjectFromTemplate(
          orgSlug!,
          projectData,
          lrn,
          auctionParams,
          envVariables,
        );

        projectId = addProjectFromTemplate.id;
      } else {
        const { addProject } = await client.addProject(
          orgSlug!,
          {
            name: `${owner}-${name}`,
            prodBranch: defaultBranch!,
            repository: fullName!,
            template: 'webapp',
            paymentAddress: senderAddress,
            txHash
          },
          lrn,
          auctionParams,
          envVariables,
        );

        projectId = addProject.id;
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        id: 'error-creating-project',
        title: 'Error creating project',
        variant: 'error',
        onDismiss: dismiss,
      });
    } finally {
      setIsLoading(false);
    }

    if (projectId) {
      return projectId;
    } else {
      throw new Error('Project creation failed');
    }
  };

  const handleFormSubmit = useCallback(
    async (createFormData: FieldValues) => {
      // Send tx request to wallet -> amount = createFormData.maxPrice * createFormData.numProviders
      // Get address of sender account(from wallet connect session) and txHash(result.signature)
      const senderAddress = 'address';
      const txHash = 'txHash';

      const environmentVariables = createFormData.variables.map(
        (variable: any) => {
          return {
            key: variable.key,
            value: variable.value,
            environments: Object.entries(createFormData.environment)
              .filter(([, value]) => value === true)
              .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)),
          };
        },
      );

      const projectId = await createProject(
        createFormData,
        environmentVariables,
        senderAddress,
        txHash
      );

      await client.getEnvironmentVariables(projectId);

      if (templateId) {
        createFormData.option === 'Auction'
          ? navigate(
              `/${orgSlug}/projects/create/success/${projectId}?isAuction=true`,
            )
          : navigate(
              `/${orgSlug}/projects/create/template/deploy?projectId=${projectId}&templateId=${templateId}`,
            );
      } else {
        createFormData.option === 'Auction'
          ? navigate(
              `/${orgSlug}/projects/create/success/${projectId}?isAuction=true`,
            )
          : navigate(
              `/${orgSlug}/projects/create/deploy?projectId=${projectId}`,
            );
      }
    },
    [client, createProject, dismiss, toast],
  );

  const fetchDeployers = useCallback(async () => {
    const res = await client.getDeployers();
    setDeployers(res.deployers);
  }, [client]);

  useEffect(() => {
    fetchDeployers();
  }, []);

  return (
    <div className="space-y-7 px-4 py-6">
      <div className="flex justify-between mb-6">
        <div className="space-y-1.5">
          <Heading as="h4" className="md:text-lg font-medium">
            Configure deployment
          </Heading>
          <Heading as="h5" className="text-sm font-sans text-elements-low-em">
            The app can be deployed by setting the deployer LRN for a single
            deployment or by creating a deployer auction for multiple
            deployments
          </Heading>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:gap-8 w-full">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
            <div className="flex flex-col justify-start gap-4 mb-6">
              <Controller
                name="option"
                control={methods.control}
                render={({ field: { value, onChange } }) => (
                  <Select
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    size="small"
                    displayEmpty
                    sx={{
                      fontFamily: 'inherit',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0',
                        borderRadius: '8px',
                      },
                    }}
                  >
                    <MenuItem value="Auction">Create Auction</MenuItem>
                    <MenuItem value="LRN">Deployer LRN</MenuItem>
                  </Select>
                )}
              />
            </div>

            {selectedOption === 'LRN' && (
              <div className="flex flex-col justify-start gap-4 mb-6">
                <Heading
                  as="h5"
                  className="text-sm font-sans text-elements-low-em"
                >
                  The app will be deployed by the configured deployer
                </Heading>
                <Controller
                  name="lrn"
                  control={methods.control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange }, fieldState }) => (
                    <FormControl fullWidth error={Boolean(fieldState.error)}>
                      <span className="text-sm text-elements-high-em mb-4">
                        Select deployer LRN
                      </span>
                      <Select
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        displayEmpty
                        size="small"
                      >
                        {deployers.map((deployer) => (
                          <MenuItem
                            key={deployer.deployerLrn}
                            value={deployer.deployerLrn}
                          >
                            {deployer.deployerLrn}
                          </MenuItem>
                        ))}
                      </Select>
                      {fieldState.error && (
                        <FormHelperText>
                          {fieldState.error.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>
            )}

            {selectedOption === 'Auction' && (
              <>
                <div className="flex flex-col justify-start gap-4 mb-6">
                  <Heading
                    as="h5"
                    className="text-sm font-sans text-elements-low-em"
                  >
                    Set the number of deployers and maximum price for each
                    deployment
                  </Heading>
                  <span className="text-sm text-elements-high-em">
                    Number of Deployers
                  </span>
                  <Controller
                    name="numProviders"
                    control={methods.control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Input type="number" value={value} onChange={onChange} />
                    )}
                  />
                </div>
                <div className="flex flex-col justify-start gap-4 mb-6">
                  <span className="text-sm text-elements-high-em">
                    Maximum Price (alnt)
                  </span>
                  <Controller
                    name="maxPrice"
                    control={methods.control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Input type="number" value={value} onChange={onChange} />
                    )}
                  />
                </div>
              </>
            )}

            <Heading as="h4" className="md:text-lg font-medium mb-3">
              Environment Variables
            </Heading>
            <div className="p-4 bg-slate-100 rounded-lg mb-6">
              <EnvironmentVariablesForm />
            </div>

            <div>
              <Button
                {...buttonSize}
                type="submit"
                disabled={isLoading}
                rightIcon={
                  isLoading ? (
                    <LoadingIcon className="animate-spin" />
                  ) : (
                    <ArrowRightCircleFilledIcon />
                  )
                }
              >
                {isLoading ? 'Deploying repo' : 'Deploy repo'}
              </Button>
            </div>
          </form>
        </FormProvider>
      <Button onClick={onConnect}>Connect Wallet</Button>
      </div>
    </div>
  );
};

export default Configure;
