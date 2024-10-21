import { useCallback, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMediaQuery } from 'usehooks-ts';
import { AuctionParams } from 'gql-client';

import {
  ArrowRightCircleFilledIcon,
  LoadingIcon,
} from 'components/shared/CustomIcon';
import { Heading } from '../../shared/Heading';
import { Button } from '../../shared/Button';
import { Select, SelectOption } from 'components/shared/Select';
import { Input } from 'components/shared/Input';
import { useToast } from 'components/shared/Toast';
import { useGQLClient } from '../../../context/GQLClientContext';

type ConfigureFormValues = {
  option: string;
  lrn?: string;
  numProviders?: number;
  maxPrice?: string;
};

const Configure = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('templateId');
  const queryParams = new URLSearchParams(location.search);

  const owner = queryParams.get('owner');
  const name = queryParams.get('name');
  const defaultBranch = queryParams.get('defaultBranch');
  const fullName = queryParams.get('fullName');
  const templateOwner = queryParams.get('templateOwner');
  const templateRepo = queryParams.get('templateRepo');
  const isPrivate = queryParams.get('isPrivate') === 'true';

  const navigate = useNavigate();
  const { toast, dismiss } = useToast();
  const client = useGQLClient();

  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, control, watch } = useForm<ConfigureFormValues>({
    defaultValues: { option: 'LRN' },
  });

  const selectedOption = watch('option');

  const isTabletView = useMediaQuery('(min-width: 720px)'); // md:
  const buttonSize = isTabletView ? { size: 'lg' as const } : {};

  const onSubmit: SubmitHandler<ConfigureFormValues> = useCallback(
    async (data) => {
      setIsLoading(true);

      try {
        let lrn: string | undefined;
        let auctionParams: AuctionParams | undefined;

        if (data.option === 'LRN') {
          lrn = data.lrn;
        } else if (data.option === 'Auction') {
          auctionParams = {
            numProviders: Number(data.numProviders!),
            maxPrice: (data.maxPrice!).toString(),
          };
        }

        if (templateId) {
          // Template-based project creation
          const projectData: any = {
            templateOwner,
            templateRepo,
            owner,
            name,
            isPrivate,
          };

          const { addProjectFromTemplate } = await client.addProjectFromTemplate(
            "",
            projectData,
            lrn,
            auctionParams
          );

          data.option === 'Auction'
            ? navigate(
              `/projects/create/success/${addProjectFromTemplate.id}?isAuction=true`,
            )
            : navigate(
              `/projects/create/template/deploy?projectId=${addProjectFromTemplate.id}&templateId=${templateId}`
            );
        } else {
          const { addProject } = await client.addProject(
            "",
            {
              name: fullName!,
              prodBranch: defaultBranch!,
              repository: fullName!,
              template: 'webapp',
            },
            lrn,
            auctionParams
          );

          data.option === 'Auction'
            ? navigate(
              `/projects/create/success/${addProject.id}?isAuction=true`
            )
            : navigate(
              `/projects/create/deploy?projectId=${addProject.id}`
            );
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
    },
    [client, isPrivate, templateId, navigate, dismiss, toast]
  );

  return (
    <div className="space-y-7">
      <div className="flex justify-between">
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 lg:gap-7 w-full">
          <div className="flex flex-col justify-start gap-3">
            <Controller
              name="option"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select
                  label="Configuration Options"
                  value={
                    {
                      value: value || 'LRN',
                      label: value === 'Auction' ? 'Create Auction' : 'Deployer LRN',
                    } as SelectOption
                  }
                  onChange={(value) => onChange((value as SelectOption).value)}
                  options={[
                    { value: 'LRN', label: 'Deployer LRN' },
                    { value: 'Auction', label: 'Create Auction' },
                  ]}
                />
              )}
            />
          </div>

          {selectedOption === 'LRN' && (
            <div className="flex flex-col justify-start gap-3">
              <Heading as="h5" className="text-sm font-sans text-elements-low-em">
                The app will be deployed by the configured deployer
              </Heading>
              <span className="text-sm text-elements-high-em">
                Enter LRN for deployer
              </span>
              <Controller
                name="lrn"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Input value={value} onChange={onChange} />
                )}
              />
            </div>
          )}

          {selectedOption === 'Auction' && (
            <>
              <div className="flex flex-col justify-start gap-3">
                <Heading as="h5" className="text-sm font-sans text-elements-low-em">
                  Set the number of deployers and maximum price for each deployment
                </Heading>
                <span className="text-sm text-elements-high-em">
                  Number of Deployers
                </span>
                <Controller
                  name="numProviders"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Input type="number" value={value} onChange={onChange} />
                  )}
                />
              </div>
              <div className="flex flex-col justify-start gap-3">
                <span className="text-sm text-elements-high-em">
                  Maximum Price (alnt)
                </span>
                <Controller
                  name="maxPrice"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Input type="number" value={value} onChange={onChange} />
                  )}
                />
              </div>
            </>
          )}

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
        </div>
      </form>
    </div>
  );
};

export default Configure;
