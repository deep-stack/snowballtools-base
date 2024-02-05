import React, { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
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

type EditDomainValues = {
  name: string;
  branch: string;
  redirectedTo: string;
};

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
    const redirectDomain = domain.redirectTo;

    if (redirectDomain !== null) {
      return redirectDomain?.name;
    } else {
      return 'none';
    }
  };

  const redirectOptions = useMemo(() => {
    const domainNames = domains
      .filter((domainData) => domainData.id !== domain.id)
      .map((domain) => domain.name);
    return ['none', ...domainNames];
  }, [domain, domains]);

  const domainRedirectedFrom = useMemo(() => {
    return domains.find(
      (domainData) => domainData.redirectTo?.id === domain.id,
    );
  }, [domains, domain]);

  const isDisableDropdown = useMemo(() => {
    return domainRedirectedFrom !== undefined;
  }, [domain, domains]);

  const {
    handleSubmit,
    register,
    control,
    watch,
    reset,
    formState: { isValid, isDirty },
  } = useForm({
    defaultValues: {
      name: domain.name,
      branch: domain.branch,
      redirectedTo: getRedirectUrl(domain),
    },
  });

  const updateDomainHandler: SubmitHandler<EditDomainValues> = useCallback(
    async (data) => {
      const domainRedirectTo = domains.find(
        (domainData) => data.redirectedTo === domainData.name,
      );

      const updates = {
        name: data.name ? data.name : domain.name,
        branch: data.branch ? data.branch : domain.branch,
        redirectToId: domainRedirectTo ? domainRedirectTo.id : null,
      };

      const { updateDomain } = await client.updateDomain(domain.id, updates);

      if (updateDomain) {
        await onUpdate();
        toast.success(`Domain ${domain.name} has been updated`);
      } else {
        reset();
        toast.error(`Error updating domain ${domain.name}`);
      }

      handleOpen();
    },
    [client, domains, domain],
  );

  useEffect(() => {
    reset({
      name: domain.name,
      branch: domain.branch,
      redirectedTo: getRedirectUrl(domain),
    });
  }, [domain, repo]);

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
      <form onSubmit={handleSubmit(updateDomainHandler)}>
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
                Domain “{domainRedirectedFrom ? domainRedirectedFrom.name : ''}”
                redirects to this domain so you can not redirect this doman
                further.
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
