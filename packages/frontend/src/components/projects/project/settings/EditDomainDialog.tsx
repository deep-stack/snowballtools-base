import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { Domain } from 'gql-client';

import {
  Typography,
  Select,
  Option,
} from '@snowballtools/material-tailwind-react-fork';

import { useGQLClient } from 'context/GQLClientContext';
import { Modal } from 'components/shared/Modal';
import { Button } from 'components/shared/Button';
import { Input } from 'components/shared/Input';
import { useToast } from 'components/shared/Toast';

const DEFAULT_REDIRECT_OPTIONS = ['none'];

interface EditDomainDialogProp {
  domains: Domain[];
  open: boolean;
  handleOpen: () => void;
  domain: Domain;
  branches: string[];
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
  branches,
  onUpdate,
}: EditDomainDialogProp) => {
  const client = useGQLClient();
  const { toast, dismiss } = useToast();

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
        toast({
          id: 'domain_id_updated',
          title: `Domain ${domain.name} has been updated`,
          variant: 'success',
          onDismiss: dismiss,
        });
      } else {
        reset();
        toast({
          id: 'domain_id_error_update',
          title: `Error updating domain ${domain.name}`,
          variant: 'error',
          onDismiss: dismiss,
        });
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
  }, [domain]);

  return (
    <Modal open={open} onOpenChange={handleOpen}>
      <Modal.Content>
        <Modal.Header>Edit domain</Modal.Header>
        <form onSubmit={handleSubmit(updateDomainHandler)}>
          <Modal.Body className="flex flex-col gap-2">
            <Typography variant="small">Domain name</Typography>
            <Input {...register('name')} />
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
                  Domain “
                  {domainRedirectedFrom ? domainRedirectedFrom.name : ''}”
                  redirects to this domain so you can not redirect this doman
                  further.
                </Typography>
              </div>
            )}
            <Typography variant="small">Git branch</Typography>
            <Input
              {...register('branch', {
                validate: (value) =>
                  Boolean(branches.length) ? branches.includes(value) : true,
              })}
              disabled={
                !Boolean(branches.length) ||
                watch('redirectedTo') !== DEFAULT_REDIRECT_OPTIONS[0]
              }
            />
            {!isValid && (
              <Typography variant="small" className="text-red-500">
                We couldn&apos;t find this branch in the connected Git
                repository.
              </Typography>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleOpen} className="mr-1">
              Cancel
            </Button>
            <Button type="submit" disabled={!isDirty}>
              Save changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
};

export default EditDomainDialog;
