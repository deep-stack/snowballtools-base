import React, { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

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

import {
  DomainDetails,
  ProjectDetails,
  RepositoryDetails,
} from '../../../../types/project';

const DEFAULT_REDIRECT_OPTIONS = ['none'];

interface EditDomainDialogProp {
  open: boolean;
  handleOpen: () => void;
  domain: DomainDetails;
  repo: RepositoryDetails;
  project: ProjectDetails;
}

const EditDomainDialog = ({
  open,
  handleOpen,
  domain,
  repo,
  project,
}: EditDomainDialogProp) => {
  const getRedirectUrl = (domain: DomainDetails) => {
    const domainArr = domain.name.split('www.');
    let redirectUrl = '';
    if (domain.name.startsWith('www.')) {
      redirectUrl = domainArr[1];
    } else {
      redirectUrl = `www.${domainArr[0]}`;
    }
    return redirectUrl;
  };

  const domains = project.deployments
    .filter((deployment: any) => {
      return deployment.domain != null;
    })
    .map((deployment: any) => deployment.domain);

  const redirectOptions = useMemo(() => {
    const redirectUrl = getRedirectUrl(domain);
    return [...DEFAULT_REDIRECT_OPTIONS, redirectUrl];
  }, [domain]);

  const isDisableDropdown = useMemo(() => {
    const redirectUrl = getRedirectUrl(domain);

    const domainRedirected = domains.find(
      (domain) => domain.name === redirectUrl,
    );

    return domainRedirected?.isRedirectedto;
  }, [domain]);

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
      redirectedTo: !domain.isRedirectedto
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
      <form
        onSubmit={handleSubmit(() => {
          handleOpen();
          toast.success(`Domain ${domain.name} has been updated`);
        })}
      >
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
