import React, { useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Domain } from 'gql-client';

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Typography,
  Select,
  Option,
} from '@material-tailwind/react';

import { RepositoryDetails } from '../../../../types/project';
import { useGQLClient } from '../../../../context/GQLClientContext';

const DEFAULT_REDIRECT_OPTIONS = ['none'];

interface EditDomainDialogProp {
  domains: Domain[];
  open: boolean;
  handleOpen: () => void;
  domain: Domain;
  repo: RepositoryDetails;
  onUpdate: () => Promise<void>;
}

const EditDomainDialog = ({
  domains,
  open,
  handleOpen,
  domain,
  repo,
  onUpdate,
}: EditDomainDialogProp) => {
  const client = useGQLClient();

  const getRedirectUrl = (domain: Domain) => {
    const domainArr = domain.name.split('www.');
    let redirectUrl = '';
    if (domain.name.startsWith('www.')) {
      redirectUrl = domainArr[1];
    } else {
      redirectUrl = `www.${domainArr[0]}`;
    }
    return redirectUrl;
  };

  const redirectOptions = useMemo(() => {
    const redirectUrl = getRedirectUrl(domain);
    return [...DEFAULT_REDIRECT_OPTIONS, redirectUrl];
  }, [domain]);

  const isDisableDropdown = useMemo(() => {
    const redirectUrl = getRedirectUrl(domain);

    const domainRedirected = domains.find(
      (domain) => domain.name === redirectUrl,
    );

    return domainRedirected?.isRedirected;
  }, [domain]);

  const onSubmit = useCallback(
    async (data: any) => {
      const updates = {
        name: data.name,
        branch: data.branch,
        isRedirected: data.redirectedTo !== 'none',
      };

      const { updateDomain } = await client.updateDomain(domain.id, updates);

      if (updateDomain) {
        await onUpdate();
        toast.success(`Domain ${domain.name} has been updated`);
      } else {
        toast.error(`Error updating domain ${domain.name}`);
      }

      handleOpen();
    },
    [client],
  );

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { isValid, isDirty },
  } = useForm({
    defaultValues: {
      name: domain.name,
      branch: repo.branch[0],
      redirectedTo: !domain.isRedirected
        ? redirectOptions[0]
        : redirectOptions[1],
    },
  });

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader className="flex justify-between">
        <div>Edit domain</div>
        <Button
          variant="outlined"
          onClick={handleOpen}
          className="mr-1 rounded-3xl"
        >
          X
        </Button>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody className="flex flex-col gap-2 p-4">
          <Typography variant="small">Domain name</Typography>
          <Input crossOrigin={undefined} {...register('name')} />
          <Typography variant="small">Redirect to</Typography>
          <Controller
            name="redirectedTo"
            control={control}
            render={({ field }) => (
              <Select {...field} disabled={isDisableDropdown}>
                {redirectOptions.map((option, key) => (
                  <Option key={key} value={option}>
                    ^ {option}
                  </Option>
                ))}
              </Select>
            )}
          />
          {isDisableDropdown && (
            <div className="flex p-2 gap-2 text-black bg-gray-300 rounded-lg">
              <div>^</div>
              <Typography variant="small">
                Domain “{redirectOptions[1]}” redirects to this domain so you
                can not redirect this doman further.
              </Typography>
            </div>
          )}
          <Typography variant="small">Git branch</Typography>
          <Input
            crossOrigin={undefined}
            {...register('branch', {
              validate: (value) => repo.branch.includes(value),
            })}
            disabled={watch('redirectedTo') !== DEFAULT_REDIRECT_OPTIONS[0]}
          />
          {!isValid && (
            <Typography variant="small" className="text-red-500">
              We couldn&apos;t find this branch in the connected Git repository.
            </Typography>
          )}
        </DialogBody>
        <DialogFooter className="flex justify-start">
          <Button variant="outlined" onClick={handleOpen} className="mr-1">
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="blue"
            type="submit"
            disabled={!isDirty}
          >
            Save changes
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default EditDomainDialog;
