import { useCallback, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

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
  maxPrice?: number;
};

const Configure = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('templateId');
  const location = useLocation();
  const { templateOwner, templateRepo, owner, name, isPrivate, orgSlug } = location.state || {};

  const navigate = useNavigate();
  const { toast, dismiss } = useToast();
  const client = useGQLClient();

  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, control, watch } = useForm<ConfigureFormValues>({
    defaultValues: { option: 'LRN' },
  });

  const selectedOption = watch('option');

  const onSubmit: SubmitHandler<ConfigureFormValues> = useCallback(
    async (data) => {
      setIsLoading(true);

      try {
        const projectData: any = {
          templateOwner,
          templateRepo,
          owner,
          name,
          isPrivate
        };

        let configData: any;
        if (data.option === 'LRN') {
          configData = data.lrn;
        } else if (data.option === 'Auction') {
          configData = {
            numProviders: data.numProviders,
            maxPrice: data.maxPrice
          }
        }

        const { addProjectFromTemplate } = await client.addProjectFromTemplate(
          orgSlug,
          projectData,
          configData
        );

        navigate(`/${orgSlug}/projects/create/template/deploy?projectId=${addProjectFromTemplate.id}&templateId=${templateId}`);
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
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 lg:gap-7 w-full">
        <div className="flex flex-col justify-start gap-3">
          <span className="text-sm text-elements-high-em">Choose an option</span>
          <Controller
            name="option"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Select
                value={{ value } as SelectOption}
                onChange={(value) =>
                  onChange((value as SelectOption).value)
                }
                options={[
                  { value: 'LRN', label: 'Set LRN' },
                  { value: 'Auction', label: 'Create Auction' },
                ]}
              />
            )}
          />
        </div>

        {selectedOption === 'LRN' && (
          <div className="flex flex-col justify-start gap-3">
            <span className="text-sm text-elements-high-em">Enter LRN</span>
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
              <span className="text-sm text-elements-high-em">Num Providers</span>
              <Controller
                name="numProviders"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Input type="number" value={value} onChange={onChange} />
                )}
              />
            </div>
            <div className="flex flex-col justify-start gap-3">
              <span className="text-sm text-elements-high-em">Max Price</span>
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
            type="submit"
            disabled={isLoading}
          >
            {isLoading? 'Deploying' : 'Deploy' }
          </Button>
        </div>
      </div>
    </form>
    </div>
  );
};

export default Configure;
