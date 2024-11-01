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
import ConnectWallet from './ConnectWallet';
import { useWalletConnectClient } from 'context/WalletConnectContext';

type ConfigureDeploymentFormValues = {
  option: string;
  lrn?: string;
  numProviders?: number;
  maxPrice?: string;
};

type ConfigureFormValues = ConfigureDeploymentFormValues &
  EnvironmentVariablesFormValues;

const DEFAULT_MAX_PRICE = '10000';

const Configure = () => {
  const { signClient, session, accounts } = useWalletConnectClient();

  const [isLoading, setIsLoading] = useState(false);
  const [deployers, setDeployers] = useState<Deployer[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [selectedDeployer, setSelectedDeployer] = useState<Deployer>();
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isPaymentDone, setIsPaymentDone] = useState(false);

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
    defaultValues: {
      option: 'Auction',
      maxPrice: DEFAULT_MAX_PRICE,
      lrn: '',
      numProviders: 1,
      variables: [],
    },
  });

  const selectedOption = methods.watch('option');

  const isTabletView = useMediaQuery('(min-width: 720px)'); // md:
  const buttonSize = isTabletView ? { size: 'lg' as const } : {};

  const createProject = async (
    data: FieldValues,
    envVariables: AddEnvironmentVariableInput[],
    senderAddress: string,
    txHash: string,
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
          txHash,
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
            txHash,
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

  const verifyTx = async (
    senderAddress: string,
    txHash: string,
    amount: string,
  ): Promise<boolean> => {
    const isValid = await client.verifyTx(
      txHash,
      `${amount.toString()}alnt`,
      senderAddress,
    );

    return isValid;
  };

  const handleFormSubmit = useCallback(
    async (createFormData: FieldValues) => {
      try {
        const deployerLrn = createFormData.lrn;
        const deployer = deployers.find(
          (deployer) => deployer.deployerLrn === deployerLrn,
        );

        let amount: string;
        let senderAddress: string;
        let txHash: string;
        if (createFormData.option === 'LRN' && !deployer?.minimumPayment) {
          toast({
            id: 'no-payment-required',
            title: 'No payment required. Deploying app...',
            variant: 'info',
            onDismiss: dismiss,
          });

          txHash = '';
          senderAddress = '';
        } else {
          if (!selectedAccount) return;

          senderAddress = selectedAccount.split(':')[2];

          if (createFormData.option === 'LRN') {
            amount = deployer?.minimumPayment!;
          } else {
            amount = (
              createFormData.numProviders * createFormData.maxPrice
            ).toString();
          }

          const amountToBePaid = amount.replace(/\D/g, '').toString();

          const txHashResponse = await cosmosSendTokensHandler(
            selectedAccount,
            amountToBePaid,
          );

          if (!txHashResponse) {
            console.error('Tx not successful');
            return;
          }

          txHash = txHashResponse;

          const isTxHashValid = await verifyTx(
            senderAddress,
            txHash,
            amountToBePaid.toString(),
          );

          if (isTxHashValid === false) {
            console.error('Invalid Tx hash', txHash);
            return;
          }
        }

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
          txHash,
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
      } catch (error) {
        console.error(error);
        toast({
          id: 'error-deploying-app',
          title: 'Error deploying app',
          variant: 'error',
          onDismiss: dismiss,
        });
      }
    },
    [client, createProject, dismiss, toast],
  );

  const fetchDeployers = useCallback(async () => {
    const res = await client.getDeployers();
    setDeployers(res.deployers);
  }, [client]);

  const onAccountChange = useCallback((account: string) => {
    setSelectedAccount(account);
  }, []);

  const onDeployerChange = useCallback(
    (selectedLrn: string) => {
      const deployer = deployers.find((d) => d.deployerLrn === selectedLrn);
      setSelectedDeployer(deployer);
    },
    [deployers],
  );

  const cosmosSendTokensHandler = useCallback(
    async (selectedAccount: string, amount: string) => {
      if (!signClient || !session || !selectedAccount) {
        return;
      }

      const chainId = selectedAccount.split(':')[1];
      const senderAddress = selectedAccount.split(':')[2];
      const snowballAddress = await client.getAddress();

      try {
        setIsPaymentDone(false);
        setIsPaymentLoading(true);

        toast({
          id: 'sending-payment-request',
          title: 'Check your wallet and approve payment request',
          variant: 'loading',
          onDismiss: dismiss,
        });

        const result: { signature: string } = await signClient.request({
          topic: session.topic,
          chainId: `cosmos:${chainId}`,
          request: {
            method: 'cosmos_sendTokens',
            params: [
              {
                from: senderAddress,
                to: snowballAddress,
                value: amount,
              },
            ],
          },
        });

        if (!result) {
          throw new Error('Error completing transaction');
        }

        toast({
          id: 'payment-successful',
          title: 'Payment successful',
          variant: 'success',
          onDismiss: dismiss,
        });

        setIsPaymentDone(true);

        return result.signature;
      } catch (error: any) {
        console.error('Error sending tokens', error);

        toast({
          id: 'error-sending-tokens',
          title: 'Error sending tokens',
          variant: 'error',
          onDismiss: dismiss,
        });

        setIsPaymentDone(false);
      } finally {
        setIsPaymentLoading(false);
      }
    },
    [session, signClient, toast],
  );

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
                        onChange={(event) => {
                          onChange(event.target.value);
                          onDeployerChange(event.target.value);
                        }}
                        displayEmpty
                        size="small"
                      >
                        {deployers.map((deployer) => (
                          <MenuItem
                            key={deployer.deployerLrn}
                            value={deployer.deployerLrn}
                          >
                            {`${deployer.deployerLrn} ${deployer.minimumPayment ? `(${deployer.minimumPayment})` : ''}`}
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
                      <Input
                        type="number"
                        value={value}
                        onChange={(e) => onChange(e)}
                      />
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

            {selectedOption === 'LRN' && !selectedDeployer?.minimumPayment ? (
              <div>
                <Button
                  {...buttonSize}
                  type="submit"
                  disabled={isLoading || !selectedDeployer || !selectedAccount}
                  rightIcon={
                    isLoading ? (
                      <LoadingIcon className="animate-spin" />
                    ) : (
                      <ArrowRightCircleFilledIcon />
                    )
                  }
                >
                  {isLoading ? 'Deploying' : 'Deploy'}
                </Button>
              </div>
            ) : (
              <>
                <Heading as="h4" className="md:text-lg font-medium mb-3">
                  Connect to your wallet
                </Heading>
                <ConnectWallet onAccountChange={onAccountChange} />
                {accounts.length > 0 && (
                  <div>
                    <Button
                      {...buttonSize}
                      type="submit"
                      disabled={
                        isLoading || isPaymentLoading || !selectedAccount
                      }
                      rightIcon={
                        isLoading || isPaymentLoading ? (
                          <LoadingIcon className="animate-spin" />
                        ) : (
                          <ArrowRightCircleFilledIcon />
                        )
                      }
                    >
                      {!isPaymentDone
                        ? isPaymentLoading
                          ? 'Transaction Requested'
                          : 'Pay and Deploy'
                        : isLoading
                          ? 'Deploying'
                          : 'Deploy'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Configure;
